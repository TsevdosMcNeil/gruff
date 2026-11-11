<?php
function gruff_common_admin_scripts(){
  wp_enqueue_style( 'custom-css', get_bloginfo('stylesheet_directory') . '/settings/assets/css/admin-style.css', false, '1.0.0');
  wp_enqueue_script( 'jquery-validate', get_bloginfo('stylesheet_directory') . '/settings/assets/js/jquery.validate.min.js', false, '1.0.0');
  wp_enqueue_script( 'dropzone', 'https://cdn.jsdelivr.net/dropzone/4.3.0/dropzone.min.js', false, '1.0.0');
  wp_enqueue_script( 'gr-common-admin-scripts', get_bloginfo('stylesheet_directory') . '/settings/assets/js/common.js', false, '1.0.0');
  wp_localize_script( 'gr-common-admin-scripts', 'gr_common_admin', ['ajax_url' => admin_url(  'admin-ajax.php' )]  ); 
  wp_enqueue_script( 'gruff-section-builder', get_bloginfo('stylesheet_directory') . '/settings/assets/js/section-builder.js', false, '1.0.0');
  wp_localize_script( 'gruff-section-builder', 'gruff_section_builder', ['ajax_url' => admin_url(  'admin-ajax.php' )]  ); 
}

add_action('admin_enqueue_scripts', 'gruff_common_admin_scripts');

include_once('settings/theme-settings.php');
include_once('settings/section-builder/builder.php');
include_once('settings/section-builder/video-modules.php');
include_once('settings/projects/project-settings.php');
include_once('settings/stories/stories-settings.php');


//Prevent editor form removing span tags
function override_mce_options($initArray) 
{
  $opts = '*[*]';
  $initArray['valid_elements'] = $opts;
  $initArray['extended_valid_elements'] = $opts;
  return $initArray;
 }
add_filter('tiny_mce_before_init', 'override_mce_options');

//Register the navigation menu
register_nav_menus([
    'gr_menu' 			=> 'Primary Navigation Menu For Gruff',
	'gr_secondary_menu' => 'Secondary Navigation Menu For Gruff'

]);

//Rest API support to the menu
function gr_get_menu() {
	$menus 				= [];
 	$locations 			= get_nav_menu_locations();
	$menu 				= wp_get_nav_menu_object($locations['gr_menu']);
	$secondary_menu 	= wp_get_nav_menu_object($locations['gr_secondary_menu']);
	//$menus['primary'] 	= wp_get_nav_menu_items($menu->term_id);
	$menus['primary'] 	= get_gr_main_menu($menu->term_id);
	$menus['secondary'] = wp_get_nav_menu_items($secondary_menu->term_id);
	return $menus;
}
//get main menu
function get_gr_main_menu($menu){
    // wordpress does not group child menu items with parent menu items
    $navbar_items = wp_get_nav_menu_items($menu);
	//return $navbar_items;
    $child_items = [];
    // pull all child menu items into separate object
    foreach ($navbar_items as $key => $item) if ($item->menu_item_parent) {
        array_push($child_items, $item);
        unset($navbar_items[$key]);
    }
	//return $child_items;
    // push child items into their parent item in the original object
    foreach ($navbar_items as $index => $item){
		$navbar_items[$index]->child_items = [];
        foreach ($child_items as $key => $child){
            if ($child->menu_item_parent == $item->ID) {
                if (!$navbar_items[$index]->child_items) $navbar_items[$index]->child_items = [];
                array_push($navbar_items[$index]->child_items, $child);
                unset($child_items[$key]);
            }
		}
	}	
    // return navbar object where child items are grouped with parents
    return $navbar_items;
}
// function gr_get_menu() {
//   $locations = get_nav_menu_locations();
//   $menu = wp_get_nav_menu_object($locations['gr_menu']);
//   return wp_get_nav_menu_items($menu->term_id);
// }
add_action( 'rest_api_init', function () {
        register_rest_route( '/gruff-api', '/menu', array(
        'methods' => 'GET',
        'callback' => 'gr_get_menu',
    ) );
} );

//Rest API support theme settings
function gr_get_settings() {
    return [
       'twitter_url'    => get_option('twitter_url'),
       'instagram_url'  => get_option('instagram_url'),
       'contact_number' => get_option('contact_number'),
       'contact_email'  => get_option('contact_email'),
       'copyright'      => get_option('copyright'),
       'office_details' => get_option('office_details'),
       'office_address' => get_option('office_address'),
       'logos'          => get_option('logos'),
   ];
}

add_action( 'rest_api_init', function () {
       register_rest_route( '/gruff-api', '/options', array(
       'methods' => 'GET',
       'callback' => 'gr_get_settings',
   ) );
} );

add_action( 'rest_api_init', function () {
       register_rest_route( '/gruff-api', '/options', array(
       'methods' => 'GET',
       'callback' => 'gr_get_settings',
   ) );
} );

/*
* Replace the image source
* Added on: 28.12.2018
*/
function replace_img_src($img_tag) {
    $doc = new DOMDocument();
    //@$doc->loadHTML($img_tag);
	@$doc->loadHTML(mb_convert_encoding($img_tag, 'HTML-ENTITIES', 'UTF-8'));
    $tags = $doc->getElementsByTagName('img');
    
    if(count($tags) > 0){
      foreach ($tags as $tag) {
        $old_src = $tag->getAttribute('data-src');
        $tag->removeAttribute('data-src');
        $new_src_url = get_stylesheet_directory_uri().'/settings/assets/img/content-images/'.$old_src;
        $tag->setAttribute('src', $new_src_url);
      }
    }

    return $doc->saveHTML();
}

/*
* API to return formatted Team Members
* Added on: 31.12.2018
*/
function gr_get_people() {
    $people_args = [
      'post_type'       => 'team_member',
      'meta_key'        => 'sequence',
      'orderby'         => 'meta_value',
      'order'           => 'ASC'
    ];
    $people = new WP_Query( $people_args );

    $peopleData = get_people_data($people);

    return $peopleData;
}

add_action( 'rest_api_init', function () {
       register_rest_route( '/gruff-api', '/people', array(
       'methods' => 'GET',
       'callback' => 'gr_get_people',
   ) );
} );

/*
* Fomat with the ACF fields
* Added on: 31.12.2018
*/
function get_people_data($data){
  
  if(!isset($data->posts) || count($data->posts) == 0) return [];

  foreach ($data->posts as $key => $value) {
    $value->member_thumbnail_image  = get_field('member_thumbnail_image',$value->ID);
    $value->member_large_image      = get_field('member_large_image',$value->ID);
    $value->member_designation      = get_field('member_designation',$value->ID);
    $value->member_qualification    = get_field('member_qualification',$value->ID);
    $value->member_description      = get_field('member_description',$value->ID);
  };

  return $data->posts;
}

/*
* API to return formatted Testimonials
* Added on: 05.02.2019
*/
function gr_get_testimonials() {
    $testimonial_args = [
      'post_type'       => 'testimonials',
      'meta_key'        => 'sequence',
      'orderby'         => 'meta_value',
      'order'           => 'ASC'
    ];
    $testimonial = new WP_Query( $testimonial_args );

    $testimonialData = get_testimonial_data($testimonial);

    return $testimonialData;
}

/*
* Fomat with the ACF fields
* Added on: 05.02.2019
*/
function get_testimonial_data($data){
  
  if(!isset($data->posts) || count($data->posts) == 0) return [];

  foreach ($data->posts as $key => $value) {
    $value->remarks      = get_field('remarks',$value->ID);
  };

  return $data->posts;
}

add_action( 'rest_api_init', function () {
       register_rest_route( '/gruff-api', '/testimonials', array(
       'methods' => 'GET',
       'callback' => 'gr_get_testimonials',
   ) );
} );


//Homepage Slider columns
function gruff_home_columns($columns)
{
    $columns = array(
        'cb'        => '<input type="checkbox" />',
        'title'     => 'Slider Title',
        'image'     => 'Slider Image',
    );
    return $columns;
}

function gruff_home_custom_columns($column)
{
    global $post;
    
    if ($column == 'image') {
        echo '<img src="'.get_field('slider_image')['url'].'" width="100px" />';
    }
    else {
         echo '';
    }
}

add_action("manage_home_slider_posts_custom_column", "gruff_home_custom_columns");
add_filter("manage_home_slider_posts_columns", "gruff_home_columns");

//People page slider columns
function gruff_people_columns($columns)
{
    $columns = array(
        'cb'        => '<input type="checkbox" />',
        'title'     => 'Slider Title',
        'image'     => 'Slider Image',
    );
    return $columns;
}

function gruff_people_custom_columns($column)
{
    global $post;
    
    if ($column == 'image') {
        echo '<img src="'.get_field('image')['url'].'" width="100px" />';
    }
    else {
         echo '';
    }
}

add_action("manage_team_slider_posts_custom_column", "gruff_people_custom_columns");
add_filter("manage_team_slider_posts_columns", "gruff_people_columns");

/*
 * Customizing the admin columns for Awards
 * Added on: 07.03.2019
 */
function gruff_awards_columns($columns)
{
    $columns = array(
        'cb'         	=> 		'<input type="checkbox" />',
        'award_name'    => 		'Award Name',
        'result'     	=> 		'Result',
        'sequence'      =>    	'Sequence',
    );
    return $columns;
}

function gruff_awards_custom_columns($column)
{
    global $post;
    
    switch($column) {
		case 'award_name':	
        	echo get_field( "award_name", $post->ID );
			break;
		case 'result':	
			$result = get_field( "result", $post->ID );
			echo $result->name;
			break;	
		case 'sequence':
			echo get_field( "sequence", $post->ID );
			break;
		default:
			echo '';
    }
    
}

add_action("manage_awards_posts_custom_column", "gruff_awards_custom_columns");
add_filter("manage_awards_posts_columns", "gruff_awards_columns");

/*
* Awards API Data
* Added on: 07.03.2019
*/
function get_awards_data($data){
  
  if(!isset($data->posts) || count($data->posts) == 0) return [];

  foreach ($data->posts as $key => $value) {
	$result = get_field( "result", $value->ID );  
    $value->award_name      = get_field('award_name',$value->ID);
    $value->result      	= $result->name;
  };

  return $data->posts;
}

add_action( 'rest_api_init', function () {
       register_rest_route( '/gruff-api', '/awards', array(
       'methods' => 'GET',
       'callback' => 'gr_get_awards',
   ) );
} );

function gr_get_awards() {
    $awards_args = [
      'post_type'       => 'awards',
      'meta_key'        => 'sequence',
      'orderby'         => 'meta_value_num',
      'order'           => 'ASC'
    ];
    $awards = new WP_Query( $awards_args );

    $awardsData = get_awards_data($awards);

    return $awardsData;
}
