/* Zdroje xml dokumentu a xslt procesoru */
function SourceList(){}
SourceList.prototype = {
	list: new Array(),
	addXSLTProc: function(aURI){
		var xsltProc = new XSLTProcessor();
		xsltProc.importStylesheet(getSource(aXSLTURI));
		xsltProcCache[aXSLTURI] = xsltProc;
		return xsltProc;
	},
	getXSLTProc: function(aURI){
		if(this.list[aURI] != undefined){
			if(this.list[aURI].constructor == XSLTProcessor)
				return this.list[aURI];
			return null;
		}
		return addXSLTProc(aURI);
	},
	getDocument(aURI, aSend, callback){
		var http = new XMLHttpRequest(); 
		var uri = aUri;
		var send = null;
		if(aSend != undefined) send = aSend;
		if(uri.indexOf(".php") === -1){
			if (http.overrideMimeType) http.overrideMimeType('text/xml');
			else uri = "aspect/standardsSupport/xml.php?x="+aUri;
		}
		var isAsync = false;
		if(callback != undefined){
			httpRequest.onreadystatechange = callback();
			isAsync = true;
		}
		http.open("POST", uri, isAsync);
		http.send(send);
		if(isAsync == false) return http.responseXML;
		return null;
	},
	loadingDocument
	add: function(aURI, aObject){
		this.list[aURI] = aObject;
		return aObject;
	}
}

function XMLProcessor(){}
XMLProcessor.prototype = {
	getProcessingURI: function(aProc, aDataURI, aDataDoc){
		var nodeInstruction = aDataDoc.firstChild;
		while(nodeInstruction.target.indexOf(aProc) == -1){
			nodeInstruction = nodeInstruction.nextSibling;
			if(nodeInstruction.nodeType != 7) break;
		}
		if(nodeInstruction.data == undefined) return '';
		var styleInstruction = nodeInstruction.data;
		styleInstruction = styleInstruction.substring(styleInstruction.indexOf('href')+6);
		styleInstruction = styleInstruction.substring(0,styleInstruction.indexOf('"'));
		return resolveURI(aDataURI, styleInstruction);
	}
}

function XSLTransformer(){}
XSLTransformer.prototype = {
	exec: function(aDataURI, aDataDoc, aParams)
	{
		var dataDoc = null;
		if(aDataDoc == undefined)
			dataDoc = getSource(aDataURI);
		else
			dataDoc = aDataDoc;
		return xslt(dataDoc, this._getXSLTURI(aDataURI, dataDoc), aParams);
	},
	_getXSLTURI: function(aDataURI, aDataDoc)
	{
		var xmlProc = new XMLProcessor();
		return xmlProc.getProcessingURI("stylesheet", aDataURI, aDataDoc);
	},
	function xslt(aDataDoc, aXSLTURI, aParams){
		var xsltProc = null;
		if(xsltProcCache[aXSLTURI] != undefined){
			if(xsltProcCache[aXSLTURI].constructor == XSLTProcessor){
				xsltProc = xsltProcCache[aXSLTURI];
			}
			else xsltProc = null;
		}
		if(xsltProc == null){
			xsltProc = addToXSLTProcCache(aXSLTURI);
		}
		if(aParams){
			if(aParams.constructor == Array){
				for(var i = 0; i < aParams.length; i++){
					xsltProc.setParameter(aParams[i][0], aParams[i][1], aParams[i][2]);
				}
			}
		}
		return xsltProc.transformToFragment(aDataDoc, document);
}
}

function changeContent(aChange, aParams){
	var result = null;
	var insertMethod = "append";
	var componentNode = null;
	for(var i=0; i < aChange.length; i++){
		for(var cn in aChange[i]){
			if(cn != 'clone'){
				componentNode = document.getElementById(cn);
				if(componentNode){
					if(componentNode.nodeName == "HR") insertMethod = "before";
					else insertMethod = "append";
					if(insertMethod == "append") componentNode.innerHTML = "";
					for(var j=0; j < aChange[i][cn].length; j++){
						var transformResult = xsltTransform(aChange[i][cn][j], aParams);
						var fragment = transformResult.fragment;
						for(var k = 0; k < fragment.childNodes.length; k++){
							if(fragment.childNodes.item(k).nodeType == 8 && (fragment.childNodes.item(k).data.indexOf("f-result") === 0)){
								result = eval(fragment.childNodes.item(k).data.substring(9));
							}
						if(insertMethod == "append") componentNode.appendChild(fragment);
						else componentNode.parentNode.insertBefore(fragment, componentNode);
					}
				}
			}
		}
	}
	return result;
}

function xsltTransform(aDataURI, aDataDoc, aParams){
	var dataDoc = null;
	if(aDataDoc == undefined){
		dataDoc = getSource(aDataURI);
	} else {
		dataDoc = aDataDoc;
	}
	var xsltURI = getXSLTURI(aDataURI,dataDoc);
	return xslt(dataDoc, xsltURI, aParams);
}
