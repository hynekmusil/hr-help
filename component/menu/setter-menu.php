<?php //encoding=utf-8
	header("Content-type: application/xml");
	require_once("../article/new-article.php");
	
	$jsonStr = $GLOBALS["HTTP_RAW_POST_DATA"];
	//$jsonStr = '{"operation":"change","menuURI":"data/menu-hlavni.xml","itemName":"úvodní stránka","itemId":"i1","uri":"index.html","title":"úvod","onentry":[{"maincol":["data/article-aktualne.xml","data/article-jak_zacit.xml"]}]}';
	$pageProperties = json_decode($jsonStr);
	$dataURI = $pageProperties->menuURI;
	$dir = dirname(__FILE__);
	
	$baseDir = substr($dir,0,strpos($dir,"component"));
	
	$xmlDoc = new DOMDocument("1.0","utf-8");
	$xmlDoc->load($baseDir.$dataURI);

	$stateId = $xmlDoc->getElementById($pageProperties->itemId)->getAttribute("id");

	$xslt = new XSLTProcessor();
	$xslDoc = new DOMDocument();
	$xslDoc->load( "setter-menu.xsl");
	$xslt->importStylesheet($xslDoc); 
	$xslt->setParameter("","itemName", $pageProperties->itemName);
	$xslt->setParameter("","itemId", $pageProperties->itemId);
	$xslt->setParameter("","uri", $pageProperties->uri);
	$xslt->setParameter("","title", $pageProperties->title);
	$xslt->setParameter("","operation",$pageProperties->operation);
	
	$result = $xslt->transformToXML($xmlDoc);
	echo $result;
	
	$fp = fopen($baseDir.$dataURI, "w");
	fwrite($fp, $result);
	fclose($fp);
	
	if(!isset($pageProperties->onentry) and $pageProperties->operation == 'change' ) exit;
	
	$xslt = new XSLTProcessor();
	$xslDoc->load("../page/setter-pageController.xsl");
	$xslt->importStylesheet($xslDoc); 
	$xslt->setParameter("","onentry", json_encode($pageProperties->onentry));
	$xslt->setParameter("","newStateId", $pageProperties->uri);
	
	$xmlDoc->load($baseDir."data/controller-page.scxml");
	if(strpos($pageProperties->operation,"insert") === 0){
		$xpath = new DOMXpath($xmlDoc);
		$elements = $xpath->query("//*[@id='$stateId']");
		if (!is_null($elements->item(0))) {
			foreach($pageProperties->onentry as $fields){
				foreach($fields as $field){
					foreach($field as $data){
						if(!is_file($baseDir.$data)){
							createArticle($baseDir.$data);
						}
					}
				}
			}
			$xslt->setParameter("", "stateId", $elements->item(0)->parentNode->getAttribute("id"));
			$xslt->setParameter("","operation","append");
		}
	}
	else{
		$xslt->setParameter("","operation",$pageProperties->operation);
		$xslt->setParameter("","stateId", $stateId);
	}
	
	$result = $xslt->transformToURI($xmlDoc, $baseDir."data/controller-page.scxml");