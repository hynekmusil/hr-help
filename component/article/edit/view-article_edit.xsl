<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" exclude-result-prefixes="a"
    xmlns:a="http://formax.cz/ns/article" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns="http://www.w3.org/1999/xhtml"
>
    <xsl:template match="a:article">
        <div>
            <xsl:apply-templates select="@xml:id"/>
            <xsl:apply-templates/>
        </div>
    </xsl:template>
    
    <xsl:template match="a:h[parent::a:article]">
        <h1>
            <xsl:apply-templates select="@xml:id"/>
            <xsl:value-of select="."/>
        </h1>
    </xsl:template>
    
    <xsl:template match="a:h">
        <xsl:element name="h{count(ancestor::a:div) + 1}">
            <xsl:apply-templates select="@xml:id"/>
            <xsl:value-of select="."/>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="*">
        <xsl:element name="{local-name()}">
            <xsl:apply-templates select="@xml:id"/>
            <xsl:apply-templates/> 
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="@xml:id">
        <xsl:attribute name="id">
            <xsl:value-of select="."/>
        </xsl:attribute>
    </xsl:template>

</xsl:stylesheet>
