"use strict";
var Util_1 = require("./common/Util");
var _prefix = 'ID_';
var Dispatcher = (function () {
    function Dispatcher() {
        this._callbacks = {};
        this._isDispatching = false;
        this._isHandled = {};
        this._isPending = {};
        this._lastID = 1;
    }
    Dispatcher.prototype.register = function (callback) {
        var id = _prefix + this._lastID++;
        this._callbacks[id] = callback;
        return id;
    };
    Dispatcher.prototype.unregister = function (id) {
        Util_1.invariant(this._callbacks[id], "Dispatcher.unregister(...): '" + id + "' does not map to a registered callback.");
        delete this._callbacks[id];
    };
    Dispatcher.prototype.waitFor = function (ids) {
        Util_1.invariant(this._isDispatching, 'Dispatcher.waitFor(...): Must be invoked while dispatching');
        for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
            var id = ids_1[_i];
            if (this._isPending[id]) {
                Util_1.invariant(this._isHandled[id], "Dispatcher.waitFor(...):  Circular dependency detected while waiting for " + id);
                continue;
            }
            Util_1.invariant(this._callbacks[id], "Dispatcher.waitFor(...): '" + id + "' does not map to a registered callback.");
            this._invokeCallback(id);
        }
    };
    Dispatcher.prototype.dispatch = function (payload) {
        Util_1.invariant(!this._isDispatching, 'Dispatcher.dispatch(...): Cannot dispatch in the middle of a dispatch');
        this._startDispatching(payload);
        try {
            for (var id in this._callbacks) {
                if (this._isPending[id]) {
                    continue;
                }
                this._invokeCallback(id);
            }
        }
        finally {
            this._stopDispatching();
        }
    };
    Dispatcher.prototype.isDispatching = function () {
        return this._isDispatching;
    };
    Dispatcher.prototype._invokeCallback = function (id) {
        this._isPending[id] = true;
        this._callbacks[id](this._pendingPayload);
        this._isHandled[id] = true;
    };
    Dispatcher.prototype._startDispatching = function (payload) {
        for (var id in this._callbacks) {
            this._isPending[id] = false;
            this._isHandled[id] = false;
        }
        this._pendingPayload = payload;
        this._isDispatching = true;
    };
    Dispatcher.prototype._stopDispatching = function () {
        delete this._pendingPayload;
        this._isDispatching = false;
    };
    return Dispatcher;
}());
exports.Dispatcher = Dispatcher;
//# sourceMappingURL=Dispatcher.js.map