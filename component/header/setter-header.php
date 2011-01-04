<?php //encoding=utf-8
header("Content-type: application/xml");
	$html = $GLOBALS["HTTP_RAW_POST_DATA"];
	$dataURI = $_REQUEST["dataURI"];
	
	$dir = dirname(__FILE__);
	$baseDir = substr($dir,0,strpos($dir,"component"));

	$config = array("indent"=> false,"output-xhtml"=> true, "wrap"=> 200);
	$tidy = new tidy();
	$tidy->parseString($html, $config, "utf8");
	$tidy->cleanRepair();
	
	$content = str_replace("&nbsp;","&#160;",$tidy->body()->child[0]->value);
	$content = "<div xmlns=\"http://www.w3.org/1999/xhtml\"".substr($content, 4);
	
	$contentDoc = new DOMDocument("1.0","UTF-8");
	$contentDoc->loadXML($content); 
	
	$xslDoc = new DOMDocument();
	$xslDoc->load("setter-header.xsl");
	
	$xslt = new XSLTProcessor();
	$xslt->importStylesheet( $xslDoc);
	
	$result = $xslt->transformToXML($contentDoc);
	
	print $result;
	
	$fp = fopen($baseDir.$dataURI, "w");
	fwrite($fp, $result);
	fclose($fp);