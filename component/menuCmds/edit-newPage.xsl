<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" exclude-result-prefixes="h"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:h="http://www.w3.org/1999/xhtml"
>
    <xsl:template match="*">
        <xsl:copy>
            <xsl:apply-templates select="@*"/>
            <xsl:apply-templates/>
        </xsl:copy>
    </xsl:template>
    
    <xsl:template name="item">
        <li>
            <a href="#">
                <span><span><xsl:value-of select="normalize-space(.)"/> new page</span></span>
            </a>  
        </li>
    </xsl:template>
    
    <xsl:template match="h:li[normalize-space(.) = '']" priority="1">
        <xsl:call-template name="item"/>
    </xsl:template>
    
    <xsl:template match="h:li[descendant-or-self::*[contains(@class,' f-edited')]]
        [preceding-sibling::h:li[1][normalize-space(.) != '']] | 
        li[descendant-or-self::*[contains(@class,' f-edited')]]">
        <xsl:call-template name="item"/>
    </xsl:template>
    
    <xsl:template match="@class[contains(.,'f-edited')]">
        <xsl:if test="normalize-space(substring-before(.,'f-edited')) != ''">
            <xsl:attribute name="class">
                <xsl:value-of select="normalize-space(substring-before(.,'f-edited'))"/>
            </xsl:attribute>
        </xsl:if>
    </xsl:template>
    
    <xsl:template match="h:br"/>
    <xsl:template match="text()[parent::h:br]"/>
    
    <xsl:template match="@*">
        <xsl:copy-of select="."/>
    </xsl:template>
    
</xsl:stylesheet>