<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" exclude-result-prefixes="n a" extension-element-prefixes="e"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:n="http://formax.cz/ns/news"
    xmlns:a="http://formax.cz/ns/article"
    xmlns:e="http://exslt.org/common"
    xmlns="http://formax.cz/ns/news"
>
    <xsl:output encoding="UTF-8"/>
    <xsl:param name="newId"/>
    <xsl:param name="operation">change</xsl:param>
    
    <xsl:variable name="newContent" xml:id="newContent"/>
    
    <xsl:template match="/">
        <xsl:processing-instruction name="xml-stylesheet">type="text/xsl" href="../component/news/view-news.xsl"</xsl:processing-instruction>
        <xsl:processing-instruction name="setter">href="../component/news/setter-news.php"</xsl:processing-instruction>
        <xsl:apply-templates select="*"/>
    </xsl:template>
    
    <xsl:template match="*">       
        <xsl:choose>
            <xsl:when test="($operation = 'shiftLeft') and following-sibling::*[1][@xml:id = $newId]">
                <xsl:apply-templates select="following-sibling::*[1]" mode="copy"/>
                <xsl:call-template name="copy"/>
            </xsl:when>
            <xsl:when test="($operation = 'shiftRight') and preceding-sibling::*[1][@xml:id = $newId]">
                <xsl:call-template name="copy"/>
                <xsl:apply-templates select="preceding-sibling::*[1]" mode="copy"/>
            </xsl:when>
            <xsl:when test="@xml:id = $newId">
                <xsl:choose>
                    <xsl:when test="($operation = 'shiftLeft') and not(preceding-sibling::*)">
                        <xsl:call-template name="copy"/>
                    </xsl:when>
                    <xsl:when test="($operation = 'shiftRight') and not(following-sibling::*)">
                        <xsl:call-template name="copy"/>
                    </xsl:when>
                    <xsl:when test="$operation = 'change'">
                        <xsl:apply-templates select="." mode="edited"/>
                    </xsl:when>
                    <xsl:when test="$operation = 'insertAfter'">
                        <xsl:call-template name="copy"/>
                        <xsl:call-template name="new"/>
                    </xsl:when>
                    <xsl:when test="$operation = 'insertBefore'">
                        <xsl:call-template name="new"/>
                        <xsl:call-template name="copy"/>
                    </xsl:when>
                </xsl:choose>
            </xsl:when>
            <xsl:otherwise>
                <xsl:call-template name="copy"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
    <xsl:template match="*" mode="copy">
        <xsl:call-template name="copy"/>
    </xsl:template>
    
    <xsl:template name="copy">
        <xsl:copy>
            <xsl:apply-templates select="@*"/>
            <xsl:apply-templates/>
        </xsl:copy>    
    </xsl:template>
    
    <xsl:template name="new">
        <new>
            <xsl:attribute name="xml:id">
                <xsl:value-of select="generate-id()"/>
            </xsl:attribute>
            <h>Novinka</h>
            <a:p>text</a:p>       
        </new>
    </xsl:template>
    
    <xsl:template match="n:new" mode="edited">
        <new>
            <xsl:copy-of select="@xml:id"/>
            <xsl:apply-templates select="e:node-set($newContent)/*" mode="html"/>
        </new>
    </xsl:template>
    
    <xsl:template match="*" mode="html">
        <xsl:apply-templates/>
    </xsl:template>
    
    <xsl:template match="h4[namespace-uri() = '']">
        <h><xsl:value-of select="."/></h>
    </xsl:template>
    
    <xsl:template match="*[namespace-uri() = '']">
        <xsl:apply-templates/>
    </xsl:template>
    
    <xsl:template match="p[namespace-uri() = '']">
        <a:p><xsl:apply-templates/></a:p>
    </xsl:template>
    
    <xsl:template match="li[namespace-uri() = '']">
        <a:l><xsl:apply-templates/></a:l>
    </xsl:template>
    
    <xsl:template match="a[namespace-uri() = '']">
        <a:a href="{@href}"><xsl:apply-templates/></a:a>
    </xsl:template>
    
    <xsl:template match="b[namespace-uri() = ''] | strong[namespace-uri() = ''] | span[namespace-uri() = ''][contains(@style,'font-weight: bold')]">
        <a:strong><xsl:apply-templates/></a:strong>
    </xsl:template>
    
    <xsl:template match="i[namespace-uri() = ''] | span[namespace-uri() = ''][contains(@style,'font-style: italic;')]">
        <a:i><xsl:apply-templates/></a:i>
    </xsl:template>
    
    <xsl:template match="@*">
        <xsl:copy/>
    </xsl:template>
    
    <xsl:template match="text()[normalize-space() = '']"/>
    
    <xsl:template match="text()">
        <xsl:value-of select="normalize-space()"/>
    </xsl:template>
       
</xsl:stylesheet>