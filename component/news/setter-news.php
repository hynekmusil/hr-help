<?php //encoding=utf-8
header("Content-type: application/xml");
if(isset($_REQUEST["id"])){
	$id = $_REQUEST["id"];
	if(isset($_REQUEST["operation"])){
		$operation = $_REQUEST["operation"];
	} else $operation = "change";
	
	$html = $GLOBALS["HTTP_RAW_POST_DATA"];

	$dataURI = $_REQUEST["dataURI"];
	$dir = dirname(__FILE__);
	$baseDir = substr($dir,0,strpos($dir,"component"));

	$config = array("indent"=> false,"output-xhtml"=> true, "wrap"=> 200);
	$tidy = new tidy();
	$tidy->parseString($html, $config, "utf8");
	$tidy->cleanRepair();
	
	$newContent = str_replace("&nbsp;","&#160;",$tidy->body()->child[0]->value);
	$newContentDoc = new DOMDocument("1.0","utf-8");
	$newContentDoc->loadXML($newContent); 
	
	$newsDoc = new DOMDocument();
	$newsDoc->load($baseDir.$dataURI);
	
	$xslDoc = new DOMDocument();
	$xslDoc->load("setter-news.xsl");
	
	$fragment = $xslDoc->createDocumentFragment();
	$fragment->appendXML($newContent);
	$xslDoc->getElementById("newContent")->appendChild($fragment);
	
	$xslt = new XSLTProcessor();
	$xslt->importStylesheet( $xslDoc);
	$xslt->setParameter("","newId", $id);
	$xslt->setParameter("","operation", $operation);
	
	$result = $xslt->transformToXML( $newsDoc );
	print $result;
	
	$fp = fopen($baseDir.$dataURI, "w");
	fwrite($fp, $result);
	fclose($fp);
}