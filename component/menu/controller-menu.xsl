<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" exclude-result-prefixes="sc"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sc="http://www.w3.org/2005/07/scxml"
    xmlns="http://www.w3.org/1999/xhtml"
>
    <xsl:param name="stateId" select="'homepage'"/>
    
    <xsl:template match="/sc:scxml">
        <xsl:apply-templates select=".//sc:state[@id = $stateId]"/>
    </xsl:template>
    
    <xsl:template match="sc:state">
        <xsl:apply-templates 
            select="ancestor-or-self::sc:state[sc:transition[@target and @event and not(@cond)]]" 
            mode="menu"/>
    </xsl:template>
    
    <xsl:template match="sc:state" mode="menu">
        <ul>
            <xsl:apply-templates select="sc:transition[@target and @event and not(@cond)]"/>  
        </ul>
    </xsl:template>
    
    <xsl:template match="sc:transition">
        <li>
            <xsl:if test="@target = $stateId">
                <xsl:attribute name="style">background-color: yellow;</xsl:attribute>
            </xsl:if>
            <a href="javascript:document.statechart.raise('{@target}')">
                <xsl:value-of select="@event"/>
            </a>
        </li>
    </xsl:template>
    
</xsl:stylesheet>