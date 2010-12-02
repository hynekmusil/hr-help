<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns="http://www.w3.org/1999/xhtml"
>
    <xsl:param name="title"/>
    <xsl:param name="baseOutputDir"/>
    
    <xsl:output omit-xml-declaration="yes"
        doctype-public="-//W3C//DTD XHTML 1.0 Strict" 
        doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"
    />
    
    <xsl:variable name="linkList" select="document('../../data/menu-hlavni.xml')"/>
    
    <xsl:template match="/">
        <html>
            <head>
                <title><xsl:value-of select="$title"/></title>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <meta name="description" content="" />
                <meta name="keywords" content="" />
                <meta name="author" content="FormaxDesign.cz" />
                <link rel="shortcut icon" type="image/x-icon" href="{$baseOutputDir}html/favicon.ico" />
                <link rel="stylesheet" type="text/css" href="{$baseOutputDir}html/css/base.css" />
                <xsl:comment>
                    <xsl:text disable-output-escaping="yes"><![CDATA[[if lt IE 9]><link rel="stylesheet" type="text/css" href="]]></xsl:text>
                    <xsl:value-of select="$baseOutputDir"/>
                    <xsl:text disable-output-escaping="yes"><![CDATA[html/css/ie8.css" /><![endif]]]></xsl:text>
                </xsl:comment>
            </head>
            <xsl:apply-templates select="*"/>
        </html>
    </xsl:template>
    
    <xsl:template match="*">
        <xsl:element name="{name()}">
            <xsl:apply-templates select="@*"/>
            <xsl:apply-templates/>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="@href[starts-with(.,'javascript:raise(')]">
        <xsl:variable name="apos">'</xsl:variable>
        <xsl:variable name="event">
            <xsl:value-of select="substring-before(
                substring-after(.,concat('javascript:raise(',$apos)),$apos)"/>
        </xsl:variable>
        <xsl:attribute name="href">
            <xsl:value-of select="concat($baseOutputDir,$linkList//*[@id = $event]/@href)"/>
        </xsl:attribute>
    </xsl:template>
    
    <xsl:template match="@*">
        <xsl:copy-of select="."/>
    </xsl:template>
    
    <xsl:template match="@contenteditable"/>
    <xsl:template match="*[starts-with(@id,'f-')]"/>
    <xsl:template match="hr[@class='blind']"/>
    
</xsl:stylesheet>