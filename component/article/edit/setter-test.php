<?php //encoding=utf-8

$xml = <<<HTM
<?xml version="1.0"?>
<?stylesheet type="text/xsl" href="../view-article.xsl"?>
<?setter href="setter-article.php"?>
<a:article xmlns:a="http://formax.cz/ns/article" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://formax.cz/ns/article ../model-article.xsd"><a:h>Aktuálnì</a:h><a:p>Dne <a:strong>10.1.2010</a:strong> spouštíme portál <a:strong>HR-Help.cz</a:strong>, který Vám pomùže øešit nìkteré body z HR problematiky. Nabízíme tímto velmi zajímavá IT øešení
na HR procesy. První funkèní aplikace pro Vás bude <a:a href="/sluzby/pruzkum-spokojenosti-zamestnancu/" alt="-">Prùzkum spokojenosti zamìstnancù</a:a>. Varianta zdarma Vám umožní zadat až 20 otázek a vybrat k
nim ze seznamu odpovìdí. Zároveò jsou k dispozici další 3 otázky pro kategorizaci odpovìdí. Vyhodnocení poté probíhá na sloupcových grafech.</a:p><a:p>Jednotlivé grafy lze uložit jako obrázky, více informací naleznete v <a:a href="/sluzby/pruzkum-spokojenosti-zamestnancu/priklady/" alt="-">pøíkladech</a:a> k dané službì.</a:p><a:p>Zároveò jsme udìlali vzorový výpoèet, který by Vám mìl usnadnit rozhodování, zda-li je tato služba pro Vás zajímavá. Podrobný výpoèet naleznete <a:a href="/sluzby/pruzkum-spokojenosti-zamestnancu/#vypocet" alt="-">zde</a:a>.</a:p></a:article>
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