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
    
    <xsl:template match="h:li[normalize-space(.) = '']" priority="1">
        <li>
            <a href="#"><xsl:value-of select="normalize-space()"/> new_page</a>
        </li>
    </xsl:template>
    
    <xsl:template match="h:li[descendant-or-self::*[contains(@class,' f-edited')]]
        [not(normalize-space(preceding-sibling::h:li) = '')] | 
        li[descendant-or-self::*[contains(@class,' f-edited')]]">
        <li>
            <a href="#"><xsl:value-of select="normalize-space()"/> new_page</a>
        </li>
    </xsl:template>
    
    <xsl:template match="@class[contains(.,'f-edited')]">
        <xsl:if test="normalize-space(substring-before(.,'f-edited')) != ''">
            <xsl:attribute name="class">
                <xsl:value-of select="normalize-space(substring-before(.,'f-edited'))"/>
            </xsl:attribute>
        </xsl:if>
    </xsl:template>
    
    <xsl:template match="@*">
        <xsl:copy-of select="."/>
    </xsl:template>
    
</xsl:stylesheet>