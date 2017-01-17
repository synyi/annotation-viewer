/**
 * Created by yjh on 2016/10/8.
 */
System.register(["./synyi-annotation-tool/src/Annotator"], function (exports_1, context_1) {
    "use strict";
    var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments)).next());
        });
    };
    var __generator = (this && this.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (sent[0] === 1) throw sent[1]; return sent[1]; }, trys: [], stack: [] }, sent, f;
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (1) {
                if (_.done) switch (op[0]) {
                    case 0: return { value: void 0, done: true };
                    case 1: case 6: throw op[1];
                    case 2: return { value: op[1], done: true };
                }
                try {
                    switch (f = 1, op[0]) {
                        case 0: case 1: sent = op; break;
                        case 4: return _.label++, { value: op[1], done: false };
                        case 7: op = _.stack.pop(), _.trys.pop(); continue;
                        default:
                            var r = _.trys.length > 0 && _.trys[_.trys.length - 1];
                            if (!r && (op[0] === 6 || op[0] === 2)) { _.done = 1; continue; }
                            if (op[0] === 3 && (!r || (op[1] > r[0] && op[1] < r[3]))) { _.label = op[1]; break; }
                            if (op[0] === 6 && _.label < r[1]) { _.label = r[1], sent = op; break; }
                            if (r && _.label < r[2]) { _.label = r[2], _.stack.push(op); break; }
                            if (r[2]) { _.stack.pop(); }
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) { op = [6, e]; }
                finally { f = 0, sent = void 0; }
            }
        }
        return {
            next: function (v) { return step([0, v]); },
            "throw": function (v) { return step([1, v]); },
            "return": function (v) { return step([2, v]); }
        };
    };
    var __moduleName = context_1 && context_1.id;
    function loadContentOfFile(file) {
        var fr = new FileReader();
        return new Promise(function (resolve) {
            fr.onload = function () {
                resolve(fr.result);
            };
            fr.readAsText(file, 'utf-8');
        });
    }
    function jsonp(url, callbackName) {
        if (!callbackName) {
            callbackName = '__callback__' + Math.round(Math.random() * 1000000);
        }
        return new Promise(function (resolve, reject) {
            window[callbackName] = function (content) {
                resolve(content);
                document.body.removeChild(scp);
                window[callbackName] = undefined;
            };
            var scp = document.createElement('script');
            scp.src = url + callbackName;
            scp.onerror = reject;
            document.body.appendChild(scp);
        });
    }
    function run() {
        return __awaiter(this, void 0, void 0, function () {
            var contentInput, result, nlpResult, rel_labels, relationDict, category_labels, text, concepts, labels, relations, rid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        contentInput = document.querySelector('#content');
                        return [4 /*yield*/, loadContentOfFile(contentInput.files[0])];
                    case 1:
                        result = _a.sent();
                        nlpResult = JSON.parse(result);
                        return [4 /*yield*/, annotationService.getRelation()];
                    case 2:
                        rel_labels = _a.sent();
                        relationDict = {};
                        rel_labels.forEach(function (x) { return relationDict[x.id] = x.text; });
                        return [4 /*yield*/, annotationService.getCategory()];
                    case 3:
                        category_labels = _a.sent();
                        text = nlpResult.rawText;
                        concepts = nlpResult.NLPResult.concepts;
                        labels = concepts.map(function (x) {
                            return {
                                category: x.category,
                                pos: [x.pos[0], x.pos[1] - 1],
                                id: x.id
                            };
                        });
                        relations = [];
                        rid = 0;
                        concepts.forEach(function (x) {
                            x.relations.forEach(function (r) {
                                relations.push({
                                    src: r.src_id,
                                    text: relationDict[r.type],
                                    id: rid++,
                                    dst: x.id
                                });
                            });
                        });
                        ann.import(text, category_labels, labels, relations);
                        return [2 /*return*/];
                }
            });
        });
    }
    var Annotator_1, AnnotationService, annotationService, ann;
    return {
        setters: [
            function (Annotator_1_1) {
                Annotator_1 = Annotator_1_1;
            }
        ],
        execute: function () {/**
             * Created by yjh on 2016/10/8.
             */
            AnnotationService = (function () {
                function AnnotationService() {
                }
                AnnotationService.prototype.getRelation = function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!!this.relCache)
                                        return [3 /*break*/, 2];
                                    _a = this;
                                    return [4 /*yield*/, jsonp('https://yi-ai.cn/api/category/relation/export?callback=')];
                                case 1:
                                    _a.relCache = _b.sent();
                                    _b.label = 2;
                                case 2: return [2 /*return*/, this.relCache];
                            }
                        });
                    });
                };
                AnnotationService.prototype.getCategory = function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!!this.catCache)
                                        return [3 /*break*/, 2];
                                    _a = this;
                                    return [4 /*yield*/, jsonp('https://yi-ai.cn/api/category/label/export?callback=')];
                                case 1:
                                    _a.catCache = _b.sent();
                                    _b.label = 2;
                                case 2: return [2 /*return*/, this.catCache];
                            }
                        });
                    });
                };
                return AnnotationService;
            }());
            annotationService = new AnnotationService();
            ann = new Annotator_1.Annotator(document.querySelector('#con'));
            document.querySelector('#run').addEventListener('click', function () { return run(); });
        }
    };
});
//# sourceMappingURL=main.js.map