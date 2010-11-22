<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" exclude-result-prefixes="h"
    xmlns:h="http://formax.cz/ns/header" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns="http://www.w3.org/1999/xhtml"
>
    <xsl:template match="h:header">
        <div id="header">
            <xsl:apply-templates select="h:home | h:menuJump"/>
        </div>
        <div id="subheader">
            <xsl:apply-templates select="h:category | h:slogan"/>
        </div>
    </xsl:template>
    
    <xsl:template match="h:home">
        <h2 id="logo"><a href="/">
            <span class="blind"><xsl:value-of select="."/></span>
        </a></h2>
    </xsl:template>
    
    <xsl:template match="h:menuJump">
        <p><a href="#menu" class="blind"><xsl:value-of select="."/></a></p>
    </xsl:template>
    
    <xsl:template match="h:category">
        <div id="catname">
            <h4><xsl:value-of select="."/></h4>
        </div>
    </xsl:template>
    
    <xsl:template match="h:slogan">
        <div id="welcome">
            <p class="welcome"><strong>
                <xsl:value-of select="h:strong"/>
            </strong></p>
            <xsl:apply-templates select="text()[normalize-space()!='']"/>
        </div>
    </xsl:template>
    
    <xsl:template match="text()">
        <p style="font-size: 11px; color: #7d7d7d">
            <xsl:value-of select="normalize-space()"/>
        </p>
    </xsl:template>
</xsl:stylesheet>