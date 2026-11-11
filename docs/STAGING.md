# Staging environment

**URL:** https://beta.gruff.tm-studio.co.uk/
**Server:** DigitalOcean droplet `TM-Server` (LON1, Ubuntu 24.04), SSH alias `DigitalOceanTMServer`
**Folder on the server:** `/data/webs/gruff`

Staging is where changes are reviewed before they go to production (gruffarchitects.com on 123reg). It runs the same stack as local, and the same layout as production.

---

## How the environments relate

| | Local | Staging | Production |
|---|---|---|---|
| Host | Docker on the laptop | Docker on TM-Server | 123reg shared hosting (no Docker) |
| Web server | Caddy → Apache (container) | host nginx → Apache (container) | LiteSpeed (Apache-compatible, reads `.htaccess`) |
| React | CRA dev server (`node` service) | static build in `frontend/build` | static build in `public_html` |
| WordPress | `/api` | `/api` | `/api` (`public_html/api`) |
| PHP | 8.5 | 8.5 | 8.2 → to be upgraded to 8.5 |
| Database | MariaDB 10.11 | MariaDB 10.11 | MariaDB 10.11 |
| Table prefix | `pr71_` | `pr71_` | `pr71_` |
| Content | copy of production | copy of production | **source of truth** (the client edits here) |

**Direction of travel:**

- **Code** (React build, theme, plugins): local → staging → production
- **Content** (database, uploads): production → staging / local. Content is never edited on staging; it gets overwritten at the next refresh.

**Why Docker images aren't the deploy unit:** production can't run Docker, so what gets reviewed on staging has to be the same files that go to 123reg: the React build plus `wp-content`. Docker on staging only provides an environment that behaves like production.

---

## How a request is served

```
browser
  └─ host nginx (443, Let's Encrypt)          /etc/nginx/sites-available/gruff
       ├─ /api/wp-content/uploads/*  → file on disk if present, otherwise proxied from http://gruffarchitects.com
       ├─ /api/logs/*                → 404
       ├─ /pma/*                     → phpMyAdmin container (127.0.0.1:8566), basic auth
       └─ everything else            → WordPress container (127.0.0.1:8466)
                                         Apache, document root /var/www/html
                                           ├─ /       React build  (./frontend/build)
                                           └─ /api/   WordPress    (./wordpress)
```

- All responses carry `X-Robots-Tag: noindex, nofollow`, and WordPress has "Discourage search engines" on.
- One container serves both the React app and WordPress, the same way `public_html` and `public_html/api` share one server on 123reg. `.htaccess` rules are therefore tested before they reach production:
  - `frontend/public/.htaccess` (copied into every build): sends React routes (`/practice`, `/people`, …) to `index.html`
  - `wordpress/.htaccess` (from `wordpress.htaccess`): WordPress under `/api/`
- The front end calls the API with a **relative** URL (`/api/wp-json/`), so the same build works on any domain.
- **Uploads aren't copied to staging.** Any media file missing on staging is fetched from the live site, so new images the client adds on production show up on staging automatically.

---

## Files on the server

```
/data/webs/gruff/
├── .env                        # staging-only settings (not in git, not synced)
├── .htpasswd-pma               # basic auth for /pma (server only, excluded from rsync)
├── docker-compose.yml          # shared with local
├── docker-compose.remote.yml   # staging overrides
├── mysql-lowmem.cnf            # low-memory database settings
├── uploads.ini                 # PHP limits (256M upload / 512M memory, for large exports)
├── wp-config.php               # mounted read-only into the container
├── nginx.conf.staging          # source of /etc/nginx/sites-available/gruff
├── frontend/build/             # React production build (synced from the laptop)
├── logs/                       # WordPress debug/error logs
└── wordpress/                  # core installed by the Docker image
    ├── .htaccess               # from wordpress.htaccess
    └── wp-content/
        ├── themes/             # synced from the laptop
        ├── plugins/            # synced from the laptop
        └── uploads/            # mostly empty: missing files come from production
```

Everything is owned by `www-data`. That's uid 33 both on the host and inside the container, so WordPress can write to `uploads` and `logs`. Creating or editing files directly on the server needs `sudo`.

### Staging `.env` (differs from local)

```ini
COMPOSE_FILE=docker-compose.yml:docker-compose.remote.yml   # plain "docker compose" uses both files
COMPOSE_PROFILES=                                            # no caddy / node on the server
APP_ENV=staging
WORDPRESS_HOME=https://beta.gruff.tm-studio.co.uk/api
WORDPRESS_DEBUG=false
WORDPRESS_TABLE_PREFIX=pr71_
WORDPRESS_SSL_PORT=8466
PHPMYADMIN_PORT=8566
# own database passwords and salts, not the ones from .env.example
```

### `docker-compose.remote.yml`

On top of `docker-compose.yml`, it does three things:

- publishes WordPress (8466) and phpMyAdmin (8566) on `127.0.0.1` only, so they're reachable through nginx and nothing else
- mounts `./frontend/build` as the web root
- caps memory (MariaDB 256 MB, WordPress 768 MB, which is above PHP's 512M so large exports aren't killed), and puts phpMyAdmin in the `tools` profile so it only runs when started by hand

### Containers

| Container | Runs | Notes |
|---|---|---|
| `gruff_mysql` | always | MariaDB 10.11, volume `mariadb_data` |
| `gruff_wordpress` | always | `wordpress:php8.5-apache` |
| `gruff_phpmyadmin` | on demand | `tools` profile |
| `gruff_wpcli` | on demand | `docker compose run --rm wpcli …` |

---

## Deploying changes to staging

### With the script

```bash
cd ~/Dockers/gruff && ./deploy-staging.sh
```

It runs the steps below in order:

1. Checks git and warns if there are uncommitted changes, unpushed commits, or commits on GitHub you haven't pulled. It asks before carrying on.
2. Builds the React front end and checks that `frontend/build/.htaccess` exists.
3. Syncs the project files and build, the themes and the plugins, then sets their owner to `www-data` on the server.
4. If `docker-compose*.yml`, `uploads.ini` or `mysql-lowmem.cnf` changed since the last deploy, asks to recreate the containers. A changed `nginx.conf.staging` is only reported (see step 4 below).
5. Runs the automatic part of the checklist after a deploy.

Each deploy writes `/data/webs/gruff/.deploy-info` on the server (commit, branch, date, whether there were uncommitted changes). That's how the next deploy knows which config files changed. Check it with `ssh DigitalOceanTMServer cat /data/webs/gruff/.deploy-info`.

| Option | |
|---|---|
| `-n`, `--dry-run` | show what would change on the server, change nothing |
| `-y`, `--yes` | don't ask (continue past git warnings, recreate containers when needed) |
| `--no-build` | deploy the existing `frontend/build` |
| `--no-plugins` | don't sync `wp-content/plugins` |

### By hand

Everything is built and tested locally first, then synced with rsync. The server never builds anything, because there isn't enough RAM to spare. It doesn't need git access either.

The rsync commands write as root on the server through a passwordless sudo rule limited to rsync (`/etc/sudoers.d/pablo-rsync`). They work with macOS's own rsync (`openrsync`), which has no `--chown`. So the files are uploaded without their Mac owner (`--no-owner --no-group`), and the last command sets the owner to `www-data` using the server's rsync (step 3b).

> Keep each command on **one line**. A space after a trailing `\` breaks the command.

### 1. React front end

```bash
cd ~/Dockers/gruff
docker compose run --rm -e REACT_APP_API_URL=/api/wp-json/ node npm run build
ls frontend/build/.htaccess    # must exist
```

### 2. Project files and build (everything except `wordpress/`)

```bash
cd ~/Dockers/gruff && rsync -avz --no-owner --no-group --delete --rsync-path="sudo rsync" --exclude='/frontend/build/api' --exclude='wordpress' --exclude='.git' --exclude='node_modules' --exclude='.sass-cache' --exclude='docs' --exclude='backups' --exclude='.env' --exclude='.htpasswd-pma' --exclude='certs' --exclude='logs' --exclude='*.sql' --exclude='*.gz' --exclude='*.zip' --exclude='*.patch' ./ DigitalOceanTMServer:/data/webs/gruff/
```

Excluded paths are never deleted on the server, so `--delete` leaves the staging `.env`, `.htpasswd-pma` and `logs` alone.

**Never let `frontend/build/api` be deleted on the server.** Inside the container, `./wordpress` is mounted at `/var/www/html/api`, on top of the `./frontend/build` mount, so it needs that empty folder to sit on. The local build has no `api` folder, so without `--exclude='/frontend/build/api'` rsync deletes it. Linux then drops the mount inside the running container, and every `/api` URL serves the React app (the site loads with no content). To repair it, recreate the container: `docker compose up -d --force-recreate wordpress`. `deploy-staging.sh` checks for this and does it automatically.

### 3. Theme and plugins (only when they changed)

```bash
cd ~/Dockers/gruff && rsync -avz --no-owner --no-group --delete --rsync-path="sudo rsync" --exclude='node_modules' --exclude='.git' ./wordpress/wp-content/themes/ DigitalOceanTMServer:/data/webs/gruff/wordpress/wp-content/themes/
cd ~/Dockers/gruff && rsync -avz --no-owner --no-group --delete --rsync-path="sudo rsync" --exclude='node_modules' --exclude='.git' ./wordpress/wp-content/plugins/ DigitalOceanTMServer:/data/webs/gruff/wordpress/wp-content/plugins/
```

No restart is needed: the files are mounted from the folders, not baked into images. To preview what would change, add `-n` (dry run).

### 3b. Owner (after every sync)

```bash
ssh DigitalOceanTMServer "sudo rsync -a --itemize-changes --chown=www-data:www-data /data/webs/gruff/ /data/webs/gruff/"
```

The server's rsync copies the folder onto itself with `--chown`: file contents stay the same, only owners change. It lists what it fixed; no output means everything was already owned by `www-data`.

`--chown` can't go in `--rsync-path` instead: rsync 3.2.7, the version Ubuntu 24.04 ships, rejects it there with "You can only specify a user-affecting --chown once".

### 4. Config changes

If `docker-compose*.yml`, `uploads.ini` or `mysql-lowmem.cnf` changed, recreate the containers:

```bash
ssh DigitalOceanTMServer
cd /data/webs/gruff && docker compose up -d
```

If `nginx.conf.staging` changed:

```bash
sudo cp /data/webs/gruff/nginx.conf.staging /etc/nginx/sites-available/gruff
sudo nginx -t && sudo systemctl reload nginx
```

`certbot` added the SSL lines to the live nginx file. Copying `nginx.conf.staging` over it removes them, so either edit `/etc/nginx/sites-available/gruff` directly or run `sudo certbot --nginx -d beta.gruff.tm-studio.co.uk` again afterwards.

---

## Refreshing content from production

Do this whenever you start a new piece of work, so staging shows what the client has published.

```bash
# 1. Export the production database (123reg phpMyAdmin, or wp db export if SSH is available)
#    and copy it to the server
scp gruff-live.sql DigitalOceanTMServer:/tmp/

# 2. On the server: back up staging first, then import
ssh DigitalOceanTMServer
cd /data/webs/gruff
docker compose exec -T mysql sh -c 'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" mariadb-dump -uroot "$MYSQL_DATABASE"' | gzip > ~/gruff-staging-$(date +%Y%m%d).sql.gz
docker compose exec -T mysql sh -c 'MYSQL_PWD="$MYSQL_PASSWORD" mysql -u"$MYSQL_USER" "$MYSQL_DATABASE"' < /tmp/gruff-live.sql

# 3. Live URLs -> staging URLs (only the /api URL). The live site runs on https, but older
#    content may still hold http:// URLs, so do both schemes
docker compose run --rm wpcli search-replace 'http://gruffarchitects.com/api'  'https://beta.gruff.tm-studio.co.uk/api' --all-tables --skip-columns=guid
docker compose run --rm wpcli search-replace 'https://gruffarchitects.com/api' 'https://beta.gruff.tm-studio.co.uk/api' --all-tables --skip-columns=guid

# 4. Bring the schema up to the installed WordPress version, keep search engines out
docker compose run --rm wpcli core update-db
docker compose run --rm wpcli option update blog_public 0

rm /tmp/gruff-live.sql
```

Log in to the CMS with the production admin account, through the same login slug as production (Protect WP Admin).

---

## phpMyAdmin

```bash
cd /data/webs/gruff
docker compose --profile tools up -d phpmyadmin   # start
docker compose stop phpmyadmin                    # stop when done (saves memory)
```

Open https://beta.gruff.tm-studio.co.uk/pma/. It asks for basic auth (`.htpasswd-pma`), then logs in as root automatically. To change the password: `sudo htpasswd /data/webs/gruff/.htpasswd-pma pablo`.

---

## WordPress core

The Docker image installs WordPress core on the first start; it isn't synced from the laptop. Staging and local should run the same version:

```bash
docker compose run --rm wpcli core version                                  # compare with local
docker compose run --rm wpcli core update --version=<local version> --force # align if different
```

Plugin and core updates are done **locally**, tested there, then synced. Updating from the staging admin would make staging differ from local, and the next rsync would overwrite those changes anyway.

---

## Server limits

TM-Server is shared with other client sites, four of them in production, and memory is tight (4 GB RAM plus 4 GB swap; an upgrade to 8 GB is planned). That's why:

- the database uses `mysql-lowmem.cnf` (64 MB buffer pool, `performance_schema` off)
- containers have memory caps, so staging can never starve a production site
- phpMyAdmin only runs when needed
- builds happen on the laptop, never on the server

Check memory with:

```bash
free -h
docker stats --no-stream | grep gruff
```

---

## Checklist after a deploy

- [ ] https://beta.gruff.tm-studio.co.uk/ loads
- [ ] Reloading `/practice` and `/people` works (no 404)
- [ ] `/api/wp-json/gruff-api/menu` returns JSON
- [ ] Images load
- [ ] CMS login works, with no redirect loop
- [ ] `/api/logs/` returns 404
- [ ] `curl -sI https://beta.gruff.tm-studio.co.uk/ | grep -i robots` shows `noindex`

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| 502 Bad Gateway | WordPress container is down: `docker compose ps`, `docker compose logs wordpress` |
| `/pma` returns 502 | phpMyAdmin isn't started (it's on demand) |
| `/pma` returns 500 | `.htpasswd-pma` is missing; recreate it with `sudo htpasswd -c …` |
| `/practice` reload returns 404 | `frontend/build/.htaccess` is missing; check `frontend/public/.htaccess` and rebuild |
| API returns 404 | `wordpress/.htaccess` is missing or has `RewriteBase /`; copy `wordpress.htaccess` again |
| Site loads with no content, and `/api/...` returns the React page (HTML) instead of JSON | `frontend/build/api` was deleted by rsync, so the WordPress volume isn't mounted any more: `docker compose up -d --force-recreate wordpress` (see step 2) |
| Typing an `/api/...` URL in the address bar shows the React app, while the API works with `curl` | the React service worker (`registerServiceWorker` in `frontend/src/index.js`) answers page loads from its cache: use a private window, or unregister it in DevTools → Application → Service Workers |
| Redirect loop or unstyled WP admin | `wp-config.php` isn't treating `X-Forwarded-Proto: https` as HTTPS |
| rsync "Permission denied" | sudo rule missing, or `--rsync-path="sudo rsync"` left out |
| rsync "unrecognized option --chown" | macOS's `openrsync` has no `--chown`: sync with `--no-owner --no-group` and fix the owner afterwards (step 3b) |
| WordPress can't write a file, or files on staging are owned by `UNKNOWN` / a number | synced without `--no-owner --no-group` or without step 3b; run step 3b |
| Container restarts during a big export | the WordPress `mem_limit` is too low for PHP's 512M |

---

## Going to production (123reg)

Production gets the same files staging was reviewed with:

- `frontend/build/` → `public_html/` (keep `public_html/api/` untouched)
- changed theme and plugins → `public_html/api/wp-content/`
- by rsync if 123reg allows SSH, otherwise SFTP/FTP

Before switching production to PHP 8.5: update WordPress and plugins **first, while still on PHP 8.2**, then change the PHP version. Also raise production's PHP limits (currently 30M uploads, `WP_MEMORY_LIMIT 40M`) if large exports are needed there.
