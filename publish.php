<?php
	$html = $GLOBALS["HTTP_RAW_POST_DATA"];
	$title = $_REQUEST["tile"];
	$uri = $_REQUEST["uri"];
	
	file_put_contents(__DIR__."/www/".$uri.".html", $html);

