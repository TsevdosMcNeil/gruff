<?php
include(dirname(dirname(__FILE__)). DIRECTORY_SEPARATOR.'/classes/TagDB.php');
include(dirname(dirname(__FILE__)). DIRECTORY_SEPARATOR.'/classes/SectionDB.php');
include(dirname(dirname(__FILE__)). DIRECTORY_SEPARATOR.'/classes/ContentDB.php');


//Add theme settings page
add_action('admin_menu', 'gruff_section_builder');

function gruff_section_builder() {
  	add_menu_page( "Gruff Section Builder", "Gruff Section Builder", "manage_options", "section-builder", "gruff_section_builder_listing", 'dashicons-layout', 99);
  	add_submenu_page( NULL, "Gruff Section Builder", "Gruff Section Builder", "manage_options", "section-builder-form", "load_gruff_section_builder_form", null, 99);
}

//Section Builder listing page
function gruff_section_builder_listing(){
	$section = new SectionDB;
	$data = $section->getAllRecords();
  	include(dirname(__FILE__) . DIRECTORY_SEPARATOR .'view'.DIRECTORY_SEPARATOR.'listing.php');
}

//Display the form
function load_gruff_section_builder_form()
{
  include(dirname(__FILE__) . DIRECTORY_SEPARATOR .'view'.DIRECTORY_SEPARATOR.'form.php');
}


//Section builder AJAX
add_action( 'wp_ajax_nopriv_gruff_get_tags', 'gruff_get_tags' );
add_action( 'wp_ajax_gruff_get_tags', 'gruff_get_tags' );

function gruff_get_tags() {
	$data = [];
    $tag = new TagDB;
 	$records = $tag->getAllRecords();

 	echo json_encode($records); exit;
}

//Save all sections 
add_action( 'wp_ajax_nopriv_gruff_section_builder_submission', 'gruff_section_builder_submission' );
add_action( 'wp_ajax_gruff_section_builder_submission', 'gruff_section_builder_submission' );
function gruff_section_builder_submission(){
	$admin_id 	= get_current_user_id();
	$date		= date('Y-m-d h:i:s');
	$response = ['status' => false, 'message' => 'Some error ocurred'];
	$insertData = [
		'type'			=> $_POST['type'],
		'section_name'	=> $_POST['section_name'],
		'section_html'	=> stripslashes($_POST['section_html']),
		'sequence'		=> $_POST['sequence'],
		'added_by'		=> $admin_id,
		'added_on'		=> $date
	];
	if(isset($_FILES['icon']) && !empty($_FILES['icon']['tmp_name'])){
		$imageData 			= getimagesize($_FILES['icon']['tmp_name']);
		$mimeType 			= $imageData['mime'];
		$allowedMimeTypes 	= ['image/jpeg', 'image/png', 'image/gif'];
		
		if (!in_array($mimeType, $allowedMimeTypes)){
		    $response['message'] = 'Only JPEG, PNG and GIFs are allowed';
		    echo json_encode($response);exit;
		}    
		$dir = dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'assets'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'section-builder/';
		$filename = rand().'-'.$_FILES['icon']['name'];
    	if(move_uploaded_file($_FILES['icon']['tmp_name'],$dir.$filename)){
    		$insertData['icon'] = $filename;
    	}else{
		    $response['message'] = 'Image could not be uploaded';
		    echo json_encode($response);exit;    	
		}
	}
	$tags_data['tags_arr'] 	= $_POST['tag_id'];
	$tags_data['height'] 	= $_POST['height'];
	$tags_data['width'] 	= $_POST['width'];
	
	//print_r($_POST);exit;

	$response = insert_section($insertData,$tags_data);
    echo json_encode($response);exit;
}

//Insert the section data
function insert_section($insertData,$tags_data){
	global 	$wpdb,
			$form_errors; 
    if(count( $form_errors->errors) > 0){
    	return ['status' => false, 'message' => 'Required form field is missing'];exit;
    }    		        
    $query = $wpdb->insert( $wpdb->prefix.'sections', $insertData);

    if(!$query){
    	return ['status' => false, 'message' => 'Some error ocurred'];exit;
    }

    $section_id = $wpdb->insert_id;

    $tags_arr 	= $tags_data['tags_arr'];
    $width 		= $tags_data['width'];
    $height 	= $tags_data['height'];

    if(count($tags_arr) > 0){
		foreach ($tags_arr as $key => $value) {
			
			$rules = !empty($width[$key]) ? json_encode([ 'width' => $width[$key], 'height' => $height[$key] ]) : NULL;

			$insert = $wpdb->insert( $wpdb->prefix.'sections_tags',
			[
				'section_id' => $section_id, 
				'tag_id'	 => $value,
				'rules'	 	 => $rules
			]);
		}
	}

	$query = 'admin.php';
    $link = add_query_arg([
        'page' => 'section-builder',
    ],$query );

    return ['status' => true, 'message' =>  'Record added successfully', 'redirectUrl' => $link];exit;

}


//Load saved sections
//Load the form
add_action( 'wp_ajax_nopriv_gruff_load_saved_sections', 'gruff_load_saved_sections' );
add_action( 'wp_ajax_gruff_load_saved_sections', 'gruff_load_saved_sections' );

function gruff_load_saved_sections(){
	$content 			= new ContentDB;
	$sectionDB 			= new SectionDB;
	$sections_arr 		= [];
	$post_id 			= isset($_POST['post_id']) ? $_POST['post_id'] : NULL;
	$param 				= ['post_id' => $post_id, 'flag' => 0];
    $contentData 		= $content->getContentData($param);
    $output 			= '';
    if(count($contentData) > 0){
      foreach ($contentData as $key => $_section) {
		$sections_arr[$key]['sequence'] = $_section['sequence'];
		$sections_arr[$key]['row_id'] 	= $_section['id'];
		$sections_arr[$key]['sections'] = $sectionDB->getRecordById( $_section['section_id']);
      }
    }
    //print_r($sections_arr);
    if(count($sections_arr) > 0){
      foreach ($sections_arr as $index => $section) {
        $output .= '<div class="single-section" data-id="'.$section['row_id'].'" data-sequence="'.$section['sequence'].'">';
        $output .= $sectionDB->load_btns($section['sections'], $section['sequence']);
        $output .= '<div class="section-container">'.$sectionDB->load_rendered($section['sections'], $section['sequence'], $post_id).'</div>';
        $output .= '</div>';
      }
    }

	$last_sequence 			= $content->last_sequence(['post_id' => $post_id]);

	//$getContentDataRow 	= $content->getContentDataRow($param);
	$sequence 	 		= isset($last_sequence) && !empty($last_sequence) ? $last_sequence + 1 : 1;
    echo json_encode(['sections_arr' => $sections_arr, 'page_data' => $output, 'sequence' => $sequence]);exit;
}



//Remove A Section
add_action( 'wp_ajax_nopriv_gruff_section_remove', 'gruff_section_remove' );
add_action( 'wp_ajax_gruff_section_remove', 'gruff_section_remove' );

function gruff_section_remove(){
	$id = trim($_POST['id']);
	$query = new SectionDB;
	$rec = $query->removeById($id);
	if(!$rec){
		echo json_encode(['status' => 'error', 'message' => 'Record could not be deleted!']);exit;
	}
	echo json_encode(['status' => 'success', 'message' => 'Record deleted successfully!']);exit;
}

//Return all available sections
add_action( 'wp_ajax_nopriv_available_sections', 'available_sections' );
add_action( 'wp_ajax_available_sections', 'available_sections' );

function available_sections(){
	$query = new SectionDB;
	$filter = [
		'type' => $_POST['type']
	];
	$records = $query->getAllRecords($filter);
	if(count($records) > 0 ){
		echo json_encode(['status' => true, 'data' => $records]);exit;
	}
	echo json_encode(['status' => false, 'data' => []]);exit;
}

//Load the form
add_action( 'wp_ajax_nopriv_gruff_load_the_form', 'gruff_load_the_form' );
add_action( 'wp_ajax_gruff_load_the_form', 'gruff_load_the_form' );

function gruff_load_the_form(){
	$query 		= new SectionDB;
	$content 	= new ContentDB;

	
	$id 		= isset($_POST['id']) ? $_POST['id'] : NULL;
	$sequence 	= isset($_POST['sequence']) ? $_POST['sequence'] : NULL;
	$post_id 	= isset($_POST['post_id']) ? $_POST['post_id'] : NULL;
	$type 		= isset($_POST['type']) ? $_POST['type'] : NULL;
	$form 		= '';
	$data 		= [];

	$section 	= $query->getRecordById($id);


	if(!isset($section) || count($section) == 0){
		echo json_encode(['status' => false, 'data' => $data, 'form' => $form, 'sequence' => $sequence]);exit;
	}


	$form 		= _form_html($section);


	//Determine the sequence
	$param 	= [
		'flag' 		=> 0,
	];

	if(!empty($post_id)){
		$param['post_id']	= $post_id;
	}

	if(!empty($id)){
		$param['section_id']	= $id;
	}

	if(!empty($sequence)){
		$param['sequence']	= $sequence;
	}

	$last_sequence 			= $content->last_sequence(['post_id' => $post_id]);

	//$getContentDataRow 	= $content->getContentDataRow($param);
	$sequence 	 		= isset($last_sequence) && !empty($last_sequence) ? $last_sequence + 1 : 1;

	$data    			= $content->_data($param);

	$content 			= new ContentDB;
	$formTags 			= $content->getSectionTags(['section_id' => $id]);


	echo json_encode(['status' => true, 'data' => $data, 'form' => $form, 'formTags' => $formTags, 'sequence' => $sequence]);exit;
}

/*
* Html generation of the form
* Added on: 21.12.2018
*/
function _form_html($section){
	$html 			= '';
	$section_id 	= $section['id'];
	$section_name 	= $section['section_name'];
	$content 		= new ContentDB;
	$sectionTags 	= $content->getSectionTags(['section_id' => $section_id]);
	if(count($sectionTags) > 0){
		$html .= '
		<div id="'.$section_id.'" class="editFormElemWrapper">
	        <div class="addFromHeader">
	          <h3>'.$section_name.'</h3>
			  <a href="javascript:void(0);" class="remove_BTN"></a>
			  <a href="javascript:void(0);" class="btnFormClose">Close</a>
	        </div>
			<form name="sectionSaveForm" id="sectionSaveForm" class="sectionSaveForm">
		';
		foreach ($sectionTags as $key => $tag_item) {
			$tag_html = str_replace('index[]',$key, $tag_item['tag']['html']);
			$tag_html = str_replace('content[]', "(content|$key)", $tag_html);
			$html .= '<div class="addFormCover">'.$tag_html.'';
		}
		$html .= '
				<input type="hidden" name="sequence[]" />
				<input type="hidden" name="section_id[]" value="'.$section_id.'" />
			</form>
			<div class="addFieldItems cell-12">
	            <input type="button" class="btn solid-btn btns-dgreen save_section" value="Save Changes">
	        </div></div>
		</div>';
	}

	return $html;
}

/*
* Save the section
* Added on: 21.12.2018
*/
add_action( 'wp_ajax_nopriv_gruff_save_section', 'gruff_save_section' );
add_action( 'wp_ajax_gruff_save_section', 'gruff_save_section' );

function gruff_save_section(){
	$post_type = $_POST['post_type'];
	
	if($post_type == 'gruff_projects'){
		$save = do_action('save_post_gruff_projects',$post_ID, $post, $update);
	}else{
		$save = do_action('save_post_gruff_stories',$post_ID, $post, $update);
	}
	
	$args = array(
	    'post_type' 	=> $post_type,
	    'numberposts'	=> 1,
	    'post_status' 	=> array('publish', 'pending', 'draft', 'auto-draft', 'future', 'private', 'inherit')
	);
	$query = new WP_Query();
	$post = $query->query( $args );
	$post_id = !empty($_POST['post_id']) ? $_POST['post_id'] : $post[0]->ID;
	$response = save_section_data($post_id,$_POST);
	echo json_encode($response);exit;
}

/*
* Save the section data
* Added on: 21.12.2018
*/

function save_section_data($post_id = NULL, $data = []){
  	global $wpdb;
  	$failed = 0;
	$response = ['status' => false, 'message' => 'Some error ocurred'];
    $wpdb->query('START TRANSACTION');
    //$_SESSION['builder_post_id'] = [];

    $section_id = $data['section_id'];
    $sequence 	= $data['sequence'];
    $date 		= date('Y-m-d h:i:s');
	$admin_id 	= get_current_user_id();
	//$content 	= json_encode(str_replace("\'","'",$data['content']),JSON_UNESCAPED_UNICODE);
	//$content 	= json_encode(str_replace('\"','"',$data['content']),JSON_UNESCAPED_UNICODE);
	$content 	= str_replace("\'","'",$data['content']);
	$content 	= str_replace('\"','"',$content);
	$content 	= json_encode($content,JSON_UNESCAPED_UNICODE);

	//print_r($content);exit;
	$contentDB 	= new ContentDB;

  	//Check for existing data
	    $contentData = $contentDB->getContentData(
	    [
	        'flag'        => 0,
	        'section_id'  => $section_id,
	        'post_id'     => $post_id,
	        'sequence'    => $sequence
	    ]);

	    $contentDataCount = count($contentData);
  	//Check for existing data

	//Delete existing data
	    if($contentDataCount){
	      	$delete = $wpdb->query(
	           'UPDATE '.$wpdb->prefix.'content_elements SET flag=2
	           WHERE flag=0 AND section_id = "'.$section_id.'" AND post_id = "'.$post_id.'" AND sequence = "'.$sequence.'"'
			);

	      	if(!$delete){
	        	$failed++;
	      	} 
	    } 
	//Delete existing data

  	//Insert into the content_elements table
	    $save_content = $wpdb->insert( $wpdb->prefix.'content_elements',
		[
			'post_id'     => $post_id,
	        'section_id'  => $section_id,
	        'content'     => $content,
	        'sequence'    => $sequence,
	        'added_by'    => $admin_id,
	        'added_on'    => $date,
		]);
  	//Insert into the content_elements table

    if(!$save_content){
      	$failed++;
    } 

    if($failed){
      	$wpdb->query('ROLLBACK');
      	return $response;
    }else{
      	$wpdb->query('COMMIT');
      	return ['status' => true, 'message' => 'Updated successfully'];
    }
}

/*
* Remove the section
* Added on: 21.12.2018
*/
add_action( 'wp_ajax_nopriv_gruff_remove_section', 'gruff_remove_section' );
add_action( 'wp_ajax_gruff_remove_section', 'gruff_remove_section' );

function gruff_remove_section(){
	global $wpdb;
	$section_id = $_POST['section_id'];
	$post_id 	= $_POST['post_id'];
	$sequence 	= $_POST['sequence'];
	$content 	= new ContentDB;
	$admin_id 	= get_current_user_id();
	$date		= date('Y-m-d h:i:s');	

	$status = array('success' => false, 'message' => 'Some error ocurred', 'post_id' => $post_id, 'sequence' => $sequence);

	$delete = $wpdb->query(
       'UPDATE '.$wpdb->prefix.'content_elements SET flag=2,updated_by='.$admin_id.',updated_on="'.$date.'"
       WHERE flag=0 AND section_id = "'.$section_id.'" AND post_id = "'.$post_id.'" AND sequence = "'.$sequence.'"'
	);

	print_r($delete);

	$param 	= [
		'flag' 		=> 0,
	];

	if(!empty($post_id)){
		$param['post_id']	= $post_id;
	}

	if(!empty($id)){
		$param['section_id']	= $id;
	}

	if(!empty($sequence)){
		$param['sequence']	= $sequence;
	}

	$last_sequence 			= $content->last_sequence(['post_id' => $post_id]);

	//$getContentDataRow 	= $content->getContentDataRow($param);
	$sequence 	 		= isset($last_sequence) && !empty($last_sequence) ? $last_sequence + 1 : 1;
	
		
	if($delete){
		$status['success'] 	= true;
		$status['message'] 	= "Section removed successfully";
		$status['id'] 		= $page_id;
		$status['sequence'] = $sequence;			
	}	

	echo json_encode($status);exit;
}


/*
* Save Image
* Added on: 24.12.2018
*/
add_action( 'wp_ajax_nopriv_gruff_builder_image', 'gruff_builder_image' );
add_action( 'wp_ajax_gruff_builder_image', 'gruff_builder_image' );

function gruff_builder_image(){
	try{
		foreach ($_FILES as $key => $file) {
			$imageData 			= getimagesize($file['tmp_name'][0]);
			//print_r($imageData);die();
			$mimeType 			= $imageData['mime'];
			$allowedMimeTypes 	= ['image/jpeg', 'image/png', 'image/gif'];
			if (!in_array($mimeType, $allowedMimeTypes)){
				echo false;exit;
			}    
			$dir = dirname(dirname(__FILE__)).DIRECTORY_SEPARATOR.'assets'.DIRECTORY_SEPARATOR.'img'.DIRECTORY_SEPARATOR.'content-images/';
			$filename = rand().'-'.$file['name'][0];
			$upload_success = move_uploaded_file($file['tmp_name'][0],$dir.$filename);
    		if($upload_success) {
				echo $filename;exit;
		    } else {
				echo false;exit;
		    }
		}
	}catch(Exception $e){
		echo false;exit;
	}
}

/*
* Update sequence
* Added on: 26.12.2018
*/
add_action( 'wp_ajax_nopriv_gruff_update_sequence', 'gruff_update_sequence' );
add_action( 'wp_ajax_gruff_update_sequence', 'gruff_update_sequence' );

function gruff_update_sequence(){
	try{
		global $wpdb;
		$orderData 	= $_POST['arr'];
		$post_id 	= isset($orderData['post_id']) ? $orderData['post_id'] : NULL;
		$id_arr 	= isset($orderData['id']) ? $orderData['id'] : [];
		$admin_id 	= get_current_user_id();
		$date		= date('Y-m-d h:i:s');		

		if(empty($post_id) || count($id_arr) == 0){
			echo false;exit;
		}
		
		foreach ($id_arr as $key => $id) {
			$sequence = $key+1;
			$update = $wpdb->query(
		       'UPDATE '.$wpdb->prefix.'content_elements SET sequence='.$sequence.',updated_by='.$admin_id.',updated_on="'.$date.'"
		       WHERE flag=0 AND id = '.$id.' AND post_id = '.$post_id
			);
		}
		echo true;exit;
	}catch(Exception $e){
		echo false;exit;
	}	

}

