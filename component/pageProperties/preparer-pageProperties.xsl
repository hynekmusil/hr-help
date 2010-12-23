<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" exclude-result-prefixes="m sc pp"
    xmlns:m="http://formax.cz/ns/menu"
    xmlns="http://formax.cz/ns/pageProperties"
    xmlns:pp="http://formax.cz/ns/pageProperties"    
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sc="http://www.w3.org/2005/07/scxml"
>
    <xsl:output encoding="UTF-8"/>
    
    <xsl:template match="/*">
        <xsl:processing-instruction name="xml-stylesheet">
            <xsl:text>"type="text/xsl" href="../component/pageProperties/view-pageProperties.xsl"</xsl:text>
        </xsl:processing-instruction>
        <pageProperties>
            <xsl:apply-templates select="m:item | pp:onentry"/>
        </pageProperties>
    </xsl:template>
    
    <xsl:template match="pp:onentry">
        <onentry><xsl:apply-templates select="*"/></onentry>
    </xsl:template>
    
    <xsl:template match="*">
        <xsl:copy>
            <xsl:attribute name="value">
                <xsl:value-of select="normalize-space()"/>
            </xsl:attribute>
        </xsl:copy>
    </xsl:template>
    
    <xsl:template match="m:item">
        <uri value="{@href}"/>
        <title value="{normalize-space(m:title)}"/>
    </xsl:template>
</xsl:stylesheet>
