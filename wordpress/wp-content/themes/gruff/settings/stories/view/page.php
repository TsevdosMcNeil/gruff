<?php
 global $post;
// Use nonce for verification to secure data sending
wp_nonce_field( basename( __FILE__ ), 'gruff_stories_nonce' );
?>
<script type="text/javascript">
    var IMAGE_PATH = '<?= get_stylesheet_directory_uri() ?>/settings/assets/img/content-images/';
</script>
<div id="stories-builder">
    <input type="hidden" id="post_id" name="post_id" value="<?= $post->ID ?>">
    <input type="hidden" id="sequence" value="1">
    <input type="hidden" id="post_type" value="gruff_stories">

    <!-- show the section form -->
    <div class="section-form" style="display:none"></div>

    <!--all available sections -->
	<div class="available-sections cell-12" style="display:none">
        <div class="sections"></div>
        <a href="javascript:void(0)" class="hide-sections">Close</a>
    </div>

    <!--all saved sections for the post -->
    <div class="page-sections gruff--StoryDetails" id="sortable"></div>

    <!-- Add section button -->
	<a href="javascript:void(0)" class="add-section btn solid-btn btns-black">Add a Section</a>
</div>
<script src="https://cdn.ckeditor.com/4.7.1/standard/ckeditor.js"></script>

