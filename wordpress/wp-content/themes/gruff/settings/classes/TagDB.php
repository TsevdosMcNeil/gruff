<?php

Class TagDB{
	private $table;
	public function __construct(){
	  global $wpdb;
	  $this->table = $wpdb->prefix.'tags';
	}
	
	/*
	* Get All Records
	* Added on: 26.11.2018
	*/
	public function getAllRecords() {
		global $wpdb;
		$sql = "SELECT * FROM {$this->table} WHERE flag = 0";
		$result = $wpdb->get_results( $sql, 'ARRAY_A' );
		return $result;
	}
	
}