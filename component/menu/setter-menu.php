<?php //encoding=utf-8
	header("Content-type: application/xml");
	$html = $GLOBALS["HTTP_RAW_POST_DATA"];
	$dataURI = $_REQUEST["dataURI"];
	$dir = dirname(__FILE__);
	
	$baseDir = substr($dir,0,strpos($dir,"component"));