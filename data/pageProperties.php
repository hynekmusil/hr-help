<?php
	header("Content-type: application/xml");
	if (isset($_REQUEST["id"])){
		$id = $_REQUEST["id"];
		$doc = new DOMDocument();
		$doc->load("menu-hlavni.xml");
		
		$node = $doc->getElementById($id);
		if($node){
			$result = new DOMDocument("1.0","UTF-8");
			$result->appendChild(
				$result->createProcessingInstruction("xml-stylesheet","type=\"text/xsl\" href=\"../component/pageProperties/view-pageProperties.xsl\"")
			);
			$result->appendChild($result->importNode($node, true));
			echo $result->saveXML();
		}
		//echo $node->nodeName;
		//$result = new DOMDocument();
		
	}