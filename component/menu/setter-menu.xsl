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
            <xsl:when test="@xml:id = $itemId">
                <xsl:choose>
                    <xsl:when test="$operation = 'change'">
                        <xsl:copy>
                            <xsl:apply-templates select="@*" mode="edited"/>
                            <xsl:apply-templates mode="edited"/>
                        </xsl:copy> 
                    </xsl:when>
                    <xsl:when test="$operation = 'insertAfter'">
                        <xsl:call-template name="copy"/>
                        <xsl:call-template name="new"/>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:call-template name="copy"/>
                        <xsl:call-template name="new"/>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:when>
            <xsl:otherwise>
                <xsl:call-template name="copy"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
    <xsl:template name="copy">
        <xsl:copy>
            <xsl:apply-templates select="@*"/>
            <xsl:apply-templates/>
        </xsl:copy>    
    </xsl:template>
    
    <xsl:template name="new">
        <item href="{$uri}" xml:id="{generate-id()}">
            <xsl:attribute name="id">
                <xsl:call-template name="id"/>
            </xsl:attribute>
            <xsl:value-of select="$itemName"/>
            <title><xsl:value-of select="$title"/></title>
        </item>
    </xsl:template>
    
    <xsl:template match="text()" mode="edited">
        <xsl:value-of select="normalize-space($itemName)"/>
    </xsl:template>
    
    <xsl:template match="m:title" mode="edited">
        <title><xsl:value-of select="$title"/></title>
    </xsl:template>
    
    <xsl:template match="@href" mode="edited">
        <xsl:attribute name="href">
            <xsl:value-of select="$uri"/>
        </xsl:attribute>
    </xsl:template>
    
    <xsl:template match="@id" mode="edited">
        <xsl:attribute name="id">
            <xsl:call-template name="id"/>
        </xsl:attribute>
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
        <xsl:copy-of select="."/>
    </xsl:template>
    
    <xsl:template match="@*" mode="edited">
        <xsl:copy-of select="."/>
    </xsl:template>
    
    <xsl:template match="text()[normalize-space() = '']"/>
    
    <xsl:template match="text()">
        <xsl:value-of select="normalize-space()"/>
    </xsl:template>
       
</xsl:stylesheet>