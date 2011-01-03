<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" exclude-result-prefixes="nc"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:nc="http://formax.cz/ns/newsCmds"
    xmlns="http://www.w3.org/1999/xhtml"
    >
    <xsl:param name="data"/>
    <xsl:output encoding="UTF-8"/>
    
    <xsl:template match="nc:newsCmds">
        <form id="f-editButtons">
            <div>
                <xsl:apply-templates select="nc:htmlCmds/*"/>
            </div>
            <div>
                <xsl:apply-templates select="nc:fxCmds/*"/>
            </div>
        </form>
    </xsl:template>
    
    <xsl:template match="*[parent::nc:htmlCmds]">
        <input type="button" value="{local-name()}">
            <xsl:attribute name="onclick">
                <xsl:text>htmlEditCmd('</xsl:text>
                <xsl:value-of select="local-name()"/>
                <xsl:text>'</xsl:text>
                <xsl:if test="@value">
                    <xsl:text>,'</xsl:text>
                    <xsl:value-of select="@value"/>
                    <xsl:text>'</xsl:text>
                </xsl:if>
                <xsl:if test="nc:prompt">
                    <xsl:if test="not(@value)">,''</xsl:if>
                    <xsl:text>,'</xsl:text>
                    <xsl:value-of select="normalize-space(nc:prompt)"/>
                    <xsl:text>'</xsl:text>
                </xsl:if>
                <xsl:text>);</xsl:text>
            </xsl:attribute>
            <xsl:attribute name="class"><xsl:value-of select="local-name()"/></xsl:attribute>
        </input>
    </xsl:template>
    
    <xsl:template match="*">
        <input type="button" class="{local-name()}" value="{.}" onclick="fxEditCmd('{local-name()}','{$data}');"/>
    </xsl:template>
    
</xsl:stylesheet>