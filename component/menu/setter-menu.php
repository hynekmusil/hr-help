<?php //encoding=utf-8
	header("Content-type: application/xml");
	$html = $GLOBALS["HTTP_RAW_POST_DATA"];
	$dataURI = $_REQUEST["dataURI"];
	
	$baseDir = substr(__DIR__,0,strpos(__DIR__,"component"));