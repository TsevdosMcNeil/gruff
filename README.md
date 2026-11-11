# Gruff Architects

Website for [Gruff Architects](http://gruffarchitects.com/): headless WordPress for content, React front end.

[![version](https://img.shields.io/badge/version-0.2.0-red.svg)](https://semver.org)


| Part | Technology | Live URL |
|---|---|---|
| Front end | React 16 (Create React App, `react-scripts` 1.x), Redux, React Router 4 | `http://gruffarchitects.com/` |
| API | WordPress REST API (`wp/v2` + custom `gruff-api` routes), ACF PRO | `http://gruffarchitects.com/api/wp-json/` |
| CMS | WordPress admin, login path hidden by [Protect WP Admin](https://wordpress.org/plugins/protect-wp-admin/) | `http://gruffarchitects.com/api/<login-slug>` |

The CMS login slug isn't written here on purpose: Protect WP Admin only works while it stays private. Ask the team for it.

---

## Local development (Docker)

The local site uses the same layout as the live one, on a single HTTPS origin, so no CORS setup is needed:

| URL | What |
|---|---|
| `https://gruff.localhost:8466/` | React dev server (hot reload) |
| `https://gruff.localhost:8466/api/wp-json/` | WordPress REST API |
| `https://gruff.localhost:8466/api/<login-slug>` | CMS |
| `https://pma.gruff.localhost:8466/` | phpMyAdmin |

### Requirements

- Docker + Docker Compose v2
- [mkcert](https://github.com/FiloSottile/mkcert), with `mkcert -install` run once per machine

Node, Composer and WP-CLI don't need to be installed locally; they run in containers.

### Services

| Service | Image | Role |
|---|---|---|
| `caddy` | `caddy:2` | HTTPS on port `8466`. Routes `/api/*` to WordPress and everything else to React. Redirects `http://` to `https://`. |
| `node` | `node:22-alpine` | React dev server, from `./frontend` |
| `wordpress` | `wordpress:php8.5-apache` | WordPress, installed in `/var/www/html/api` inside the container |
| `mysql` | `mysql:8.0.36` | Database (Docker volume `mysql_data`) |
| `phpmyadmin` | `phpmyadmin:5.2` | Database admin |
| `wpcli` | `wordpress:cli-php8.5` | WP-CLI, run on demand |

`caddy` and `node` are in the `dev` profile. `.env` sets `COMPOSE_PROFILES=dev`, so `docker compose up -d` starts everything.

### Project structure

```
.
├── Caddyfile             # routing: / -> React, /api -> WordPress, media fallback to the live site
├── docker-compose.yml
├── .env                  # local settings and secrets (not in git)
├── .env.example
├── wp-config.php         # mounted into the WordPress container (reads everything from .env)
├── wordpress.htaccess    # rewrite rules for WordPress in /api (copy to wordpress/.htaccess)
├── uploads.ini           # PHP upload limits
├── certs/                # mkcert certificates (not in git)
├── logs/                 # WordPress debug log (not in git)
├── frontend/             # React app (src/, public/, package.json)
└── wordpress/            # WordPress root, served at /api
    └── wp-content/       # theme (registers the gruff-api routes), plugins, uploads
```

### First-time setup

```bash
# 1. Certificates
mkdir -p certs
mkcert -cert-file certs/local.pem -key-file certs/local-key.pem gruff.localhost pma.gruff.localhost

# 2. Settings: copy and fill in passwords, salts and the ACF PRO licence
cp .env.example .env

# 3. Rewrite rules for WordPress in /api
cp wordpress.htaccess wordpress/.htaccess

# 4. Start
docker compose up -d
docker compose logs -f node      # the first start runs npm install, then "Compiled successfully"
```

Then import the live content (see [Importing the live site](#importing-the-live-site)). The front end shows nothing useful without it.

### Settings (`.env`)

All settings, including the front end's, live in the project `.env`. There's no `frontend/.env`.

| Variable | Local value | Used for |
|---|---|---|
| `WORDPRESS_HOME` | `https://gruff.localhost:8466/api` | WordPress home and site URL. Must end in `/api`, with no trailing slash. |
| `WORDPRESS_SSL_PORT` | `8466` | HTTPS port (Caddy) |
| `APP_ENV` | `local` | With `local`, `wp-config.php` adds the port to the URL if it's missing |
| `CADDY_HOSTNAME` | `gruff.localhost` | Local domain |
| `CADDY_PRODUCTION_DOMAIN` | `gruffarchitects.com` | Missing media is fetched from here |
| `FRONTEND_API_URL` | `https://gruff.localhost:8466/api/wp-json/` | `REACT_APP_API_URL` in React |
| `FRONTEND_API_CUSTOM_PREFIX` | `gruff-api/` | `REACT_APP_API_CUSTOM_PREFIX` in React |
| `FRONTEND_API_VERSION` | `wp/v2/` | `REACT_APP_API_VERSION` in React |
| `NODE_PORT` | `5266` | React dev server port (inside Docker only) |

React reads `REACT_APP_*` only when the dev server starts or a build runs. After changing one, restart it: `docker compose up -d --force-recreate node`.

### Media

Requests to `/api/wp-content/uploads/...` are served from `wordpress/wp-content/uploads` if the file exists locally. Otherwise Caddy fetches them from the live site. You don't need to download the uploads folder unless you want to work offline.

---

## Importing the live site

The front end depends on data that only exists in the live backend:

- custom routes under `/wp-json/gruff-api/`: `menu`, `options`, `projects`, `stories`, `people`
- `acf` fields in the `wp/v2` responses, and the `home-sliders` post type
- pages with the IDs **19** and **50**, which are hard-coded in the front end (Practice & People, Contact)

You need the live theme and plugins (`wp-content/themes`, `wp-content/plugins`) and a database dump.

```bash
# Database (WORDPRESS_TABLE_PREFIX in .env must match the dump's prefix)
docker compose exec -T mysql sh -c 'MYSQL_PWD="$MYSQL_PASSWORD" mysql -u"$MYSQL_USER" "$MYSQL_DATABASE"' < gruff-live.sql

# Live URLs -> local URLs. Replace the URL with /api, not the bare domain,
# or email addresses like mail@gruffarchitects.com get changed too.
docker compose run --rm wpcli search-replace 'http://gruffarchitects.com/api'  'https://gruff.localhost:8466/api' --all-tables --skip-columns=guid
docker compose run --rm wpcli search-replace 'https://gruffarchitects.com/api' 'https://gruff.localhost:8466/api' --all-tables --skip-columns=guid
```

Then log in to the CMS and save **Settings → Permalinks** once. This also writes the rewrite rules Protect WP Admin needs.

Check that it worked:

```bash
docker compose run --rm wpcli eval 'echo home_url(), PHP_EOL;'      # https://gruff.localhost:8466/api
curl -sk "https://gruff.localhost:8466/api/wp-json/gruff-api/options" | head -c 200; echo
```

Never commit the database dump: add `*.sql` to `.gitignore`.

---

## Production build

```bash
docker compose run --rm -e REACT_APP_API_URL=http://gruffarchitects.com/api/wp-json/ node npm run build
```

The build ends up in `frontend/build/`. `-e` overrides only the API URL; the prefix and version come from `.env`.

Before building, check `"homepage"` in `frontend/package.json`. It's set to `http://sundewlabs.com/gruff/html`, so the build expects to be served from `/gruff/html/`. For the live site at the domain root, set it to `"/"`.

`frontend/public/.htaccess` (copied into the build) sends every unknown path to `index.html`, so React Router handles routes like `/project/<slug>` on Apache.

---

## Useful commands

```bash
docker compose up -d                                  # start everything
docker compose down                                   # stop
docker compose ps                                     # status
docker compose logs -f node                           # React dev server output
docker compose logs -f wordpress                      # Apache / PHP errors
tail -f logs/debug.log                                # WordPress debug log
docker compose restart caddy                          # after editing the Caddyfile
docker compose up -d --force-recreate node            # after changing FRONTEND_* in .env
docker compose run --rm wpcli plugin list             # any WP-CLI command
docker compose exec node npm install <package>        # add a front-end dependency
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| "Client sent an HTTP request to an HTTPS server" | You're on an old Caddyfile without the `http_redirect` listener. Use `https://`, or update the Caddyfile and run `docker compose restart caddy`. |
| `/api/wp-json/` shows the theme instead of JSON | Permalinks are set to Plain. Run `docker compose run --rm wpcli rewrite structure '/%postname%/'`, or save **Settings → Permalinks**. |
| `/api/...` pages give 404 | `wordpress/.htaccess` still has `RewriteBase /`. Copy `wordpress.htaccess` over it. |
| WordPress links are missing `/api` | `WORDPRESS_HOME` in `.env` must end in `/api`. Then run `docker compose up -d --force-recreate wordpress`. |
| `npm ci` fails with `EBADPLATFORM` (fsevents) | The 2018 lockfile lists the macOS-only `fsevents` in a way npm 7+ rejects on Linux. The `node` service uses `npm install` instead. |
| `TypeError: menu.map is not a function` | The menu API returns `{ primary, secondary }`, not a list. `src/components/Menu.js` must handle both shapes. |
| Front end changes don't reload (macOS / Windows) | Set `CHOKIDAR_USEPOLLING: "true"` on the `node` service. |

---

## Security notes

- Never commit `.env`, `certs/`, `logs/` or database dumps.
- ACF PRO is a paid plugin: keep it out of public repositories.
- Keep the CMS login slug out of the repository and out of public notes.

---

## Copyright and License

Copyright 2026 Gruff Wordpress Theme released under the [MIT](LICENSE) license.

---

## Versioning

---

We use [SemVer](https://semver.org/) for versioning. For the versions available, [list of tags can be found in this page](https://github.com/pablorica/docker-starter-kit/tags).

---

### Changelog

[CHANGELOG.md](docs/CHANGELOG.md)

