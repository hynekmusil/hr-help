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
				refreshData(currComponentInfo, null, params);
				return false;
		    });
		    var ppModifier = {};
		    function modifyPP(){
		      
		    }
		    function addPP(){
		      alert(document.pageProperties.newPlace.value + " " + document.pageProperties.newDataURI.value);
		    }
		    function removePP(aId){
		      alert(aId);
		    }
        </script>
        <form id="pageProperties" name="pageProperties">
            <input name="itemName" value="{normalize-space(text())}" type="hidden"/>
            <input name="itemId" value="t1" type="hidden"/>
            <input name="operation" value="change" type="hidden"/>
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
                            <option value="maincol" selected="selected">maincol</option>
                            <option value="leftcol">leftcol</option>
                        </select>
                    </td>
                    <td>
                        <input id="newDataURI" name="newDataURI" value="data/.xml" pattern="^(data\/[a-zA-Z0-9\-_]+)(\.xml)?$"/>
                    </td>
                    <td>
                        <button type="button" onclick="addPP()">Přidat komponentu</button>
                    </td>
                </tr>
                <tr>
                    <td><button type="submit">Odeslat</button></td>
                    <td><button type="reset">Reset</button></td>
                </tr>
            </table>
        </form>
    </xsl:template>
    
    <xsl:template match="*">
        <tr>
            <th><xsl:value-of select="local-name()"/></th>
            <td>
                <xsl:if test="not(parent::pp:onentry)">
                    <xsl:attribute name="colspan">2</xsl:attribute>
                </xsl:if>
                <input type="text" name="{local-name()}" value="{@value}">
                    <xsl:attribute name="pattern">
                        <xsl:apply-templates select="." mode="pattern"/>
                    </xsl:attribute>
                </input>
            </td>
            <xsl:if test="parent::pp:onentry">
            <td><button type="button" onclick="removePP('{count(preceding-sibling::*)}')">Odebrat</button></td>
            </xsl:if>
        </tr>
    </xsl:template>
    
    <xsl:template match="pp:uri" mode="pattern">^([a-zA-Z0-9\-_]+\/?)*(\.html)?$</xsl:template>
    <xsl:template match="pp:title" mode="pattern"/>
</xsl:stylesheet>