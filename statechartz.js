/****************************************************************************
 **
 ** Copyright (C) 2009 Nokia Corporation and/or its subsidiary(-ies).
 ** Contact: Qt Software Information (qt-info@nokia.com)
 **
 ** This file is part of the SCXML module of the Qt Labs.
 **
 ** GNU General Public License Usage
 ** Alternatively, this file may be used under the terms of the GNU
 ** General Public License version 3.0 as published by the Free Software
 ** Foundation and appearing in the file LICENSE.GPL included in the
 ** packaging of this file.  Please review the following information to
 ** ensure the GNU General Public License version 3.0 requirements will be
 ** met: http://www.gnu.org/copyleft/gpl.html.
 **
 ** If you are unsure which license is appropriate for your use, please
 ** contact the sales department at qt-sales@nokia.com.
 ** $QT_END_LICENSE$
 **
 ****************************************************************************/
var code_evaled;

function namespaceResolver(aPrefix){
	if(aPrefix == 'sc') return 'http://www.w3.org/2005/07/scxml';
}

if(!Array.indexOf){
    Array.prototype.indexOf = function(obj){
        for(var i=0; i<this.length; i++){
            if(this[i]==obj){
                return i;
            }
        }
        return -1;
    }
}

function el_hasClass(ele, cls) {
    return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

function el_addClass(ele, cls) {
    if (!el_hasClass(ele, cls)) ele.className += " " + cls;
}

function el_removeClass(ele, cls) {
    if (el_hasClass(ele, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        ele.className = ele.className.replace(reg, ' ');
    }
}
var Set = Array;
Set.prototype.add = function Set_add(o) {
    for (var i = 0; i < this.length; ++i) {
        if (this[i] == o) return;
    }
    this.push(o);
};

function removeFromSet(s, o) {
    var index = s.indexOf(o);
    var a = [];
    for (var i = 0; i < s.length; ++i)
    if (s[i] != o) a.push(s[i]);
    return a;
};
Array.prototype.clone = function () {
    var a = new Array();
    for (var i = 0; i < this.length; ++i)
    a[i] = this[i];
    return a;
};
Object.prototype.clone = function () {
    var o = {};
    o.prototype = this.prototype;
    for (var i = 0; i < this.length; ++i)
    o[i] = this[i];
    return o;
};

function Signal() {
    this.prototype = new Array();
    this.connect = this.push;
    this.emit = function () {
        var a = arguments.clone();
        for (var i = 0; i < this.length; ++i) {
            this[i](a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9]);
        }
    };

};

Statechartz = {
	doc: null,
    buildFromArgs: function (args, defaultFunc) {
        var obj = {};
        for (var i = 0; i < args.length; ++i) {
            var a = args[i];
            if (a != null) {
                if (typeof(a) == "string") {
                    obj.id = a;
                }
                else if (typeof(a) == "function") {
                    obj[defaultFunc] = a;
                }
                else if (typeof(a) == "object") {
                    if (a.cls != undefined) {
                        if (obj[a.cls] == undefined) obj[a.cls] = [a.obj];
                        else obj[a.cls].push(a.obj);
                    }
                    else {
                        for (var n in a) {
                            obj[n] = a[n];
                        }
                    }
                }
            }
        }
        return obj;
    },
    buildState: function (type, args) {
        var obj = this.buildFromArgs(args);
        obj.type = type;
        obj.historyStates = [];
        obj.toString = function () {
            return ("state (id=" + this.id + ")");
        };
        if (obj.states != undefined) {
            for (var i = 0; i < obj.states.length; ++i) {
                var s = obj.states[i];
                s.parent = obj;
                if (s.initial == true) obj.initialState = s;
                if (s.type == "H") {
                    obj.historyStates.push(s);
                }
            }
        } else obj.states = [];
        if (obj.transitions != undefined) {
            for (var i = 0; i < obj.transitions.length; ++i) {
                obj.transitions[i].source = obj;
                obj.transitions[i].regexp =
                new RegExp("^" + obj.transitions[i].event + "($|(\\.[A-Za-z0-9_]+)+$)");
            }
        } else obj.transitions = [];
        obj.atomic = (obj.type != "H" && obj.states.length == 0);
        return {
            cls: "states",
            obj: obj
        };
    },
    fixStateIDs: function (state, stateByID, idx) {
        state.sort_index = idx++;
        stateByID[state.id] = state;
        if (state.states != undefined) for (var i = 0; i < state.states.length; ++i) {
            idx = this.fixStateIDs(state.states[i], stateByID, idx);
        }
        return idx;
    },
    fixTransitionTargets: function (state, stateByID) {
        if (state.transitions != undefined) {
            for (var i = 0; i < state.transitions.length; ++i) {
                var t = state.transitions[i];
                if (t.targets != undefined) for (var j = 0; j < t.targets.length; ++j) t.targets[j] = stateByID[t.targets[j]];
                else t.targets = [];
            }
        }
        if (state.states != undefined) {
            for (var i = 0; i < state.states.length; ++i) {
                this.fixTransitionTargets(state.states[i], stateByID);
            }
        }
    },
    fixTransitions: function (state) {
        var stateByID = {};
        this.fixStateIDs(state, stateByID, 0);
        this.fixTransitionTargets(state, stateByID);
        return state;
    },

    resolveFunction: function (f) {
        if (typeof(f) == "function") return f;
        else if (typeof(f) == "string") return function () {
            return eval(f);
        };
    },
    resolveEvent: function (e) {
        if (typeof(e) == "string") {
            return e;
        } else if (typeof(e) == "function") {
            var uid = "";
            if (e.connect != undefined) {
                e.connect(function () {
                    this.raise(uid);
                });
                return uid;
            }
        } else if (typeof(e) == "object") {
            var uid = "";
            e +=
            function () {
                this.raise();
            };
        }
    },
    Entry: function (f) {
        return {
            onentry: this.resolveFunction(f)
        };
    },
    Exit: function (f) {
        return {
            onexit: Statechartz.resolveFunction(f)
        };
    },
    Done: function (f) {
        return {
            ondone: Statechartz.resolveFunction(f)
        };
    },
    Trigger: function (f) {
        return {
            ontrigger: Statechartz.resolveFunction(f)
        };
    },
    Targets: function () {
        var a = new Array();
        for (var i = 0; i < arguments.length; ++i)
        a[i] = arguments[i];
        return {
            targets: a
        };
    },
    Event: function (e) {
        return {
            event: this.resolveEvent(e)
        };
    },
    Condition: function (f) {
        return {
            condition: Statechartz.resolveFunction(f)
        };
    },
    Target: function (s) {
        return this.Targets(s);
    },
    Initial: {
        initial: true
    },
    Deep: {
        deep: true
    },
    Shallow: {
        deep: false
    },
    Final: function () {
        return Statechartz.buildState("F", arguments);
    },
    State: function () {
        return Statechartz.buildState("S", arguments);
    },
    Parallel: function () {
        return Statechartz.buildState("P", arguments);
    },
    History: function () {
        return Statechartz.buildState("H", arguments);
    },
    Attribute: function (element, attr, value) {
        return {
            cls: "attributes",
            obj: {
                type: 'A',
                element: element,
                attr: attr,
                value: value
            }
        };
    },
    Css: function (element, attr, value) {
        return {
            cls: "attributes",
            obj: {
                type: 'S',
                element: element,
                attr: attr,
                value: value
            }
        };
    },
    Transition: function () {
        var t = {
            cls: "transitions",
            obj: this.buildFromArgs(arguments, "ontrigger")
        };
        if (t.targets == undefined) t.targets = [];
        return t;
    },
    build: function (rootState) {
        return {
            rootState: Statechartz.fixTransitions(rootState.obj, {}),
            event: {
                name: "",
                data: {}
            },
            historyValues: {},
            processing: false,
            doContinue: false,
            raise: function raise(event, external, payload) {
                if (this.externalQueue == undefined) {
                    start();
                }
                if (!this.processing) external = true;
                (external ? this.externalQueue : this.internalQueue).push({
                    name: event,
                    data: payload
                });
                if (!this.processing){
					this.process();
				}
            },
            start: function () {
                this.doContinue = true;
                this.rootState.parent = undefined;
                this.configuration = new Set();
                this.externalQueue = [];
                this.internalQueue = [];
                this.processing = true;
                this.enterStates([{
                    source: this.rootState,
                    targets: [this.rootState.initialState]
                }]);
                this.process();
            },
            stop: function stop() {
                this.doContinue = false;
                this.configuration = new Set();
                this.externalQueue = this.internalQueue = [];
            },
            pause: function pause() {
                this.doContinue = false;
                this.running = false;
            },
            configuration: new Set(),
            eventMatch: function eventMatch(trre, transitionEvent, actualEvent) {
                if (transitionEvent == undefined && actualEvent == undefined) return true;
                else if (transitionEvent != undefined && actualEvent != undefined) {
                    return (
                    transitionEvent == "*" || transitionEvent == actualEvent || actualEvent.match(trre));
                    //                                                        actualEvent.indexOf(transitionEvent+'.')==0)
                } else return false;
            },
            startEventLoop: function startEventLoop() {
                var initialStepComplete = false;
                this.processing = true;
                while (true) {
                    var enabledTransitions = this.selectTransitions();
                    if (enabledTransitions.length == 0) {
                        var internalEvent = this.internalQueue.shift();
                        if (internalEvent != undefined) {
                            this.event = internalEvent;
                            enabledTransitions = this.selectTransitions(internalEvent);
                        }
                    }
                    if (enabledTransitions.length != 0) {
                        microstep(this.enabledTransitions);
                    } else break;
                }
                this.process();
            },
            process: function process() {
                this.processing = true;
                while (this.externalQueue.length > 0) {
                    var externalEvent = this.externalQueue.shift();
                    this.event = externalEvent;
                    status = externalEvent.name;
                    var enabledTransitions = this.selectTransitions(externalEvent);
                    if (enabledTransitions.length) {
                        this.microstep(enabledTransitions);
                        var macrostepComplete = false;
                        while (!macrostepComplete) {
                            enabledTransitions = this.selectTransitions();
                            if (enabledTransitions.length == 0) {
                                var internalEvent = this.internalQueue.shift();
                                if (internalEvent != undefined) {
                                    this.event = internalEvent;
                                    enabledTransitions = this.selectTransitions(internalEvent);
                                }
                            }
                            if (enabledTransitions.length == 0) {
                                macrostepComplete = true;
                            } else {
                                this.microstep(enabledTransitions);
                            }
                        }
                    }
                }
                this.processing = false;
            },
            exitOrder: function (state_a, state_b) {
                return state_b.sort_index - state_a.sort_index;
            },
            entryOrder: function (state_a, state_b) {
                return state_a.sort_index - state_b.sort_index;
            },
            exitInterpreter: function () {
                var inFinalState = false;
                var statesToExit = this.configuration.sort(this.exitOrder);
                for (var s = 0; s < statesToExit.length; ++s) {
                    s.onexit();
                }
            },
            selectTransitions: function selectTransitions(e) {
                var enabledTransitions = new Set();
                for (var i = 0; i < this.configuration.length; ++i) {
                    var state = this.configuration[i];
                    if (state.atomic) {
                        if (!this.isPreempted(state, enabledTransitions)) {
                            var ancs = [state].concat(this.getProperAncestors(state));
                            var breakLoop = false;
                            for (var j = 0; j < ancs.length && !breakLoop; ++j) {
                                var tt = ancs[j].transitions;
                                if (tt != undefined) {
                                    for (var ti = 0; ti < tt.length; ++ti) {
                                        var t = tt[ti];
                                        if (t != undefined) if ((this.eventMatch(t.regexp, t.event, e == undefined ? undefined : e.name)) && this.func(t.condition, e)) {
                                            enabledTransitions.add(t);
                                            breakLoop = true;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return enabledTransitions;
            },
            microstep: function microstep(enabledTransitions) {
                this.exitStates(enabledTransitions);
                for (var t = 0; t < enabledTransitions.length; ++t)
                this.func(enabledTransitions[t].ontrigger, this.event);
                this.enterStates(enabledTransitions);
            },
            exitStates: function exitStates(enabledTransitions) {
                var statesToExit = new Set();
                for (x = 0; x < enabledTransitions.length; ++x) {
                    var t = enabledTransitions[x];
                    if (t.targets != undefined && t.targets.length) {
                        var LCA = this.findLCA([t.source].concat(t.targets));
                        for (var i = 0; i < this.configuration.length; ++i) {
                            var s = this.configuration[i];
                            if (this.isDescendant(s, LCA)) {
                                statesToExit.add(s);
                            }
                        }
                    }
                }
                statesToExit = statesToExit.sort(this.exitOrder);
                for (var i = 0; i < statesToExit.length; ++i) {
                    var s = statesToExit[i];
                    if (s.historyStates != undefined) for (var j = 0; j < s.historyStates.length; ++j) {
                        var h = s.historyStates[j];
                        var hconf = [];
                        for (var k = 0; k < this.configuration.length; k++) {
                            var conf = this.configuration[k];
                            if ((h.deep && this.isDescendant(conf, s)) || (!h.deep && conf.parent == s)) {
                                hconf.push(conf);
                            }
                        }
                        this.historyValues[h.id] = hconf;
                    }
                }
                for (var i = 0; i < statesToExit.length; ++i) {
                    var s = statesToExit[i];
                    this.func(s.onexit);
                    this.configuration = removeFromSet(this.configuration, s);
                    if (s.id != undefined && s.id != "") {
                        this.removeCssClass("state_" + s.id);
                        /*
                         var sel = document.getElementById("screen_"+s.id);
                         if (sel != null)
                         sel.style.visibility = "hidden";
                         */
                    }
                }
            },
            enterStates: function enterStates(enabledTransitions) {
                var statesToEnter = new Set();
                var statesForDefaultEntry = new Set();
                for (var i = 0; i < enabledTransitions.length; ++i) {
                    var t = enabledTransitions[i];
                    if (t.targets != undefined && t.targets.length) {
                        var LCA = this.findLCA([t.source].concat(t.targets));
                        for (var j = 0; j < t.targets.length; ++j) {
                            this.addStatesToEnter(t.targets[j], LCA, statesToEnter, statesForDefaultEntry);
                        }
                    }
                }
                statesToEnter = statesToEnter.sort(this.entryOrder);
                for (var i = 0; i < statesToEnter.length; ++i) {
                    var s = statesToEnter[i];
                    this.configuration.push(s);
                    if (s.id != undefined && s.id != "") {
						this._name = s.id;
                        this.addCssClass("state_" + s.id);
                        var sel = document.getElementById("screen_" + s.id);
                        if (sel != null) sel.style.visibility = "visible";
                    }
                    this.func(s.onentry, this.event);
                    if (s.type == "F") {
                        var parent = s.parent;
                        var gparent = parent.parent;
                        this.raise("done." + parent.id);
                        if (gparent != undefined) {
                            if (gparent.type == "P" && this.isInFinalState("P")) {
                                this.raise("done." + gparent.oid);
                            }
                        }
                        if (this.isInFinalState(this.rootState)) {
                            this.doContinue = false;
                            this.finished();
                        }
                    }
                }
            },
            addStatesToEnter: function addStatesToEnter(s, root, statesToEnter) {
                if (s == undefined) return;
                if (s.type == 'H') {
                    var h = this.historyValues[s.id];
                    if (h != undefined) {
                        for (var i = 0; i < h.length; ++i) {
                            this.addStatesToEnter(h[i], root, statesToEnter);
                        }
                    } else if (s.states.length) {
                        this.addStatesToEnter(s.initialState, s, statesToEnter);
                    }
                } else {
                    statesToEnter.add(s);
                    if (s.type == 'P') {
                        for (var i = 0; i < s.states.length; ++i) {
                            this.addStatesToEnter(s.states[i], s, statesToEnter);
                        }
                    } else if (s.type == 'S' && s.states.length) {
                        this.addStatesToEnter(s.initialState, s, statesToEnter);
                    }
                    var pa = this.getProperAncestors(s, root);
                    if (root != undefined && root.type == 'P') {
                        for (var i = 0; i < root.states.length; ++i)
                        pa.add(root.states[i]);
                    }
                    for (var i = 0; i < pa.length; ++i) {
                        var anc = pa[i];
                        statesToEnter.add(anc);
                        if (anc.type == "P") {
                            for (var j = 0; j < anc.states.length; ++j) {
                                var pChild = anc.states[j];
                                var doAdd = true;
                                for (var k = 0; k < statesToEnter.length; ++k) {
                                    var s2 = statesToEnter[k];
                                    if (this.isDescendant(s2, pChild)) {
                                        doAdd = false;
                                        break;
                                    }
                                }
                                if (doAdd) this.addStatesToEnter(pChild, anc, statesToEnter);
                            }
                        }
                    }

                }
            },
            isInFinalState: function isInFinalState(state) {
                if (state.type == 'F') return true;
                else if (state.type == 'S') {
                    for (var i = 0; i < this.configuration.length; ++i) {
                        var s = this.configuration[i];
                        if (s.parent == state && s.type == 'F') return true;
                    }
                } else if (state.type == 'P') {
                    var all_done = true;
                    for (var j = 0; j < state.children.length; ++j) {
                        if (state.children[j].type != 'F') {
                            all_done = false;
                            break;
                        }
                    }
                    if (all_done) {
                        return true;
                    }
                } else return false;
            },
            isDescendant: function isDescendant(child, parent) {
				if(typeof(child) == "undefined") return false;
                for (var s = child.parent; s != parent; s = s.parent) {

                    if (typeof(s) == "undefined") return false;
                }
                return typeof(s) != "undefined";
            },
            getProperAncestors: function getProperAncestors(state, root) {
                var ancs = [];
                var i = 0;
                if (state != undefined) {
                    for (var s = state; s != root && s != undefined; s = s.parent) {
                        ancs[i++] = s;
                    }
                }
                return ancs;
            },
            findLCA: function findLCA(states) {
                var ancs = this.getProperAncestors(states[0]);
                for (var i = 0; i < ancs.length; ++i) {
                    var anc = ancs[i];
                    var all_are_descendants = true;
                    for (var j = 1; j < states.length; ++j) {
                        var s = states[j];
                        if (!this.isDescendant(s, anc)) {
                            all_are_descendants = false;
                            break;
                        }
                    }
                    if (all_are_descendants) return anc;
                    else return this.rootState;
                }
            },
            isPreempted: function isPreempted(state, transitionList) {
                for (var i = 0; i < transitionList.length; ++i) {
                    t = transitionList[i];
                    if (t.targets.length > 0) {
                        if (this.isDescendant(state, this.findLCA([t.source].concat(t.targets)))) {
                            return true;
                        }
                    }
                }
                return false;
            },
            func: function func(f, e) {
                if (typeof(f) == "function"){
					return f.call(this, e);
				}
                else return true;
            },
            addCssClass: function addCssClass(cls) {
                var ctx = [document.body];
                if (typeof(this.cssContext) != "undefined") ctx = document.querySelectorAll(this.cssContext);
                for (var i = 0; i < ctx.length; ++i)
                el_addClass(ctx[i], cls);
            },
            removeCssClass: function removeCssClass(cls) {
                var ctx = [document.body];
                if (typeof(this.cssContext) != "undefined") ctx = document.querySelectorAll(this.cssContext);
                if (typeof(ctx) != 'undefined') for (var i = 0; i < ctx.length; ++i) el_removeClass(ctx[i], cls);
            }
        };
    },
    loadScxml: function (doc) {
        var scxmlElement = doc.documentElement;
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

        function resolveElement(el) {
            var args = [];
			if(document.documentElement.firstElementChild){
				for (var e = el.firstElementChild; e != null; e = e.nextElementSibling) {
					args.push(resolveElement(e));
				}
			}
			else{
				var allNodes = el.childNodes;
				for (var i = 0; i < allNodes.length; i++) {
					if(allNodes[i].nodeType == 1){
						args.push(resolveElement(allNodes[i]));
					}
				}
			}
			
            var tagName;
			if(el.localName)  tagName = el.localName.toLowerCase();
			else tagName = el.nodeName.toLowerCase();
			
            if (tagName == 'initial' || ((tagName == 'state' || tagName == 'parallel' || tagName == 'history') && el.parentNode.getAttribute("initial") == el.getAttribute('id'))) args.push(Statechartz.Initial);
            if (tagName == "scxml") {
				if(document.documentElement.firstElementChild){
					for (var e = el.firstElementChild; e != null; e = e.nextElementSibling) {
						if (e.localName.toLowerCase() == 'script') {
							eval(e.textContent);
						}
					}
				}
				else{
					var allNodes = el.childNodes;
					for (var i = 0; i < allNodes.length; i++) {
						if(allNodes[i].nodeType == 1){
							if (allNodes[i].nodeName.toLowerCase() == 'script') {
								eval(allNodes[i].text);
							}
						}
					}
				}
                var sc = Statechartz.build(Statechartz.buildState("S", args));
                sc._data = {};
				sc._name = 'name';
                var datas = el.getElementsByTagName("data");
                for (var i = 0; i < datas.length; ++i) {
                    var data = datas[i];
                    sc._data[data.getAttribute("id")] = eval(data.getAttribute("expr"));
                }
                return sc;
            } else if (tagName == "state" || tagName == "initial") {
                args.push(el.getAttribute("id"));
                return Statechartz.buildState("S", args);
            } else if (tagName == "parallel") {
                args.push(el.getAttribute("id"));
                return Statechartz.buildState("P", args);
            } else if (tagName == "final") {
                args.push(el.getAttribute("id"));
                return Statechartz.buildState("F", args);
            } else if (tagName == "history") {
                if (el.getAttribute("type") == "shallow") args.push(el.getAttribute("type") == "shallow" ? Statechartz.Shallow : Statechartz.Deep);
                args.push(el.getAttribute("id"));
                return Statechartz.buildState("H", args);
            } else if (tagName == "onentry") {
				var result = Statechartz.Entry(createFunctionFromExecutionContext(args));
                return result;
            } else if (tagName == "onexit") {
                return Statechartz.Exit(createFunctionFromExecutionContext(args));
            } else if (tagName == "transition") {
                var func = createFunctionFromExecutionContext(args);
                args = [];
                var cond = el.getAttribute("cond");
                var ev = el.getAttribute("event");
                var target = el.getAttribute("target");
                if (func != undefined) args.push(func);
                if (cond != null) {
					var cond_func;
					var f= "(function(_event){with (this) { return " + cond + ";}})";
					if (window.execScript) {
						window.execScript('code_evaled = '+f);
						cond_func = code_evaled;
					} else {
						cond_func = eval("(function(_event){with (this) { return " + cond + ";}})");
					}
                    args.push({
                        condition: cond_func
                    });
                }
                if (ev != null) {
                    args.push(Statechartz.Event(ev));
                }
                if (target != null) {
                    args.push(Statechartz.Targets(target.split(' ')));
                }
                var t = {
                    cls: "transitions",
                    obj: Statechartz.buildFromArgs(args, "ontrigger")
                };
                if (t.targets == undefined) t.targets = [];
                return t;
            } else if (tagName == "if") {
                return "with(this) {if (" + el.getAttribute("cond") + ") {" + args.join(';') + "}}";
            } else if (tagName == "elseif") {
                return "} else if (" + el.getAttribute("cond") + ") {";
            } else if (tagName == "else") {
                return "} else {";
            } else if (tagName == "log") {
                return "";
            } else if (tagName == "raise") {
                return 'raise("' + el.getAttribute("event") + '",false,{' + args.join(',') + '})';
            } else if (tagName == "send") {
                var delay_attr = el.getAttribute("delay");
                if (delay_attr == null) delay_attr = "0";
                return 'setTimeout(function(){raise("' + el.getAttribute("event") + '",' + (el.getAttribute("target") != "_internal" ? 'true' : 'false') + ',{' + args.join(',') + '}),' + delay_attr + '});';
            } else if (tagName == "assign") {
                var loc = el.getAttribute("location");
                if (loc == null) loc = "_data." + el.getAttribute("dataid");
                return loc + "=" + el.getAttribute("expr");
            } else if (tagName == "script") {
				return getTextContent(el);
            } else if (tagName == "param") {
                return el.getAttribute("name") + ":" + el.getAttribute("expr");
            }
        }
        return resolveElement(scxmlElement);
    },
    loadFromDocument: function () {
        var links = document.getElementsByTagName("link");
        for (var i = 0; i < links.length; ++i) {
            var link = links[i];
            var rel = link.getAttribute("rel");
            if (rel == "statechart") {
				xmlDoc = getSource(link.getAttribute("href"));
				document.statechart = Statechartz.loadScxml(xmlDoc);
				Statechartz.doc = xmlDoc;
				document.statechart.start();
                /*var href = link.getAttribute("href");
                if (window.XMLHttpRequest) xhttp = new XMLHttpRequest();
                else xhttp = new ActiveXObject("Microsoft.XMLHTTP");
                xhttp.open("GET", href, false);
                xhttp.setRequestHeader("Content-Type", "application/xml;charset=UTF8");
                xhttp.send("");
                if (xhttp.readyState == 4) {
                    var xmlDoc = xhttp.responseXML;
                    if (xmlDoc == null) {
                        var parser = new DOMParser();
                        xmlDoc = parser.parseFromString(xhttp.responseText, "text/xml");
                    }
                    if (xmlDoc != null) {
                        document.statechart = Statechartz.loadScxml(xmlDoc);
						Statechartz.doc = xmlDoc;
                        document.statechart.start();
                    }
                }*/
            }
        }
    }
};

window.onload = Statechartz.loadFromDocument;

function getTextContent(aElement){
	if(aElement.textContent) return aElement.textContent;
	if(aElement.text) return aElement.text;
}