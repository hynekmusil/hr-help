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
		this.getDocument = function(aURI, aSend, aCallback, aCallbackParams){
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
							else if(aCallbackParams.constructor == Array) callback.apply(this, aCallbackParams);
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
		this.transform = function(aDataDoc, aXSLTDoc, aParams) {
			var xsltProc = new XSLTProcessor();
			xsltProc.importStylesheet(aXSLTDoc);
			if(aParams){
				if(aParams.constructor == Array)
					for(var i = 0; i < aParams.length; i++)
						xsltProc.setParameter(aParams[i][0], aParams[i][1], aParams[i][2]);
			}
			return xsltProc.transformToFragment(aDataDoc, document);
		}
	};
	var content = new function(){
		this.change = function(aId, aFragment){
			var result = null;
			var insertMethod = "append";
			var componentNode = document.getElementById(aId);
			if(componentNode){
				if(componentNode.nodeName == "HR") insertMethod = "before";
				else insertMethod = "append";
				if(insertMethod == "append") componentNode.innerHTML = "";
				for(var k = 0; k < aFragment.childNodes.length; k++){
					if(aFragment.childNodes.item(k).nodeType == 8 && (aFragment.childNodes.item(k).data.indexOf("f-result") === 0)){
						result = eval(aFragment.childNodes.item(k).data.substring(9));
					}
				}
				if(insertMethod == "append") componentNode.appendChild(fragment);
				else componentNode.parentNode.insertBefore(fragment, componentNode);
			}
		}
	};
	
	var dataURI = "data/page.xml";
	source.getDocument(dataURI, null, getXSLTURI);
	
	function getXSLTURI(){
		var xsltURI = uriResolver.getXSLTURI(dataURI, this.responseXML);
		source.getDocument(xsltURI, null, xsltTransform, this.responseXML);
	}
	
	function xsltTransform(aDocunent){
		fragment = xslt.transform(aDocunent, this.responseXML);
		content.change("content", fragment);
	}
	
};
