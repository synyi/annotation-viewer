"use strict";
var _this = this;
var Relation_1 = require("../src/lib/store/Relation");
var Dispatcher_1 = require("../src/lib/Dispatcher");
describe('with RelationStore', function () {
    beforeEach(function () {
        var relations = [
            { id: 1, src: 1, dst: 2, category: 2 },
            { id: 2, src: 2, dst: 4, category: 1 }
        ];
        var dispatcher = new Dispatcher_1.Dispatcher();
        _this.relationCount = relations.length;
        _this.relationStore = new Relation_1.RelationStore(dispatcher, relations);
    });
    afterEach(function () {
        _this.relationCount = 0;
        delete _this.relationStore;
    });
    it('should support query all relations', function () {
        var relations = _this.relationStore.select();
        expect(relations.length).toEqual(_this.relationCount);
    });
    it('should support retrieve a relation by ID', function () {
        var relation = _this.relationStore.getById(1);
        expect(relation.id).toEqual(1);
        expect(relation.category).toEqual(2);
        expect(relation.src).toEqual(1);
        expect(relation.dst).toEqual(2);
    });
    it('should support add new relation into itself', function () {
        var relation = _this.relationStore.add(3, 2, 1);
        expect(relation.id).toEqual(3);
        expect(_this.relationStore.select().length).toEqual(_this.relationCount + 1);
    });
    it('should support remove specified relation from itself', function () {
        _this.relationStore.remove(1);
        var relations = _this.relationStore.select();
        expect(relations.length).toEqual(_this.relationCount - 1);
        expect(_this.relationStore['_lastID']).toEqual(2);
        expect(function () { _this.relationStore.getById(1); }).toThrow();
    });
});
//# sourceMappingURL=RelationStoreSpec.js.map