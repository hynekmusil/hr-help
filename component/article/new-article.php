<?php //encoding=UTF-8
	function createArticle($aFileName){
		$articleDoc = new DOMDocument("1.0", "UTF-8");
		$articleDoc->appendChild($articleDoc->createProcessingInstruction("xml-stylesheet","type=\"text/xsl\" href=\"../component/article/view-article.xsl\""));
		$articleDoc->appendChild($articleDoc->createProcessingInstruction("setter", "href=\"../component/article/setter-article.php\""));
		$articleE = $articleDoc->appendChild($articleDoc->createElementNS("http://formax.cz/ns/article","article"));
		$articleE->setAttributeNS("http://www.w3.org/2001/XMLSchema-instance","xsi:schemaLocation","http://formax.cz/ns/article ../component/article/model-article.xsd");
		$articleE->appendChild($articleDoc->createElementNS("http://formax.cz/ns/article","h","nový článek"));
		$articleE->appendChild($articleDoc->createElementNS("http://formax.cz/ns/article","p","nový článek"));
		$articleDoc->save($aFileName);
	}
	if (isset($_REQUEST["fileName"])){
		$fileName = $_REQUEST["fileName"];
		createArticle("../../data/$fileName");
	}
?>