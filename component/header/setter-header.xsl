<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" exclude-result-prefixes="h"
    xmlns:a="http://formax.cz/ns/header"
    xmlns="http://formax.cz/ns/header"
    xmlns:h="http://www.w3.org/1999/xhtml"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
>
    <xsl:output encoding="UTF-8"/>
    
    <xsl:template match="h:div[not(parent::*)]">
        <xsl:processing-instruction name="xml-stylesheet">
            <xsl:text>type="text/xsl" href="../component/header/view-header.xsl"</xsl:text>
        </xsl:processing-instruction>
        <xsl:processing-instruction name="setter">
            <xsl:text>href="../component/header/setter-header.php"</xsl:text>
        </xsl:processing-instruction>
        <header
            xsi:schemaLocation="http://formax.cz/ns/article ../component/header/model-header.xsd"
         >
            <home href="/">HR-Help</home>
            <menuJump>Skočit na navigaci</menuJump>
            <xsl:apply-templates select="h:div"/>
        </header>
    </xsl:template>
    
    <xsl:template match="h:div[@id = 'catname']">
        <category><xsl:value-of select="h:h4"/></category>
    </xsl:template>
    
    <xsl:template match="h:div[@id = 'welcome']">
        <slogan><xsl:apply-templates select="*"/></slogan>
    </xsl:template>
    
    <xsl:template match="h:p[@class = 'welcome']">
        <strong><xsl:value-of select="h:strong"/></strong>
    </xsl:template>
    
    <xsl:template match="h:p">
        <xsl:value-of select="text()"/>
    </xsl:template>
    
</xsl:stylesheet>
