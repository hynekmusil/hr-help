<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" exclude-result-prefixes="m"
    xmlns:m="http://formax.cz/ns/menu" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns="http://www.w3.org/1999/xhtml"
>
    <xsl:param name="event"/>
    
    <xsl:template match="m:menu">
        <h3 class="blind">Menu</h3>
        <ul>
            <xsl:copy-of select="@id"/>
            <xsl:apply-templates select="m:item"/>
        </ul>
        <xsl:apply-templates select="m:item[@id = $event]" mode="instruction"/>
    </xsl:template>
    
    <xsl:template match="m:item">
        <li>
            <xsl:choose>
                <xsl:when test="($event = @id)">
                    <xsl:apply-templates select="." mode="selected"/>
                </xsl:when>
                <xsl:when test="($event = '') and @selected">
                    <xsl:apply-templates select="." mode="selected"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:apply-templates select="." mode="item"/>
                </xsl:otherwise>
            </xsl:choose> 
        </li>
    </xsl:template>
    
    <xsl:template match="m:item" mode="item">
        <xsl:param name="active"/>
        <xsl:variable name="fid">
            <xsl:if test="@xml:id">f-id-</xsl:if>
        </xsl:variable>
        <xsl:if test="concat($active,$fid,@xml:id) != ''">
            <xsl:attribute name="class"><xsl:value-of select="normalize-space(concat($active,$fid,@xml:id))"/></xsl:attribute>
        </xsl:if>
        <a href="javascript:raise('{@id}','{@href}')">
            <span><span><xsl:value-of select="normalize-space(text())"/></span></span>
        </a>
    </xsl:template>
    
    <xsl:template match="m:item" mode="selected">
        <xsl:apply-templates select="." mode="item">
            <xsl:with-param name="active" select="'active '"/>
        </xsl:apply-templates>
    </xsl:template>
    
    <xsl:template match="m:item" mode="instruction">
        <xsl:variable name="q">"</xsl:variable>
        <xsl:comment>
            <xsl:value-of select="concat('f-result:[',$q,m:title,$q,',',$q,@href,$q,']')"/>
        </xsl:comment>
    </xsl:template>
    
</xsl:stylesheet>