//encoding=UTF-8

/*@cc_on
(function(f){
 window.setTimeout =f(window.setTimeout);
 window.setInterval =f(window.setInterval);
})(function(f){return function(c,t){var a=[].slice.call(arguments,2);return f(function(){c.apply(this,a)},t)}});
@*/

try{
var formax = new function() {
	var threadId = 0;
	var startProc = null;
	var nowProc = null;
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
		this.getProc = function(aXSLTDoc){
			var xsltProc = new XSLTProcessor();
			xsltProc.importStylesheet(aXSLTDoc);
			return xsltProc;
		};
		this.transform = function(aDataDoc, aXSLTProc, aParams){
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
		this.xsltProc = null;
		this.params = aParams;
		this.placeId = aPlaceId;
		this.threadId = "";
	};
	Content.prototype = {
		load: function(aThis, aThreadId){
			var newEl = document.createElement("div");
			aThis.threadId = "thread" + aThreadId;
			newEl.id = aThis.threadId;
			newEl.style.cssFloat = "left";
			newEl.style.width = "25%";
			var el = document.getElementById("process");
			el.parentNode.insertBefore(newEl, el);
			source.getDocument(aThis.dataURI, null, aThis.loadData, aThis);
		},
		loadData: function(aThis){
			source.list[aThis.dataURI] =  this.responseXML;
			aThis.dataDoc = source.list[aThis.dataURI];
			aThis.templateURI = uriResolver.getXSLTURI(aThis.dataURI, aThis.dataDoc);
			if(source.list[aThis.templateURI] === null){
				var time = new Date() - startProc;
				document.getElementById(aThis.threadId).innerHTML += "<b style=\"color: red;\">" + time + "</b> loading of template " + aThis.templateURI + " was already initiated <br/>";
				aThis.saveReturnedFragment(aThis);
			} else{
				var time = new Date() - startProc;
				document.getElementById(aThis.threadId).innerHTML += "<b style=\"color: red;\">" + time + "</b> loading of template "+ aThis.templateURI + " is initiated <br/>";
				source.list[aThis.templateURI] = null;
				source.getDocument(aThis.templateURI, null, aThis.loadFragment, aThis);
			}
		},
		loadFragment: function(aThis){
			source.list[aThis.templateURI] = xslt.getProc(this.responseXML);
			var time = new Date() - startProc;
			document.getElementById(aThis.threadId).innerHTML += "<b style=\"color: red;\">" + time + "</b> xslt processor for: "+ aThis.templateURI + "  was loaded<br/>";
			aThis.xsltProc = source.list[aThis.templateURI];
			var fragment = xslt.transform(aThis.dataDoc, aThis.xsltProc, aThis.params);
			aThis.saveFragment(fragment);
		},
		saveReturnedFragment: function(aThis, aThreadId){
			var start = null;
			var now = null;
			var i = 0;
			var waiting = setInterval(function(){
				if(source.list[aThis.templateURI].constructor == XSLTProcessor){
					clearInterval(waiting);
					aThis.xsltProc = source.list[aThis.templateURI];
					var time = new Date() - startProc;
					document.getElementById(aThis.threadId).innerHTML += "<b style=\"color: red;\">" + time + "</b> xslt processor for: "+ aThis.templateURI + "  is available<br/>"
					var fragment = xslt.transform(aThis.dataDoc, aThis.xsltProc, aThis.params);
					aThis.saveFragment(fragment);
				}
				var time = new Date() - startProc;
				document.getElementById(aThis.threadId).innerHTML += "<b style=\"color: red;\">" + time + "</b> waiting on load xslt processor for: "+ aThis.templateURI + " " + i + "<br/>";
			},10);
		},
		saveFragment: function(aFragment){
			var componentNode = document.getElementById(this.placeId);
			if(componentNode){
				var insertMethod = "";
				if(componentNode.nodeName == "HR") insertMethod = "before";
				else insertMethod = "append";
				for(var k = 0; k < aFragment.childNodes.length; k++){
					if(aFragment.childNodes.item(k).nodeType == 8 && (aFragment.childNodes.item(k).data.indexOf("f-result") === 0)){
						eval(aFragment.childNodes.item(k).data.substring(9));
					}
				}
				if(insertMethod == "append") {
					componentNode.appendChild(aFragment);
					var time = new Date() - startProc;
					document.getElementById(this.threadId).innerHTML += "<b style=\"color: red;\">" + time + "</b> fragment for: "+ this.dataURI +" was <b>appended into</b> element with id <b>" + this.placeId + "</b><br/>";
				}
				else{
					componentNode.parentNode.insertBefore(aFragment, componentNode);
					var time = new Date() - startProc;
					document.getElementById(this.threadId).innerHTML += "<b style=\"color: red;\">" + time + "</b> fragment for: "+ this.dataURI +" was <b>inserted before</b> element with  id <b>" + this.placeId + "</b><br/>";
				}
			}
			else {
				var time = new Date() - startProc;
				document.getElementById(this.threadId).innerHTML += "<b style=\"color: red;\">" + time + "</b> fragment for: "+ this.dataURI +" was not inserted<br/>";
			}
		}
	};
	var contents = new function(){
		this.change = function(aChange, aParams, aNoPublish){
			for(var i=0; i < aChange.length; i++){
				for(var cn in aChange[i]){
					if(cn != 'clone'){
						if(!(aParams && aParams.constructor == Array)) aParams = [];
						for(var j=0; j < aChange[i][cn].length; j++){
							var content = new Content(aChange[i][cn][j], cn, aParams);
							threadStart(content.load, content);
						}	
					}
				}
			}
		};
	};
	
	window.onload = function(){
		startProc = new Date();
		contents.change([{"leftcol":["data/article-aktualne.xml"]},{"maincol":["data/article-jak_zacit.xml","data/article-aktualne.xml"]}]);
	}
	
	function threadStart(aCallback, aObject){
		setTimeout(aCallback, 0, aObject, threadId);
		threadId++;
		return true;
	}
};
}catch(e) {alert(e);}