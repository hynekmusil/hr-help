<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" exclude-result-prefixes="mc"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:mc="http://formax.cz/ns/menuCmds"
    xmlns="http://www.w3.org/1999/xhtml"
>
    <xsl:param name="data"/>
    <xsl:output encoding="UTF-8"/>
    
    <xsl:template match="mc:menuCmds">
       <form id="f-editButtons">
           <xsl:apply-templates select="*[not(self::mc:field)]"/>
       </form>
       <xsl:apply-templates select="mc:field"/>
    </xsl:template>
    
    <xsl:template match="mc:field">
        <div id="{@xml:id}">
            <xsl:text> </xsl:text>
        </div>
    </xsl:template>
    
    <xsl:template match="*">
        <input type="button" class="{local-name()}" value="{.}" onclick="fxEditCmd('{local-name()}','{$data}');"/>
    </xsl:template>

</xsl:stylesheet>
