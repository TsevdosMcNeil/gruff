<?php
Class ContentDB{

	private $table;
	private $table2;
	private $table3;
	
	public function __construct(){
		global $wpdb;
		$this->table = $wpdb->prefix.'content_elements';
		$this->table2 = $wpdb->prefix.'sections_tags';
		$this->table3 = $wpdb->prefix.'tags';
	}
	
	/*
	* Get the Content Data Single Row
	* Added on: 21.12.2018
	*/
	public function getContentDataRow($param = []){
		global $wpdb;
		$condition = '';
		$index = 0;
		$total = count($param);
		if(isset($param) && count($param) > 0 ){
			foreach ($param as $key => $value) {
				$condition .= "$key = $value";
				if($total - 1 > $index){
					$condition .= " And ";
				}
				$index++;
			}
		}

		$sql = "SELECT * FROM {$this->table} WHERE $condition ORDER BY sequence DESC";
		$result = $wpdb->get_row( $sql, 'ARRAY_A' );

		return $result;		
	}

	/*
	* Get all the Content Data
	* Added on: 21.12.2018
	*/
	public function getContentData($param = []){
		global $wpdb;
		$condition = '';
		$index = 0;
		$total = count($param);
		if(isset($param) && count($param) > 0 ){
			foreach ($param as $key => $value) {
				$condition .= "$key = $value";
				if($total - 1 > $index){
					$condition .= " And ";
				}
				$index++;
			}
		}
		//print_r($condition);

		$sql = "SELECT * FROM {$this->table} WHERE $condition ORDER BY sequence ASC";
		$result = $wpdb->get_results( $sql, 'ARRAY_A' );

		return $result;		
	}
	
	/*
	* Get the tags for the section
	* Added on: 21.12.2018
	*/
	public function getSectionTags($param = []){
		global $wpdb;
		$condition = '';
		$index = 0;
		$total = count($param);
		if(isset($param) && count($param) > 0 ){
			foreach ($param as $key => $value) {
				$condition .= "$key = $value";
				if($total - 1 > $index){
					$condition .= " And ";
				}
				$index++;
			}
		}

		$sql = "SELECT * FROM {$this->table2} WHERE $condition";
		$result = $wpdb->get_results( $sql, 'ARRAY_A' );

		if(count($result) > 0){
			foreach ($result as $index => $row) {
				$tag_id =	$row['tag_id'];
				$tagSql = 	"SELECT * FROM {$this->table3} WHERE id=".$tag_id;
				$tag 	= 	$wpdb->get_row( $tagSql, 'ARRAY_A' );				
				$result[$index]['tag'] = $tag;
			}
		}

		return $result;	
	}

	/*
	* Get saved data for the page 
	* Added on: 12.11.18
	*/
	public function _data($param){
		$output = [];
		$data = $this->getContentData($param);
		//print_r($data);exit;
		if(count($data) > 0){
		  foreach ($data as $key => $value) {
		    $output[$value['sequence']] = json_decode($value['content'], true, 512, JSON_UNESCAPED_UNICODE);  
		  }
		}  
		return $output;
	}

	/*
	* Types of field
	* Added on: 21.12.2018
	*/
	public static $types = [
      1 => 'text',
      2 => 'image',
      3 => 'textarea'
    ];

    /*
    * Get the last sequence
    * Added on: 26.12.2018
    */
    public function last_sequence($param = []){
    	$results = $this->getContentData($param);
    	return count($results);
    }
}