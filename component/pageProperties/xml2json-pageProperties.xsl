<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" exclude-result-prefixes="pp"
    xmlns="http://formax.cz/ns/pageProperties"
    xmlns:pp="http://formax.cz/ns/pageProperties"    
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
>
    <xsl:output method="text"/>
    <xsl:param name="menuURI"/>
    <xsl:param name="stateId"/>
    <xsl:param name="operation">change</xsl:param>
    <xsl:variable name="q">"</xsl:variable>
    
    <xsl:template match="pp:pageProperties">
        <xsl:text>{"operation":"</xsl:text>
        <xsl:value-of select="$operation"/>
        <xsl:text>","menuURI":"</xsl:text>
        <xsl:value-of select="$menuURI"/>
        <xsl:text>","itemName":"</xsl:text>
        <xsl:value-of select="normalize-space(text()[1])"/>
        <xsl:text>","itemId":"</xsl:text>
        <xsl:value-of select="@xml:id"/>
        <xsl:text>","uri":"</xsl:text>
        <xsl:value-of select="pp:uri/@value"/>
        <xsl:text>","title":"</xsl:text>
        <xsl:value-of select="pp:title/@value"/>
        <xsl:text>","onentry":[</xsl:text>
        <xsl:apply-templates select="pp:onentry"/>
        <xsl:text>]}</xsl:text>
    </xsl:template>
    
    <xsl:template match="pp:onentry">
        <xsl:variable name="onentry">
            <xsl:for-each select="*">
                <xsl:if test="not(preceding-sibling::*[name() = name(current())])">
                    <xsl:value-of select="concat('{',$q,local-name(),$q,':[')"/>  
                    <xsl:for-each select="../*[name() = name(current())]">
                        <xsl:value-of select="concat($q,'data/',@value,$q)"/>
                        <xsl:if test="position() != last()">,</xsl:if>
                    </xsl:for-each>
                    <xsl:text>]},</xsl:text>
                </xsl:if>
            </xsl:for-each>
        </xsl:variable>
        <xsl:value-of select="substring($onentry,0,string-length($onentry))"/>
    </xsl:template>
       
</xsl:stylesheet>
