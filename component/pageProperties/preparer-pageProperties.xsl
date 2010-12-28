<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" exclude-result-prefixes="m sc pp"
    xmlns:m="http://formax.cz/ns/menu"
    xmlns="http://formax.cz/ns/pageProperties"
    xmlns:pp="http://formax.cz/ns/pageProperties"    
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sc="http://www.w3.org/2005/07/scxml"
>
    <xsl:output encoding="UTF-8"/>
    <xsl:param name="id"/>
    <xsl:param name="itemName"/>
    <xsl:param name="operation"/>
    
    <xsl:template match="/*">
        <xsl:processing-instruction name="xml-stylesheet">
            <xsl:text>type="text/xsl" href="../component/pageProperties/view-pageProperties.xsl"</xsl:text>
        </xsl:processing-instruction>
        <xsl:processing-instruction name="setter">
            <xsl:text>href="javascript"</xsl:text>
        </xsl:processing-instruction>
        <pageProperties operation="{$operation}">
			<xsl:attribute name="xml:id"><xsl:value-of select="$id"/></xsl:attribute>
            <xsl:value-of select="$itemName"/>
            <xsl:apply-templates select="m:item | pp:onentry | pp:data"/>
            <place id="maincol">hlavní sloupec</place>
            <place id="leftcol">levý sloupec</place>
        </pageProperties>
    </xsl:template>
    
    <xsl:template match="pp:onentry">
        <onentry><xsl:apply-templates select="pp:change/*"/></onentry>
    </xsl:template>
    
    <xsl:template match="pp:data">
        <data id="{@id}"/>
    </xsl:template>
    
    <xsl:template match="*[parent::pp:change]">
        <xsl:copy>
            <xsl:attribute name="value">
                <xsl:choose>
                    <xsl:when test="starts-with(normalize-space(),'data/')">
                        <xsl:value-of select="substring-after(normalize-space(),'data/')"/>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:value-of select="normalize-space()"/>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:attribute>
        </xsl:copy>
    </xsl:template>
    
    <xsl:template match="m:item">
        <uri value="{@href}"/>
        <title value="{normalize-space(m:title)}"/>
    </xsl:template>
</xsl:stylesheet>
