"use strict";
var Label = (function () {
    function Label(id, category, pos) {
        this.pos = [0, 0];
        this.id = id;
        this.category = category;
        this.pos[0] = pos[0];
        this.pos[1] = pos[1];
    }
    Label.prototype.isTruncate = function (pos) {
        return (this.pos[0] <= pos && this.pos[1] > pos);
    };
    return Label;
}());
exports.Label = Label;
var LabelContainer = (function () {
    function LabelContainer() {
        this.labels = [];
        this.lineMap = {};
    }
    LabelContainer.prototype.create = function (id, category, pos) {
        this.insert(new Label(id, category, pos));
    };
    LabelContainer.prototype.push = function (label) {
        this.insert(label);
    };
    LabelContainer.prototype.get = function (id) {
        return this.labels[id];
    };
    Object.defineProperty(LabelContainer.prototype, "length", {
        get: function () {
            return this.labels.length;
        },
        enumerable: true,
        configurable: true
    });
    LabelContainer.prototype.gen = function (label) {
        return this.labels;
    };
    LabelContainer.prototype.insert = function (target) {
        var i = 0;
        for (var _i = 0, _a = this.labels; _i < _a.length; _i++) {
            var label = _a[_i];
            if (label.pos[0] < target.pos[0])
                i += 1;
        }
        this.labels.splice(i, 0, target);
    };
    return LabelContainer;
}());
exports.LabelContainer = LabelContainer;
//# sourceMappingURL=Label.js.map