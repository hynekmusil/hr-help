function Thing(name) {
    this.name = name;
}
Thing.prototype.doSomething = function(callback, salutation) {
    // Call our callback, but using our own instance as the context
    callback.call(this, salutation);
}

function foo(salutation) {
    alert(salutation + " " + this.name);
}

function Document(){}
Document.prototype = {
_id: 0,
_name: '',

name: function() {
  return this._name;
},

id: function() {
  return this._id;
},

save: function() {
   return true;
},

open: function(id) {
  this._id = id;
  this._name = 'Ajax on AOP steroids'
  alert(this._name);
  return true;
}
}

function Lockable(){}
Lockable.prototype = {
_locked: false,

  locked: function() {
    return this._locked;
  },
  lock: function() {
	this._locked = true;
  }
}

var lockable = new Lockable();

jQuery.aop.around( {target: Document, method: 'open'}, 
  function(invocation) {
    alert('open: ' + invocation.arguments[0]); 
	var result = "";
	if(lockable.locked() === false) {
		result= invocation.proceed(); 
		lockable.lock();
	}
	else result = false;
	return result;
  }
);

var t = new Thing('Joe');
t.doSomething(foo, 'Hi;');  // Alerts "Hi Joe" via `foo`

doc = new Document();
var test = doc.open("i1");
if(test) alert("opened");
else  alert("locked");
var test = doc.open("i2");
if(test) alert("opened");
else  alert("locked");

