# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.3.1] - 2026-11-11

### Added

- `deploy-staging.sh`: deploys local to staging in one command. It warns about uncommitted or unpushed changes, builds the front end, syncs files, theme and plugins, recreates the containers when their config changed, and runs the post-deploy checks. See docs/STAGING.md.

## [0.3.0] - 2026-11-11

Video modules for project pages.

### Added

- Section Builder field type **Video**. The editor chooses:
  - **Source**: a video file from the Media Library (with guidance on file size, and a warning above 20 MB), or a YouTube / Vimeo link.
  - **Playback**: autoplay (muted, loops, no controls; starts when the section comes into view) or player controls (the visitor presses play, with sound).
  - **Poster image** for video files (optional).
  Files are stored as root-relative URLs (`/api/wp-content/uploads/...`), so the same database works on local, staging and production.
- Three project modules: **Video 1 (Full width)** `layout26`, **Video 2 (Video left, text right)** `layout27`, **Video 3 (Text left, video right)** `layout28`.
- `settings/section-builder/video-modules.php`:
  - creates the field type and modules in the database the first time an administrator opens wp-admin (option `gruff_video_modules_version`) and copies the module icons from `settings/section-builder/icons/`;
  - `gruff_render_videos()` turns the module's video placeholder into a `<video>` or a YouTube / Vimeo `<iframe>` (embed proportions from oEmbed, cached).
- `SectionDB::load_rendered()` now passes its output through the `gruff_section_rendered` filter.
- Front end: `video-modules.css` (imported in `index.css`); project pages pause Vimeo videos when leaving a section and play autoplay ones when arriving (fullpage.js already does this for video files and YouTube).

### Deploy

- Theme: upload `functions.php`, `settings/classes/SectionDB.php`, `settings/section-builder/video-modules.php`, `settings/section-builder/icons/`, `settings/assets/js/video-field.js` and `settings/assets/css/video-field.css`, then open wp-admin once as an administrator.
- Front end: rebuild and rsync `frontend/build`.

## [0.2.2] - 2026-11-11

Staging environment

### Changed

 - Stop tracking frontend/build (generated, deployed via rsync)

## [0.2.1] - 2026-11-11

Local now runs the same database server and table prefix as the live site, so local, staging and production share one stack.

### Changed

- Database: `mysql:8.0.36` → `mariadb:10.11` (the live server runs 10.11.19-MariaDB). New Docker volume `mariadb_data`; the old `mysql_data` volume is no longer used and can be removed once the new database is checked.
- Database healthcheck uses MariaDB's own `healthcheck.sh`. Removed the MySQL-only `--default-authentication-plugin` flag.
- Table prefix `wp_` → `pr71_` (the live prefix) in `.env.example`, for every environment.
- `docker-compose.remote.yml`: staging only overrides ports, mounts the React build at the web root and puts phpMyAdmin in the `tools` profile. Images and PHP limits come from `docker-compose.yml`.

### Added

- `mysql-lowmem.cnf`: low-memory database settings, mounted in local and staging.

## [0.2.0] - 2026-11-11

The front end now runs the same code as gruffarchitects.com. The source the original developer handed over was an older version than the live site, so `frontend/src` was rebuilt from the source maps of the live build (`main.dd4ccf40.js.map` and `main.bc0eacd3.css.map`).

### Added

- Pages that exist on the live site but were missing from the old source:
  - separate `/practice` and `/people` pages (Practice layouts 1–5, carousel, awards)
  - `/privacy-notice`
  - a 404 page for unknown addresses
- The live menu, with the Projects sub-menu (grid / list) and the secondary menu.
- The page loader, awards and testimonial data (`awardActionCreators`, `reducers/awards.js`, `reducers/loader.js`, `reducers/testimonial.js`).
- `src/lib/fullpage.offsetSections.min.js`: the paid fullPage.js *Offset Sections* extension, recovered from the live build. It isn't on npm, and the original developer had copied it into `node_modules` by hand.
- `react-owl-carousel2` dependency (used by the home banner).
- `FRONTEND_FULLPAGE_LICENSE` in `.env` / `.env.example`, passed to React as `REACT_APP_FULLPAGE_LICENSE`.
- `docs/HEADLESS.md`: a section on where `frontend/src` came from.

### Changed

- `frontend/src` replaced with the live source. Routes now match the live site: `/practice` and `/people` instead of `/practice-people`.
- `src/assets/css/style.css` is now the live compiled (minified) CSS. Edit it directly.
- Images and fonts in `src/assets/` taken from the live build's `static/media/`. `src/assets/img` stays in `.gitignore`, so copy it in by hand.
- `@fullpage/react-fullpage` pinned to `0.1.14`, the version the live site uses.
- `frontend/package.json` `homepage` set to `/`, so production builds are served from the domain root.
- `frontend/package-lock.json` regenerated.
- Production build docs use the `https` live API URL.

### Removed

- The old combined `PracticePeople` container and components.
- The old `.scss` partials (`_breakpoints`, `_color`, `_fonts`, `_mixin`, `_owl`, `_reset`, `style.scss`), which didn't match the live styles.
- The temporary 0.1.0 workarounds in `Layout.js` (redirects from `/practice` and `/people`) and `Menu.js` (flattening the menu data).

### Fixed

- The 0.1.0 known issues: `menu.map is not a function`, the `sundewlabs.com/gruff/html` homepage, and source that didn't match the API's data shapes.

### Security

- The repository should be private: it contains the licensed fullPage extension, and the docs show the hidden CMS login path.

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

[Unreleased]: https://github.com/TsevdosMcNeil/gruff/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/TsevdosMcNeil/gruff/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/TsevdosMcNeil/gruff/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/TsevdosMcNeil/gruff/releases/tag/v0.1.0
