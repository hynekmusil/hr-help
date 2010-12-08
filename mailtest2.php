<?php 

$Name = "info"; //senders name 
$email = "info@formax.cz"; //senders e-mail adress 
$recipient = "hynek.musil@gmail.com"; //recipient 
$mail_body = "The text for the mail..."; //mail body 
$subject = "Subject for reviever"; //subject 
$header = "From: ". $Name . " <" . $email . ">\r\n"; //optional headerfields 

mail($recipient, $subject, $mail_body, $header); //mail command :) 
?>