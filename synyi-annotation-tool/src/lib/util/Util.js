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
    Util.keyBy = function (array, key) {
        var result = {};
        for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
            var element = array_1[_i];
            result[element[key]] = element;
        }
        return result;
    };
    return Util;
}());
exports.Util = Util;
//# sourceMappingURL=Util.js.map