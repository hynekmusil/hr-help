<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" exclude-result-prefixes="m sc pp"
    xmlns:m="http://formax.cz/ns/menu"
    xmlns="http://formax.cz/ns/pageProperties"
    xmlns:pp="http://formax.cz/ns/pageProperties"    
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sc="http://www.w3.org/2005/07/scxml"
>
    <xsl:output encoding="UTF-8" indent="yes"/>
    <xsl:param name="pos"/>
    <xsl:param name="place"/>
    <xsl:param name="dataURI"/>
    <xsl:param name="uri"/>
    <xsl:param name="title"/>
    <xsl:param name="titleItem"/>
    <xsl:param name="operation"/>
    
    <xsl:template match="/">
        <xsl:processing-instruction name="xml-stylesheet">
            <xsl:text>"type="text/xsl" href="../component/pageProperties/view-pageProperties.xsl"</xsl:text>
        </xsl:processing-instruction>
        <xsl:processing-instruction name="setter">
            <xsl:text>href="javascript"</xsl:text>
        </xsl:processing-instruction>
        <xsl:apply-templates select="*"/>
    </xsl:template>
    
    <xsl:template match="pp:pageProperties">
        <xsl:copy>
            <xsl:copy-of select="@*"/>
            <xsl:apply-templates select="text()[1]"/>
            <xsl:apply-templates select="*"/>
        </xsl:copy>
    </xsl:template>
    
    <xsl:template match="*">
        <xsl:call-template name="copy"/>
    </xsl:template>
    
    <xsl:template match="pp:place">
        <xsl:copy-of select="."/>
    </xsl:template>
    
    <xsl:template match="*[@value]">
        <xsl:copy>
            <xsl:apply-templates select="@value"/>
        </xsl:copy>   
    </xsl:template>
    
    <xsl:template match="*[parent::pp:onentry]" priority="2">
        <xsl:choose>
            <xsl:when test="$operation = 'removeComponent' and 
                number($pos) = count(preceding-sibling::*) and count(../*) > 1"/>
            <xsl:when test="number($pos) = count(preceding-sibling::*) and 
                $place != '' and $place != local-name()">
                <xsl:element name="{$place}" namespace="http://formax.cz/ns/pageProperties">
                    <xsl:apply-templates select="@value"/>
                </xsl:element>
            </xsl:when>
            <xsl:otherwise>
                <xsl:call-template name="copy"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
    <xsl:template match="@value">
        <xsl:choose>
            <xsl:when test="name(..) = 'uri' and $uri != ''">
                <xsl:attribute name="value">
                    <xsl:value-of select="$uri"/>
                </xsl:attribute>
            </xsl:when>
            <xsl:when test="name(..) = 'title' and $title != ''">
                <xsl:attribute name="value">
                    <xsl:value-of select="$title"/>
                </xsl:attribute>
            </xsl:when>
            <xsl:otherwise><xsl:copy/></xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
    <xsl:template match="@value[ancestor::pp:onentry]" priority="2">
        <xsl:choose>
            <xsl:when test="$pos = ''"><xsl:copy/></xsl:when>
            <xsl:when test="number($pos) = count(parent::*/preceding-sibling::*) and $dataURI != ''">
                <xsl:attribute name="value">
                    <xsl:value-of select="$dataURI"/>
                </xsl:attribute>
            </xsl:when>
            <xsl:otherwise><xsl:copy/></xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
    <xsl:template match="text()[parent::pp:pageProperties][1]">
        <xsl:choose>
            <xsl:when test="$titleItem != ''"><xsl:value-of select="$titleItem"/></xsl:when>
            <xsl:otherwise><xsl:copy/></xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
    <xsl:template match="pp:onentry">
        <onentry>
            <xsl:apply-templates select="*"/>
            <xsl:if test="$operation = 'addComponent'">
                <xsl:element name="{$place}" namespace="http://formax.cz/ns/pageProperties">
                    <xsl:attribute name="value">
                        <xsl:value-of select="$dataURI"/>
                    </xsl:attribute>
                </xsl:element>
            </xsl:if>
        </onentry>
    </xsl:template>
    
    <xsl:template name="copy">
        <xsl:copy>
            <xsl:apply-templates select="@*"/>
            <xsl:apply-templates/>
        </xsl:copy>
    </xsl:template>
    
    <xsl:template match="@*">
        <xsl:copy/>
    </xsl:template>
</xsl:stylesheet>
