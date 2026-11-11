# Backlog

Known issues and improvements for later work, found during the video modules work (November 2026).
Most urgent first. Remove an item, or move it to the CHANGELOG, once it's done.

| # | Item | Area | Urgency |
|---|---|---|---|
| 1 | [Section Builder AJAX is open to anyone](#1-section-builder-ajax-is-open-to-anyone) | Security (theme) | **Urgent, on production** |
| 2 | [CKEditor 4.7.1 is no longer secure](#2-ckeditor-471-is-no-longer-secure) | Security (CMS) | High |
| 3 | [One canonical tag, title and description for every page](#3-one-canonical-tag-title-and-description-for-every-page) | SEO | High |
| 4 | [Share image missing from the repo](#4-share-image-missing-from-the-repo) | SEO | Before the next production deploy |
| 5 | [Smaller fixes in `index.html`](#5-smaller-fixes-in-indexhtml) | SEO | Medium |
| 6 | [React service worker](#6-react-service-worker) | Front end | Medium |
| 7 | [Google Analytics no longer records anything](#7-google-analytics-no-longer-records-anything) | Analytics | Medium (client decision) |
| 8 | [Other outdated or fragile code in the theme](#8-other-outdated-or-fragile-code-in-the-theme) | Theme | Low |
| 9 | [Repository and staging housekeeping](#9-repository-and-staging-housekeeping) | Infrastructure | Low |
| 10 | [Video modules: follow-ups](#10-video-modules-follow-ups) | Feature | When needed |

---

## 1. Section Builder AJAX is open to anyone

**Where:** `wordpress/wp-content/themes/gruff/settings/section-builder/builder.php`, `settings/classes/*.php`

All 10 Section Builder AJAX actions are registered with `wp_ajax_nopriv_` as well as `wp_ajax_`, so visitors who **aren't logged in** can call them through `/api/wp-admin/admin-ajax.php`:

`available_sections`, `gruff_builder_image`, `gruff_get_tags`, `gruff_load_saved_sections`, `gruff_load_the_form`, `gruff_remove_section`, `gruff_save_section`, `gruff_section_builder_submission`, `gruff_section_remove`, `gruff_update_sequence`

None of them checks a nonce or the user's permissions. So anyone can:

- add, change, reorder or delete the content of any project or story, or delete whole modules from the Section Builder
- reach SQL queries built by joining request values into strings (`ContentDB::getContentData()`, `getSectionTags()`, `gruff_remove_section()`, `gruff_update_sequence()`, `save_section_data()`): SQL injection
- **upload files** with `gruff_builder_image`. It only checks `getimagesize()` and keeps the uploaded file's original name and extension, in a public folder (`settings/assets/img/content-images/`). A PHP file disguised as an image passes that check, and the server could then run it: anyone could take over the 123reg hosting.

**Fix** (small):

1. Remove every `add_action('wp_ajax_nopriv_…')` line. All these actions are only used in wp-admin.
2. At the start of each handler: `if (!current_user_can('edit_posts')) wp_send_json_error(null, 403);` (`manage_options` for the actions that create or delete modules).
3. Add a nonce: create it with `wp_create_nonce('gruff_section_builder')` in the `wp_localize_script()` calls, send it with every `$.ajax()` in `section-builder.js`, `projects.js` and `stories.js`, and check it with `check_ajax_referer()`.
4. Build every query with `$wpdb->prepare()`, and cast IDs and sequences with `(int)`.
5. `gruff_builder_image`: rename the file to a random name with an extension taken from the detected MIME type (`.jpg` / `.png` / `.gif`), never from the uploaded name. Or use `wp_handle_upload()` / the Media Library.
6. Re-enable the nonce checks commented out in `gruff_projects_save()` and `gruff_stories_save()`.

**After deploying the fix,** check the live `content-images` folder (and the rest of the theme) for any `.php` or other unexpected files that were uploaded before.

## 2. CKEditor 4.7.1 is no longer secure

**Where:** loaded from `cdn.ckeditor.com/4.7.1` in `settings/projects/view/page.php`, `settings/stories/view/page.php` and `settings/section-builder/view/form.php`, with `CKEDITOR.config.allowedContent = true` (any HTML is allowed) in `form.php` and `section-builder.js`.

4.7.1 dates from 2017 and has known security problems. Upgrading to the latest version (4.25.2-lts) isn't a free upgrade:

- CKEditor 4 reached end of life in June 2023. **4.22.1** was the last open-source version, but it gets no security updates.
- Every version from **4.23.0-lts** onwards needs a commercial license key (CKEditor's "Extended Support Model").

Options:

| Option | Cost | Notes |
|---|---|---|
| Buy the CKEditor 4 LTS license and load 4.25.2-lts with `licenseKey` | paid | Smallest code change |
| Use WordPress's own editor (TinyMCE) with `wp.editor.initialize()` / `wp_enqueue_editor()` | free | Already shipped with WordPress and kept up to date; replaces the `CKEDITOR.*` calls in `section-builder.js` |
| CKEditor 5 | free (GPL) | Different API, more work |
| 4.22.1 (last open-source version) | free | Better than 4.7.1, but still unmaintained |

Whichever option is chosen, also limit the HTML editors can paste (drop `allowedContent = true`), since the content goes straight into the React pages with `dangerouslySetInnerHTML`.

## 3. One canonical tag, title and description for every page

**Where:** `frontend/public/index.html`, the project and story pages in `frontend/src`

React serves the same `index.html` for every URL, and nothing in the front end changes the `<head>` per page. So every page, including `/project/little-donyland`:

- has `<link rel="canonical" href="https://gruffarchitects.com/">`, which tells Google it's a copy of the home page and may keep project pages out of search results
- has the same title ("Gruff Architects") and description, in Google and when shared on social media

**Fix:** set the title, description, canonical URL and Open Graph tags per page from the data the front end already loads, e.g. with `react-helmet`. Until that's done, removing the canonical tag from `index.html` is better than one that points every page at the home page.

## 4. Share image missing from the repo

`og:image` and `twitter:image` point to `https://gruffarchitects.com/6izK40-v_400x400.png`, which only exists in `public_html` on the live server. Add it to the repo so every build includes it:

```bash
curl -o frontend/public/6izK40-v_400x400.png https://gruffarchitects.com/6izK40-v_400x400.png
```

## 5. Smaller fixes in `index.html`

- The description is about 400 characters long. Google shows about 155–160, so write a shorter one.
- The share image is 400×400. For large previews (LinkedIn, Facebook, WhatsApp), use about 1200×630 and set `twitter:card` to `summary_large_image`.
- JSON-LD address: `postalCode` is `2FL`, which isn't a full UK postcode; `streetAddress` repeats the city and country; `addressCountry` should be `GB`. The full postcode is needed from the client.
- `<meta name="keyword">` is misspelled (`keywords`), and search engines ignore it anyway: remove it.

## 6. React service worker

**Where:** `frontend/src/index.js` calls `registerServiceWorker()` (Create React App 1.x default).

It's installed on the live site (HTTPS) and on staging. It caches the front end's files and answers every page you open by URL with the cached `index.html`. Side effects:

- after a deploy, returning visitors see the previous version of the front end until they reload (sometimes twice) or close all the site's tabs
- opening a WordPress URL in the address bar (including the CMS login slug) can show the React app in a browser that has visited the front end before

**Fix:** in `frontend/src/index.js`, replace `registerServiceWorker()` with `unregister()`:

```js
import { unregister } from './registerServiceWorker';
unregister();
```

This also removes the service worker from visitors' browsers on their next visit.

## 7. Google Analytics no longer records anything

`index.html` loads Universal Analytics (`UA-136893416-1`). Google stopped processing data for Universal Analytics properties in July 2023, so the tag collects nothing. Options: remove it, or replace it with a GA4 property. If Analytics is kept, the site needs a cookie consent banner (UK GDPR / PECR).

## 8. Other outdated or fragile code in the theme

- **Dropzone 4.3.0** from `cdn.jsdelivr.net` (`functions.php`, `form.php`): very old, used for the image uploads in the Section Builder. Update it, or move image uploads to the Media Library (see item 1).
- **`mb_convert_encoding(..., 'HTML-ENTITIES', ...)`** in `replace_img_src()` (`functions.php`) is deprecated since PHP 8.2. It still works, but logs deprecation notices. Use the `<?xml encoding="UTF-8">` prefix with `DOMDocument::loadHTML()` instead (as `gruff_render_videos()` does).
- **Image modules only accept exact pixel sizes** (Dropzone checks width and height against the module's rules). Editors have to resize every image by hand. Accept larger images and resize or crop them on upload.

## 9. Repository and staging housekeeping

- `frontend/public/.htaccess` isn't tracked by git: `.gitignore` ignores all dotfiles (`.*`). A fresh clone builds without it, and React routes like `/practice` then return 404 on reload. Add `!frontend/public/.htaccess` to the whitelist in `.gitignore` and commit the file.
- `nginx.conf.staging` fetches missing uploads from `http://gruffarchitects.com`. The live site runs on HTTPS, so switch the `proxy_pass` to `https://gruffarchitects.com` (with `proxy_ssl_server_name on;`).

## 10. Video modules: follow-ups

- **Stories:** the three video modules are only offered for Projects. To offer them for Stories, set their `type` to `0` (Both) in `pr71_sections` and add the CSS for `.gruff--StoryDetails` in `frontend/src/assets/css/video-modules.css`.
- **Production upload limit:** production allows 30 MB uploads (see STAGING.md). That matches the maximum the CMS advises for video files, but raise it a little (e.g. 64 MB) so a file just over 30 MB doesn't fail with a confusing error.
- **Vimeo autoplay** only hides the player controls when the video belongs to a paid Vimeo account; with YouTube, the title may show briefly. Uploaded files give the cleanest result.
