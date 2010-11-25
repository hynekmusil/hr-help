<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" exclude-result-prefixes="h"
    xmlns:a="http://formax.cz/ns/article"
    xmlns:h="http://www.w3.org/1999/xhtml"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
>
    <xsl:output encoding="UTF-8"/>
    
    <xsl:template match="h:div[not(parent::*)]">
        <xsl:processing-instruction name="xml-stylesheet">
            <xsl:text>type="text/xsl" href="../component/article/view-article.xsl"</xsl:text>
        </xsl:processing-instruction>
        <xsl:processing-instruction name="setter">
            <xsl:text>href="../component/article/setter-article.php"</xsl:text>
        </xsl:processing-instruction>
        <a:article
            xsi:schemaLocation="http://formax.cz/ns/article ../component/article/model-article.xsd"
         >
            <xsl:apply-templates/>
        </a:article>
    </xsl:template>
    
    <xsl:template match="h:div">
        <a:div><xsl:apply-templates/></a:div>
    </xsl:template>
    
    <xsl:template match="h:p">
        <a:p><xsl:apply-templates/></a:p>
    </xsl:template>
    
    <xsl:template match="h:ul | h:ol">
        <xsl:apply-templates/>
    </xsl:template>
    
    <xsl:template match="h:li">
        <a:l><xsl:apply-templates/></a:l>
    </xsl:template>
    
    <xsl:template match="h:a">
        <a:a href="{@href}"><xsl:apply-templates/></a:a>
    </xsl:template>
    
    <xsl:template match="h:b | h:strong | h:span[contains(@style,'font-weight: bold')]">
        <a:strong><xsl:apply-templates/></a:strong>
    </xsl:template>
    
    <xsl:template match="h:i | h:span[contains(@style,'font-style: italic;')]">
        <a:i><xsl:apply-templates/></a:i>
    </xsl:template>
    
    <xsl:template match="h:img">
        <a:img src="{@src}"/>
    </xsl:template>
    
    <xsl:template match="h:h1 | h:h2 | h:h3 | h:h4 | h:h5 | h:h6">
        <a:h level="{substring-after(name(),'h')}">
            <xsl:apply-templates/>
        </a:h>
    </xsl:template>
    
    <xsl:template match="h:br"/>
    
    <xsl:template match="text()[normalize-space() = '']"/>
    
</xsl:stylesheet>
