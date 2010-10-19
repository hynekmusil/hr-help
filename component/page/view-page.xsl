<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" exclude-result-prefixes="l"
    xmlns:l="http://formax.cz/ns/page" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns="http://www.w3.org/1999/xhtml"
>
    <xsl:template match="l:layout">
        <div id="menu">
            <xsl:text> </xsl:text>
        </div>
        <div>
            <xsl:apply-templates/>
        </div>
        <pre id="log">
            <xsl:text> </xsl:text>
		</pre>
    </xsl:template>
    
    <xsl:template match="l:field">
        <div id="{@xml:id}">
            <xsl:comment>
                <xsl:value-of select="@xml:id"/>
            </xsl:comment>
        </div>
    </xsl:template>
    
    <xsl:template match="l:column">
        <div class="column" id="{@xml:id}">
            <xsl:apply-templates/>
        </div>
    </xsl:template>
</xsl:stylesheet>
