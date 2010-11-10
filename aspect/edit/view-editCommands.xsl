<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" exclude-result-prefixes="ec"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:ec="http://formax.cz/ns/editCommands"
    xmlns="http://www.w3.org/1999/xhtml"
>
    <xsl:param name="data"/>
    
    <xsl:template match="/ec:editCommands">
       <form id="editButtons">
           <fieldset>
               <xsl:apply-templates select="ec:htmlCommands/*"/>
           </fieldset>
           <fieldset>
               <xsl:apply-templates select="ec:fxCommands/*"/>
           </fieldset>
       </form> 
    </xsl:template>
    
    <xsl:template match="*[parent::ec:htmlCommands]">
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
                <xsl:if test="ec:prompt">
                    <xsl:if test="not(@value)">,''</xsl:if>
                    <xsl:text>,'</xsl:text>
                    <xsl:value-of select="normalize-space(ec:prompt)"/>
                    <xsl:text>'</xsl:text>
                </xsl:if>
                <xsl:text>);</xsl:text>
            </xsl:attribute>
        </input>
    </xsl:template>
    
    <xsl:template match="*[parent::ec:fxCommands]">
        <input type="button" value="{local-name()}" onclick="{local-name()}('{$data}');"/>
    </xsl:template>

</xsl:stylesheet>
