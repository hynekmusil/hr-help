<?php
	$html = $GLOBALS["HTTP_RAW_POST_DATA"];
	$title = $_REQUEST["title"];
	$uri = $_REQUEST["uri"];
	$uriArr = explode("/",$uri);
	$dir = dirname(__FILE__)."/../../www";
	$baseOutputDir = "";
	$newDir = $dir;
	$newFile = "/index.html";
	$addNewDir = false;
	for($i=0; $i< count($uriArr); $i++){
		echo $i." = ".(count($uriArr) - 1)."\n";
		if($i == (count($uriArr) - 1)) {
			if($uriArr[$i] == "index") $addNewDir = false;
			elseif(!endsWith($uriArr[$i], ".html")) $addNewDir = true;
			else {
				$newFile = "/".$uriArr[$i];
				$addNewDir = false;
			}
		}
		else $addNewDir = true;
		if($addNewDir == true) {
			$baseOutputDir .= "../";
			$newDir .= "/".$uriArr[$i];
			if(!is_dir($newDir)) mkdir($newDir);
		}
	}
	
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
	$xslt->setParameter("","baseOutputDir", $baseOutputDir);
	
	$xslt->transformToURI( $xmlDoc, $newDir.$newFile);
	
	function endsWith($aFullStr, $aEndStr)
	{
		$fullStrEnd = substr($aFullStr, strlen($aFullStr) - strlen($aEndStr));
		return $fullStrEnd == $aEndStr;
	}