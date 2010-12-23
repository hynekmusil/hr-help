<?php
	header("Content-type: application/xml");
	if (isset($_REQUEST["id"])){
		$id = $_REQUEST["id"];
		
		$menuDoc = new DOMDocument("1.0", "UTF-8");
		$menuDoc->load("menu-hlavni.xml");
		$itemNode = $menuDoc->getElementById($id);
		$stateId = $itemNode->getAttribute("id");
		$changeDoc = null;
		$scxmlDoc = new DOMDocument("1.0", "UTF-8");
		$scxmlDoc->load("controller-page.scxml");
		$xpath = new DOMXpath($scxmlDoc);
		$elements = $xpath->query("//*[@id='$stateId']");
		if (!is_null($elements->item(0))) {
			$elements = $elements->item(0)->getElementsByTagNameNS("http://www.w3.org/2005/07/scxml","onentry");
			if (!is_null($elements->item(0))) {
				$elements = $elements->item(0)->getElementsByTagNameNS("http://www.w3.org/2005/07/scxml","script");
				if (!is_null($elements->item(0))) {
					$script = trim($elements->item(0)->nodeValue);
					if(strpos($script,"changeContent(") === 0){
						$xml = new JSON2XML( json_decode( "{\"onentry\":" . substr($script, 14, -2)."}"),"","http://formax.cz/ns/pageProperties");
						$changeDoc = new DOMDocument("1.0", "UTF-8");
						$changeDoc->loadXML($xml->xml);
					}
				}
			}
		}
		$ppDoc = new DOMDocument("1.0", "UTF-8");
		$ppNode = $ppDoc->createElementNS("http://formax.cz/ns/pageProperties","pageProperties");
		$ppNode->appendChild($ppDoc->importNode($itemNode, true));
		if($changeDoc != null) $ppNode->appendChild($ppDoc->importNode($changeDoc->documentElement, true));
		$ppDoc->appendChild($ppNode);
		
		$xslt = new XSLTProcessor();
		$xslDoc = new DOMDocument("1.0", "UTF-8");
		$xslDoc->load("../component/pageProperties/preparer-pageProperties.xsl");
		$xslt->importStylesheet( $xslDoc); 
		$xslt->setParameter("","id",$id);
		
		echo $xslt->transformToXML($ppDoc );
	}
class JSON2XML{
	public $xml = '';
	private $namespace = "";
	
	function __construct(&$aO, $aTab="", $aNamespace = ""){
		$this->namespace = $aNamespace;
		foreach($aO as $m=>$o) $this->toXml($o,$m,"");
		if($aTab !='') $this->xml = str_replace("\t",$aTab,$this->xml);
		else{
			$this->xml = str_replace("\t","",$this->xml);
			$this->xml = str_replace("\n","",$this->xml);
		}
	}
	function toXml($aV,$aName,$aInd){
		$i = 0;
		if(is_array($aV)){
			$n = count($aV);
			for($i=0; $i<$n;$i++) $this->xml .= $aInd .$this->toXml($aV[$i],$aName,$aInd."\t")."\n";
		}
		elseif(is_object($aV)){
			$hasChild = false;
			$this->xml .= $aInd."<".$aName;
			foreach($aV as $m=>$o){
				if($m[0] == "@") $this->xml .= " ".substr($m,1)."=\"".$o."\"";
				else $hasChild = true;
			}
			if($this->namespace != "") $this->xml .= " xmlns=\"{$this->namespace}\"";
			$this->xml .= $hasChild ? ">" : "/>";
			if($hasChild){
				foreach($aV as $m=>$o){
					if($m == "#text") $this->xml .= $o;
					elseif($m == "#cdata") $this->xml .= "<![CDATA[".$o."]]>";
					elseif($m[0] != "@") $this->xml .= $this->toXml($o,$m,$aInd."\t");
				}
				$this->xml .= ($this->xml[strlen($this->xml)-1] == "\n" ? $aInd : "")."</$aName>";
			}
		}
		elseif($aV == '') $this->xml .= $aInd."<$aName/>";
		else $this->xml .= $aInd."<$aName>".$aV."</$aName>";
		//return $this->xml;
	}
}