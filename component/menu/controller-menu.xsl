<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" exclude-result-prefixes="sc l"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sc="http://www.w3.org/2005/07/scxml"
    xmlns:l="http://formax.cz/ns/xslt-lib"
    xmlns:exslt="http://exslt.org/common"
    xmlns:msxsl="urn:schemas-microsoft-com:xslt"
    xmlns="http://www.w3.org/1999/xhtml"
    extension-element-prefixes="exslt msxsl"
>
    <msxsl:script language="JScript" implements-prefix="exslt">
        this['node-set'] =  function (x) {
        return x;
        }
    </msxsl:script>
    
    <xsl:output indent="yes"/>
    <xsl:param name="stateIds" select="'homepage preview'"/>
    
    <xsl:variable name="sId">
        <xsl:call-template name="tokenize">
            <xsl:with-param name="text" select="$stateIds"/>
        </xsl:call-template>
    </xsl:variable>
    
    <xsl:template name="tokenize">
        <xsl:param name="text" select="."/>
        <xsl:choose>
            <xsl:when test="contains($text,' ')">
                <l:t><xsl:value-of select="substring-before($text,' ')"/></l:t>
                <xsl:call-template name="tokenize">
                    <xsl:with-param name="text">
                        <xsl:value-of select="substring-after($text,' ')"/>
                    </xsl:with-param>
                </xsl:call-template>
            </xsl:when>
            <xsl:otherwise>
                <l:t><xsl:value-of select="$text"/></l:t>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
    <xsl:template match="/sc:scxml">
        <div>
            <h4><xsl:value-of select="$stateIds"/></h4>
            <xsl:apply-templates select=".//sc:state[@id = exslt:node-set($sId)/*]"/>
        </div>
    </xsl:template>
    
    <xsl:template match="sc:state">
        <xsl:apply-templates 
            select="ancestor-or-self::sc:*[sc:transition[@target and @event and not(@cond)]]" 
            mode="menu"/>
    </xsl:template>
    
    <xsl:template match="sc:state" mode="menu">
        <ul>
            <xsl:apply-templates select="sc:transition[@target and @event and not(@cond)]"/>                
        </ul>
    </xsl:template>
    
    <xsl:template match="sc:transition">
        <li>
            <xsl:if test="@target = exslt:node-set($sId)/*">
                <xsl:attribute name="style">background-color: yellow;</xsl:attribute>
            </xsl:if>
            <a href="javascript:document.statechart.raise('{@event}')">
                <xsl:value-of select="@target"/>
            </a>
        </li>
    </xsl:template>
    
</xsl:stylesheet>