<?php
Class SectionDB{
	private $table;
	private $table2;
	
	public function __construct(){
	  global $wpdb;
	  $this->table 	= $wpdb->prefix.'sections';
	  $this->table2 = $wpdb->prefix.'sections_tags';
	  $this->table3 = $wpdb->prefix.'content_elements';
	}
	
	/*
	* Get All Records
	* Added on: 26.11.2018
	*/
	public function getAllRecords($filter = []) {
	  global $wpdb;
	  $sql = "SELECT * FROM {$this->table} WHERE flag = 0";

	  if(isset($filter['type']) && count($filter['type']) > 0 ){
	  	$type = '';
	  	foreach ($filter['type'] as $key => $value) {
	  		$type .= $value.',';
	  	}
	  	$type = rtrim($type,',');
	  	$sql.= " AND type IN (".$type.")";
	  }

	  if(isset($filter['limit']) && $filter['limit'] > 0){
	  	//$sql.= " ORDER BY id DESC LIMIT 0, $filter['limit'] ";
	  }
	  $result = $wpdb->get_results( $sql, 'ARRAY_A' );

	  if(count($result) > 0){
	  	foreach ($result as $key => $value) {
	  		$img = !empty($value['icon']) ? get_stylesheet_directory_uri().'/settings/assets/img/section-builder/'.$value['icon'] : get_stylesheet_directory_uri().'/settings/assets/img/noImage.jpg';
	  		$result[$key]['icon_img'] = '<img src="'.$img.'" alt="'.$value['section_name'].'" />';
	  	}
	  }

	  return $result;
	}
	/*
	* Get Record by ID
	* Added on: 26.11.2018
	*/
	public function getRecordById($id = NULL){
		global $wpdb;
		$sql = "SELECT * FROM {$this->table} WHERE id='{$id}'";
		$result = $wpdb->get_row( $sql, 'ARRAY_A' );
		if(count($result) > 0){
			$img = !empty($result['icon']) ? get_stylesheet_directory_uri().'/settings/assets/img/section-builder/'.$result['icon'] : get_stylesheet_directory_uri().'/settings/assets/img/noImage.jpg';
			$result['icon_img'] = '<img src="'.$img.'" alt="'.$result['section_name'].'" />';
		}
	  	return $result;	
	}
	/*
	* Delete a record
	* Added on: 26.11.2018
	*/
	public function removeById($id = NULL){
		global $wpdb;
		$sql = "UPDATE  {$this->table} SET flag=%d,updated_on=NOW() WHERE id=%d";
		$update = $wpdb->query($wpdb->prepare($sql,2,$id));
		if($update){
			$sql = "UPDATE  {$this->table2} SET flag=%d WHERE section_id=%d";
			$secondUpdate = $wpdb->query($wpdb->prepare($sql,2,$id));
		}
		return $secondUpdate;	
	}

	/*
	* Load the buttons
	* Added on: 24.12.2018
	*/
	public function load_btns($section, $sequence){
	return '<div class="section-controls">
				<h4>'.$section["section_name"].'</h4>
		      	<a href="javascript:void(0)" class="edit-section" data-section_id="'.$section["id"].'" data-sequence="'.$sequence.'">Edit</a>
		     	<a href="javascript:void(0)" class="delete-section" data-section_id="'.$section["id"].'" data-sequence="'.$sequence.'">Delete</a>
		    </div>';
	}
	/*
	* Load the rendered html
	* Added on: 12.11.2018
	*/
	public function load_rendered($section, $sequence, $post_id){
		$content = new ContentDB;
		$output_html = $section['section_html'];
    	$data   = $content->_data(['post_id' => $post_id, 'section_id' => $section['id'], 'sequence' => $sequence,'flag' => 0]);
		if(count($data) > 0){  
			foreach ($data as $key => $row) {
				if(count($row) > 0){
					foreach ($row as $index => $item) {
						$output_html = str_replace("$index", "$item", $output_html);
					}
				}  
			}
		}
		//Let modules post-process the section (e.g. video-modules.php turns video placeholders into players)
		return apply_filters('gruff_section_rendered', $output_html, $section);
	}

}