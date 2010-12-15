//encoding=UTF-8
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
		this.getDocument = function(aURI, aSend, aCallback, aCallbackParams, aHasSave){
			if(aHasSave){
				if(this.list[aURI]) {
					alert("* davam z chache "+ aURI);
					return this.list[aURI];
				}
				else alert("* neni v chache "+ aURI);
			}
			var uri = aURI;
			var send = null;
			if(aSend != undefined) send = aSend;
			var callback = aCallback;
			var http = new XMLHttpRequest(); 
			if(uri.indexOf(".php") === -1){
				if(http.overrideMimeType) http.overrideMimeType("text/xml");
				else uri = "aspect/standardsSupport/xml.php?x=" + aURI;
			}
			var isAsync = false;
			if(callback != undefined){
				http.onreadystatechange = function(){
					if (http.readyState == 4) {  
						if (http.status == 200) 
							if(aCallbackParams == undefined) callback.call(this);
							else callback.call(this, aCallbackParams);
						else alert('There was a problem with the request.');  
					}  
				};
				isAsync = true;
			}
			http.open("POST", uri, isAsync);
			http.send(send);
			if(isAsync == false) return http.responseXML;
			return null;
		};
	};
	var xslt = new function() {
		var xsltProcList = [];
		this.transform = function(aDataDoc, aXSLTDoc, aParams) {
			var xsltProc = new XSLTProcessor();
			xsltProc.importStylesheet(aXSLTDoc);
			if(aParams){
				if(aParams.constructor == Array)
					for(var i = 0; i < aParams.length; i++)
						xsltProc.setParameter(aParams[i][0], aParams[i][1], aParams[i][2]);
			}
			return xsltProc.transformToFragment(aDataDoc, document);
		};
	};
	var contents = new function(){
		this.changeById = function(aId, aFragment){
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
			if(source.list[xsltURI]) {
				alert("je tam " + xsltURI);
			} else {
				var params = [["","xsltBaseURI", xsltURI]].concat(aCallBackParams);
				alert("neni tam " + xsltURI);
				source.getDocument(xsltURI, null, contents.xsltTransform, [this.responseXML, params], true);
			}
		};
		this.xsltTransform = function(aCallBackParams){
			for(var i=0; i < aCallBackParams[1].length; i++) if(aCallBackParams[1][i][1] == "xsltBaseURI") break;
			
			source.list[aCallBackParams[1][i][2]] = this.responseXML;
			for(var i=0; i < aCallBackParams[1].length; i++) if(aCallBackParams[1][i][1] == "componentId") break;
			var componentId = aCallBackParams[1][i][2];
			fragment = xslt.transform(aCallBackParams[0], this.responseXML, aCallBackParams[1]);
			contents.changeById(componentId, fragment);
		}
		
	};
	
	window.onload = function(){
		contents.change([{"maincol":["data/article-aktualne.xml","data/article-jak_zacit.xml","data/article-aktualne.xml"]}]);
	}
};