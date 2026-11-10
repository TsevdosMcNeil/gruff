# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.1] - 2026-11-10

- Wordpress template

## [0.1.0] - 2026-11-10

Starting point: the existing Gruff site (React front end + WordPress API) running in a local Docker setup that copies the live layout.

### Added

- Local Docker setup, created with `new-wp-sage.sh` (without Sage):
  - `caddy`, `node`, `wordpress`, `mysql`, `phpmyadmin` and `wpcli` services
  - HTTPS on `https://gruff.localhost:8466` with mkcert certificates
- Caddy routing with the same layout as the live site, on one origin (no CORS):
  - `/` goes to the React dev server
  - `/api/*` goes to WordPress
  - `/api/wp-content/uploads/*` is served from the local copy, or fetched from the live site if it's missing
  - plain `http://` on the HTTPS port redirects to `https://`
- The React front end in `frontend/`, served by a `node:22-alpine` dev server with hot reload.
- `wordpress.htaccess`: rewrite rules for WordPress in `/api` (`RewriteBase /api/`), plus a rule blocking `/api/logs/`.
- `README.md` covering setup, settings, the live import, the production build and troubleshooting.

### Changed

- WordPress is installed in `/var/www/html/api` inside the container (`working_dir`), so it's served at `/api` like the live site. `./wordpress` is still the WordPress root on disk.
- `WORDPRESS_HOME` is now `https://gruff.localhost:8466/api`.
- `wp-config.php` adds the local port right after the domain rather than at the end, so URLs with a path work (`https://gruff.localhost/api` → `https://gruff.localhost:8466/api`). It also removes any trailing slash.
- The front end's settings (`REACT_APP_API_URL`, `REACT_APP_API_CUSTOM_PREFIX`, `REACT_APP_API_VERSION`) come from the project `.env` through `docker-compose.yml` (`FRONTEND_*` variables). `frontend/.env` was removed.
- The `node` service runs `npm install` instead of `npm ci`, because npm 7+ rejects the 2018 lockfile (v1) on Linux (`fsevents`).

### Removed

- The Sage-only parts of the template: the `composer` service, the Sage environment variables in the `node` service, and the `theme_node_modules` volume (replaced by `frontend_node_modules`).

### Known issues

- `TypeError: menu.map is not a function` in `src/components/Menu.js`. The `gruff-api/menu` route returns `{ primary, secondary }`, where `primary` can be an object with numbered keys and items can have `child_items`, but the front end expects a flat list.
- `frontend/package.json` has `"homepage": "http://sundewlabs.com/gruff/html"`, so production builds expect to be served from `/gruff/html/`.
- The front end's source doesn't match the API's current data shapes, so the live site may run a newer build than this code. Other components may need the same kind of fix as `Menu.js`.

[Unreleased]: https://github.com/pablorica/gruff/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/pablorica/gruff/releases/tag/v0.1.0
