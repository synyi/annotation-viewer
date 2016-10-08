System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var EventBase;
    return {
        setters:[],
        execute: function() {
            EventBase = (function () {
                function EventBase() {
                    this.listeners = {};
                }
                EventBase.prototype.emit = function (event, args) {
                    if (!this.listeners[event]) {
                        return false;
                    }
                    for (var _i = 0, _a = this.listeners[event]; _i < _a.length; _i++) {
                        var l = _a[_i];
                        l.listener(this, args);
                        return true;
                    }
                    return false;
                };
                EventBase.prototype.on = function (event, listener) {
                    if (!this.listeners[event]) {
                        this.listeners[event] = [];
                    }
                    var id = Math.random();
                    this.listeners[event].push({ listener: listener, id: id });
                    return id;
                };
                EventBase.prototype.off = function (event) {
                    this.listeners[event] = [];
                };
                EventBase.prototype.offById = function (event, id) {
                    var list = this.listeners[event];
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].id == id) {
                            list.splice(i, 1);
                            return;
                        }
                    }
                };
                EventBase.prototype.offAll = function () {
                    this.listeners = {};
                };
                return EventBase;
            }());
            exports_1("EventBase", EventBase);
        }
    }
});
//# sourceMappingURL=EventBase.js.map