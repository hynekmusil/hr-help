<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" exclude-result-prefixes="p"
    xmlns:p="http://formax.cz/ns/page" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns="http://www.w3.org/1999/xhtml"
>
    <xsl:template match="p:layout">
        <div id="f-pageCmds" style="position: absolute; top: 0; left: 0;">
            <xsl:text> </xsl:text>
        </div>
        <div id="container">
            <xsl:apply-templates/>
        </div>
        <div id="f-editCmds">
            <xsl:text> </xsl:text>
        </div>
        <!--pre id="f-log">
            <xsl:text> </xsl:text>
		</pre-->
    </xsl:template>
    
    <xsl:template match="p:field">
        <div id="{@xml:id}">
            <xsl:comment>
                <xsl:value-of select="@xml:id"/>
            </xsl:comment>
        </div>
    </xsl:template>
    
    <xsl:template match="p:field[(@xml:id = 'menu') or (@xml:id = 'header') or (@xml:id = 'footer')]">
        <hr id="before-{@xml:id}" class="blind"/>
    </xsl:template>
    
    <xsl:template match="p:column">
        <div id="{@xml:id}">
            <div id="main-content">
                <xsl:apply-templates/>
                <div class="cleaner">
                    <xsl:comment>~</xsl:comment>
                </div>
            </div>
        </div>
    </xsl:template>
    
</xsl:stylesheet>