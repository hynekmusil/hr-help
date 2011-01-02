<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" exclude-result-prefixes="pp m" extension-element-prefixes="r"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:pp="http://formax.cz/ns/pageProperties"
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:m="http://formax.cz/ns/menu"
    xmlns:r="http://exslt.org/regular-expressions"
>
    <xsl:variable name="menuDoc" select="document('../../data/menu-hlavni.xml')"/>
    
    <!--xsl:template match="/">
        <xsl:apply-templates select=".//*" mode="validate"/>
    </xsl:template-->
    
    <xsl:template match="pp:uri" mode="validate">
        <xsl:variable name="message">
            <xsl:choose>
                <xsl:when test="@value = ''">Hodnota je povinná</xsl:when>
                <xsl:when test="not(r:test(@value,'^([a-zA-Z0-9\-_]+\/?)*(\.html)?$',''))">Hodnota má špatný formát</xsl:when>
                <!--xsl:when test="$menuDoc//m:item[@href = current()/@value]">Hodnota není unikátní</xsl:when-->
            </xsl:choose>
        </xsl:variable>
        <xsl:if test="$message != ''">
            <span class="f-invalid">
                <xsl:value-of select="$message"/>
            </span>
        </xsl:if>
    </xsl:template>
    
    <xsl:template match="pp:title" mode="validate">
        <xsl:if test="pp:title = ''">
            <span class="f-invalid">Hodnota je povinná</span>
        </xsl:if>
    </xsl:template>
    
    <xsl:template match="pp:newArticle">
        <xsl:variable name="message">
            <xsl:choose>
                <xsl:when test="@value = ''">Hodnota je povinná</xsl:when>
                <xsl:when test="r:test(@value,'^[a-zA-Z0-9\-_]+\.xml$','') != true()">Hodnota má špatný formát</xsl:when>
            </xsl:choose>
        </xsl:variable>        
        <xsl:if test="$message != ''">
            <span id="f-invalidNewArticle">
                <xsl:value-of select="$message"/>
            </span>
        </xsl:if>
    </xsl:template>
    
    <xsl:template match="*" mode="validate"/>
        
</xsl:stylesheet>
