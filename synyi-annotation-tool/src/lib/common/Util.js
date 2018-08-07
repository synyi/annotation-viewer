'use strict';
var Util = (function () {
    function Util() {
    }
    Util.height = function (node) {
        return node.clientHeight || node.getBoundingClientRect().height || node.getBBox().height;
    };
    Util.width = function (node) {
        return node.clientWidth || node.getBoundingClientRect().width || node.getBBox().width;
    };
    Util.top = function (node) {
        return node.clientTop || node.getBoundingClientRect().top || node.getBBox().y;
    };
    Util.left = function (node) {
        return node.clientLeft || node.getBoundingClientRect().left || node.getBBox().x;
    };
    Util.autoIncrementId = function (lines, key) {
        var max = -1;
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            for (var _a = 0, line_1 = line; _a < line_1.length; _a++) {
                var item = line_1[_a];
                if (item[key] > max)
                    max = item[key];
            }
        }
        return max + 1;
    };
    Util.removeInLines = function (lines, callback) {
        for (var _i = 0, lines_2 = lines; _i < lines_2.length; _i++) {
            var line = lines_2[_i];
            for (var i = 0; i < line.length; i++) {
                if (callback(line[i])) {
                    line.splice(i, 1);
                    return true;
                }
            }
        }
        return false;
    };
    Util.throwError = function (message) {
        throw new Error("synyi-annotation-tool: " + message);
    };
    return Util;
}());
exports.Util = Util;
exports.invariant = function (condition, message) {
    if (!condition) {
        var error = void 0;
        if (message === undefined) {
            error = new Error("Minified exception occurred.");
        }
        else {
            message = '(poplar) ' + message;
            error = new Error(message);
            error.name = 'Invariant Violation';
        }
        throw error;
    }
};
exports.clone = function (object) {
    return JSON.parse(JSON.stringify(object));
};
exports.each = function (arr, callback) {
    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
        var element = arr_1[_i];
        callback(element);
    }
};
exports.end = function (arr) {
    return arr[arr.length - 1];
};
exports.start = function (arr) {
    return arr[0];
};
exports.endIndex = function (arr) {
    return arr.length > 0 ? arr.length - 1 : 0;
};
exports.nestPush = function (arr, index, element) {
    if (arr[index] === undefined)
        arr[index] = [];
    return arr[index].push(element);
};
exports.remove = function (arr, element) {
    var index = arr.indexOf(element);
    return index >= 0 ? arr.splice(index, 1) : [];
};
exports.isUndefined = function (target) {
    return target === undefined;
};
//# sourceMappingURL=Util.js.map