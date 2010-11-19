<?php //encoding=utf-8
	header("Content-type: application/xml");
	$html = $GLOBALS["HTTP_RAW_POST_DATA"];
	$dataURI = $_REQUEST["dataURI"];
	
	$baseDir = substr(__DIR__,0,strpos(__DIR__,"component"));
	
	$config = array("indent"=> false,"output-xhtml"=> true, "wrap"=> 200);
	$tidy = new tidy();
	$tidy->parseString($html, $config, "utf8");
	$tidy->cleanRepair();
	
	$xmlDoc = new DOMDocument("1.0","utf-8");
	$xmlDoc->loadXML(str_replace("&nbsp;","&#160;",$tidy->body()->value)); 
	
	$xslt = new XSLTProcessor();
	$xslDoc = new DOMDocument();
	$xslDoc->load( 'setter-article.xsl');
	$xslt->importStylesheet( $xslDoc); 
	$result = $xslt->transformToXML( $xmlDoc );
	print $result;
	
	$patterns = array();
	$patterns[0] = '@(<\?stylesheet type="text\/xsl" href=")([^"]+"\?>)@';
	$patterns[1] = '@(<\?setter href=")([^"]+"\?>)@';
	$patterns[2] = '@(xsi:schemaLocation="[^ ]+)([^"]+")@';
	$replacements = array();
	$replacements[0] = '$1../component/article/$2';
	$replacements[1] =  '$1../component/article/$2';
	$replacements[2] =  '$1 ../component/article/$2';
	$result = preg_replace($patterns, $replacements, $result);
	
	$fp = fopen($baseDir.$dataURI, "w");
	fwrite($fp, $result);
	fclose($fp);