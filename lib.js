var menuDoc = null;
var menuProc = null;
var menuUri = 'component/menu/controller-menu.xsl';
var menuNode = null;
var stateIds = '';
var stateShot = new Object;
//var stateShotHTML = '';

var presentationCache = new Array();
var xsltProcCache = new Array();

window.onload = function(){
	try{
		menuProc = new XSLTProcessor();
		menuProc.importStylesheet(getSource(menuUri));
		Statechartz.loadFromDocument();
	}catch(err){
		var str = '<h1>Váš prohlížeč nepodporuje tuto aplikaci - vyzkoušejte Firefox</h1><span>';
		if (typeof (exception) == "object" && exception.message) str += err.message;
		else str +=err;
		document.body.innerHTML = str+'</span>';
	}
}

function getActiveStateIds(){
	var result = '';
	for (var i = 0; i < document.statechart.configuration.length; ++i) {
		var state = document.statechart.configuration[i];
		if (state.atomic) {
			result += ' '+state.id;
		} 
	}
	return result.substring(1);
}

function setLayout(aLayoutURI){
	document.body.innerHTML = '';
	//stateShot = {"layout": aLayoutURI};
	var fragment = xsltTransform(aLayoutURI);
	document.body.appendChild(fragment);
}

function refreshMenu(){
	stateIds = getActiveStateIds();
	menuNode = document.getElementById("menu");
	menuNode.innerHTML = '';
	menuProc.setParameter(null, "stateIds", stateIds);
	var fragment = menuProc.transformToFragment(Statechartz.doc, document);
	menuNode.appendChild(fragment);
}

function showContent(aChange,aURI,aTitle){
	if(aURI) {
		location.hash = aURI;
		stateShot.uri = aURI; 
	}
	if(aTitle) {
		document.title = aTitle;
		stateShot.title= aTitle;
	}
	refreshMenu();
	var log = document.getElementById('log');
	log.innerHTML =JSON.stringify(aChange) + "\n";
	var dataURI = '';
	var componentDoc = null;
	var componentNode = null;
	var xsltURI = '';
	for(var i=0; i < aChange.length; i++){
		for(var cn in aChange[i]){
			if(cn != 'clone'){
				componentNode = document.getElementById(cn);
				if(componentNode){
					stateShot[cn] = new Array;
					componentNode.innerHTML = '';
					log.innerHTML += aChange[i][cn] + ": \n";
					for(var j=0; j < aChange[i][cn].length; j++){
						var fragment = xsltTransform(aChange[i][cn][j]);
						stateShot[cn][j] = new Array;
						for(var k = 0; k < fragment.childNodes.length; k++){
							stateShot[cn][j][k] = new Object;
							stateShot[cn][j][k].node = fragment.childNodes.item(k);
							stateShot[cn][j][k].dataURI = aChange[i][cn][j]; 
						}
						var nl = componentNode.appendChild(fragment);
					}
				}
			}
		}
	}
}

function switchToEditMode(){
	for(var c in stateShot){
		if(c!="clone" && c!= "title" && c!= "uri"){
			for(var i=0; i < stateShot[c].length; i++){
				for(var j=0; j < stateShot[c][i].length; j++){
					var space = "";
					if(stateShot[c][i][j].node.className) space = " ";
					stateShot[c][i][j].node.className += space+"f-component "+c+"_"+i+"_"+j;
					stateShot[c][i][j].node.onclick = editComponent;
				}
			}
		}
	}
}

function switchToPreview(){
	for(var c in stateShot){
		if(c!="clone" && c!= "title" && c!= "uri"){
			for(var i=0; i < stateShot[c].length; i++){
				for(var j=0; j < stateShot[c][i].length; j++){
					var icn = stateShot[c][i][j].node.className.indexOf("f-component");
					if(icn > -1){
						stateShot[c][i][j].node.className = stateShot[c][i][j].node.className.substring(0,icn);
						stateShot[c][i][j].node.onclick = null;
					}
				}
			}
		}
	}
}

function editComponent(){
	alert(this.className);
}

function S4() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}

function resolveURI(aBaseURI, aURI){
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
		baseURIArray.shift();
	}
	baseURIArray.pop();
	return baseURIArray.join('/') + uriArray.join('/') ;
}

function xsltTransform(aDataURI, aDataDoc){
	var dataDoc = null;
	if(aDataDoc == undefined){
		dataDoc = getSource(aDataURI);
	} else {
		dataDoc = aDataDoc;
	}
	var xsltURI = getXSLTURI(aDataURI,dataDoc);
	var xsltProc = null;
	if(xsltProcCache[xsltURI] != undefined){
		if(xsltProcCache[xsltURI].constructor == XSLTProcessor){
			xsltProc = xsltProcCache[xsltURI];
		}
		else xsltProc = null;
	}
	if(xsltProc == null){
		xsltProc = addToXSLTProcCache(xsltURI);
	}
	xsltProc.setParameter(null, "stateIds", stateIds);
	return xsltProc.transformToFragment(dataDoc, document);
}

function getXSLTURI(aDataURI, aDataDoc){
	var nodeInstruction = aDataDoc.firstChild;
	while(nodeInstruction.data.indexOf("text/xsl") == -1){
		nodeInstruction = nodeInstruction.nextSibling;
		if(nodeInstruction.nodeType != 7) break;
	}
	var styleInstruction = nodeInstruction.data;
	styleInstruction = styleInstruction.substring(styleInstruction.indexOf('href')+6);
	styleInstruction = styleInstruction.substring(0,styleInstruction.indexOf('"'));
	return resolveURI(aDataURI, styleInstruction);
}

function addToXSLTProcCache(aXSLTURI){
	var xsltProc = new XSLTProcessor();
	xsltProc.importStylesheet(getSource(aXSLTURI));
	xsltProcCache[aXSLTURI] = xsltProc;
	return xsltProc;
}

function getSource(aUri,aAsText){
	var http = new XMLHttpRequest(); 
	var uri = aUri;
	if (http.overrideMimeType){
		http.overrideMimeType('text/xml');
	}else {
		uri = 'xml.php?x='+aUri;
	}
	http.open("GET",uri,false);
	http.send(null);
	if(aAsText) return http.responseText;
	return http.responseXML;
}