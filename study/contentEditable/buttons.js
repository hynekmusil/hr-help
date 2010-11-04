window.onload = function () {
	var buttons = document.getElementById('testForm').getElementsByTagName('input');
	for (var i=0;i<buttons.length;i++) {
		if (buttons[i].type != 'button') continue;
		buttons[i].onclick = command;
	}
}

function command() {
	var cmd = this.id;
	var bool = false;
	var value = this.getAttribute('cmdValue') || null;
	if (value == 'promptUser')
		value = prompt(this.getAttribute('promptText'));
	var test = document.execCommand(cmd,bool,value);
	if(test){ 
		var doc = document.implementation.createDocument ('', '', null);  
		var node = doc.importNode(document.getElementById('testElement'),true);
		doc.appendChild(node);
		
		var repairerProc = null;
		var repairerUri = 'repairer.xsl';
		repairerProc = new XSLTProcessor();
		repairerProc.importStylesheet(getSource(repairerUri));
		var fragment = repairerProc.transformToFragment(doc, document);
		//document.getElementById('result').innerHTML = '';
		//document.getElementById('result').appendChild(fragment);
		//document.getElementById('testElement').innerHTML = '';
		//document.getElementById('testElement').appendChild(fragment);
	}
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