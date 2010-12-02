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
	
	$xmlDoc = new DOMDocument("1.0","utf-8");
	$xmlDoc->loadXML(str_replace("&nbsp;","&#160;",$tidy->body()->child[0]->value)); 
	
	$xslt = new XSLTProcessor();
	$xslDoc = new DOMDocument();
	$xslDoc->load( 'setter-article.xsl');
	$xslt->importStylesheet( $xslDoc); 
	$result = $xslt->transformToXML( $xmlDoc );
	
	print $result;
	
	$fp = fopen($baseDir.$dataURI, "w");
	fwrite($fp, $result);
	fclose($fp);