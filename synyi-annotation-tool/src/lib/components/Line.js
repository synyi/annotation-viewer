"use strict";
var Line = (function () {
    function Line(id, width, height) {
        this.svg = SVG(id).size(width, height);
    }
    Line.prototype.group = function () {
    };
    Line.prototype.extend = function (lineNo) {
    };
    return Line;
}());
exports.Line = Line;
//# sourceMappingURL=Line.js.map