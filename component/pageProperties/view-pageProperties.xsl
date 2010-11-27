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
				alert(form.serialize());
		    });
        </script>
        <form id="pageProperties">
            <table>
                <tr>
                    <th>uri</th>
                    <td>
                        <input type="url" name="url" value="{@href}" required="required"/>
                    </td>
                </tr>
                <tr>
                    <th>title</th>
                    <td>
                        <input type="text" name="url" value="{m:title}"/>
                    </td>
                </tr>
                <tr>
                    <td><button type="submit">Submit form</button></td>
                    <td><button type="reset">Reset</button></td>
                </tr>
            </table>
        </form>
    </xsl:template>
</xsl:stylesheet>