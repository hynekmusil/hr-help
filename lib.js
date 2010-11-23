//encoding=UTF-8
var stateIds = '';
var stateShot = new Object;
var eb = null;

var presentationCache = new Array();
var xsltProcCache = new Array();

window.onload = function(){
	try{
		Statechartz.loadFromDocument();
	}catch(err){
		var str = "<h1>Váš prohlížeč nepodporuje tuto aplikaci - vyzkoušejte Firefox</h1><span>";
		if (typeof (exception) == "object" && exception.message) str += err.message;
		else str +=err;
		document.body.innerHTML = str + "</span>";
	}
}

function publish(){
	for(var i = 0; i < events4Publish.length;  i++){
		document.statechart.raise(events4Publish[i],false,{"publish":true});
	}
}

function publishState(){
	if(stateShot.uri != ""){
		send = document.body.innerHTML;
		getSource("aspect/publish/publish.php?title="+stateShot.title+"&uri="+stateShot.uri,send);
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

function inState(aStateId){
	for (var i = 0; i < document.statechart.configuration.length; ++i) {
		if(document.statechart.configuration[i].id == aStateId) return true;
	}
	return false;
}

function setLayout(aLayoutURI){
	//stateShot = {"layout": aLayoutURI};
	var fragment = xsltTransform(aLayoutURI);
	document.body.appendChild(fragment);
	document.body.removeChild(document.body.firstChild);
}

function raise(aEvent, aHref){
	document.statechart.raise(aEvent);
}
function changeMenu(aMenu){
	var info = changeContent([aMenu], [["","event",document.statechart.event.name]], true);
	if(info){
		if(info.constructor == Array && info.length == 2){
			document.title = info[0];
			stateShot.title=  info[0];
			location.hash = info[1];
			stateShot.uri = info[1];
		}
	}	
}

function changeContent(aChange, aParams, aNoPublish){
	var log = document.getElementById("f-log");
	var result = null;
	var insertMethod = "append";
	if(log) log.innerHTML =JSON.stringify(aChange) + "\n";
	var componentNode = null;
	for(var i=0; i < aChange.length; i++){
		for(var cn in aChange[i]){
			if(cn != 'clone'){
				componentNode = document.getElementById(cn);
				if(componentNode){
					stateShot[cn] = new Array;
					if(componentNode.nodeName == "HR") insertMethod = "before";
					if(insertMethod == "append") componentNode.innerHTML = "";
					if(log) log.innerHTML += aChange[i][cn] + ": \n";
					for(var j=0; j < aChange[i][cn].length; j++){
						var transformResult = xsltTransform4Edit(aChange[i][cn][j], aParams);
						var fragment = transformResult.fragment;
						stateShot[cn][j] = new Object;
						stateShot[cn][j].dataURI = aChange[i][cn][j];
						stateShot[cn][j].setterURI = transformResult.setterURI;
						if(stateShot[cn][j].setterURI != "") stateShot[cn][j].ids = new Array;
						for(var k = 0; k < fragment.childNodes.length; k++){
							if(fragment.childNodes.item(k).nodeType == 8 && (fragment.childNodes.item(k).data.indexOf("f-result") === 0)){
								result = eval(fragment.childNodes.item(k).data.substring(9));
							} else if(stateShot[cn][j].ids || (insertMethod == "before")) 
							{
								var idc = "";
								if(fragment.childNodes.item(k).id == ""){
									idc =  cn+"_"+j+"_"+k;
									if(stateShot[cn][j].ids) 
										stateShot[cn][j].ids[k] = idc;
									fragment.childNodes.item(k).id =  idc;
								}
								else{
									idc = fragment.childNodes.item(k).id;
									if(stateShot[cn][j].ids) 
										stateShot[cn][j].ids[k] = idc;
								}
								if(removeNode = document.getElementById(idc)) removeNode.parentNode.removeChild(removeNode);
							}
						}
						if(insertMethod == "append") componentNode.appendChild(fragment);
						else componentNode.parentNode.insertBefore(fragment, componentNode);
					}
				}
			}
		}
	}
	//if(inState("edit")) switchToEditMode();
	if(aNoPublish == undefined){
		if(inState("publish")) publishState();
	}
	return result;
}

function switchToEditMode(){
	var node = null;
	var space = "";
	for(var c in stateShot){
		if(c!="clone" && c!= "title" && c!= "uri"){
			for(var i=0; i < stateShot[c].length; i++){
				if(stateShot[c][i].ids){
					//stateShot[c][i].ids = new Array();
					for(var j=0; j < stateShot[c][i].ids.length; j++){
						space = "";
						node = document.getElementById(stateShot[c][i].ids[j]);
						if(node){
							if(node.className) space = " ";
							node.className += space+"f-component "+c+"_"+i+"_"+j;
							node.onclick = startEditing;
							node.onkeyup = keyUpEditing;
						}
					}
				}
			}
		}
	}
}

function htmlEditCmd(aCmd,aValue,aPrompt) {
	var bool = false;
	var value = null;
	if(aValue === '') value= '';
	if ((value === '') && (aPrompt != undefined))
		value = prompt(aPrompt);
	document.execCommand(aCmd,bool,value);
}
function saveData(){
	var ss = stateShotAddr2Object(eb.className);
	var id = ss.ids[0];
	var cen =  document.getElementById(id);
	var nn = cen.nodeName;
	var stag = "<"+nn+">";
	var etag = "</"+nn+">";
	send = stag + cen.innerHTML + etag;
	var doc = getSource(ss.setterURI+"?dataURI="+ss.dataURI, send);
	fragment = xsltTransform(ss.setterURI, doc);
	for(var i in fragment.childNodes){
		if(fragment.childNodes.item(i)){
			if(fragment.childNodes.item(i).nodeType == 1){
				var n = fragment.childNodes.item(i);
				n.className = cen.className;
				n.contentEditable = true;
				n.id = id;
				cen.parentNode.replaceChild(n, cen);
			}
		}
	}
}

function stateShotAddr2Object(aAddr){
	var addrArray = aAddr.split("_");
	if(addrArray.length != 3) return null;
	var result = stateShot[addrArray[0]];
	if(result){
		result = result[addrArray[1]];
		if(result){
			return result;
		}
	}
	return null;
}

function switchToPreview(){
	var node = null;
	eb =  document.getElementById("f-editButtons");
	if(eb)
		eb.parentNode.removeChild(eb);
	for(var c in stateShot){
		if(c!="clone" && c!= "title" && c!= "uri"){
			for(var i=0; i < stateShot[c].length; i++){
				if(stateShot[c][i].ids){
					for(var j=0; j < stateShot[c][i].ids.length; j++){
						node = document.getElementById(stateShot[c][i].ids[j]);
						if(node){
							var icn = node.className.indexOf("f-component");
							if(icn > -1){
								node.className = node.className.substring(0, icn);
								node.onclick = null;
								node.onkeyup = null;
								node.contentEditable = false;
							}
						}
					}
				}
			}
		}
	}
}

function startEditing(){
	var info = getInfoAboutEditedObject(this);
	raise("edit."+info.componentName);
	eb =  document.getElementById("f-editButtons");
	var ebHeight = getElementHeight(eb);
	var coo = getElementCoordinate(this);
	eb.style.position = "absolute";
	eb.style.top = String(coo[0] - ebHeight)+"px";
	eb.style.left = String(coo[1])+"px";
	eb.className = info.objectName;
	this.contentEditable = true;
}
function keyUpEditing(e){
	var evt = e || window.event;
	var info = getInfoAboutEditedObject(this);
	document.statechart.raise("edit." + info.componentName + ".keyUp",false,{"key":evt.keyCode,"object":info.object});
}
function editMenu(){
	var data = document.statechart.event.data;
	if(data.key == 13){
		markEditedElement()
		var oldNode = document.getElementById(data.object.ids[1]);
		var doc = null;
		if(document.implementation && document.implementation.createDocument) {
			doc = document.implementation.createDocument("", "", null);
			var node = doc.importNode(oldNode, true);
			doc.appendChild(node);
			var serializer = new XMLSerializer();
			alert(serializer.serializeToString(doc));
		}
		else  {
			send = oldNode.outerHTML;
			doc = getSource("aspect/standardsSupport/xml.php", send);
		}
		var fragment = xslt(doc, "component/menuCmds/edit-newPage.xsl");
		var newNode = fragment.childNodes.item(0);
		alert(newNode.innerHTML);
		newNode.onkeyup = keyUpEditing;
		newNode.onclick = startEditing;
		oldNode.parentNode.replaceChild(newNode, oldNode);
	}
}
function markEditedElement(){
	var sel = null;
	var editedNode = null;
	if (window.getSelection){
		sel =  window.getSelection();
		editedNode = sel.anchorNode;
		if(editedNode.nodeType == 3){
			editedNode = editedNode.parentNode;
		}
	} else if (document.selection){
		sel = document.selection.createRange();
		editedNode = sel.parentElement();
	}
	editedNode.className += " f-edited";
}
function getInfoAboutEditedObject(aElement){
	var result = new Object;
	result.objectName = aElement.className.substring(aElement.className.indexOf("f-component") + 12);
	result.object = stateShotAddr2Object(result.objectName);
	if(result.object){
		result.componentName = result.object.setterURI.split("/")[1];
	}
	return result;
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
		baseURIArray.pop();
	}
	baseURIArray.pop();
	var baseURI = baseURIArray.join("/");
 	if(baseURI != "") baseURI += "/";
	return baseURI + uriArray.join("/") ;
}

function xsltTransform4Edit(aDataURI, aParams){
	var dataDoc = getSource(aDataURI);
	var result = new Object;
	result.setterURI = getSetterURI(aDataURI, dataDoc);
	result.fragment = xsltTransform("", dataDoc, aParams);
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

function getXSLTURI(aDataURI, aDataDoc){
	return getProcessingURI("stylesheet", aDataURI, aDataDoc);
}

function getSetterURI(aDataURI, aDataDoc){
	return getProcessingURI("setter", aDataURI, aDataDoc);
}

function getProcessingURI(aProc, aDataURI, aDataDoc){
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

function addToXSLTProcCache(aXSLTURI){
	var xsltProc = new XSLTProcessor();
	xsltProc.importStylesheet(getSource(aXSLTURI));
	xsltProcCache[aXSLTURI] = xsltProc;
	return xsltProc;
}

function getSource(aUri, aSend, aAsText){
	var http = new XMLHttpRequest(); 
	var uri = aUri;
	var send = null;
	if(aSend != undefined){
		send = aSend;
	}
	if(aAsText == undefined){
		if (http.overrideMimeType){
			http.overrideMimeType('text/xml');
		}else if(uri.indexOf("aspect/standardsSupport/xml.php") === -1) {
			uri = "aspect/standardsSupport/xml.php?x="+aUri;
		}
	}
	http.open("POST",uri,false);
	http.send(send);
	if(aAsText) return http.responseText;
	return http.responseXML;
}

function getElementHeight(aNode){
	var heightStr = window.getComputedStyle(aNode,null).getPropertyValue("height");
	return Number(heightStr.substr(0, heightStr.length - 2));
}

function getElementCoordinate(aNode){
	var top=0;
	var left=0;
	var node = aNode;
	while (node != null) {
		top += node.offsetTop;
		left += node.offsetLeft;
		node = node.offsetParent;
	}
	return new Array(top, left);
}

if (!window.getComputedStyle) {
    window.getComputedStyle = function(el, pseudo) {
        this.el = el;
        this.getPropertyValue = function(prop) {
            var re = /(\-([a-z]){1})/g;
            if (prop == "float") prop = "styleFloat";
			if (prop == "height") return el.offsetHeight+"px";
            if (re.test(prop)) {
                prop = prop.replace(re, function () {
                    return arguments[2].toUpperCase();
                });
            }
            return el.currentStyle[prop] ? el.currentStyle[prop] : null;
        }
        return this;
    }
}