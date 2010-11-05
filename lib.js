var menuDoc = null;
var menuProc = null;
var menuUri = 'component/menu/controller-menu.xsl';
var menuNode = null;
var stateIds = '';

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
	//document.body.innerHTML = '';
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

function showContent(aChange){
	refreshMenu();
	var log = document.getElementById('log');
	log.innerHTML =JSON.stringify(aChange) + "\n";
	var dataURI = '';
	var componentDoc = null;
	var componentNode = null;
	var xsltURI = '';
	for(var i=0; i < aChange.ch.length; i++){
		componentNode = document.getElementById(aChange.ch[i].f)
		componentNode.innerHTML = '';
		log.innerHTML += aChange.ch[i].f + ": \n";
		for(var j=0; j < aChange.ch[i].d.length; j++){
			var fragment = xsltTransform(aChange.ch[i].d[j]);
			componentNode.appendChild(fragment);
		}
	}
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