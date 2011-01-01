<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" exclude-result-prefixes="m" extension-element-prefixes="s"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:m="http://formax.cz/ns/menu"
    xmlns:s="http://exslt.org/strings"
    xmlns="http://formax.cz/ns/menu"
>
    <xsl:output encoding="UTF-8"/>
    <xsl:param name="itemName"/>
    <xsl:param name="itemId"/>
    <xsl:param name="uri"/>
    <xsl:param name="title"/>
    <xsl:param name="operation">change</xsl:param>
    
    <xsl:template match="/">
        <xsl:processing-instruction name="xml-stylesheet">type="text/xsl" href="../component/menu/view-menu.xsl"</xsl:processing-instruction>
        <xsl:processing-instruction name="setter">href="../component/menu/setter-menu.php"</xsl:processing-instruction>
        <xsl:apply-templates select="*"/>
    </xsl:template>
    
    <xsl:template match="*">       
        <xsl:choose>
            <xsl:when test="($operation = 'shiftLeft') and following-sibling::*[1][@xml:id = $itemId]">
                <xsl:apply-templates select="following-sibling::*[1]" mode="copy"/>
                <xsl:call-template name="copy"/>
            </xsl:when>
            <xsl:when test="($operation = 'shiftRight') and preceding-sibling::*[1][@xml:id = $itemId]">
                <xsl:call-template name="copy"/>
                <xsl:apply-templates select="preceding-sibling::*[1]" mode="copy"/>
            </xsl:when>
            <xsl:when test="@xml:id = $itemId">
                <xsl:choose>
                    <xsl:when test="($operation = 'shiftLeft') and not(preceding-sibling::*)">
                        <xsl:call-template name="copy"/>
                    </xsl:when>
                    <xsl:when test="($operation = 'shiftRight') and not(following-sibling::*)">
                        <xsl:call-template name="copy"/>
                    </xsl:when>
                    <xsl:when test="$operation = 'change'">
                        <xsl:copy>
                            <xsl:apply-templates select="@*" mode="edited"/>
                            <xsl:apply-templates select="*" mode="edited"/>
                        </xsl:copy> 
                    </xsl:when>
                    <xsl:when test="$operation = 'insertAfter'">
                        <xsl:call-template name="copy"/>
                        <xsl:call-template name="new"/>
                    </xsl:when>
                    <xsl:when test="$operation = 'insertBefore'">
                        <xsl:call-template name="new"/>
                        <xsl:call-template name="copy"/>
                    </xsl:when>
                </xsl:choose>
            </xsl:when>
            <xsl:otherwise>
                <xsl:call-template name="copy"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
    <xsl:template match="*" mode="copy">
        <xsl:call-template name="copy"/>
    </xsl:template>
    
    <xsl:template name="copy">
        <xsl:copy>
            <xsl:apply-templates select="@*"/>
            <xsl:apply-templates/>
        </xsl:copy>    
    </xsl:template>
    
    <xsl:template name="new">
        <item href="{$uri}">
            <xsl:attribute name="xml:id">
                <xsl:value-of select="generate-id()"/>
            </xsl:attribute>
            <xsl:attribute name="id">
                <xsl:call-template name="id"/>
            </xsl:attribute>
            <xsl:value-of select="normalize-space($itemName)"/>
            <title><xsl:value-of select="$title"/></title>
        </item>
    </xsl:template>
    
    <xsl:template match="m:title" mode="edited">
        <xsl:value-of select="normalize-space($itemName)"/>
        <title>
            <xsl:choose>
                <xsl:when test="$title = ''"><xsl:value-of select="."/></xsl:when>
                <xsl:otherwise><xsl:value-of select="$title"/></xsl:otherwise>
            </xsl:choose>
        </title>
    </xsl:template>
    
    <xsl:template match="@href" mode="edited">
        <xsl:attribute name="href">
            <xsl:choose>
                <xsl:when test="$uri = ''"><xsl:value-of select="."/></xsl:when>
                <xsl:otherwise><xsl:value-of select="$uri"/></xsl:otherwise>
            </xsl:choose>
        </xsl:attribute>
    </xsl:template>
    
    <xsl:template match="@id" mode="edited">
        <xsl:attribute name="id">
            <xsl:choose>
                <xsl:when test="$uri = ''"><xsl:value-of select="."/></xsl:when>
                <xsl:otherwise><xsl:call-template name="id"/></xsl:otherwise>
            </xsl:choose>
        </xsl:attribute>
    </xsl:template>
    
    <xsl:template match="@xml:id" mode="edited">
        <xsl:copy/>
    </xsl:template>
    
    <xsl:template name="id">
        <xsl:variable name="smallcase" select="'abcdefghijklmnopqrstuvwxyz'" />
        <xsl:variable name="uppercase" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'" />
        
        <xsl:for-each select="s:tokenize($uri,'/')">
            <xsl:choose>
                <xsl:when test="position() != 1">
                    <xsl:value-of select="concat(
                        translate(substring(.,1,1),$smallcase, $uppercase),
                        substring(.,2))"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="."/> 
                </xsl:otherwise>
            </xsl:choose>
        </xsl:for-each>
    </xsl:template>
    
    <xsl:template match="@*">
        <xsl:copy/>
    </xsl:template>
    
    <xsl:template match="@*" mode="edited">
        <xsl:copy/>
    </xsl:template>
    
    <xsl:template match="text()[normalize-space() = '']"/>
    
    <xsl:template match="text()">
        <xsl:value-of select="normalize-space()"/>
    </xsl:template>
       
</xsl:stylesheet>