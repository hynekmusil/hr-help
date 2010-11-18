<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" exclude-result-prefixes="a"
    xmlns:a="http://formax.cz/ns/article" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns="http://www.w3.org/1999/xhtml"
>
    <xsl:template match="a:article">
        <div>
            <xsl:apply-templates/>
        </div>
    </xsl:template>
    
    <xsl:template match="a:h[parent::a:article]">
        <h1><xsl:value-of select="."/></h1>
    </xsl:template>
    
    <xsl:template match="a:h">
        <xsl:element name="h{count(ancestor::a:div) + 1}">
            <xsl:value-of select="."/>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="a:l[not(preceding-sibling::*[1][name() = 'a:l'])]">
        <ul>
            <xsl:apply-templates select="." mode="li"/>
        </ul>
    </xsl:template>
    
    <xsl:template match="a:l"/>
    
    <xsl:template match="a:l" mode="li">
        <li><xsl:apply-templates/></li>
        <xsl:apply-templates select="following-sibling::*[1][name()='a:l']" mode="li"/>
    </xsl:template>
        
    <xsl:template match="*">
        <xsl:element name="{local-name()}">
            <xsl:copy-of select="@href | @class | @src | @alt"/>
            <xsl:apply-templates/> 
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="text()[normalize-space() = '']">
        <xsl:text> </xsl:text>
    </xsl:template>

</xsl:stylesheet>
