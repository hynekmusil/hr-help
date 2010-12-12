//encoding=UTF-8
var formax = new function() {
	var uri = new function() {
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
			return uri.resolveURI(aURI, instructionURI);
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
	var sourceList = new function() {
		this.list = new Array();
		this.addDoc = function(aURI, aSend, aCallback, aPipeResult){
			var send = null;
			if(aSend != undefined) send = aSend;
			for(var i=0; i < this.list.length; i++){
				if((aURI == this.list[i].uri) && (send == this.list[i].send)) break;
			}
			if(i == this.list.length){
				this.list[i]= {"uri": aURI, "send": send, "callback": aCallback};
				if(aPipeResult == undefined) this.getDocument(i); 
				else this.getDocument(i, aPipeResult);
			}
			return i;
		},
		this.getDocument = function(aId, aPipeResult){
			var URI = this.list[aId].uri;
			var uri = URI;
			var send = this.list[aId].send;
			var callback = this.list[aId].callback;
			var http = new XMLHttpRequest(); 
			if(uri.indexOf(".php") === -1){
				if(http.overrideMimeType) http.overrideMimeType("text/xml");
				else uri = "aspect/standardsSupport/xml.php?x=" + URI;
			}
			var isAsync = false;
			var docInfo = this.list[aId];
			if(callback != undefined){
				http.onreadystatechange = function(){
					if (http.readyState == 4) {  
						if (http.status == 200) 
							if(aPipeResult == undefined) callback.call(this, docInfo);  
							else callback.call(this, docInfo, aPipeResult);
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
	}
	
	function getXSLTURI(aDocInfo){
		aDocInfo.doc = this.responseXML;
		var xsltURI = uri.getXSLTURI(aDocInfo.uri, aDocInfo.doc);
		aDocInfo.xsltDocId = sourceList.addDoc(xsltURI, null, xsltTransform, aDocInfo.doc);
	}
	
	function xsltTransform(aDocInfo, aPipeResult){
		aDocInfo.doc = this.responseXML;
		fragment = xslt.transform(aPipeResult, aDocInfo.doc);
		content.change("content", fragment);
	}
	
	sourceList.addDoc("data/page.xml", null, getXSLTURI);
};
