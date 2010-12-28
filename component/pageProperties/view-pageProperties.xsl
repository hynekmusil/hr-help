<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" exclude-result-prefixes="pp"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:pp="http://formax.cz/ns/pageProperties"
    xmlns="http://www.w3.org/1999/xhtml"
>
    <xsl:template match="pp:pageProperties">
        <div>
            <form id="pageProperties" name="pageProperties">
                <input name="itemName" value="{normalize-space(text()[1])}" type="hidden"/>
                <input name="itemId" value="{@xml:id}" type="hidden"/>
                <table>
                    <xsl:apply-templates select="pp:uri | pp:title"/>
                    <tr>
                        <th colspan="3">zobrazí komponentu:</th>
                    </tr>
                    <tr>
                        <th>místo</th><th>data</th>
                    </tr>
                    <xsl:apply-templates select="pp:onentry/*"/>
                    <tr id="f-addonentry">
                        <td colspan="3">
                            <input type="text" name="newArticle" value="article-new.xml"/>
                            <button type="button" onclick="addNewArticle()">vytvořit článek</button>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3"><button type="button" onclick="sendPP()">Odeslat</button></td>
                    </tr>
                </table>
            </form>
        </div>
    </xsl:template>
    
    <xsl:template match="*[parent::pp:onentry]">
        <xsl:variable name="order" select="count(preceding-sibling::*)"/>
        <tr id="f-onentry{$order}">
            <td>
                <select name="place{$order}" onblur="modifyPP('change','{$order}')">
                    <xsl:apply-templates select="../../pp:place" mode="option">
                        <xsl:with-param name="selected" select="local-name()"/>
                    </xsl:apply-templates>
                </select> 
            </td>
            <td>
                <xsl:if test="count(../*) = 1">
                    <xsl:attribute name="colspan">2</xsl:attribute>
                </xsl:if>
                <select name="dataURI{$order}" onblur="modifyPP('change','{$order}')">
                    <xsl:apply-templates select="../../pp:data" mode="option">
                        <xsl:with-param name="selected">
                            <xsl:choose>
                                <xsl:when test="../../pp:data[@id = current()/@value]">
                                    <xsl:value-of select="@value"/>
                                </xsl:when>
                                <xsl:otherwise>
                                    <xsl:value-of select="../../pp:data[1]/@id"/>
                                </xsl:otherwise>
                            </xsl:choose>
                        </xsl:with-param>
                    </xsl:apply-templates>
                </select>
            </td>
            <xsl:if test="count(../*) > 1">
                <td><button type="button" onclick="modifyPP('removeComponent','{$order}')">Odebrat</button></td>
            </xsl:if>
        </tr>
    </xsl:template>
    
    <xsl:template match="*" mode="option">
        <xsl:param name="selected">maincol</xsl:param>
        <option value="{@id}">
            <xsl:if test="$selected = @id">
                <xsl:attribute name="selected">selected</xsl:attribute>
            </xsl:if>
            <xsl:choose>
                <xsl:when test="normalize-space() != ''"><xsl:value-of select="."/></xsl:when>
                <xsl:otherwise><xsl:value-of select="@id"/></xsl:otherwise>
            </xsl:choose>
        </option>
    </xsl:template>
    
    <xsl:template match="*">
        <tr>
            <th><xsl:value-of select="local-name()"/></th>
            <td colspan="2">
                <input type="text" name="{local-name()}" value="{@value}" onblur="modifyPP('change')">
                    <xsl:apply-templates select="." mode="pattern"/>
                </input>
            </td>
        </tr>
    </xsl:template>
    
    <xsl:template match="*" mode="pattern"/>
</xsl:stylesheet>