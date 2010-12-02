<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" exclude-result-prefixes="m"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:m="http://formax.cz/ns/menu"
    xmlns="http://www.w3.org/1999/xhtml"
>
    <xsl:template match="m:item">
        <script type="text/javascript" src="aspect/jquery/jquery.tools.min.js">
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
        </script>
        <form id="pageProperties" name="pageProperties">
            <input name="itemName" value="{normalize-space(text())}" type="hidden"/>
            <input name="itemId" value="t1" type="hidden"/>
            <input name="operation" value="change" type="hidden"/>
            <table>
                <tr>
                    <th>uri</th>
                    <td>
                        <input type="text" pattern="^([a-zA-Z0-9\-_]+\/?)*(\.html)?$" name="uri" value="{@href}" required="required"/>
                    </td>
                </tr>
                <tr>
                    <th>title</th>
                    <td>
                        <input type="text" name="title" value="{m:title}"/>
                    </td>
                </tr>
                <tr>
                    <td><button type="submit">Odeslat</button></td>
                    <td><button type="reset">Reset</button></td>
                </tr>
            </table>
        </form>
    </xsl:template>
</xsl:stylesheet>