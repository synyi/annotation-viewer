System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Line;
    return {
        setters:[],
        execute: function() {
            Line = (function () {
                function Line(id, width, height) {
                    this.svg = SVG(id).size(width, height);
                }
                Line.prototype.group = function () {
                };
                Line.prototype.extend = function (lineNo) {
                };
                return Line;
            }());
            exports_1("Line", Line);
        }
    }
});
//# sourceMappingURL=Line.js.map