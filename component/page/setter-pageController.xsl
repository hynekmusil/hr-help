<xsl:stylesheet version="1.0" exclude-result-prefixes="sc"
    xmlns:sc="http://www.w3.org/2005/07/scxml"
    xmlns="http://www.w3.org/2005/07/scxml"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
>
    <xsl:output method="xml" indent="yes"/>
    
    <xsl:param name="onentry"/>
    <xsl:param name="stateId"/>
    <xsl:param name="newStateId"/>
    <xsl:param name="operation">change</xsl:param>
    
    <xsl:template match="sc:state">
        <xsl:choose>
            <xsl:when test="@id = $stateId">
                <xsl:choose>
                    <xsl:when test="$operation = 'change'">
                        <xsl:apply-templates select="." mode="change"/>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:apply-templates select="." mode="append"/>
                    </xsl:otherwise>
                </xsl:choose> 
            </xsl:when>
            <xsl:otherwise>
                <xsl:call-template name="copy"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
    <xsl:template match="sc:state" mode="change">
       <xsl:copy>
           <xsl:copy-of select="@*"/>
           <xsl:apply-templates select="sc:onentry" mode="change"/>
           <xsl:apply-templates select="*[local-name() != 'onentry']"/>
       </xsl:copy> 
    </xsl:template>
    
    <xsl:template match="sc:onentry" mode="change">
        <onentry>
            <script>
                <xsl:value-of select="concat('changeContent(',$onentry,');')"/>
            </script>
        </onentry>
    </xsl:template>
    
    <xsl:template match="sc:state" mode="append">
        <xsl:copy>
            <xsl:copy-of select="@*"/>
            <xsl:copy-of select="*[local-name() != 'transition']"/>
            <xsl:if test="$newStateId != ''">
                <state id="{$newStateId}">
                    <onentry>
                        <script>
                            <xsl:value-of select="concat('changeContent(',$onentry,');')"/>
                        </script>
                    </onentry>
                </state>
                <transition event="{$newStateId}" target="{$newStateId}">
                    <script>changeMenu(_data.mainMenu);</script>
                </transition>
            </xsl:if>
            <xsl:copy-of select="sc:transition"/>
        </xsl:copy>
    </xsl:template>  
    
    <xsl:template name="copy">
        <xsl:copy>
            <xsl:apply-templates select="@*"/>
            <xsl:apply-templates/>
        </xsl:copy>    
    </xsl:template>
    
    <xsl:template match="*">
        <xsl:call-template name="copy"/>
    </xsl:template>
    
    <xsl:template match="@*">
        <xsl:copy/>
    </xsl:template>
    
    <xsl:template match="text()[normalize-space() = '']"/>
    
    <xsl:template match="text()">
        <xsl:value-of select="normalize-space()"/>
    </xsl:template>
    
</xsl:stylesheet>
