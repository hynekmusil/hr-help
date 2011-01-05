<?php //encoding utf-8
$menuDoc = new DOMDocument("1.0", "UTF-8");
$menuDoc->load("menu-hlavni.xml");
$elements = $menuDoc->documentElement->childNodes;
$result = "var events4Publish = [";
foreach($elements as $element){
	$result .= "\"{$element->getAttribute("id")}\",";
}
echo substr($result,0,-1)."];";