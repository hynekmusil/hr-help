<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" exclude-result-prefixes="m sc pp"
    xmlns:m="http://formax.cz/ns/menu"
    xmlns="http://formax.cz/ns/pageProperties"
    xmlns:pp="http://formax.cz/ns/pageProperties"    
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sc="http://www.w3.org/2005/07/scxml"
>
    <xsl:output encoding="UTF-8"/>
    <xsl:param name="pos"/>
    <xsl:param name="place"/>
    <xsl:param name="uri"/>
    
    <xsl:template match="/">
        <xsl:processing-instruction name="xml-stylesheet">
            <xsl:text>"type="text/xsl" href="../component/pageProperties/view-pageProperties.xsl"</xsl:text>
        </xsl:processing-instruction>
        <xsl:apply-templates select="*"/>
    </xsl:template>
    
    <xsl:template match="*">
        <xsl:call-template name="copy"/>
    </xsl:template>
    
    <xsl:template match="pp:onentry">
        <xsl:copy>
            <xsl:apply-templates select="*"/>
            <xsl:if test="$place != '' and $uri!=''">
                <xsl:element name="{$place}" namespace="http://formax.cz/ns/pageProperties">
                    <xsl:attribute name="value">
                        <xsl:value-of select="$uri"/>
                    </xsl:attribute>
                </xsl:element>
            </xsl:if>
        </xsl:copy>
    </xsl:template>
    
    <xsl:template match="*[parent::pp:onentry]">
        <xsl:choose>
            <xsl:when test="$pos = count(preceding-sibling::*)"/>
            <xsl:otherwise>
                <xsl:call-template name="copy"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
    <xsl:template name="copy">
        <xsl:copy>
            <xsl:apply-templates select="@*"/>
            <xsl:apply-templates/>
        </xsl:copy>
    </xsl:template>
</xsl:stylesheet>
