<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" exclude-result-prefixes="p"
    xmlns:p="http://formax.cz/ns/page" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns="http://www.w3.org/1999/xhtml"
>
    <xsl:template match="p:layout">
        <div id="f-pageCmds">
            <xsl:text> </xsl:text>
        </div>
        <div id="menu">
            <xsl:text> </xsl:text>
        </div>
        <div>
            <xsl:apply-templates/>
        </div>
        <div id="f-editCmds">
            <xsl:text> </xsl:text>
        </div>
        <pre id="log">
            <xsl:text> </xsl:text>
		</pre>
    </xsl:template>
    
    <xsl:template match="p:field">
        <div id="{@xml:id}">
            <xsl:comment>
                <xsl:value-of select="@xml:id"/>
            </xsl:comment>
        </div>
    </xsl:template>
    
    <xsl:template match="p:column">
        <div class="column" id="{@xml:id}">
            <xsl:apply-templates/>
        </div>
    </xsl:template>
</xsl:stylesheet>
