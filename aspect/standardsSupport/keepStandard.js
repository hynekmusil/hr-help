/*@cc_on
(function(f){
 window.setTimeout =f(window.setTimeout);
 window.setInterval =f(window.setInterval);
})(function(f){return function(c,t){var a=[].slice.call(arguments,2);return f(function(){c.apply(this,a)},t)}});
@*/

window.onload = function(){
	var i = setInterval(function(start){
		if(new Date - start > 990) {
			alert("about 1 second: ".concat(new Date - start));
			clearInterval(i);
		}
	}, 20, new Date);
}
