<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:a="http://formax.cz/ns/article"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
>
    <xsl:output encoding="UTF-8"/>
    
    <xsl:template match="/body">
        <xsl:processing-instruction name="stylesheet">
            <xsl:text>type="text/xsl" href="../view-article.xsl"</xsl:text>
        </xsl:processing-instruction>
        <xsl:processing-instruction name="setter">
            <xsl:text>href="setter-article.php"</xsl:text>
        </xsl:processing-instruction>
        <a:article
            xsi:schemaLocation="http://formax.cz/ns/article ../model-article.xsd"
         >
            <xsl:apply-templates select="div/*"/>
        </a:article>
    </xsl:template>
    
    <xsl:template match="div">
        <a:div><xsl:apply-templates/></a:div>
    </xsl:template>
    
    <xsl:template match="p">
        <a:p><xsl:apply-templates/></a:p>
    </xsl:template>
    
    <xsl:template match="ul | ol">
        <xsl:apply-templates/>
    </xsl:template>
    
    <xsl:template match="li">
        <a:l><xsl:apply-templates/></a:l>
    </xsl:template>
    
    <xsl:template match="a">
        <a:a href="{@href}"><xsl:apply-templates/></a:a>
    </xsl:template>
    
    <xsl:template match="b | strong | span[contains(@style,'font-weight: bold')]">
        <a:strong><xsl:apply-templates/></a:strong>
    </xsl:template>
    
    <xsl:template match="i | span[contains(@style,'font-style: italic;')]">
        <a:i><xsl:apply-templates/></a:i>
    </xsl:template>
    
    <xsl:template match="img">
        <a:img src="{@src}"/>
    </xsl:template>
    
    <xsl:template match="h1 | h2 | h3 | h4 | h5 | h6">
        <a:h level="substring-afer(name(),'h')">
            <xsl:apply-templates/>
        </a:h>
    </xsl:template>
    
    <xsl:template match="text()[normalize-space() = '']">
        <xsl:text> </xsl:text>
    </xsl:template>
    
</xsl:stylesheet>