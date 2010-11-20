<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" exclude-result-prefixes="ac"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:ac="http://formax.cz/ns/articleCmds"
    xmlns="http://www.w3.org/1999/xhtml"
>
    <xsl:param name="data"/>
    <xsl:output encoding="UTF-8"/>
    
    <xsl:template match="/ac:articleCmds">
       <form id="f-editButtons">
           <fieldset>
               <xsl:apply-templates select="ac:fxCmds/*"/>
           </fieldset>
       </form> 
    </xsl:template>
    
    <xsl:template match="*[parent::ac:htmlCmds]">
        <input type="button" value="{local-name()}">
            <xsl:attribute name="onclick">
                <xsl:text>htmlEditCmd('</xsl:text>
                <xsl:value-of select="local-name()"/>
                <xsl:text>'</xsl:text>
                <xsl:if test="@value">
                    <xsl:text>,'</xsl:text>
                    <xsl:value-of select="@value"/>
                    <xsl:text>'</xsl:text>
                </xsl:if>
                <xsl:if test="ac:prompt">
                    <xsl:if test="not(@value)">,''</xsl:if>
                    <xsl:text>,'</xsl:text>
                    <xsl:value-of select="normalize-space(ac:prompt)"/>
                    <xsl:text>'</xsl:text>
                </xsl:if>
                <xsl:text>);</xsl:text>
            </xsl:attribute>
        </input>
    </xsl:template>
    
    <xsl:template match="*[parent::ac:fxCmds]">
        <input type="button" value="{local-name()}" onclick="{local-name()}('{$data}');"/>
    </xsl:template>

</xsl:stylesheet>
