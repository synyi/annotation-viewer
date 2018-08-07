"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Util_1 = require('../common/Util');
var Cache_1 = require('../common/Cache');
var Store_1 = require("./Store");
var LabelStore = (function (_super) {
    __extends(LabelStore, _super);
    function LabelStore(dispatcher, linesCount, labels) {
        var _this = this;
        _super.call(this, dispatcher);
        this._clear();
        this._labels = labels;
        this._linesCount = linesCount;
        linesCount.reduce(function (sum, count) {
            sum += count;
            _this._linesAccumulatedCount.push(sum);
            return sum;
        }, 0);
        Util_1.each(labels, function (label) {
            _this._updateState(label);
        });
    }
    LabelStore.prototype.select = function () {
        return Util_1.clone(this._labels);
    };
    LabelStore.prototype.getById = function (id) {
        Util_1.invariant(this._IDMap[id], "LabelStore.getById: Label id(" + id + ") does not map to a registered label)");
        return Util_1.clone(this._IDMap[id]);
    };
    LabelStore.prototype.selectByLine = function (lineNumber) {
        Util_1.invariant(lineNumber < this._labelsInLines.length && lineNumber >= 0, "LabelStore.selectByLine: Line number #" + lineNumber + " is out of range");
        return Util_1.clone(this._labelsInLines[lineNumber]);
    };
    LabelStore.prototype.getLineRangeById = function (id) {
        Util_1.invariant(this._IDMap[id], "LabelStore.getLineRangeById: Label ID(" + id + ") does not map to a registered label)");
        var totalChars = Util_1.end(this._linesAccumulatedCount);
        var _a = this._IDMap[id].pos, startPos = _a[0], endPos = _a[1];
        var startLineNumber = this._binarySearchLineNumber(startPos, 0, Util_1.endIndex(this._linesAccumulatedCount));
        var endLineNumber = this._binarySearchLineNumber(endPos, 0, Util_1.endIndex(this._linesAccumulatedCount));
        var startLinePosition = { line: startLineNumber,
            position: startPos - (this._linesAccumulatedCount[startLineNumber - 1] || 0) };
        var endLinePosition = { line: endLineNumber,
            position: endPos - (this._linesAccumulatedCount[endLineNumber - 1] || 0) };
        return [startLinePosition, endLinePosition];
    };
    LabelStore.prototype.add = function (category, position) {
        var id = this._lastID + 1;
        var label = { category: category, pos: position, id: id };
        try {
            this._labels.push(label);
            this._updateState(label);
        }
        catch (e) {
            this._evictState(label);
            throw e;
        }
        this.emit('created', Util_1.clone(label));
        return label;
    };
    LabelStore.prototype.setCategoryById = function (id, category) {
        var label = this._IDMap[id];
        Util_1.invariant(label, "LabelStore.setCategoryById: Label ID(" + id + ") does not map to a registered label");
        label.category = category;
        this.emit('updated', Util_1.clone(label));
        return Util_1.clone(label);
    };
    LabelStore.prototype.remove = function (id) {
        var label = this._IDMap[id];
        Util_1.invariant(label, "LabelStore.remove: Label ID(" + id + ") does not map to a registered label");
        this._evictState(label);
        this.emit('deleted', Util_1.clone(label));
    };
    LabelStore.prototype._binarySearchLineNumber = function (position, start, end) {
        if (start >= end) {
            var count = this._linesAccumulatedCount[start];
            Util_1.invariant(position < count, "LabelStore._binarySearchLineNumber: Label position(" + position + ") is out of range(" + start + ":" + count + ")");
            return start;
        }
        var middle = Math.floor((start + end) / 2);
        return this._linesAccumulatedCount[middle] > position
            ? this._binarySearchLineNumber(position, start, middle)
            : this._binarySearchLineNumber(position, middle + 1, end);
    };
    LabelStore.prototype._updateState = function (label) {
        this._setIDMap(label);
        this._parseLabelInLines(label);
        this._lastID = Math.max(this._lastID, label.id);
    };
    LabelStore.prototype._evictState = function (label) {
        var id = label.id;
        delete this._IDMap[id];
        Util_1.each(this._labelsInLines, function (labelsInLine) {
            Util_1.remove(labelsInLine, label);
        });
        Util_1.remove(this._labels, label);
        this._lastID = this._labels.reduce(function (x, y) { return Math.max(x, y.id); }, 0);
    };
    LabelStore.prototype._parseLabelInLines = function (label) {
        var _a = this.getLineRangeById(label.id), startLine = _a[0].line, endLine = _a[1].line;
        Util_1.nestPush(this._labelsInLines, startLine, label);
        if (startLine !== endLine)
            Util_1.nestPush(this._labelsInLines, endLine, label);
    };
    LabelStore.prototype._setIDMap = function (label) {
        Util_1.invariant(this._IDMap[label.id] === undefined, "LabelStore._setIDMap: Label id#" + label.id + " is duplicated");
        this._IDMap[label.id] = label;
    };
    LabelStore.prototype._clear = function (update) {
        if (update === void 0) { update = false; }
        if (!update) {
            this._linesCount = [];
            this._labels = [];
        }
        this._labelsInLines = [];
        this._linesAccumulatedCount = [];
        this._IDMap = {};
        this._lastID = 0;
    };
    __decorate([
        Cache_1.memorize
    ], LabelStore.prototype, "getLineRangeById", null);
    __decorate([
        Cache_1.clear
    ], LabelStore.prototype, "_clear", null);
    return LabelStore;
}(Store_1.Store));
exports.LabelStore = LabelStore;
//# sourceMappingURL=Label.js.map