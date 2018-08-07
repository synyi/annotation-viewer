"use strict";
var EventBase_1 = require("../common/EventBase");
var Util_1 = require("../common/Util");
var Store = (function () {
    function Store(dispatcher) {
        var _this = this;
        this.__emitter = new EventBase_1.EventBase();
        this.__dispatcher = dispatcher;
        this.__className = this.constructor['name'];
        this.__changeEvent = 'changed';
        this.__changed = false;
        this._dispatchToken = dispatcher.register(function (payload) {
            _this.__invokeOnDispatch(payload);
        });
    }
    Store.prototype.emit = function (event, args) {
        this.__emitter.emit(this.__changeEvent, args);
        return this.__emitter.emit(event, args);
    };
    Store.prototype.on = function (event, listener) {
        return this.__emitter.on(event, listener);
    };
    Store.prototype.offById = function (event, id) {
        this.__emitter.offById(event, id);
    };
    Store.prototype.getDispatcher = function () {
        return this.__dispatcher;
    };
    Store.prototype.getDispatchToken = function () {
        return this._dispatchToken;
    };
    Store.prototype.__invokeOnDispatch = function (payload) {
        this.__changed = false;
        this.__onDispatch(payload);
    };
    Store.prototype.__onDispatch = function (payload) {
        Util_1.invariant(false, this.__className + " has not overridden Store.__onDispatch, which is required");
    };
    return Store;
}());
exports.Store = Store;
//# sourceMappingURL=Store.js.map