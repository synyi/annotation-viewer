"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Store_1 = require("./Store");
var Util_1 = require("../common/Util");
var RelationStore = (function (_super) {
    __extends(RelationStore, _super);
    function RelationStore(dispatcher, relations) {
        var _this = this;
        _super.call(this, dispatcher);
        this._clear();
        this._relations = relations;
        Util_1.each(relations, function (relation) {
            _this._updateState(relation);
        });
    }
    RelationStore.prototype.select = function () {
        return Util_1.clone(this._relations);
    };
    RelationStore.prototype.getById = function (id) {
        Util_1.invariant(this._IDMap[id], "RelationStore.getById: Relation ID(" + id + ") does not map to a registered relation)");
        return Util_1.clone(this._IDMap[id]);
    };
    RelationStore.prototype.add = function (category, src, dst) {
        var id = this._lastID + 1;
        var relation = { id: id, category: category, src: src, dst: dst };
        try {
            this._relations.push(relation);
            this._updateState(relation);
        }
        catch (e) {
            this._evictState(relation);
            throw e;
        }
        this.emit('created', Util_1.clone(relation));
        return relation;
    };
    RelationStore.prototype.remove = function (id) {
        var relation = this._IDMap[id];
        Util_1.invariant(relation, "RelationStore.remove: Relation ID(" + id + ") does not map to a registered relation");
        this._evictState(relation);
        this.emit('deleted', Util_1.clone(relation));
    };
    RelationStore.prototype.removeByLabel = function (id) {
        var _this = this;
        var relationsToDelete = this._relations.filter(function (relation) { return relation.src == id || relation.dst == id; });
        Util_1.each(relationsToDelete, function (relation) {
            _this._evictState(relation, true);
        });
        this._lastID = this._relations.reduce(function (x, y) { return Math.max(x, y.id); }, 0);
        this.emit('deleted by label', Util_1.clone(relationsToDelete));
    };
    RelationStore.prototype._updateState = function (relation) {
        this._setIDMap(relation);
        this._lastID = Math.max(this._lastID, relation.id);
    };
    RelationStore.prototype._evictState = function (relation, lazy) {
        if (lazy === void 0) { lazy = false; }
        var id = relation.id;
        delete this._IDMap[id];
        Util_1.remove(this._relations, relation);
        if (!lazy)
            this._lastID = this._relations.reduce(function (x, y) { return Math.max(x, y.id); }, 0);
    };
    RelationStore.prototype._setIDMap = function (relation) {
        Util_1.invariant(this._IDMap[relation.id] === undefined, "RelationStore._setIDMap: Relation ID#" + relation.id + " is duplicated");
        this._IDMap[relation.id] = relation;
    };
    RelationStore.prototype._clear = function (update) {
        if (update === void 0) { update = false; }
        if (!update) {
            this._relations = [];
        }
        this._IDMap = {};
        this._lastID = 0;
    };
    return RelationStore;
}(Store_1.Store));
exports.RelationStore = RelationStore;
//# sourceMappingURL=Relation.js.map