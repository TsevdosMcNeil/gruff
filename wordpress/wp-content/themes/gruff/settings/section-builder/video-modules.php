<?php
/*
* Video modules for the section builder
* Added on: 11.11.2026
*
* Adds a "Video" field type and three project modules:
*   - Video 1 (Full width)
*   - Video 2 (Video left, text right)
*   - Video 3 (Text left, video right)
*
* The Video field lets the editor choose:
*   - source:   a video file from the Media Library, or a YouTube / Vimeo link
*   - playback: autoplay (muted, looping, no controls) or player controls (click to play, with sound)
*   - poster:   an image shown while a video file loads (files only)
*
* The section builder fills templates by plain text replacement, so the template only holds
* a placeholder: <div class="gruff-video" data-video="(content|N)"></div>. The field stores its
* settings as URL-encoded JSON, and gruff_render_videos() turns the placeholder into a <video>
* or an <iframe> whenever a section is rendered (API and admin preview).
*
* The section builder keeps its field types and module templates in the database (pr71_tags,
* pr71_sections, pr71_sections_tags), not in code. They are created here the first time an
* administrator opens wp-admin after deploying the theme, so local, staging and production each
* get them without copying the database.
*
* On the front end fullpage.js starts autoplay videos when their section comes into view and
* pauses every video when the visitor leaves the section (Vimeo: see Projects/Details/index.js).
*/

define('GRUFF_VIDEO_MODULES_VERSION', 1);

/*
* Field types. The editing interface is built by video-field.js, so it can change without
* touching the database.
*/
function gruff_video_tags(){
	return [
		'Video' => '<div class="addFieldItems cell-12 gr-video-field">
	<span>Video</span>
	<div class="gr-video-ui"></div>
	<input type="hidden" class="addinput gr-video-value" name="content[]" >
</div>
',
	];
}

/*
* Modules. "fields" lists the field types in order: field N fills (content|N) in the template.
* Field types that already exist: Heading, Content, Image Caption.
*/
function gruff_video_sections(){
	return [
		[
			'section_name' => 'Projects | Video 1 (Full width)',
			'icon'         => 'video-full-width.jpg',
			'sequence'     => 26,
			'fields'       => ['Video', 'Image Caption'],
			'section_html' => '<section class="gruff-Layout layout26 layoutVideo">
	<div class="fulidImg-container">
		<div class="gruff-video" data-video="(content|0)"></div>
		<p class="caption">(content|1)</p>
	</div>
</section>',
		],
		[
			'section_name' => 'Projects | Video 2 (Video left, text right)',
			'icon'         => 'video-left-text-right.jpg',
			'sequence'     => 27,
			'fields'       => ['Video', 'Image Caption', 'Heading', 'Content'],
			'section_html' => '<section class="gruff-Layout layout27 layoutVideo">
	<div class="fulidImg-container">
		<div class="gruff-video" data-video="(content|0)"></div>
		<p class="caption">(content|1)</p>
	</div>
	<div class="content-container">
		<h6 class="titlelg">(content|2)</h6>
		<div class="desc">(content|3)</div>
	</div>
</section>',
		],
		[
			'section_name' => 'Projects | Video 3 (Text left, video right)',
			'icon'         => 'video-right-text-left.jpg',
			'sequence'     => 28,
			'fields'       => ['Heading', 'Content', 'Video', 'Image Caption'],
			'section_html' => '<section class="gruff-Layout layout28 layoutVideo">
	<div class="content-container">
		<h6 class="titlelg">(content|0)</h6>
		<div class="desc">(content|1)</div>
	</div>
	<div class="fulidImg-container">
		<div class="gruff-video" data-video="(content|2)"></div>
		<p class="caption">(content|3)</p>
	</div>
</section>',
		],
	];
}

/*
* Create the field types and modules once per environment
*/
add_action('admin_init', 'gruff_video_modules_install');

function gruff_video_modules_install(){
	if((int) get_option('gruff_video_modules_version', 0) >= GRUFF_VIDEO_MODULES_VERSION){
		return;
	}
	if(!current_user_can('manage_options')){
		return;
	}

	global $wpdb;
	$tags_table     = $wpdb->prefix.'tags';
	$sections_table = $wpdb->prefix.'sections';
	$links_table    = $wpdb->prefix.'sections_tags';
	$admin_id       = get_current_user_id();
	$date           = current_time('mysql');

	//Field types: create the new ones, then map every name to its id
	foreach(gruff_video_tags() as $name => $html){
		$exists = $wpdb->get_var($wpdb->prepare("SELECT id FROM {$tags_table} WHERE name = %s AND flag = 0", $name));
		if(!$exists){
			$ok = $wpdb->insert($tags_table, [
				'type'     => 1,
				'name'     => $name,
				'html'     => $html,
				'added_by' => $admin_id,
				'added_on' => $date,
				'flag'     => 0,
			]);
			if(!$ok){
				return; //try again on the next admin page load
			}
		}
	}

	$tag_ids = [];
	foreach($wpdb->get_results("SELECT id, name FROM {$tags_table} WHERE flag = 0", ARRAY_A) as $row){
		if(!isset($tag_ids[$row['name']])){
			$tag_ids[$row['name']] = (int) $row['id'];
		}
	}

	//Modules
	foreach(gruff_video_sections() as $section){
		foreach($section['fields'] as $field){
			if(empty($tag_ids[$field])){
				return; //a field type is missing, don't create a broken module
			}
		}

		$exists = $wpdb->get_var($wpdb->prepare("SELECT id FROM {$sections_table} WHERE section_name = %s AND flag = 0", $section['section_name']));
		if($exists){
			continue;
		}

		$ok = $wpdb->insert($sections_table, [
			'type'         => 1, //Projects
			'section_name' => $section['section_name'],
			'section_html' => $section['section_html'],
			'sequence'     => $section['sequence'],
			'icon'         => gruff_video_modules_copy_icon($section['icon']),
			'added_by'     => $admin_id,
			'added_on'     => $date,
			'flag'         => 0,
		]);
		if(!$ok){
			return;
		}
		$section_id = $wpdb->insert_id;

		foreach($section['fields'] as $field){
			$wpdb->insert($links_table, [
				'section_id' => $section_id,
				'tag_id'     => $tag_ids[$field],
				'rules'      => NULL,
			]);
		}
	}

	update_option('gruff_video_modules_version', GRUFF_VIDEO_MODULES_VERSION);
}

/*
* Module icons live in settings/section-builder/icons (tracked in git); the section
* builder reads them from settings/assets/img/section-builder (not tracked).
*/
function gruff_video_modules_copy_icon($filename){
	$source = dirname(__FILE__).DIRECTORY_SEPARATOR.'icons'.DIRECTORY_SEPARATOR.$filename;
	$dir    = dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'assets'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'section-builder';

	if(!file_exists($source) || !wp_mkdir_p($dir)){
		return NULL;
	}
	if(!file_exists($dir.DIRECTORY_SEPARATOR.$filename) && !copy($source, $dir.DIRECTORY_SEPARATOR.$filename)){
		return NULL;
	}
	return $filename;
}

/*
* Render the video placeholders of a section (hooked into SectionDB::load_rendered)
*/
add_filter('gruff_section_rendered', 'gruff_render_videos');

function gruff_render_videos($html){
	if(strpos($html, 'gruff-video') === false){
		return $html;
	}

	$previous = libxml_use_internal_errors(true);
	$doc = new DOMDocument();
	$doc->loadHTML('<?xml encoding="UTF-8"><div id="gruff-video-root">'.$html.'</div>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
	libxml_clear_errors();
	libxml_use_internal_errors($previous);

	$xpath = new DOMXPath($doc);
	$root  = $doc->getElementById('gruff-video-root');
	if(!$root){
		return $html;
	}

	$placeholders = $xpath->query('//div[contains(concat(" ", normalize-space(@class), " "), " gruff-video ")]');
	foreach(iterator_to_array($placeholders) as $placeholder){
		$settings = gruff_video_settings($placeholder->getAttribute('data-video'));
		$node     = $settings ? gruff_video_node($doc, $settings) : NULL;
		if($node){
			$placeholder->parentNode->replaceChild($node, $placeholder);
		}else{
			$placeholder->parentNode->removeChild($placeholder);
		}
	}

	$output = '';
	foreach($root->childNodes as $child){
		$output .= $doc->saveHTML($child);
	}
	return $output;
}

/*
* Read the field value: URL-encoded JSON {source, file, url, playback, poster}
*/
function gruff_video_settings($value){
	$data = json_decode(rawurldecode(trim((string) $value)), true);
	if(!is_array($data)){
		return NULL;
	}
	return [
		'source'   => (isset($data['source']) && $data['source'] === 'embed') ? 'embed' : 'file',
		'file'     => gruff_video_clean_url(isset($data['file']) ? $data['file'] : ''),
		'url'      => gruff_video_clean_url(isset($data['url']) ? $data['url'] : ''),
		'autoplay' => !(isset($data['playback']) && $data['playback'] === 'controls'),
		'poster'   => gruff_video_clean_url(isset($data['poster']) ? $data['poster'] : ''),
	];
}

//Only http(s) and root-relative URLs
function gruff_video_clean_url($url){
	$url = trim((string) $url);
	if($url === '' || preg_match('~^(https?:)?//~i', $url) || (isset($url[0]) && $url[0] === '/' )){
		return $url;
	}
	return '';
}

/*
* Build the <video> or the embed for the settings
*/
function gruff_video_node($doc, $settings){
	if($settings['source'] === 'file'){
		if($settings['file'] === ''){
			return NULL;
		}
		$video = $doc->createElement('video');
		$video->setAttribute('class', 'gruff-videoFile');
		$video->setAttribute('src', $settings['file']);
		if($settings['poster'] !== ''){
			$video->setAttribute('poster', $settings['poster']);
		}
		$video->setAttribute('playsinline', '');
		$video->setAttribute('preload', 'metadata');
		if($settings['autoplay']){
			//muted is required by browsers for autoplay; fullpage.js plays data-autoplay videos
			$video->setAttribute('muted', '');
			$video->setAttribute('loop', '');
			$video->setAttribute('data-autoplay', '');
		}else{
			$video->setAttribute('controls', '');
		}
		return $video;
	}

	$embed = gruff_video_embed($settings['url'], $settings['autoplay']);
	if(!$embed){
		return NULL;
	}

	$ratio   = gruff_video_ratio($settings['url']);
	$wrapper = $doc->createElement('div');
	$wrapper->setAttribute('class', 'gruff-videoEmbed '.($settings['autoplay'] ? 'is-autoplay' : 'has-controls'));
	$wrapper->setAttribute('style', '--r: '.round($ratio, 4));

	$iframe = $doc->createElement('iframe');
	$iframe->setAttribute('src', $embed);
	$iframe->setAttribute('title', 'Video');
	$iframe->setAttribute('allow', 'autoplay; fullscreen; picture-in-picture; encrypted-media');
	$iframe->setAttribute('allowfullscreen', '');
	$iframe->setAttribute('loading', 'lazy');
	$iframe->setAttribute('frameborder', '0');
	if($settings['autoplay']){
		$iframe->setAttribute('data-autoplay', '');
		$iframe->setAttribute('tabindex', '-1');
	}
	$wrapper->appendChild($iframe);
	return $wrapper;
}

/*
* YouTube / Vimeo link -> player URL
*
* YouTube: fullpage.js plays and pauses iframes whose src contains "youtube.com/embed/"
* (it adds enablejsapi=1 itself), so autoplay doesn't add autoplay=1: the video starts when
* its section comes into view.
* Vimeo: background=1 gives a clean muted loop without controls, but only for videos on a
* paid Vimeo plan; on a free plan Vimeo shows its normal player.
*/
function gruff_video_embed($url, $autoplay){
	if(preg_match('~(?:youtube\.com/(?:watch\?(?:.*&)?v=|embed/|shorts/|live/|v/)|youtu\.be/)([A-Za-z0-9_-]{11})~i', $url, $m)){
		$id = $m[1];
		$params = $autoplay
			? ['mute' => 1, 'controls' => 0, 'loop' => 1, 'playlist' => $id, 'playsinline' => 1, 'rel' => 0, 'disablekb' => 1, 'iv_load_policy' => 3, 'enablejsapi' => 1]
			: ['playsinline' => 1, 'rel' => 0, 'enablejsapi' => 1];
		return 'https://www.youtube.com/embed/'.$id.'?'.http_build_query($params);
	}

	if(preg_match('~vimeo\.com/(?:.*?/)?(\d{6,})(?:/([a-f0-9]{6,}))?~i', $url, $m)){
		$id     = $m[1];
		$params = ['dnt' => 1, 'title' => 0, 'byline' => 0, 'portrait' => 0];
		$hash   = !empty($m[2]) ? $m[2] : NULL;
		if(!$hash){
			parse_str((string) parse_url($url, PHP_URL_QUERY), $query);
			if(!empty($query['h']) && preg_match('~^[a-f0-9]+$~i', $query['h'])){
				$hash = $query['h'];
			}
		}
		if($hash){
			$params = ['h' => $hash] + $params;
		}
		if($autoplay){
			$params += ['background' => 1, 'autoplay' => 1, 'muted' => 1, 'loop' => 1, 'autopause' => 0];
		}
		return 'https://player.vimeo.com/video/'.$id.'?'.http_build_query($params);
	}

	return NULL;
}

/*
* Width / height of a YouTube or Vimeo video, from oEmbed (cached), so vertical or
* square videos keep their shape. Defaults to 16:9.
*/
function gruff_video_ratio($url){
	$key   = 'gruff_video_ratio_'.md5($url);
	$ratio = get_transient($key);
	if($ratio !== false){
		return (float) $ratio;
	}

	$ratio = 16 / 9;
	$found = false;
	if(function_exists('_wp_oembed_get_object')){
		$data = _wp_oembed_get_object()->get_data($url);
		if($data && !empty($data->width) && !empty($data->height)){
			$ratio = (float) $data->width / (float) $data->height;
			$found = true;
		}
	}
	set_transient($key, $ratio, $found ? MONTH_IN_SECONDS : DAY_IN_SECONDS);
	return $ratio;
}

/*
* Video field in the project / story editor
*/
add_action('admin_enqueue_scripts', 'gruff_video_modules_admin_scripts');

function gruff_video_modules_admin_scripts($hook){
	if(!in_array($hook, ['post.php', 'post-new.php'], true)){
		return;
	}
	$screen = get_current_screen();
	if(!$screen || !in_array($screen->post_type, ['gruff_projects', 'gruff_stories'], true)){
		return;
	}

	$assets = get_stylesheet_directory_uri().'/settings/assets';
	wp_enqueue_media();
	wp_enqueue_script('gruff-video-field', $assets.'/js/video-field.js', ['jquery', 'gruff-section-builder'], '1.0.0', true);
	wp_enqueue_style('gruff-video-field', $assets.'/css/video-field.css', [], '1.0.0');
}
