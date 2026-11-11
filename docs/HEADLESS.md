# Gruff — headless WordPress + React (local Docker)

Same layout as the live site, on one origin:

| URL | Serves | Live equivalent |
|---|---|---|
| `https://gruff.localhost:8466/` | React front end (CRA dev server, hot reload) | `https://gruffarchitects.com/` |
| `https://gruff.localhost:8466/api/wp-json/` | WordPress REST API | `https://gruffarchitects.com/api/wp-json` |
| `https://gruff.localhost:8466/api/GR0319` | CMS login (Protect WP Admin) | `https://gruffarchitects.com/api/GR0319` |
| `https://pma.gruff.localhost:8466/` | phpMyAdmin | — |

Because the front end and the API share one origin, no CORS setup is needed.

## How it fits together

- **Caddy** routes `/api/*` to the `wordpress` container and everything else to the `node` container (`Caddyfile`).
- **WordPress** is installed in `/var/www/html/api` inside the container (`working_dir`), so Apache serves it at `/api` with no path rewriting. `./wordpress` on your machine is still the WordPress root.
- **Media** (`/api/wp-content/uploads/...`): Caddy serves the local file if it exists, otherwise it fetches it from the live site (`CADDY_PRODUCTION_DOMAIN`). You don't need to download the uploads folder unless you want to work offline.
- **React** runs from `./frontend` on `node:22-alpine`. Its settings (`REACT_APP_*`) come from the project `.env` through `docker-compose.yml`; there's no `frontend/.env`. `node_modules` lives in a Docker volume.

## Setup

### 1. Add the front end

Copy the React project into `./frontend` (without `node_modules/` or `build/`):

```bash
cd ~/Dockers/gruff
mkdir frontend
rsync -a --exclude node_modules --exclude build /path/to/_frontend/ frontend/
```

Add to the project `.gitignore`:

```gitignore
frontend/node_modules/
frontend/build/
```

### 2. `.env`

```ini
CADDY_PRODUCTION_DOMAIN=gruffarchitects.com
FRONTEND_API_URL=https://gruff.localhost:8466/api/wp-json/
FRONTEND_API_CUSTOM_PREFIX=gruff-api/
FRONTEND_API_VERSION=wp/v2/
```

These become `REACT_APP_API_URL`, `REACT_APP_API_CUSTOM_PREFIX` and `REACT_APP_API_VERSION` in the `node` service. Delete `frontend/.env`, so there's only one place to set them. After changing any of them, restart the dev server: `docker compose up -d --force-recreate node`.

`NODE_PORT` is reused as the React dev server's port (any free port works; it's only used inside Docker).

### 3. WordPress URLs with `/api`

WordPress must know it lives at `https://gruff.localhost:8466/api`. Set `WORDPRESS_HOME` (and the site URL, if `wp-config.php` sets it separately) so it ends in `/api`, then check:

```bash
docker compose run --rm wpcli eval 'echo home_url(), PHP_EOL, site_url(), PHP_EOL;'
# https://gruff.localhost:8466/api
# https://gruff.localhost:8466/api
```

If `wp-config.php` adds the port to `WORDPRESS_HOME` when `APP_ENV=local`, make sure `/api` ends up **after** the port.

### 4. Rewrite rules

```bash
cp wordpress.htaccess wordpress/.htaccess
```

### 5. Start

```bash
docker compose --profile dev up -d --force-recreate
docker compose logs -f node      # first start runs npm install, then "Compiled successfully"
```

Use `npm install`, not `npm ci`, in the `node` container: the 2018 lockfile (v1) lists the macOS-only `fsevents` in a way npm 7+ rejects on Linux. The first `npm install` upgrades `frontend/package-lock.json`; commit the new one.

## Importing the live site

The front end depends on the live backend, which an empty WordPress doesn't have:

- custom endpoints under `/wp-json/gruff-api/` (`projects`, `stories`, `people`, `options`, `menu`)
- `acf` fields in the `wp/v2` responses, and the `home-sliders` post type
- pages with the hard-coded IDs **19** and **50** (Practice & People, Contact)

So you need the live `wp-content/themes/<theme>` (where the `gruff-api` routes are probably registered), `wp-content/plugins` (ACF, Protect WP Admin, …) and a database dump.

```bash
cd ~/Dockers/gruff

# 1. Theme + plugins from the live server
#    -> wordpress/wp-content/themes/<theme>/ and wordpress/wp-content/plugins/

# 2. Database. The live prefix is pr71_ (WORDPRESS_TABLE_PREFIX in .env).
#    (the mysql container already has the credentials in its environment)
docker compose exec -T mysql sh -c 'MYSQL_PWD="$MYSQL_PASSWORD" mysql -u"$MYSQL_USER" "$MYSQL_DATABASE"' < gruff-live.sql

# 3. Replace the live URLs (both schemes: the live site runs on https, but older content may still hold http:// URLs)
docker compose run --rm wpcli search-replace 'http://gruffarchitects.com/api'  'https://gruff.localhost:8466/api' --all-tables --skip-columns=guid
docker compose run --rm wpcli search-replace 'https://gruffarchitects.com/api' 'https://gruff.localhost:8466/api' --all-tables --skip-columns=guid

# 4. Check the endpoints the front end uses
curl -sk https://gruff.localhost:8466/api/wp-json/gruff-api/projects | head -c 300; echo
curl -sk https://gruff.localhost:8466/api/wp-json/wp/v2/pages/19     | head -c 300; echo
```

Then log in at `https://gruff.localhost:8466/api/GR0319` and save **Settings → Permalinks** once. WordPress then rewrites `.htaccess` itself, including any rules from Protect WP Admin.

## Production build

`frontend/package.json` has `"homepage": "/"`, so the build is served from the domain root. Build with the live API URL:

```bash
docker compose run --rm -e REACT_APP_API_URL=https://gruffarchitects.com/api/wp-json/ node npm run build
```

The `-e` overrides only the API URL for that build; the prefix, version and fullPage licence still come from `.env`. The build ends up in `frontend/build/`.

## Where `frontend/src` came from

The source the original developer handed over was an older version than the one running on gruffarchitects.com (it had a combined `/practice-people` page, no `/privacy-notice`, no 404 page, and older styles). `frontend/src` was rebuilt from the source maps of the live build (`static/js/main.dd4ccf40.js.map` and `static/css/main.bc0eacd3.css.map`), so it matches the live site:

- JS: recovered file-for-file from the source map.
- CSS: `src/assets/css/style.css` is the live compiled (minified) CSS. The old `.scss` partials did not match live and were dropped, so edit `style.css` directly.
- Images and fonts: taken from the live build's `static/media/`.
- `src/lib/fullpage.offsetSections.min.js` is the paid fullPage.js *Offset Sections* extension, which isn't on npm (the original developer had copied it into `node_modules`). It is licensed to this site and must not be redistributed, so keep this repository private.
- `package.json`: `@fullpage/react-fullpage` pinned to 0.1.14 (the version live uses) and `react-owl-carousel2` added (used by the Practice carousel).
