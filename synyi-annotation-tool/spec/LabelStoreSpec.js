"use strict";
var _this = this;
var Label_1 = require("../src/lib/store/Label");
var Dispatcher_1 = require("../src/lib/Dispatcher");
describe("with LabelStore", function () {
    beforeEach(function () {
        var linesCount = [58, 69, 78, 67];
        var labels = [
            { id: 1, pos: [1, 5], category: 1 },
            { id: 2, pos: [57, 81], category: 4 }
        ];
        var dispatcher = new Dispatcher_1.Dispatcher();
        _this.labelsCount = labels.length;
        _this.labelStore = new Label_1.LabelStore(dispatcher, linesCount, labels);
    });
    afterEach(function () {
        _this.labelsCount = 0;
        delete _this.labelStore;
    });
    it('should support query all labels', function () {
        var labels = _this.labelStore.select();
        expect(labels.length).toEqual(_this.labelsCount);
    });
    it('should support retrieve a label by id', function () {
        var label = _this.labelStore.getById(2);
        expect(label.id).toEqual(2);
        expect(label.pos[1]).toEqual(81);
        expect(label.category).toEqual(4);
    });
    it('should contain an efficient binary search method', function () {
        expect(_this.labelStore._binarySearchLineNumber(10, 0, 3)).toEqual(0);
        expect(_this.labelStore._binarySearchLineNumber(58, 0, 3)).toEqual(1);
        expect(_this.labelStore._binarySearchLineNumber(204, 0, 3)).toEqual(2);
        expect(function () { _this.labelStore._binarySearchLineNumber(273, 0, 3); }).toThrow();
    });
    it("should support retrieve specific label's range", function () {
        var testRangeOne = _this.labelStore.getLineRangeById(1);
        expect(testRangeOne[0].line).toEqual(0);
        expect(testRangeOne[0].position).toEqual(1);
        expect(testRangeOne[1].line).toEqual(0);
        expect(testRangeOne[1].position).toEqual(5);
        var testRangeTwo = _this.labelStore.getLineRangeById(2);
        expect(testRangeTwo[0].line).toEqual(0);
        expect(testRangeTwo[1].line).toEqual(1);
        expect(testRangeTwo[1].position).toEqual(23);
    });
    it("should support select labels according to line number", function () {
        var labelsInLineOne = _this.labelStore.selectByLine(0);
        var labelsInLineTwo = _this.labelStore.selectByLine(1);
        expect(labelsInLineOne.length).toEqual(2);
        expect(labelsInLineTwo.length).toEqual(1);
        var labelInLineOne = labelsInLineOne[0];
        var labelInLineTwo = labelsInLineTwo[0];
        expect(labelInLineOne.id).toEqual(1);
        expect(labelInLineTwo.id).toEqual(2);
    });
    it("should support add new label into itself", function () {
        var label = _this.labelStore.add(1, [129, 140]);
        expect(label.id).toEqual(3);
        var labelLineRange = _this.labelStore.getLineRangeById(label.id);
        expect(labelLineRange[0].line).toEqual(2);
        expect(labelLineRange[0].position).toEqual(2);
        expect(_this.labelStore.select().length).toEqual(3);
    });
    it("should support remove specified label from itself", function () {
        _this.labelStore.remove(2);
        expect(_this.labelStore['_lastID']).toEqual(1);
        expect(_this.labelStore.select().length).toEqual(1);
        expect(function () { _this.labelStore.getById(2); }).toThrow();
        expect(_this.labelStore['_labelsInLines'][1].length).toEqual(0);
    });
    it("should support set label category by ID", function () {
        var label = _this.labelStore.setCategoryById(1, 3);
        expect(label.category).toEqual(3);
        label = _this.labelStore.getById(1);
        expect(label.category).toEqual(3);
    });
});
//# sourceMappingURL=LabelStoreSpec.js.map