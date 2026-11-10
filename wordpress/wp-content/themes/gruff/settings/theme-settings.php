<?php
//Add theme settings page
add_action('admin_menu', 'gruff_theme_settings');

function gruff_theme_settings() {
  add_menu_page( "Gruff Theme Settings", "Gruff Theme Settings", "manage_options", "theme-panel", "theme_settings_page", null, 99);
}

//Display the form
function theme_settings_page()
{
  include(dirname(__FILE__) . DIRECTORY_SEPARATOR .'settings.php');
  ?>
  
<?php }

//All Fields
function display_theme_panel_fields()
{
  register_setting("gr_theme_section", "contact_number");
  register_setting("gr_theme_section", "contact_email");
  register_setting("gr_theme_section", "twitter_url");
  register_setting("gr_theme_section", "instagram_url");
  register_setting("gr_theme_section", "copyright");
	
  register_setting("gr_theme_section", "office_details");
  register_setting("gr_theme_section", "office_address");
	
  register_setting("gr_theme_section", "logos");

  add_settings_section("gr_theme_section", "Gruff Theme Settings", null, "theme-options");

  add_settings_field("twitter_url", "Twitter", "twitter_url", "theme-options", "gr_theme_section");  
  add_settings_field("instagram_url", "Instagram", "instagram_url", "theme-options", "gr_theme_section");  
  add_settings_field("contact_number", "Contact Number", "contact_number", "theme-options", "gr_theme_section");  
  add_settings_field("contact_email", "Contact Email", "contact_email", "theme-options", "gr_theme_section");  
  add_settings_field("copyright", "Copyright", "copyright", "theme-options", "gr_theme_section");   
	
  add_settings_field("office_details", "Office Details", "office_details", "theme-options", "gr_theme_section");    
  add_settings_field("office_address", "Office Address", "office_address", "theme-options", "gr_theme_section");   	
	
  add_settings_field("logos", "Logos", "logos", "theme-options", "gr_theme_section");   
	
}

add_action("admin_init", "display_theme_panel_fields");


//Twitter Social Media
function twitter_url()
{
?>
  <div class="social-media">
      <input type="url" name="twitter_url" id="twitter_url" value="<?php echo get_option('twitter_url'); ?>" />
  </div>    
  <?php
}

//Instagram Social Media
function instagram_url()
{
?>
  <div class="social-media">
      <input type="url" name="instagram_url" id="instagram_url" value="<?php echo get_option('instagram_url'); ?>" />
  </div>    
  <?php
}

//Contact Number Field
function contact_number()
{
?>
  <div class="general-info">
      <input type="text" name="contact_number" id="contact_number" value="<?php echo get_option('contact_number'); ?>" />
  </div>    
  <?php
}

//Contact Email Field
function contact_email()
{
?>
  <div class="general-info">
      <input type="email" name="contact_email" id="contact_email" value="<?php echo get_option('contact_email'); ?>" />
  </div>    
  <?php
}

//Copyright Field
function copyright()
{
?>
  <div class="trademark-section">
     <?php 
        $copyright = get_option('copyright');
        $settings = array(
          'teeny' => true,
          'textarea_rows' => 15,
          'tabindex' => 1
      );
      wp_editor($copyright, 'copyright', $settings);
    ?>
  </div>    
  <?php
}

//Office Details Field
function office_details()
{
?>
  <div class="trademark-section">
     <?php 
        $office_details = get_option('office_details');
        $settings = array(
          'teeny' => true,
          'textarea_rows' => 15,
          'tabindex' => 1
      );
      wp_editor($office_details, 'office_details', $settings);
    ?>
  </div>    
  <?php
}


//Office Address Field
function office_address()
{
?>
  <div class="trademark-section">
     <?php 
        $office_address = get_option('office_address');
        $settings = array(
          'teeny' => true,
          'textarea_rows' => 15,
          'tabindex' => 1
      );
      wp_editor($office_address, 'office_address', $settings);
    ?>
  </div>    
  <?php
}

//Logos Field
function logos()
{
?>
  <div class="trademark-section">
     <?php 
        $logos = get_option('logos');
        $settings = array(
          'teeny' => true,
          'textarea_rows' => 15,
          'tabindex' => 1
      );
      wp_editor($logos, 'logos', $settings);
    ?>
  </div>    
  <?php
}

function Project_custom_login()
{
  echo '<link rel="stylesheet" type="text/css" href="' . get_bloginfo('stylesheet_directory') . '/settings/assets/css/login.css" />';
}
add_action('login_head', 'Project_custom_login');

//Dashboard Widget 
function ProjectWidget() {
  ?>
    <div class="widget-area one">
      <p class="count"><?= gruff_get_count('gruff_projects') ?></p>
      <a class="btn solid-btn btns-black" href="<?= site_url() ?>/wp-admin/post-new.php?post_type=gruff_projects">Add New</a>
    </div>
  <?php 
}
function add_ProjectWidget() {
  wp_add_dashboard_widget('ProjectWidget', 'Projects', 'ProjectWidget');
}
add_action('wp_dashboard_setup', 'add_ProjectWidget');

function GruffStoryWidget() {
  ?>
    <div class="widget-area two">
      <p class="count"><?= gruff_get_count('gruff_stories') ?></p>
      <a class="btn solid-btn btns-black" href="<?= site_url() ?>/wp-admin/post-new.php?post_type=gruff_stories">Add New</a>
    </div>
  <?php 
}
function add_GruffStoryWidget() {
  wp_add_dashboard_widget('GruffStoryWidget', 'Stories', 'GruffStoryWidget');
}
add_action('wp_dashboard_setup', 'add_GruffStoryWidget');

function GruffTeamWidget() {
  ?>
    <div class="widget-area three">
      <p class="count"><?= gruff_get_count('team_member') ?></p>
      <a class="btn solid-btn btns-black" href="<?= site_url() ?>/wp-admin/post-new.php?post_type=team_member">Add New</a>
    </div>
  <?php 
}
function add_GruffTeamWidget() {
  wp_add_dashboard_widget('GruffTeamWidget', 'Team Members', 'GruffTeamWidget');
}
add_action('wp_dashboard_setup', 'add_GruffTeamWidget');

function GruffSettingsWidget() {
  ?>
    <div class="widget-area four">
      <a class="btn solid-btn btns-black" href="<?= site_url() ?>/wp-admin/admin.php?page=theme-panel">Update Theme Settings</a>
    </div>
  <?php 
}
function add_GruffSettingsWidget() {
  wp_add_dashboard_widget('GruffSettingsWidget', 'Settings', 'GruffSettingsWidget');
}
add_action('wp_dashboard_setup', 'add_GruffSettingsWidget');

/*
* Get count
*/

function gruff_get_count($post_type){
  $args = array(
      'post_type'     => $post_type,
      'post_status'   => array('publish')
  );
  $query = new WP_Query();
  $post = $query->query( $args );
  return count($post);
}