<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" exclude-result-prefixes="f"
    xmlns:f="http://formax.cz/ns/footer"
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
> 
    <xsl:template match="f:footer">
        <div id="footer">
            <xsl:apply-templates select="*"/>
        </div>
    </xsl:template>
    
    <xsl:template match="f:copyright">
        <xsl:value-of select="concat(@to,' © Copyright')"/>
        <xsl:apply-templates/>
    </xsl:template>
    
    <xsl:template match="f:developedBy">
        <xsl:text> Developed by </xsl:text>
        <a href="{@href}"><strong>
            <xsl:value-of select="."/>
        </strong></a>
    </xsl:template>
    
    <xsl:template match="f:a[preceding-sibling::*[1][local-name() = 'developedBy']]">
        <br/>
        <xsl:apply-templates select=". | following-sibling::f:a[preceding-sibling::*[1][local-name() = 'a']]" mode="fmenu"/>
    </xsl:template>
    
    <xsl:template match="f:a" mode="fmenu">
        <a href="{@href}"><xsl:value-of select="."/></a>
        <xsl:if test="local-name(following-sibling::*[1]) = 'a'">
            <xsl:text> | </xsl:text>
        </xsl:if>
    </xsl:template>
    
    <xsl:template match="f:a"/>
    
    <xsl:template match="f:strong">
        <xsl:text> </xsl:text>
        <strong><xsl:value-of select="."/></strong>
    </xsl:template>

</xsl:stylesheet>
