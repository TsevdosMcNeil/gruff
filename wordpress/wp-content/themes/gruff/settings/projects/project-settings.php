<?php
//Add the meta box
function gruff_add_projects_meta_box() {
   add_meta_box(
       'gruff-projects-meta-box',       // $id
       'Sections',                		// $title
       'show_projects_meta_box',  		// $callback
       'gruff_projects',                // $page
       'normal',                  		// $context
       'high'                     		// $priority
   );
}
add_action('add_meta_boxes', 'gruff_add_projects_meta_box');

//load admin scripts
function gruff_projects_scripts(){
    wp_enqueue_script( 'gruff-projects', get_bloginfo('stylesheet_directory') . '/settings/assets/js/projects.js', ['gruff-section-builder'], '1.0.0');
    wp_localize_script( 'gruff-projects', 'gruff_section_builder', ['ajax_url' => admin_url(  'admin-ajax.php' )]  ); 
}
add_action('admin_enqueue_scripts', 'gruff_projects_scripts');

//Show the page
function show_projects_meta_box() {
	include('view/page.php');
}

//Hook into save
add_action( 'save_post_gruff_projects', 'gruff_projects_save', 10, 3 );

/* When a specific post type's post is saved, saves our custom data
 * @param int     $post_ID Post ID.
 * @param WP_Post $post    Post object.
 * @param bool    $update  Whether this is an existing post being updated or not.
*/
function gruff_projects_save( $post_id, $post, $update ) {

  global $wpdb;

  // verify if this is an auto save routine. 
  // If it is our form has not been submitted, so we dont want to do anything
  if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) 
      return;

  // verify this came from the our screen and with proper authorization,
  // because save_post can be triggered at other times

  //if ( !wp_verify_nonce( $_POST['gruff_projects_nonce'], dirname(__FILE__) . DIRECTORY_SEPARATOR . 'view' . DIRECTORY_SEPARATOR .'page.php' ) )
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

//Check recent project count	
function gruff_projects_recent_save_post( $post_id )
{
	$field = 'field_5ca43fc84d230';
	if( empty($_POST['acf']) ) {
        return;
    }
	if(isset($_POST['acf'][$field]) && $_POST['acf'][$field] == 1){
		$args = [
			'post_type'       => 'gruff_projects',
			'meta_key'        => 'recent_project',
			'orderby'         => 'meta_value',
			'meta_query'      => [
				[
					'key'     => 'recent_project',
					'compare' => '=',
					'value'   => '1'
				]
			],
			'post__not_in' => [$post_id]
		];
		$projects = new WP_Query( $args );
		if(isset($projects->posts) && count($projects->posts) == 4){
			return false;
		}
	}
}
add_action('acf/save_post', 'gruff_projects_recent_save_post', 1);
//Check recent project count

/*
* API data for projects
* Added on: 27.12.2018
*/

add_action( 'rest_api_init', function () {
       register_rest_route( '/gruff-api', '/projects', array(
       'methods'  => 'GET',
       'callback' => 'gr_get_projects',
   ) );
} );


/*
* API data for projects
* Added on: 27.12.2018
*/

add_action( 'rest_api_init', function () {
       register_rest_route( '/gruff-api', '/projects', array(
       'methods'  => 'GET',
       'callback' => 'gr_get_projects',
   ) );
} );


function gr_get_projects() {
  $content        = new ContentDB;
  $sectionDB      = new SectionDB;
  	
  //Query to get project post type data
    $args = [
      'post_type'     => 'gruff_projects',
      'meta_key'      => 'sequence',
      'orderby'       => 'meta_value_num',
      'order'         => 'ASC',
      'meta_query'      => [
        [
          'key'     => 'type',
          'compare' => '!=',
          'value'   => '2'
        ]
      ]
    ];
    $projects = new WP_Query( $args );
    
    $featured = format_projects($projects);

    $other_args = [
      'post_type'     => 'gruff_projects',
      'meta_key'      => 'sequence',
      'orderby'       => 'meta_value_num',
      'order'         => 'ASC',
      'meta_query'      => [
        [
          'key'     => 'type',
          'compare' => '!=',
          'value'   => '1'
        ]
      ]
    ];
    $other_projects = new WP_Query( $other_args );

    $others = format_projects($other_projects);

  //Recent projects
    $recent_projects = get_recent_projects();

  //Return the API response for projects
    return ['featured' => $featured, 'others' => array_chunk($others,6), 'all_others' => $others, 'all' => array_merge($featured, $others), 'recent_projects' => $recent_projects];
}
//Format Project Data
function format_projects($projects){
    $content        = new ContentDB;
    $sectionDB      = new SectionDB;  

    if(!isset($projects->posts) || count($projects->posts) == 0){
      return [];exit;
    }

  //Add ACF data and layout to the result set
    foreach ($projects->posts as $key => $project) {

      $sections_arr   = [];
      $post_id        = $project->ID;
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
      if(count($sections_arr) > 0){
        foreach ($sections_arr as $index => $section) {
          $output[] = replace_img_src($sectionDB->load_rendered($section['sections'], $section['sequence'], $post_id));
        }
      }

      $project->hero_image      = get_field('hero_image',$post_id);
      $project->icon_color      = get_field('icon_color',$post_id) == 1 ? 'rgb(255, 255, 255)' : 'rgb(184, 187, 179)';
	  $project->details_icon    = get_field('details_icon',$post_id) == 2 ? 'rgb(184, 187, 179)' : 'rgb(255, 255, 255)';
      $project->grid_image      = get_field('grid_image',$post_id);
      $project->list_image      = get_field('list_image',$post_id);
      $project->list_view_color = get_field('list_view_color',$post_id);
      $project->sub_heading     = get_field('sub_heading',$post_id);
      $project->sequence        = get_field('sequence',$post_id);
      $project->layout          = $output;

    }

    return $projects->posts;
}

/*
* Get the recent projects
* Added on: 28.12.2018
*/
function get_recent_projects(){
  $args = [
    'post_type'       => 'gruff_projects',
    'meta_key'        => 'recent_project',
    'orderby'         => 'meta_value',
	'meta_query'      => [
        [
          'key'     => 'recent_project',
          'compare' => '=',
          'value'   => '1'
        ]
    ],
    'posts_per_page'  => 4
  ];
  $projects = new WP_Query( $args );

  if(!isset($projects->posts) || count($projects->posts) == 0){
    return [];exit;
  }

  foreach ($projects->posts as $key => $project) {
    $post_id                  = $project->ID;
    $project->hero_image      = get_field('hero_image',$post_id);
  }

  return $projects->posts;
}

/*
 * Customizing the admin columns for projects
 * Added on: 01.03.2019
 */
function gruff_projects_columns($columns)
{
    $columns = array(
        'cb'         			=> 		'<input type="checkbox" />',
        'title'     			=> 		'Project Title',
        'recent_project'     	=> 		'Recent Project',
        'featured'     			=> 		'Featured',
        'sequence'       		=>    	'Sequence',
    );
    return $columns;
}

function gruff_projects_custom_columns($column)
{
    global $post;
    
    switch($column) {
		case 'featured':	
        	echo get_field( "featured", $post->ID ) == 1 ? 'Yes' : 'No';
			break;
		case 'recent_project':
			echo get_field( "recent_project", $post->ID ) == 1 ? 'Yes' : 'No';
			break;
		case 'sequence':
			echo get_field( "sequence", $post->ID );
			break;
		default:
			echo '';
    }
    
}

add_action("manage_gruff_projects_posts_custom_column", "gruff_projects_custom_columns");
add_filter("manage_gruff_projects_posts_columns", "gruff_projects_columns");