<?php
	$html = $GLOBALS["HTTP_RAW_POST_DATA"];
	$title = $_REQUEST["title"];
	$uri = $_REQUEST["uri"];
	
	$config = array("indent"=> false,"output-xhtml"=> true, "wrap"=> 200);
	$tidy = new tidy();
	$tidy->parseString($html, $config, "utf8");
	$tidy->cleanRepair();
	
	$xmlDoc = new DOMDocument("1.0","UTF-8");
	$xmlDoc->loadXML(str_replace("&nbsp;","&#160;",$tidy->body()->value)); 
	
	$xslt = new XSLTProcessor();
	$xslDoc = new DOMDocument();
	$xslDoc->load( "filter.xsl");
	$xslt->importStylesheet( $xslDoc); 
	$xslt->setParameter("","title",$title);
	
	$xslt->transformToURI( $xmlDoc, __DIR__."/../../www/".$uri.".html");