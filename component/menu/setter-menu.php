<?php //encoding=utf-8
	header("Content-type: application/xml");
	$dataURI = $_REQUEST["dataURI"];
	$dir = dirname(__FILE__);
	
	$baseDir = substr($dir,0,strpos($dir,"component"));
	
	$xmlDoc = new DOMDocument("1.0","utf-8");
	$xmlDoc->load($baseDir.$dataURI);
	
	$xslt = new XSLTProcessor();
	$xslDoc = new DOMDocument();
	$xslDoc->load( "setter-menu.xsl");
	$xslt->importStylesheet( $xslDoc); 
	$xslt->setParameter("","itemName",$_REQUEST["itemName"]);
	$xslt->setParameter("","itemId",$_REQUEST["itemId"]);
	$xslt->setParameter("","uri",$_REQUEST["uri"]);
	$xslt->setParameter("","title",$_REQUEST["title"]);
	$xslt->setParameter("","operation",$_REQUEST["operation"]);
	$result = $xslt->transformToXML( $xmlDoc );
	
	print $result;
	
	$fp = fopen($baseDir.$dataURI, "w");
	fwrite($fp, $result);
	fclose($fp);