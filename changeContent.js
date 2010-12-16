//encoding=UTF-8
try{
var formax = new function() {
	var uriResolver = new function() {
		this.getXSLTURI = function(aURI, aDoc){
			var nodeInstruction = aDoc.firstChild;
			while(nodeInstruction.target.indexOf("stylesheet") == -1){
				nodeInstruction = nodeInstruction.nextSibling;
				if(nodeInstruction.nodeType != 7) break;
			}
			if(nodeInstruction.data == undefined) return '';
			var instructionURI = nodeInstruction.data;
			instructionURI = instructionURI.substring(instructionURI.indexOf('href')+6);
			instructionURI = instructionURI.substring(0,instructionURI.indexOf('"'));
			return uriResolver.resolveURI(aURI, instructionURI);
		};
		this.resolveURI = function(aBaseURI, aURI){
			var uriArray = aURI.split("/");
			var baseURIArray = aBaseURI.split("/");
			var countToParents = 0;
			var i = 0;
			for(i=0; i<uriArray.length; i++){
				if(uriArray[i] == '..') countToParents++;
				else break;
			}
			for(i=0; i<countToParents; i++){
				uriArray.shift();
				baseURIArray.pop();
			}
			baseURIArray.pop();
			var baseURI = baseURIArray.join("/");
			if(baseURI != "") baseURI += "/";
			return baseURI + uriArray.join("/") ;
		};
	};
	var source = new function() {
		this.list = [];
		this.getDocument = function(aURI, aSend, aCallback, aObject, aHasSave){
			if(aHasSave){
				this.list[aURI] = null;
				if(this.list[aURI]) return this.list[aURI];
			}
			var uri = aURI;
			var send = null;
			if(aSend != undefined) send = aSend;
			var http = new XMLHttpRequest(); 
			if(uri.indexOf(".php") === -1){
				if(http.overrideMimeType) http.overrideMimeType("text/xml");
				else uri = "aspect/standardsSupport/xml.php?x=" + aURI;
			}
			var isAsync = false;
			if(aCallback != undefined){
				http.onreadystatechange = function(){
					if (http.readyState == 4) {  
						if (http.status == 200) 
							if(aObject == undefined) aCallback.call(this);
							else aCallback.call(this, aObject);
						else{
							this.list[aURI] = false;
							throw "There was a problem with the request."; 
						}
					}  
				};
				isAsync = true;
			}
			http.open("POST", uri, isAsync);
			http.send(send);
			if(isAsync == false) return http.responseXML;
			return false;
		};
	};
	var xslt = new function() {
		this.procList = [];
		this.transform = function(aDataDoc, aXSLTDoc, aParams) {
			var xsltProc = new XSLTProcessor();
			xsltProc.importStylesheet(aXSLTDoc);
			for(var i=0; i < aParams.length; i++) if(aParams[i][1] == "xsltBaseURI") break;
			this.procList[aParams[i][2]] = xsltProc;
			return this.procTransform(aDataDoc, xsltProc, aParams);
		};
		this.procTransform = function(aDataDoc, aXSLTProc, aParams){
			if(aParams){
				if(aParams.constructor == Array)
					for(var i = 0; i < aParams.length; i++)
						aXSLTProc.setParameter(aParams[i][0], aParams[i][1], aParams[i][2]);
			}
			return aXSLTProc.transformToFragment(aDataDoc, document);
		}
	};
	var Content = function(aDataURI, aPlaceId, aParams){
		this.dataURI = aDataURI;
		this.dataDoc = null;
		this.templateURI = "";
		this.params = aParams;
		this.placeId = aPlaceId;
	};
	Content.prototype = {
		load: function(){
			source.getDocument(this.dataURI, null, this.getXSLTURI, this);
		},
		getXSLTURI: function(aThis){
			aThis.dataDoc = this.responseXML;
			aThis.templateURI = uriResolver.getXSLTURI(aThis.dataURI, aThis.dataDoc);
			if(source.list[aThis.templateURI] === null) alert("uz je");
			else{
				source.list[aThis.templateURI] = null;
				source.getDocument(aThis.templateURI, null, aThis.transform, aThis);
			}
		},
		transform: function(aThis){
			source.list[aThis.templateURI] = this.responseXML;
			xslt.transform(aThis.dataDoc, this.responseXML, aThis.params);
			alert("ulozena templata");
		}
	};
	var contents = new function(){
		this.change = function(aChange, aParams, aNoPublish){
			for(var i=0; i < aChange.length; i++){
				for(var cn in aChange[i]){
					if(cn != 'clone'){
						componentNode = document.getElementById(cn);
						if(!(aParams && aParams.constructor == Array)) aParams = [];
						if(componentNode){
							for(var j=0; j < aChange[i][cn].length; j++){
								var content = new Content(aChange[i][cn][j], cn, aParams);
								content.load();
							}
						}	
					}
				}
			}
		};
	};

/*
	var xslt = new function() {
		this.procList = [];
		this.transform = function(aDataDoc, aXSLTDoc, aParams) {
			var xsltProc = new XSLTProcessor();
			xsltProc.importStylesheet(aXSLTDoc);
			for(var i=0; i < aParams.length; i++) if(aParams[i][1] == "xsltBaseURI") break;
			this.procList[aParams[i][2]] = xsltProc;
			return this.procTransform(aDataDoc, xsltProc, aParams);
		};
		this.procTransform = function(aDataDoc, aXSLTProc, aParams){
			if(aParams){
				if(aParams.constructor == Array)
					for(var i = 0; i < aParams.length; i++)
						aXSLTProc.setParameter(aParams[i][0], aParams[i][1], aParams[i][2]);
			}
			return aXSLTProc.transformToFragment(aDataDoc, document);
		}
	};
	var contents = new function(){
		this.changeById = function(aId, aFragment){
			alert("contents "+ aId);
			var result = null;
			var insertMethod = "append";
			var componentNode = document.getElementById(aId);
			if(componentNode){
				if(componentNode.nodeName == "HR") insertMethod = "before";
				else insertMethod = "append";
				for(var k = 0; k < aFragment.childNodes.length; k++){
					if(aFragment.childNodes.item(k).nodeType == 8 && (aFragment.childNodes.item(k).data.indexOf("f-result") === 0)){
						result = eval(aFragment.childNodes.item(k).data.substring(9));
					}
				}
				if(insertMethod == "append") componentNode.appendChild(fragment);
				else componentNode.parentNode.insertBefore(fragment, componentNode);
			}
		};
		this.change = function(aChange, aParams, aNoPublish){
			for(var i=0; i < aChange.length; i++){
				for(var cn in aChange[i]){
					if(cn != 'clone'){
						componentNode = document.getElementById(cn);
						if(!(aParams && aParams.constructor == Array)) aParams = [];
						if(componentNode){
							for(var j=0; j < aChange[i][cn].length; j++){
								alert(j+" "+aChange[i][cn].length);
								var params = [["","componentId", cn],["","baseURI", aChange[i][cn][j]]].concat(aParams);
								source.getDocument(aChange[i][cn][j], null, contents.getXSLTURI, params);
							}
						}	
					}
				}
			}
		};
		this.getXSLTURI = function(aCallBackParams){		
			for(var i=0; i < aCallBackParams.length; i++) if(aCallBackParams[i][1] == "baseURI") break;
			var xsltURI = uriResolver.getXSLTURI(aCallBackParams[i][2], this.responseXML);
			var params = [["","xsltBaseURI", xsltURI]].concat(aCallBackParams);
			alert("getXSLTURI ");
			if(source.list[xsltURI] === null) {
				var start = null;
				var now = null;
				var i = 0;
				while(xslt.procList[xsltURI] != undefined){
					start = new Date();
					do {now = new Date(); } 
					while(now-start < 10);
					if(i > 200) throw "too long waiting for the xslt processor";
					i++;
				}
				if(xslt.procList[xsltURI].constructor == XSLTProcessor){
					fragment = xslt.procTransform(this.responseXML, xslt.procList[xsltURI], params);
					for(var i=0; i < aCallBackParams.length; i++) if(aCallBackParams[i][1] == "componentId") break;
					alert("getXSLTURI "+ aCallBackParams[i][1][2]);
					contents.changeById(aCallBackParams[i][1][2], fragment);
				} else throw "bad xslt processor";
			} else source.getDocument(xsltURI, null, contents.xsltTransform, [this.responseXML, params], true);
		};
		this.xsltTransform = function(aCallBackParams){
			for(var i=0; i < aCallBackParams[1].length; i++) if(aCallBackParams[1][i][1] == "xsltBaseURI") break;
			source.list[aCallBackParams[1][i][2]] = this.responseXML;
			for(var i=0; i < aCallBackParams[1].length; i++) if(aCallBackParams[1][i][1] == "componentId") break;
			var componentId = aCallBackParams[1][i][2];
			fragment = xslt.transform(aCallBackParams[0], this.responseXML, aCallBackParams[1]);
			alert("xsltTransform " + componentId);
			contents.changeById(componentId, fragment);
		}
	};*/
	
	
	
	window.onload = function(){
		contents.change([{"maincol":["data/article-aktualne.xml","data/article-jak_zacit.xml","data/article-aktualne.xml"]}]);
	}
};
}catch(e) {alert(e);}