<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" exclude-result-prefixes="pp"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:pp="http://formax.cz/ns/pageProperties"
    xmlns="http://www.w3.org/1999/xhtml"
>
    <xsl:template match="pp:pageProperties">
        <script type="text/javascript" src="component/pageProperties/jquery.tools.min.js">
            <xsl:text> </xsl:text>
        </script>
        <script type="text/javascript">
            $.tools.validator.localize("cz", {
                '*': 'Prosím, zadejte správnou hodnotu.',
	            ':url': 'Prosím, zadejte validní URI.',
	            '[required]': 'Prosím, vyplňte povinnou položku.'
            });
            $("#pageProperties").validator({lang:"cz"}).submit(function(e){
		        var form = $(this);
		        var params = form.serialize();
		        alert(params);
				refreshData(currComponentInfo, null, params);
				return false;
		    });
		    var ppModifier = {};
        </script>
        <form id="pageProperties" name="pageProperties">
            <input name="itemName" value="{normalize-space(text()[1])}" type="hidden"/>
            <input name="itemId" value="{@xml:id}" type="hidden"/>
            <input name="operation" value="{@operation}" type="hidden"/>
            <table>
                <xsl:apply-templates select="pp:uri | pp:title"/>
                <tr>
                    <th colspan="2">zobrazí komponentu:</th>
                </tr>
                <tr>
                    <th>místo</th><th>data</th>
                </tr>
                <xsl:apply-templates select="pp:onentry/*"/>
                <tr>
                    <td>
                        <select name="newPlace">
                            <xsl:apply-templates select="pp:place"/>
                        </select>
                    </td>
                    <td>
                        <input id="newDataURI" name="newDataURI" value="data/.xml"/>
                    </td>
                    <td>
                        <button type="button" onclick="modifyPP()">Přidat</button>
                    </td>
                </tr>
                <tr>
                    <td><button type="submit">Odeslat</button></td>
                    <td><button type="reset">Reset</button></td>
                </tr>
            </table>
        </form>
    </xsl:template>
    
    <xsl:template match="*[parent::pp:onentry]">
        <xsl:variable name="order" select="count(preceding-sibling::*)"/>
        <tr>
        <td>
            <select name="place{$order}">
                <xsl:apply-templates select="../../pp:place">
                    <xsl:with-param name="selected" select="local-name()"/>
                </xsl:apply-templates>
            </select> 
        </td>
        <td>
            <input type="text" name="dataURI{$order}" value="{@value}">
                <xsl:apply-templates select="." mode="pattern"/>
            </input> 
        </td>
        <td><button type="button" onclick="modifyPP('{$order}')">Odebrat</button></td>
        </tr>
    </xsl:template>
    
    <xsl:template match="pp:place">
        <xsl:param name="selected">maincol</xsl:param>
        <option value="{@id}">
            <xsl:if test="$selected = @id">
                <xsl:attribute name="selected">selected</xsl:attribute>
            </xsl:if>
            <xsl:value-of select="."/>
        </option>
    </xsl:template>
    
    <xsl:template match="*">
        <tr>
            <th><xsl:value-of select="local-name()"/></th>
            <td colspan="2">
                <input type="text" name="{local-name()}" value="{@value}">
                    <xsl:apply-templates select="." mode="pattern"/>
                </input>
            </td>
        </tr>
    </xsl:template>
    
    <xsl:template match="pp:uri" mode="pattern">
        <xsl:attribute name="pattern">^([a-zA-Z0-9\-_]+\/?)*(\.html)?$</xsl:attribute>
    </xsl:template>
    <xsl:template match="*[parent::pp:onentry]" mode="pattern">
        <xsl:attribute name="pattern">^(data\/[a-zA-Z0-9\-_]+)(\.xml)?$</xsl:attribute>
    </xsl:template>
    <xsl:template match="*" mode="pattern"/>
</xsl:stylesheet>