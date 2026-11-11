/*
* Video field for the section builder
* Added on: 11.11.2026
*
* Builds the editing interface inside .gr-video-field and keeps its hidden input
* (input.addinput, saved by section-builder.js) up to date with URL-encoded JSON:
*   { source: 'file'|'embed', file, url, playback: 'autoplay'|'controls', poster }
* Files are stored as root-relative URLs (/api/wp-content/uploads/...), so the same
* database works on local, staging and production.
* The front end is rendered from this value by gruff_render_videos() (video-modules.php).
*/
(function($){

	var MAX_RECOMMENDED_MB 	= 20,
		MAX_MB 				= 30,
		counter 			= 0;

	var DEFAULTS = { source: 'file', file: '', url: '', playback: 'autoplay', poster: '' };

	var FILE_HELP = 'MP4 (H.264), up to 1920px wide. Keep it under ' + MAX_RECOMMENDED_MB + ' MB (' + MAX_MB + ' MB at most): '
		+ 'large files load slowly, especially on phones. For autoplay, a short clip (10–30 seconds) works best, as it loops.';
	var LINK_HELP = 'Paste the YouTube or Vimeo page link. With autoplay, Vimeo only hides its player controls if the '
		+ 'video\'s Vimeo account is on a paid plan; YouTube may briefly show its title.';
	var POSTER_HELP = 'Shown while the video loads, and on phones in low power mode, which block autoplay. '
		+ 'Use a still from the video, with the same proportions.';

	//Value <-> settings
	function read($field){
		var raw = $.trim($field.find('.gr-video-value').val() || '');
		if(raw === '') return $.extend({}, DEFAULTS);
		try{
			return $.extend({}, DEFAULTS, JSON.parse(decodeURIComponent(raw)));
		}catch(e){
			return $.extend({}, DEFAULTS);
		}
	}

	function write($field, settings){
		var empty = settings.source === 'file' ? !settings.file : !settings.url;
		var value = empty ? '' : encodeURIComponent(JSON.stringify(settings)).replace(/'/g, '%27');
		$field.find('.gr-video-value').val(value);
	}

	//Keep URLs on this site root-relative
	function rootRelative(url){
		try{
			var parsed = new URL(url, window.location.href);
			return parsed.origin === window.location.origin ? parsed.pathname : url;
		}catch(e){
			return url;
		}
	}

	function fileName(url){
		try{ return decodeURIComponent(url.split('/').pop()); }catch(e){ return url.split('/').pop(); }
	}

	function linkType(url){
		if(/(youtube\.com\/(watch|embed|shorts|live|v)|youtu\.be\/)/i.test(url)) return 'YouTube';
		if(/vimeo\.com\/(.*\/)?\d{6,}/i.test(url)) return 'Vimeo';
		return '';
	}

	//Interface
	function build(field){
		var $field 		= $(field),
			settings 	= read($field),
			id 			= 'gr-video-' + (++counter);

		var html = ''
			+ '<div class="gr-video-row">'
			+ 	'<label class="gr-video-label">Source</label>'
			+ 	'<label><input type="radio" name="' + id + '-source" value="file"> Upload a video file</label>'
			+ 	'<label><input type="radio" name="' + id + '-source" value="embed"> YouTube or Vimeo link</label>'
			+ '</div>'

			+ '<div class="gr-video-row gr-video-file">'
			+ 	'<div class="gr-video-preview"></div>'
			+ 	'<a href="javascript:void(0);" class="link outline-link link-green gr-video-select" data-library="video">Select video</a>'
			+ 	'<a href="javascript:void(0);" class="link outline-link link-red gr-video-clear" data-key="file">Remove</a>'
			+ 	'<p class="gr-video-help">' + FILE_HELP + '</p>'
			+ 	'<p class="gr-video-warning gr-video-size"></p>'
			+ '</div>'

			+ '<div class="gr-video-row gr-video-embed">'
			+ 	'<input type="text" class="gr-video-url" placeholder="https://www.youtube.com/watch?v=…  or  https://vimeo.com/…">'
			+ 	'<p class="gr-video-help">' + LINK_HELP + '</p>'
			+ 	'<p class="gr-video-warning gr-video-url-warning"></p>'
			+ '</div>'

			+ '<div class="gr-video-row">'
			+ 	'<label class="gr-video-label">Playback</label>'
			+ 	'<label><input type="radio" name="' + id + '-playback" value="autoplay"> Autoplay: muted, loops, no controls</label>'
			+ 	'<label><input type="radio" name="' + id + '-playback" value="controls"> Player controls: the visitor presses play, with sound</label>'
			+ '</div>'

			+ '<div class="gr-video-row gr-video-file gr-video-poster">'
			+ 	'<label class="gr-video-label">Poster image (optional)</label>'
			+ 	'<div class="gr-video-poster-preview"></div>'
			+ 	'<a href="javascript:void(0);" class="link outline-link link-green gr-video-select" data-library="image">Select image</a>'
			+ 	'<a href="javascript:void(0);" class="link outline-link link-red gr-video-clear" data-key="poster">Remove</a>'
			+ 	'<p class="gr-video-help">' + POSTER_HELP + '</p>'
			+ '</div>';

		$field.find('.gr-video-ui').html(html);
		$field.find('input[name="' + id + '-source"][value="' + settings.source + '"]').prop('checked', true);
		$field.find('input[name="' + id + '-playback"][value="' + settings.playback + '"]').prop('checked', true);
		$field.find('.gr-video-url').val(settings.url);
		$field.data('gr-video', settings);
		refresh($field);
	}

	function refresh($field){
		var settings = $field.data('gr-video');

		$field.find('.gr-video-file').toggle(settings.source === 'file');
		$field.find('.gr-video-embed').toggle(settings.source === 'embed');

		//Video file
		var $preview = $field.find('.gr-video-preview').empty();
		if(settings.file){
			$('<video muted playsinline controls preload="metadata"></video>').attr('src', settings.file).attr('poster', settings.poster || null).appendTo($preview);
			$('<p class="gr-video-name"></p>').text(fileName(settings.file)).appendTo($preview);
		}
		$field.find('.gr-video-clear[data-key="file"]').toggle(!!settings.file);

		//Poster
		var $poster = $field.find('.gr-video-poster-preview').empty();
		if(settings.poster){
			$('<img alt="" />').attr('src', settings.poster).appendTo($poster);
		}
		$field.find('.gr-video-clear[data-key="poster"]').toggle(!!settings.poster);

		//Link check
		var url = $.trim(settings.url || ''),
			type = linkType(url);
		$field.find('.gr-video-url-warning').text(url && !type ? 'This doesn\'t look like a YouTube or Vimeo video link.' : (type ? type + ' video' : ''))
			.toggleClass('is-ok', !!type);

		write($field, settings);
	}

	function update($field, changes){
		$field.data('gr-video', $.extend({}, $field.data('gr-video'), changes));
		refresh($field);
	}

	//Events
	$(document).on('change', '.gr-video-field input[type="radio"]', function(){
		var changes = {},
			key = /-source$/.test(this.name) ? 'source' : 'playback';
		changes[key] = this.value;
		update($(this).closest('.gr-video-field'), changes);
	});

	$(document).on('input change', '.gr-video-field .gr-video-url', function(){
		update($(this).closest('.gr-video-field'), { url: $.trim($(this).val()) });
	});

	$(document).on('click', '.gr-video-field .gr-video-clear', function(e){
		e.preventDefault();
		var $field = $(this).closest('.gr-video-field'), changes = {};
		changes[$(this).attr('data-key')] = '';
		if($(this).attr('data-key') === 'file') $field.find('.gr-video-size').text('');
		update($field, changes);
	});

	$(document).on('click', '.gr-video-field .gr-video-select', function(e){
		e.preventDefault();
		var $field 	= $(this).closest('.gr-video-field'),
			isVideo = $(this).attr('data-library') === 'video';

		var frame = wp.media({
			title: 		isVideo ? 'Select a video' : 'Select a poster image',
			library: 	{ type: isVideo ? 'video' : 'image' },
			button: 	{ text: isVideo ? 'Use this video' : 'Use this image' },
			multiple: 	false
		});

		frame.on('select', function(){
			var attachment = frame.state().get('selection').first().toJSON();
			if(isVideo){
				var mb = attachment.filesizeInBytes ? attachment.filesizeInBytes / 1048576 : 0;
				$field.find('.gr-video-size').text(
					mb > MAX_MB ? 'This file is ' + mb.toFixed(0) + ' MB. Please export a smaller version (under ' + MAX_RECOMMENDED_MB + ' MB).' :
					mb > MAX_RECOMMENDED_MB ? 'This file is ' + mb.toFixed(0) + ' MB: it may load slowly on phones.' : ''
				);
				update($field, { file: rootRelative(attachment.url) });
			}else{
				update($field, { poster: rootRelative(attachment.url) });
			}
		});

		frame.open();
	});

	//The section form is loaded and filled by section-builder.js; build the interface once it's done
	$(document).ajaxComplete(function(event, xhr, settings){
		if(settings && typeof settings.data === 'string' && settings.data.indexOf('action=gruff_load_the_form') !== -1){
			$('.section-form .gr-video-field').each(function(){
				build(this);
			});
		}
	});

})(jQuery);
