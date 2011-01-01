<xsl:stylesheet version="1.0" exclude-result-prefixes="sc" extension-element-prefixes="s"
    xmlns:sc="http://www.w3.org/2005/07/scxml"
    xmlns="http://www.w3.org/2005/07/scxml"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:s="http://exslt.org/strings"
>
    <xsl:output method="xml" indent="yes"/>
    
    <xsl:param name="onentry"/>
    <xsl:param name="stateId"/>
    <xsl:param name="newStateId"/>
    <xsl:param name="operation">change</xsl:param>
    <xsl:variable name="repairedNewStateId">
        <xsl:call-template name="id">
            <xsl:with-param name="uri" select="$newStateId"/>
        </xsl:call-template>
    </xsl:variable>
    
    <xsl:template name="id">
        <xsl:param name="uri"/>
        <xsl:variable name="smallcase" select="'abcdefghijklmnopqrstuvwxyz'" />
        <xsl:variable name="uppercase" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'" />
        
        <xsl:for-each select="s:tokenize($uri,'/')">
            <xsl:choose>
                <xsl:when test="position() != 1">
                    <xsl:value-of select="concat(
                        translate(substring(.,1,1),$smallcase, $uppercase),
                        substring(.,2))"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="."/> 
                </xsl:otherwise>
            </xsl:choose>
        </xsl:for-each>
    </xsl:template>
    
    <xsl:template match="sc:state">
        <xsl:choose>
            <xsl:when test="@id = $stateId">
                <xsl:choose>
                    <xsl:when test="$operation = 'change'">
                        <xsl:apply-templates select="." mode="change"/>
                    </xsl:when>
                    <xsl:when test="$operation = 'remove'"/>
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
    
    <xsl:template match="sc:transition">
        <xsl:choose>
            <xsl:when test="$operation = 'remove' and @event = $stateId"/>
            <xsl:when test="$operation = 'change' and @event = $stateId">
                <transition event="{$repairedNewStateId}" target="{$repairedNewStateId}">
                    <xsl:copy-of select="*"/>
                </transition>
            </xsl:when>
            <xsl:otherwise>
                <xsl:copy-of select="."/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
    <xsl:template match="sc:state" mode="change">
       <xsl:copy>
           <xsl:copy-of select="@*[name() != 'id']"/>
           <xsl:attribute name="id">
               <xsl:value-of select="$repairedNewStateId"/>
           </xsl:attribute>
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
            <xsl:if test="$repairedNewStateId != ''">
                <state id="{$repairedNewStateId}">
                    <onentry>
                        <script>
                            <xsl:value-of select="concat('changeContent(',$onentry,');')"/>
                        </script>
                    </onentry>
                </state>
                <transition event="{$repairedNewStateId}" target="{$repairedNewStateId}">
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
