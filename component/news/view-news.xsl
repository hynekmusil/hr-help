<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" exclude-result-prefixes="a n"
    xmlns:n="http://formax.cz/ns/news"
    xmlns:a="http://formax.cz/ns/article" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns="http://www.w3.org/1999/xhtml"
>
    <xsl:template match="n:news">
        <xsl:apply-templates select="n:new"/>
    </xsl:template>
    
    <xsl:template match="n:new">
        <div class="box">
            <xsl:apply-templates select="n:h"/>
            <div class="content">
                <xsl:apply-templates select="a:p | a:l"/>
            </div>
        </div>
    </xsl:template>
    
    <xsl:template match="n:h">
        <h4 class="title"><xsl:apply-templates/></h4>
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