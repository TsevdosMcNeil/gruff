<?php
//Add the meta box
function gruff_add_stories_meta_box() {
   add_meta_box(
       'gruff-stories-meta-box',       // $id
       'Sections',                		// $title
       'show_stories_meta_box',  		// $callback
       'gruff_stories',                // $page
       'normal',                  		// $context
       'high'                     		// $priority
   );
}
add_action('add_meta_boxes', 'gruff_add_stories_meta_box');

//load admin scripts
function gruff_stories_scripts(){
    wp_enqueue_script( 'gruff-stories', get_bloginfo('stylesheet_directory') . '/settings/assets/js/stories.js', ['gruff-section-builder'], '1.0.0');
    wp_localize_script( 'gruff-stories', 'gruff_section_builder', ['ajax_url' => admin_url(  'admin-ajax.php' )]  ); 

}
add_action('admin_enqueue_scripts', 'gruff_stories_scripts');

//Show the page
function show_stories_meta_box() {
	include('view/page.php');
}

//Hook into save
add_action( 'save_post_gruff_stories', 'gruff_stories_save', 10, 3 );

/* When a specific post type's post is saved, saves our custom data
 * @param int     $post_ID Post ID.
 * @param WP_Post $post    Post object.
 * @param bool    $update  Whether this is an existing post being updated or not.
*/
function gruff_stories_save( $post_id, $post, $update ) {

  global $wpdb;

  // verify if this is an auto save routine. 
  // If it is our form has not been submitted, so we dont want to do anything
  if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) 
      return;

  // verify this came from the our screen and with proper authorization,
  // because save_post can be triggered at other times

  //if ( !wp_verify_nonce( $_POST['gruff_stories_nonce'], dirname(__FILE__) . DIRECTORY_SEPARATOR . 'view' . DIRECTORY_SEPARATOR .'page.php' ) )
     // return;


  // Check permissions
  if ( 'page' == $post->post_type ) 
  {
    if ( !current_user_can( 'edit_page', $post_id ) )
        return;
  }
  else
  {
    if ( !current_user_can( 'edit_post', $post_id ) )
        return;
  }

  // OK, we're authenticated: we need to find and save the data

  $mydata = $_POST;

  return $mydata;
}

/*
* API data for stories
* Added on: 28.12.2018
*/

add_action( 'rest_api_init', function () {
       register_rest_route( '/gruff-api', '/stories', array(
       'methods'  => 'GET',
       'callback' => 'gr_get_stories',
   ) );
} );

function gr_get_stories() {
  $content        = new ContentDB;
  $sectionDB      = new SectionDB;  

  //Query to get story post type data
    $args = [
      'post_type'     => 'gruff_stories',
      'meta_key'      => 'sequence',
      'orderby'       => 'meta_value',
      'order'         => 'ASC'
    ];
    $stories = new WP_Query( $args );
    
    if(!isset($stories->posts) || count($stories->posts) == 0){
      return [];exit;
    }
  //Add ACF data and layout to the result set
    foreach ($stories->posts as $key => $story) {

      $sections_arr   = [];
      $post_id        = $story->ID;
      $param          = ['post_id' => $post_id, 'flag' => 0];
      $contentData    = $content->getContentData($param);
      $output         = [];

      if(count($contentData) > 0){
        foreach ($contentData as $key => $_section) {
          $sections_arr[$key]['sequence'] = $_section['sequence'];
          $sections_arr[$key]['row_id']   = $_section['id'];
          $sections_arr[$key]['sections'] = $sectionDB->getRecordById( $_section['section_id']);
        }
      }
     // print_r($sections_arr);die();
      if(count($sections_arr) > 0){
        foreach ($sections_arr as $index => $section) {
          $output[] = replace_img_src($sectionDB->load_rendered($section['sections'], $section['sequence'], $post_id));
        }
      }

      $story->hero_image      = get_field('hero_image',$post_id);
      $story->thumbnail_image = get_field('thumbnail_image',$post_id);
      $story->font_color      = get_field('font_color',$post_id);
      $story->sub_heading     = get_field('sub_heading',$post_id);
      $story->sequence        = get_field('sequence',$post_id);
      $story->layout          = $output;

    }

  //Return the API response for stories
    return ['stories' => $stories->posts, 'all' => $stories->posts];exit;
}