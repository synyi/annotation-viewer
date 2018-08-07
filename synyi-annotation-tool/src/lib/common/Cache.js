"use strict";
var Util_1 = require("./Util");
var Cache = (function () {
    function Cache() {
        this._cache = {};
    }
    Cache.prototype.get = function (key) {
        return this._cache[key];
    };
    Cache.prototype.set = function (key, value) {
        this._cache[key] = value;
    };
    Cache.prototype.has = function (key) {
        return (key in this._cache);
    };
    Cache.prototype.clear = function () {
        this._cache = {};
    };
    return Cache;
}());
exports.Cache = Cache;
exports.memorize = function (target, propertyKey, descriptor) {
    var func = descriptor.value;
    var serialize = function (args) { return (propertyKey + '.' + isPrimitiveArg(args) ? args[0] : JSON.stringify(args)); };
    if (Util_1.isUndefined(target.constructor._cache))
        target.constructor._cache = new Cache();
    descriptor.value = function () {
        var cache = target.constructor._cache;
        var key = serialize(arguments);
        if (cache.has(key))
            return cache.get(key);
        var ret = func.apply(this, arguments);
        cache.set(key, ret);
        return ret;
    };
    return descriptor;
};
exports.clear = function (target, propertyKey, descriptor) {
    if (target.constructor._cache instanceof Cache)
        target.constructor._cache.clear();
    return descriptor;
};
var isPrimitiveArg = function (args) {
    if (args.length === 1) {
        var arg = args[0];
        var type = typeof arg;
        return arg == null || (type != "object" && type != "function");
    }
    return false;
};
//# sourceMappingURL=Cache.js.map