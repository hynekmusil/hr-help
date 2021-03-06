//encoding=UTF-8
var stateIds = '';
var stateShot = new Object;
var currComponentInfo = null;
var eb = null;

var uid = (
  function(){
    var id=0; 
    return function(){
		return id++ ;
    };
  } 
)();

var presentationCache = new Array();
var xsltProcCache = new Array();
var dataDocCache = new Array();

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
					else insertMethod = "append";
					if(insertMethod == "append") componentNode.innerHTML = "";
					if(log) log.innerHTML += aChange[i][cn] + ": \n";
					for(var j=0; j < aChange[i][cn].length; j++){
						var transformResult = xsltTransform4Edit(aChange[i][cn][j], aParams);
						var fragment = transformResult.fragment;
						stateShot[cn][j] = new Object;
						stateShot[cn][j].name = cn+"_"+j;
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
	parseStateShot(function(aId, aC, aI, aJ){
		var space = "";
		var node = document.getElementById(aId);
		if(node){
			if(node.className.indexOf("f-component") == -1){
				if(node.className) space = " ";
				node.className += space+"f-component "+aC+"_"+aI+"_"+aJ;
				if(stateShot[aC][aI].setterURI != "data/javascript"){
					node.onclick = startEditing;
					//node.onkeyup = keyUpEditing;
				}
			}
		}
	});
}
function parseStateShot(callback){
	var node = null;
	var space = "";
	for(var c in stateShot){
		if(c!="clone" && c!= "title" && c!= "uri"){
			for(var i=0; i < stateShot[c].length; i++){
				if(stateShot[c][i].ids){
					for(var j=0; j < stateShot[c][i].ids.length; j++){
						callback(stateShot[c][i].ids[j], c, i, j);
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
	var id = "";
	var cen = null;
	var send="";
	for(var i=0;  i < ss.ids.length;  i++){
		cen =  document.getElementById(ss.ids[i]);
		if(cen){
			if(cen.outerHTML) send += cen.outerHTML;
			else {
				nn = cen.nodeName.toLowerCase();
				send += "<"+ nn + ' xmlns="http://www.w3.org/1999/xhtml"';
				for(var  a=0;  a < cen.attributes.length; a++){
					send += " "+cen.attributes.item(a).nodeName+'="'+cen.attributes.item(a).value+'"';
				}
				send += ">"+cen.innerHTML+"</"+nn+">";
			}
		}
	}
	refreshData(ss, send);
}
function menuSaveData(){
	var data = document.statechart.event.data;
	var nId = getEditedNodeId(data.object.object.ids);
	if(nId != ""){
		var cNode = getEditedNode();
		var dataURI = "data/pageProperties.php?id=" + nId;
		var send={operation: "change", itemId: nId, itemName: cNode.textContent, menuURI: data.object.object.dataURI};
		refreshData(data.object.object, JSON.stringify(send));
	}
}
function newsSaveData(){
	var data = document.statechart.event.data;
	var nId = getEditedNodeId(data.object.object.ids);
	if(nId != ""){
		var cNode = getEditedNode();
		while(cNode.className.indexOf("f-id-"+nId) == -1) cNode = cNode.parentNode;
		refreshData(data.object.object, "<div>" + cNode.innerHTML + "</div>", "id="+nId);
	}
}
function headerSaveData(){
	var data = document.statechart.event.data;
	var nId = getEditedNodeId(data.object.object.ids);
	if(nId != ""){
		var cNode = document.getElementById("subheader");
		refreshData(data.object.object, "<div>" + cNode.innerHTML + "</div>");
	}
}
function refreshData(aComponentInfo, aSend, aQueryString, aNoModify){
	var queryString = "";
	if(aQueryString) queryString += "&" + aQueryString;
	var doc = getSource(aComponentInfo.setterURI+"?dataURI="+aComponentInfo.dataURI+ queryString, aSend);
	fragment = xsltTransform("data", doc);
	if(!aNoModify){
		modifyData(fragment, aComponentInfo);
	}
}
function modifyData(aFragment, aComponentInfo, aNoScript){
	var j = 0;
	var id = aComponentInfo.name.substring(0,aComponentInfo.name.indexOf("_"));
	var contentElement = document.getElementById(id);
	var newContentElement = null;
	var insertMethod = "append";
	if(contentElement.nodeName == "HR") insertMethod = "before";	
	for(var i=0; i < aComponentInfo.ids.length; i++){
		var oldElement = document.getElementById(aComponentInfo.ids[i]);
		if(insertMethod == "append") {
			if(i == (aComponentInfo.ids.length - 1) && oldElement.nextSibling != null){
				insertMethod = "before";
				newContentElement = oldElement.nextSibling;
			}
			contentElement.removeChild(oldElement);
		}
		else contentElement.parentNode.removeChild(oldElement);
		if(aFragment.childNodes.item(i) == null) j++;
	}
	if(newContentElement != null) contentElement = newContentElement;
	while(j>0){
		aComponentInfo.ids.pop();
		j--;
	}
	var j=0;
	var i= 0;
	for(i in aFragment.childNodes){
		if(aFragment.childNodes.item(i)){
			if(aFragment.childNodes.item(i).nodeType == 1){
				var n = aFragment.childNodes.item(0);
				if(n.nodeName != "SCRIPT"){
					var space = "";
					if(n.className) space = " ";
					n.className += space+"f-component " + aComponentInfo.name + "_" + j;
					if(aComponentInfo.setterURI != "data/javascript") n.contentEditable = true;
				}
				if(!(n.nodeName == "SCRIPT" && aNoScript != undefined)){
					if(j < aComponentInfo.ids.length) {
						if(!n.id) n.id = aComponentInfo.ids[j];
					}
					else{
						if(!n.id) n.id = aComponentInfo.name+ "_" + j;
						aComponentInfo.ids[j] = n.id;
					}
					var targetElement = document.getElementById(aComponentInfo.ids[aComponentInfo.ids.length - 1]);
					if(insertMethod == "append")
						contentElement.appendChild(n);
					else {
						contentElement.parentNode.insertBefore(n, contentElement);
					}
				}
				j++;
			}
		}
	}
}
function fxEditCmd(aCmdName, aData){
	var info = new Object;
	info.object = stateShotAddr2Object(eb.className)
	info.data = aData;
	info.componentName = info.object.setterURI.split("/")[1];
	//alert("edit." + info.componentName + "." + aCmdName);
	document.statechart.raise("edit." + info.componentName + "." + aCmdName, false, {"object":info});
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
	eb =  document.getElementById("f-editButtons");
	if(eb)
		eb.parentNode.removeChild(eb);
	var ep =  document.getElementById("f-editProperties");
	if(ep)
		ep.parentNode.removeChild(ep);
	parseStateShot(function(aId, aC, aI, aJ){
		var node = document.getElementById(aId);
		if(node){
			var icn = node.className.indexOf("f-component");
			if(icn > -1){
				node.className = node.className.substring(0, icn);
				if(stateShot[aC][aI].setterURI != "data/javascript"){
					node.onclick = null;
					node.onkeyup = null;
					node.contentEditable = false;
				}
			}
		}
	});
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
	var node = null;
	parseStateShot(function(aId, aC, aI, aJ){
		node = document.getElementById(aId);
		if(stateShot[aC][aI].setterURI != "data/javascript"){
			if(node) node.onclick = startEditing;
		}
	});
	for(var i=0; i< info.object.ids.length; i++){
		node = document.getElementById(info.object.ids[i]);
		if(node) node.onclick = null;
	}
	this.contentEditable = true;
}
function keyUpEditing(e){
	var evt = e || window.event;
	var info = getInfoAboutEditedObject(this);
	document.statechart.raise("edit." + info.componentName + ".keyUp",false,{"key":evt.keyCode,"object":info.object});
}
function editMenu(){
	var data = document.statechart.event.data;
	if(document.getElementById("pageProperties")){
		var id = "f-id-" + document.forms["pageProperties"].itemId.value;
		var editedNode = getEditedNode();
		var itemNode = editedNode;
		while(itemNode.nodeName != "LI") itemNode = itemNode.parentNode;
		if(itemNode.className.indexOf(id) > -1)
			document.forms["pageProperties"].itemName.value = getEditedNode().textContent;
	}
}
function changeMenuItemProperty(aField, aDataURI){
	var data = document.statechart.event.data;
	var nId = getEditedNodeId(data.object.object.ids);
	if(nId != ""){
		var cNode = getEditedNode();
		var change = new Array;
		change[0] = new Object;
		change[0][aField] = new Array;
		change[0][aField][0] = aDataURI + "?id=" + nId + "&itemName=" + cNode.textContent + "&operation=change";
		changeContent(change, null, true);
		document.forms["pageProperties"].itemName.value = cNode.textContent;
		//document.forms["pageProperties"].itemId.value = nId;
		var eNode = document.getElementById(data.object.object.ids[1]);
		var pNode = document.getElementById(aField);
		var eCoo = getElementCoordinate(eNode);
		var cCoo = getElementCoordinate(cNode);
		var eNodeHeight = getElementHeight(eNode);
		pNode.style.position = "absolute";
		pNode.style.top = String(eCoo[0] + eNodeHeight)+"px";
		pNode.style.left = String(cCoo[1])+"px";
		pNode.className = eb.className;
		currComponentInfo = data.object.object;
	}
}
function createFunctionFromExecutionContext(args) {
   if (args.length == 0) return {};
   var f = "function(_event){with(this){" + (args.join(';')) + ";}}";
	if (window.execScript) {
		window.execScript('code_evaled = '+f);
		return code_evaled;
	}
	var result = eval("("+f+")");
   return result;
}
function modifyMenu(aOperation){
	var data = document.statechart.event.data;
	var nId = getEditedNodeId(data.object.object.ids);
	var send={operation: aOperation, itemId: nId, menuURI: data.object.object.dataURI}
	if(aOperation.indexOf("insert") === 0){
		var id = uid();
		send.itemName = "new item " + id;
		send.uri = "newState" + id;
		send.title = "new title " + id;
		send.onentry = [{maincol:["data/article-new"+id+".xml"]}];
		var sourceState = document.statechart.getStateByName("site");
		var newState = Statechartz.buildState("S",[send.uri]).obj;
		newState.onentry =  createFunctionFromExecutionContext(["changeContent("+JSON.stringify(send.onentry)+");"]);
		newState.parent = sourceState;
		newState.sort_index = document.statechart.addState(newState, sourceState);
		var newTransition = Statechartz.buildFromArgs([createFunctionFromExecutionContext(["changeMenu(_data.mainMenu);"]), Statechartz.Event(send.uri)], "ontrigger");
		newTransition.source = sourceState;
		newTransition.targets = [newState];
		newTransition.regexp = new RegExp("^" + send.uri + "($|(\\.[A-Za-z0-9_]+)+$)");
		sourceState.transitions.push(newTransition);
	}
	refreshData(data.object.object, JSON.stringify(send));
}
function modifyNews(aOperation){
	var data = document.statechart.event.data;
	var nId = getEditedNodeId(data.object.object.ids);
	if(nId != ""){
		var cNode = getEditedNode();
		while(cNode.className.indexOf("f-id-"+nId) == -1) cNode = cNode.parentNode;
		refreshData(data.object.object, "<div>" + cNode.innerHTML + "</div>", "id="+nId+"&operation="+aOperation);
	}
}
function getEditedNodeId(aIds){
	var node = getEditedNode();
	if(node){
		while(node.className.indexOf("f-id-") == -1){
			node = node.parentNode;
			if(node.className == undefined) break;
			if(aIds.indexOf(node.id) != -1) break;
		}
		var nId = "";
		if(node.className){
			nId = node.className;
			var ni = nId.indexOf("f-id-");
			if(ni != -1){
				nId = nId.substring(ni + 5);
				ni = nId.indexOf(" ");
				if(ni != -1){
					nId = nId.substring(0, ni);
				}
			}
		}
		return nId;
	}
	return "";
}
function markEditedElement(){
	var sel = null;
	var editedNode = getEditedNode();
	editedNode.className += " f-edited";
}
function getEditedNode(){
	var editedNode = null;
	if(window.getSelection){
		sel =  window.getSelection();
		editedNode = sel.anchorNode;
		if(editedNode.nodeName == "BODY"){
			alert("Je potřeba kliknout do textu, tak aby se v něm objevil kurzor, pak můžete začít editovat.");
			return null;
		}
		if(editedNode.nodeType == 3){
			editedNode = editedNode.parentNode;
		}
	} else if (document.selection){
		sel = document.selection.createRange();
		editedNode = sel.parentElement();
	}
	return editedNode;
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
	dataDocCache[aDataURI] = dataDoc;
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

function xslt(aDataDoc, aXSLTURI, aParams, aResultType){
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
	xsltProc.clearParameters();
	if(aParams){
		if(aParams.constructor == Array){
			for(var i = 0; i < aParams.length; i++){
				xsltProc.setParameter(aParams[i][0], aParams[i][1], aParams[i][2]);
			}
		}
	}
	if(aResultType != undefined) {
		var dom = xsltProc.transformToDocument(aDataDoc);
		if(aResultType == "DOM") return dom;
		else return dom.documentElement.childNodes.item(0).nodeValue;
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
		if(uri.indexOf(".php") === -1){
			if (http.overrideMimeType){
				http.overrideMimeType('text/xml');
			}else {
				uri = "aspect/standardsSupport/xml.php?x="+aUri;
			}
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

function modifyPP(aOperation, aId, aDataURI){
	var params = null;
	var formPP = document.forms["pageProperties"];
	var dataURI = "data/pageProperties.php?id=" + formPP.itemId.value;
	var dataDocInfo = getDataDocFromCache(dataURI);
	var dataDoc = dataDocInfo.doc;
	var uri = dataDocInfo.uri;
	if(aOperation == "addComponent"){
		var newDataURI = "article-new.xml";
		if(aDataURI != undefined) {
			var ina = document.getElementById("f-invalidNewArticle");
			if(ina) ina.parentNode.removeChild(ina);
			var testDoc = document.implementation.createDocument("http://formax.cz/ns/pageProperties","newArticle", null);
			testDoc.documentElement.setAttribute("value", aDataURI);
			var fragment = xslt(testDoc, "component/pageProperties/validator-pageProperties.xsl");
			document.getElementById("f-addonentry").appendChild(fragment);
			ina = document.getElementById("f-invalidNewArticle");
			if(ina) return false;
			newDataURI = aDataURI;
		}
		params = [["","operation", aOperation],["","place","maincol"],["","dataURI",newDataURI]];
	} else if(aOperation == "removeComponent"){
		if(aId != undefined){
			params = [["","operation", aOperation],["","pos", aId]];
		}
	}
	else {
		params = [["","uri", formPP.uri.value],["","title",formPP.title.value],["","titleItem",formPP.itemName.value]];
		if(aId != undefined){
			params.push(["","pos", aId]);
			params.push(["","place",formPP["place"+aId].value]);
			params.push(["","dataURI",formPP["dataURI"+aId].value]);
		}
	}
	dataDoc = xslt(dataDoc,"component/pageProperties/controller-pageProperties.xsl", params,"DOM");
	//var serializer = new XMLSerializer();
	dataDocCache[uri] = dataDoc;
	//alert(serializer.serializeToString(dataDoc));
	if(aOperation != "change"){
		fragment = xsltTransform("data", dataDoc);
		modifyData(fragment, stateShot["f-editProperties"][0], true);
	}
}
function sendPP(){
	var dataURI = "data/pageProperties.php?id=" + document.forms["pageProperties"].itemId.value;
	var dataDocInfo = getDataDocFromCache(dataURI);
	var dataDoc = dataDocInfo.doc;
	var oldStateId = forState;
	//var serializer = new XMLSerializer();
	//alert(serializer.serializeToString(dataDoc));
	fragment = xsltTransform("data", dataDoc);
	modifyData(fragment, stateShot["f-editProperties"][0], true);
	var nl = document.getElementsByTagName("span");
	for(var i= 0;  i< nl.length; i++){
		if(nl.item(i).className == "f-invalid") {
			return false;
		}
	}
	var newStateId = forState;
	
	var json = xslt(dataDoc,"component/pageProperties/xml2json-pageProperties.xsl",[["","menuURI",currComponentInfo.dataURI]],"TEXT");
	refreshData(currComponentInfo, json);
	dataDoc =  getSource(dataURI + "&itemName=" + document.forms["pageProperties"].itemName.value);
	dataDocCache[dataDocInfo.uri] = dataDoc;
	
	//if(oldStateId != newStateId){
		var state = document.statechart.getStateByName(oldStateId);
		state.id = newStateId;
		state.onentry =  createFunctionFromExecutionContext(["changeContent("+JSON.stringify(JSON.parse(json).onentry)+");"]);
		for(var i=0; i < state.parent.transitions.length; i++){
			if(state.parent.transitions[i].event == oldStateId){
				state.parent.transitions[i].event = newStateId;
				state.parent.transitions[i].regexp = new RegExp("^" + newStateId + "($|(\\.[A-Za-z0-9_]+)+$)");
			}
		}
	//}
}
function addNewArticle(){
	var formPP = document.forms["pageProperties"];
	var dataURI = "data/pageProperties.php?id=" + formPP.itemId.value;
	var dataDocInfo = getDataDocFromCache(dataURI);
	var uri = dataDocInfo.uri;
	var doc = dataDocInfo.doc;
	var fileName = formPP.newArticle.value;
	var dataList = doc.getElementsByTagNameNS("http://formax.cz/ns/pageProperties","data");
	var isNew = true;
	for(var i in dataList){
		if(dataList[i].constructor == Element){
			if(dataList[i].getAttribute("id") == fileName){
				isNew = false;
				break;
			}
		}
	}
	var firstData = dataList.item(0);
	if(isNew){
		var newData = doc.createElementNS("http://formax.cz/ns/pageProperties","data");
		newData.setAttribute("id",fileName);
		firstData.parentNode.insertBefore(newData, firstData);
	}
	//var serializer = new XMLSerializer();
	//alert(serializer.serializeToString(doc));
	getSource("component/article/new-article.php?fileName="+ fileName, null, "text");
	dataDocCache[uri] = doc;
	modifyPP("addComponent","", fileName);
}
function getDataDocFromCache(aStartURI){
	var uri = "";
	for(uri in dataDocCache){
		if(uri.indexOf(aStartURI) === 0) {
			return {"uri": uri, "doc": dataDocCache[uri]};
		}
	}
	return null;
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
if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(elt /*, from*/)
  {
    var len = this.length;

    var from = Number(arguments[1]) || 0;
    from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++)
    {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
  };
}
