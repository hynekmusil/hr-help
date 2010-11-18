<?php //encoding=utf-8

$xml = <<<HTM
<?xml version="1.0"?>
<?stylesheet type="text/xsl" href="../view-article.xsl"?>
<?setter href="setter-article.php"?>
<a:article xmlns:a="http://formax.cz/ns/article" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://formax.cz/ns/article ../model-article.xsd"><a:h>Aktu�ln�</a:h><a:p>Dne <a:strong>10.1.2010</a:strong> spou�t�me port�l <a:strong>HR-Help.cz</a:strong>, kter� V�m pom��e �e�it n�kter� body z HR problematiky. Nab�z�me t�mto velmi zaj�mav� IT �e�en�
na HR procesy. Prvn� funk�n� aplikace pro V�s bude <a:a href="/sluzby/pruzkum-spokojenosti-zamestnancu/" alt="-">Pr�zkum spokojenosti zam�stnanc�</a:a>. Varianta zdarma V�m umo�n� zadat a� 20 ot�zek a vybrat k
nim ze seznamu odpov�d�. Z�rove� jsou k dispozici dal�� 3 ot�zky pro kategorizaci odpov�d�. Vyhodnocen� pot� prob�h� na sloupcov�ch grafech.</a:p><a:p>Jednotliv� grafy lze ulo�it jako obr�zky, v�ce informac� naleznete v <a:a href="/sluzby/pruzkum-spokojenosti-zamestnancu/priklady/" alt="-">p��kladech</a:a> k dan� slu�b�.</a:p><a:p>Z�rove� jsme ud�lali vzorov� v�po�et, kter� by V�m m�l usnadnit rozhodov�n�, zda-li je tato slu�ba pro V�s zaj�mav�. Podrobn� v�po�et naleznete <a:a href="/sluzby/pruzkum-spokojenosti-zamestnancu/#vypocet" alt="-">zde</a:a>.</a:p></a:article>
HTM;

$patterns = array();
$patterns[0] = '@(<\?stylesheet type="text\/xsl" href=")(\.\.)?([^"]+"\?>)@';
$patterns[1] = '@(<\?setter href=")([^"]+"\?>)@';
$patterns[2] = '@(xsi:schemaLocation="[^ ]+) (\.\.)?([^"]+")@';
$replacements = array();
$replacements[0] = '$1../component/article$3';
$replacements[1] =  '$1../component/article/edit/$2';
$replacements[2] =  '$1 ../component/article$3';

echo preg_replace($patterns, $replacements, $xml);