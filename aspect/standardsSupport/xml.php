<?php
	header("Content-type: application/xml");
	if (isset($_REQUEST['x']))
	{
		echo file_get_contents("../../{$_REQUEST['x']}");
		exit;
	}
	$search = array("@<SPAN></SPAN>@","@<LI>([^<]*)</LI>@");
	$replace = array("<BR/>","<LI>$1<BR/></LI>");
	$html = preg_replace($search,$replace,$GLOBALS["HTTP_RAW_POST_DATA"]);
	$config = array("indent"=> false,"output-xhtml"=> true, "wrap"=> 200);
	$tidy = new tidy();
	$tidy->parseString($html, $config, "utf8");
	$tidy->cleanRepair();
	echo $tidy->body()->child[0]->value;
	