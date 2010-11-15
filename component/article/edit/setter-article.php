<?php //encoding=utf-8
	header("Content-type: application/xml");
	$html = $HTTP_RAW_POST_DATA;
	
	$config = array(
           'indent'         => false,
           'output-xhtml'   => true,
           'wrap'           => 200);
		   
	$tidy = new tidy();
	$tidy->parseString($html, $config, 'utf8');
	$tidy->cleanRepair();
	
	$xmlDoc = new DOMDocument();
	$xmlDoc->loadXML($tidy->body()->value); 
	
	$xslt = new XSLTProcessor();
	$xslDoc = new DOMDocument();
	$xslDoc->load( 'setter-article.xsl', LIBXML_NOCDATA);
	$xslt->importStylesheet( $xslDoc);

	print $xslt->transformToXML( $xmlDoc );
	
	//echo  $tidy->body()->value;
	