<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns="http://www.w3.org/1999/xhtml"
>
    <xsl:param name="title"/>
    
    <xsl:output omit-xml-declaration="yes"
        doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" 
        doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"
    />
    
    <xsl:variable name="linkList" select="document('../../data/linkList.xml')"/>
    
    <xsl:template match="/">
        <html>
            <head>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <title>HR-pomoc</title>
            </head>
            <xsl:apply-templates select="body"/>
        </html>
    </xsl:template>
    
    <xsl:template match="*">
        <xsl:element name="{name()}">
            <xsl:apply-templates select="@*"/>
            <xsl:apply-templates/>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="@href[starts-with(.,'javascript:document.statechart.raise(')]">
        <xsl:variable name="apos">'</xsl:variable>
        <xsl:variable name="event">
            <xsl:value-of select="substring-before(
                substring-after(.,concat('javascript:document.statechart.raise(',$apos)),$apos)"/>
        </xsl:variable>
        <xsl:attribute name="href">
            <xsl:value-of select="$linkList//*[@id = $event]/@uri"/>
        </xsl:attribute>
    </xsl:template>
    
    <xsl:template match="@*">
        <xsl:copy-of select="."/>
    </xsl:template>
    
</xsl:stylesheet>