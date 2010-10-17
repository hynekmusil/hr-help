<?php //encoding=utf-8
	$content = $GLOBALS['HTTP_RAW_POST_DATA'];
	$log = "log_{$_REQUEST['l']}_";
	if(strpos($_SERVER['HTTP_USER_AGENT'],'MSIE') === false) $log .='b.txt';
	else $log .='ie.txt';
	$fp = fopen($log, 'a');
	fwrite($fp, "$content\n");
	fclose($fp);