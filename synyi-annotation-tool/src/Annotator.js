System.register(['./lib/util/TextSelector', './lib/util/EventBase', './lib/Draw', './lib/components/Paragraph', './lib/components/Label', './lib/util/Util'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var TextSelector_1, EventBase_1, Draw_1, Paragraph_1, Label_1, Util_1;
    var Categories, States, Annotator, InvalidLabelError;
    return {
        setters:[
            function (TextSelector_1_1) {
                TextSelector_1 = TextSelector_1_1;
            },
            function (EventBase_1_1) {
                EventBase_1 = EventBase_1_1;
            },
            function (Draw_1_1) {
                Draw_1 = Draw_1_1;
            },
            function (Paragraph_1_1) {
                Paragraph_1 = Paragraph_1_1;
            },
            function (Label_1_1) {
                Label_1 = Label_1_1;
            },
            function (Util_1_1) {
                Util_1 = Util_1_1;
            }],
        execute: function() {
            (function (Categories) {
                Categories[Categories['sign&symptom'] = 1] = 'sign&symptom';
                Categories[Categories['diagnosis'] = 2] = 'diagnosis';
                Categories[Categories['assessment'] = 3] = 'assessment';
                Categories[Categories['treatment'] = 4] = 'treatment';
                Categories[Categories["index"] = 5] = "index";
                Categories[Categories["drug"] = 6] = "drug";
                Categories[Categories["body location"] = 7] = "body location";
                Categories[Categories["frequency"] = 8] = "frequency";
                Categories[Categories["value"] = 9] = "value";
                Categories[Categories["change"] = 10] = "change";
                Categories[Categories["modifier"] = 11] = "modifier";
                Categories[Categories["time"] = 12] = "time";
                Categories[Categories["instrument"] = 13] = "instrument";
                Categories[Categories["location"] = 14] = "location";
                Categories[Categories["unit"] = 15] = "unit";
                Categories[Categories["degree"] = 16] = "degree";
                Categories[Categories["bool"] = 17] = "bool";
                Categories[Categories["privacy"] = 18] = "privacy";
                Categories[Categories["probability"] = 19] = "probability";
            })(Categories || (Categories = {}));
            exports_1("Categories", Categories);
            (function (States) {
                States[States["Init"] = 0] = "Init";
                States[States["Rendering"] = 1] = "Rendering";
                States[States["Interrupted"] = 2] = "Interrupted";
                States[States["Finished"] = 3] = "Finished";
            })(States || (States = {}));
            Annotator = (function (_super) {
                __extends(Annotator, _super);
                function Annotator(container, config) {
                    var _this = this;
                    if (config === void 0) { config = {}; }
                    _super.call(this);
                    this.group = {};
                    this.lines = {};
                    this.category = [];
                    this.labelsSVG = [];
                    this.linkable = false;
                    this.underscorable = false;
                    this.progress = 0;
                    this.config = {
                        visible: {
                            'relation': true,
                            'highlight': true,
                            'label': true
                        },
                        style: {
                            padding: 10,
                            baseLeft: 30,
                            rectColor: '',
                            bgColor: 'white',
                            width: 0,
                            height: 0
                        },
                        puncLen: 80,
                        linesPerRender: 15,
                        selectable: false
                    };
                    this.labelLineMap = {};
                    this.relationLineMap = {};
                    this.background = undefined;
                    this.baseTop = 0;
                    this.baseLeft = 0;
                    this.maxWidth = 0;
                    this.labelSelected = false;
                    this.selectedLabel = {};
                    this.trackLine = null;
                    this._state = States.Init;
                    this.svg = SVG(container);
                    this.init();
                    this.draw = new Draw_1.Draw(this);
                    this.svg.node.addEventListener('mouseup', function (event) {
                        if (event.detail >= 2) {
                            TextSelector_1.TextSelector.clear();
                            return;
                        }
                        _this.selectionParagraphEventHandler();
                    });
                    this.svg.node.addEventListener('click', function (event) {
                        _this.clickLabelEventHandler(event);
                        _this.clickRelationEventHandler(event);
                    });
                    this.svg.node.addEventListener('mousemove', function (event) {
                        _this.mousemoveEventHandler(event);
                    });
                    this.svg.node.addEventListener('mouseover', function (event) {
                        _this.moveoverEventHandler(event);
                    });
                    this.svg.node.addEventListener('mouseout', function (event) {
                        _this.moveoutEventHandler(event);
                    });
                    this.loadConfig(config);
                    this.svg.size(this.config.style.width, this.config.style.height);
                    window['a'] = this;
                }
                Object.defineProperty(Annotator.prototype, "state", {
                    get: function () {
                        return this._state;
                    },
                    set: function (value) {
                        var name = States[value];
                        this.emit('state changed', name);
                        this.emit("state " + name.toLowerCase());
                        this._state = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Annotator.prototype.init = function () {
                    this.group = {
                        shadow: this.svg.group(),
                        background: this.svg.group(),
                        relation: this.svg.group(),
                        highlight: this.svg.group(),
                        text: this.svg.group(),
                        annotation: []
                    };
                    this.lines = {
                        text: [],
                        highlight: [],
                        annotation: this.group['annotation'],
                        raw: [],
                        label: [],
                        relation: [],
                        relation_meta: [],
                        top: 0
                    };
                    this.labelLineMap = {};
                    this.relationLineMap = {};
                    this.labels = new Label_1.LabelContainer();
                    this.progress = 0;
                    this.raw = '';
                    this.state = States.Init;
                    this.background = this.group['background'].rect(0, 0, this.config.style.width, this.config.style.height).fill('white');
                };
                Annotator.prototype.clear = function () {
                    this.svg.clear();
                    this.init();
                };
                Annotator.prototype.render = function (startAt) {
                    var _this = this;
                    this.requestAnimeFrame(function () {
                        var linesPerRender = _this.config.linesPerRender;
                        try {
                            var lines = _this.lines['raw'];
                            if (_this.state !== States.Rendering || !_this.svg || _this.svg.node.getClientRects().length < 1) {
                                _this.state = States.Interrupted;
                                throw new Error('Render is interrupted, maybe svg root element is invisible now.');
                            }
                            var endAt_1 = startAt + linesPerRender > lines.length ? lines.length : startAt + linesPerRender;
                            if (startAt >= lines.length) {
                                _this.transformRelationMeta();
                                _this.draw.reRelations();
                                _this.state = States.Finished;
                                return;
                            }
                            var style = _this.config.style;
                            for (var i = startAt; i < endAt_1; i++) {
                                _this.baseTop = style.height;
                                var text = _this.draw.textline(i + 1, lines[i], _this.baseLeft, _this.baseTop);
                                var width = Util_1.Util.width(text.node) + _this.baseLeft;
                                if (width > _this.maxWidth)
                                    _this.maxWidth = width;
                                _this.lines['text'].push(text);
                                _this.lines['annotation'].push([]);
                                _this.lines['highlight'].push([]);
                                _this.lines['relation'].push([]);
                                _this.baseTop += style.padding + Util_1.Util.height(text.node);
                                style.height = _this.baseTop;
                                if (_this.lines['label'][i]) {
                                    for (var _i = 0, _a = _this.lines['label'][i]; _i < _a.length; _i++) {
                                        var label = _a[_i];
                                        var raw = _this.lines['raw'][i];
                                        var j = 0;
                                        var x = label.x, y = label.y;
                                        while (raw[j] == ' ') {
                                            j += 1;
                                            x -= 1;
                                            y -= 1;
                                        }
                                        if (x < 0 || y < 0)
                                            continue;
                                        try {
                                            var startAt_1 = _this.lines['text'][i].node.getExtentOfChar(x);
                                            var endAt_2 = _this.lines['text'][i].node.getExtentOfChar(y);
                                            var selector = {
                                                lineNo: i + 1,
                                                width: endAt_2.x - startAt_1.x + endAt_2.width,
                                                height: startAt_1.height,
                                                left: startAt_1.x,
                                                top: startAt_1.y
                                            };
                                            _this.draw.label(label.id, label.category, selector);
                                        }
                                        catch (e) {
                                            if (e.name === 'IndexSizeError') {
                                                console.error('Error occured while indexing text line(最可能是标签匹配错位,请联系yjh)');
                                                if (e.stack)
                                                    console.error(e.stack);
                                            }
                                            else {
                                                throw e;
                                            }
                                        }
                                    }
                                }
                                if (_this.lines['relation_meta'][i]) {
                                    for (var _b = 0, _c = _this.lines['relation_meta'][i]; _b < _c.length; _b++) {
                                        var relation = _c[_b];
                                        if (relation.invalid)
                                            continue;
                                        var id = relation.id, src = relation.src, dst = relation.dst, text_1 = relation.text;
                                        try {
                                            _this.draw.relation(id, src, dst, text_1);
                                        }
                                        catch (e) {
                                            console.error(e.message);
                                            if (e.stack)
                                                console.error(e.stack);
                                        }
                                    }
                                }
                            }
                            _this.config.style.width = _this.maxWidth + 100;
                            _this.resize(_this.maxWidth + 100, _this.config.style.height);
                            _this.progress = endAt_1 / lines.length;
                            _this.emit('progress', _this.progress);
                            setTimeout(function () {
                                _this.render(endAt_1);
                            }, 10);
                        }
                        catch (e) {
                            console.error(e.message);
                            if (e.stack)
                                console.error(e.stack);
                            _this.state = States.Interrupted;
                        }
                    });
                };
                Annotator.prototype.loadConfig = function (config) {
                    for (var _i = 0, _a = Object.keys(this.config.style); _i < _a.length; _i++) {
                        var key = _a[_i];
                        if (config[key])
                            this.config.style[key] = config[key];
                    }
                    if (config.visible) {
                        for (var _b = 0, _c = Object.keys(this.config.visible); _b < _c.length; _b++) {
                            var key = _c[_b];
                            if (config.visible[key] !== undefined)
                                this.config.visible[key] = config.visible[key];
                        }
                    }
                    if (config.linesPerRender)
                        this.config.linesPerRender = config.linesPerRender;
                    if (config.puncLen)
                        this.config.puncLen = config.puncLen;
                    if (config.selectable)
                        this.config.selectable = config.selectable;
                };
                Annotator.prototype.import = function (raw, categories, labels, relations) {
                    if (categories === void 0) { categories = []; }
                    if (labels === void 0) { labels = []; }
                    if (relations === void 0) { relations = []; }
                    if (this.state == States.Rendering)
                        throw new Error('Can not import data while svg is rendering...');
                    this.clear();
                    this.category = categories;
                    this.raw = raw;
                    var slices = raw.split(/(.*?[\n\r])/g)
                        .filter(function (value) { return value.length > 0; })
                        .map(function (value) { return value.replace('\n', ' '); });
                    var lines = [];
                    for (var _i = 0, labels_1 = labels; _i < labels_1.length; _i++) {
                        var label = labels_1[_i];
                        this.labels.create(label.id, label.category, label.pos);
                    }
                    var lineNo = 0;
                    var basePos = 0;
                    var loopLimit = 0;
                    var labelSentinel = 0;
                    var puncLen = this.config.puncLen;
                    while (slices.length > 0) {
                        loopLimit += 1;
                        if (loopLimit > 100000) {
                            throw new Error('dead loop!');
                        }
                        var slice = slices.shift();
                        if (slice.length < 1)
                            continue;
                        if (slice.length > puncLen) {
                            if (slices.length < 1 && slice.slice(puncLen).length > 0)
                                slices[0] = slice.slice(puncLen);
                            else if (slices.length > 0)
                                slices[0] = slice.slice(puncLen) + slices[0];
                            slice = slice.slice(0, puncLen);
                        }
                        var truncPos = basePos + slice.length - 1;
                        while (true) {
                            if (this.labels.length <= labelSentinel)
                                break;
                            var i = labelSentinel;
                            var truncFlag = false;
                            while (true) {
                                var label = this.labels.get(i);
                                if (label.pos[0] > truncPos)
                                    break;
                                if (label.isTruncate(truncPos)) {
                                    truncFlag = true;
                                    truncPos = label.pos[0] - 1;
                                }
                                i += 1;
                                if (this.labels.length <= i)
                                    break;
                            }
                            if (!truncFlag) {
                                labelSentinel = i;
                                break;
                            }
                        }
                        if (slice.length < 1 || truncPos < basePos)
                            continue;
                        var truncOffset = truncPos - basePos + 1;
                        if (slices.length > 0)
                            slices[0] = slice.slice(truncOffset) + slices[0];
                        else if (slice.slice(truncOffset).length > 0)
                            slices[0] = slice.slice(truncOffset);
                        slice = slice.slice(0, truncOffset);
                        lineNo += 1;
                        basePos += slice.length;
                        lines.push(slice);
                        this.lines['raw'].push(slice);
                    }
                    this.baseTop = this.config.style.height = 10;
                    this.baseLeft = this.config.style.baseLeft;
                    this.maxWidth = 0;
                    for (var _a = 0, lines_1 = lines; _a < lines_1.length; _a++) {
                        var line = lines_1[_a];
                        this.lines['label'].push([]);
                    }
                    for (var _b = 0, labels_2 = labels; _b < labels_2.length; _b++) {
                        var label = labels_2[_b];
                        try {
                            var _c = this.posInLine(label['pos'][0], label['pos'][1]), x = _c.x, y = _c.y, no = _c.no;
                            this.lines['label'][no - 1].push({ x: x, y: y, category: label['category'], id: label['id'], pos: label['pos'] });
                            this.labelLineMap[label['id']] = no;
                        }
                        catch (e) {
                            if (e instanceof InvalidLabelError) {
                                console.error(e.message);
                                this.lines['label'][0].push({
                                    x: -1,
                                    y: -1,
                                    id: label['id'],
                                    category: label['category'],
                                    pos: label['pos']
                                });
                                continue;
                            }
                            throw e;
                        }
                    }
                    for (var _d = 0, lines_2 = lines; _d < lines_2.length; _d++) {
                        var line = lines_2[_d];
                        this.lines['relation_meta'].push([]);
                    }
                    for (var _e = 0, relations_1 = relations; _e < relations_1.length; _e++) {
                        var relation = relations_1[_e];
                        var srcLineNo = this.labelLineMap[relation['src']];
                        var dstLineNo = this.labelLineMap[relation['dst']];
                        if (typeof srcLineNo == 'number' && typeof dstLineNo == 'number') {
                            var lineNo_1 = Math.max(srcLineNo, dstLineNo);
                            var id = relation.id, src = relation.src, dst = relation.dst, text = relation.text;
                            this.lines['relation_meta'][lineNo_1 - 1].push({ id: id, src: src, dst: dst, text: text });
                        }
                        else {
                            var id = relation.id, src = relation.src, dst = relation.dst, text = relation.text;
                            this.lines['relation_mata'][0].push({
                                id: id,
                                src: src,
                                dst: dst,
                                text: text,
                                invalid: false
                            });
                        }
                    }
                    this.state = States.Rendering;
                    this.render(0);
                };
                Annotator.prototype.dump = function () {
                    var labels = this.lines['label'].reduce(function (labels, line) {
                        for (var _i = 0, line_1 = line; _i < line_1.length; _i++) {
                            var label = line_1[_i];
                            labels.push({
                                'id': label.id,
                                'category': label.category,
                                'pos': label.pos
                            });
                        }
                        return labels;
                    }, []);
                    var relations = this.lines['relation_meta'].reduce(function (relations, line) {
                        for (var _i = 0, line_2 = line; _i < line_2.length; _i++) {
                            var relation = line_2[_i];
                            relations.push({
                                'id': relation.id,
                                'src': relation.src,
                                'dst': relation.dst,
                                'text': relation.text
                            });
                        }
                        return relations;
                    }, []);
                    return { labels: labels, relations: relations };
                };
                Annotator.prototype.refresh = function () {
                    var _a = this.dump(), labels = _a.labels, relations = _a.relations;
                    if (this.state == States.Rendering)
                        throw new Error('Refreshing is not allowed in current state');
                    this.state = States.Init;
                    this.import(this.raw, this.category, labels, relations);
                };
                Annotator.prototype.getConfig = function () {
                    return JSON.parse(JSON.stringify(this.config));
                };
                Annotator.prototype.setVisiblity = function (component, visible) {
                    if (this.config.visible[component] === undefined)
                        throw new Error("\"" + component + "\" is not a componenet of annotation-tool");
                    if (typeof visible !== 'boolean')
                        throw new Error("\"" + visible + "\" is not boolean");
                    this.config.visible[component] = visible;
                };
                Annotator.prototype.setStyle = function (attribute, value) {
                    if (this.config.style[attribute])
                        this.config.style[attribute] = value;
                    else
                        throw new Error("\"attr " + attribute + "\" is not found.");
                };
                Annotator.prototype.setConfig = function (key, value) {
                    if (this.config[key] && key !== 'style' && key !== 'visibility')
                        this.config[key] = value;
                };
                Annotator.prototype.exportPNG = function (scale, filename) {
                    if (scale === void 0) { scale = 1; }
                    if (filename === void 0) { filename = 'export.png'; }
                    var el = this.svg.node;
                    var dataUrl = 'data:image/svg+xml;utf-8,' + el.outerHTML;
                    var img = document.createElement('img');
                    var a = document.createElement('a');
                    document.body.appendChild(a);
                    a.setAttribute('style', 'display: none');
                    img.onload = function () {
                        var canvas = document.createElement('canvas');
                        canvas.width = scale * img.width;
                        canvas.height = scale * img.height;
                        var ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width * scale, img.height * scale);
                        if (canvas.toBlob) {
                            canvas.toBlob(function (b) {
                                var url = URL.createObjectURL(b);
                                a.setAttribute('href', url);
                                a.setAttribute('download', filename);
                                a.click();
                                URL.revokeObjectURL(url);
                            });
                        }
                        else {
                            var url = canvas.toDataURL();
                            window.open(url, '_blank');
                        }
                    };
                    img.src = dataUrl;
                };
                Annotator.prototype.resize = function (width, height) {
                    this.svg.size(width, height);
                    this.background.size(width, height);
                };
                Annotator.prototype.getLabelById = function (id) {
                    var rect = document.querySelector("[data-id=\"label-" + id + "\"]");
                    var text = rect.nextElementSibling;
                    var group = rect.parentElement;
                    var highlight = document.querySelector("[data-id=\"label-highlight-" + id + "\"]");
                    return {
                        id: id, rect: rect, text: text, group: group, highlight: highlight,
                        svg: {
                            rect: SVG.get(rect.id),
                            group: SVG.get(group.id),
                            highlight: SVG.get(highlight.id),
                            text: SVG.get(text.id)
                        }
                    };
                };
                Annotator.prototype.getSelectedTextByLabelId = function (id) {
                    for (var _i = 0, _a = this.lines['label']; _i < _a.length; _i++) {
                        var line = _a[_i];
                        for (var _b = 0, line_3 = line; _b < line_3.length; _b++) {
                            var label = line_3[_b];
                            if (label.id == id) {
                                return this.raw.slice(label.pos[0], label.pos[1] + 1);
                            }
                        }
                    }
                };
                Annotator.prototype.getRelationById = function (id) {
                    var group = document.querySelector("[data-id=\"relation-" + id + "\"]");
                    var path = group.childNodes[0];
                    var rect = group.childNodes[1];
                    return {
                        path: path, group: group, rect: rect, id: id,
                        svg: {
                            group: SVG.get(group.id),
                            path: SVG.get(path.id),
                            rect: SVG.get(rect.id)
                        }
                    };
                };
                Annotator.prototype.addLabel = function (category, selection) {
                    if (!this.config.visible['label'])
                        return;
                    var id = this.lines['label'].reduce(function (id, line) {
                        for (var _i = 0, line_4 = line; _i < line_4.length; _i++) {
                            var label = line_4[_i];
                            id = Math.max(label.id, id);
                        }
                        return id;
                    }, -1) + 1;
                    var line = selection.line.start;
                    this.draw.label(id, category, {
                        lineNo: line,
                        width: selection.rect.width,
                        height: selection.rect.height,
                        top: selection.rect.top,
                        left: selection.rect.left
                    });
                    this.lines['label'][line - 1].push({
                        x: selection.offset.start,
                        y: selection.offset.end,
                        pos: [selection.pos.start, selection.pos.end],
                        category: category, id: id
                    });
                    this.labelLineMap[id] = line;
                    this.draw.reRelations(line);
                };
                Annotator.prototype.removeLabel = function (id) {
                    var _this = this;
                    var dom = this.svg.node.querySelector("[data-id=\"label-" + id + "\"]").parentElement;
                    var highlight = this.svg.node.querySelector("[data-id=\"label-highlight-" + id + "\"]");
                    var remove = function (lines, id) {
                        for (var _i = 0, lines_3 = lines; _i < lines_3.length; _i++) {
                            var line = lines_3[_i];
                            for (var i = 0; i < line.length; i++) {
                                var tid = -1;
                                if (line[i] instanceof _this.svg.constructor)
                                    tid = line[i].attr('id');
                                else
                                    tid = line[i].id;
                                if (tid == id) {
                                    line.splice(i, 1);
                                    return;
                                }
                            }
                        }
                    };
                    remove(this.lines['label'], id);
                    remove(this.lines['highlight'], highlight.id);
                    remove(this.lines['annotation'], dom.id);
                    var lineNo = this.labelLineMap[id];
                    var _a = this.getLabelById(id).svg, group = _a.group, rect = _a.rect;
                    var top = group.transform()['y'] + rect.y();
                    this.draw.tryMoveLineUp(lineNo);
                    SVG.get(highlight.id).remove();
                    SVG.get(dom.id).remove();
                };
                Annotator.prototype.setLabelCategoryById = function (id, category) {
                    var lineNo = this.labelLineMap[id];
                    if (!lineNo)
                        throw new Error('Invalid label id');
                    var labels = this.lines['label'][lineNo - 1];
                    for (var _i = 0, labels_3 = labels; _i < labels_3.length; _i++) {
                        var label = labels_3[_i];
                        if (label.id == id) {
                            label.category = category;
                        }
                    }
                    this.refresh();
                };
                Annotator.prototype.addRelation = function (src, dst, text) {
                    if (!this.config.visible['relation'])
                        return;
                    var id = Util_1.Util.autoIncrementId(this.lines['relation_meta'], 'id');
                    var srcLineNo = this.labelLineMap[src];
                    var dstLineNo = this.labelLineMap[dst];
                    if (typeof srcLineNo == 'number' && typeof dstLineNo == 'number') {
                        var lineNo = Math.min(srcLineNo, dstLineNo);
                        this.relationLineMap[id] = lineNo;
                        this.lines['relation_meta'][lineNo - 1].push({ id: id, src: src, dst: dst, text: text });
                    }
                    else {
                        throw new Error("Invalid label number: " + src + ", " + dst + " ");
                    }
                    this.draw.relation(id, src, dst, text);
                    this.draw.reRelations(Math.min(srcLineNo, dstLineNo));
                };
                Annotator.prototype.removeRelation = function (id) {
                    Util_1.Util.removeInLines(this.lines['relation_meta'], function (item) {
                        return item.id == id;
                    });
                    Util_1.Util.removeInLines(this.lines['relation'], function (item) {
                        return item.attr('data-id') == "relation-" + id;
                    });
                    var _a = this.getRelationById(id).svg, group = _a.group, rect = _a.rect;
                    var top = rect.y() + group.transform()['y'];
                    var lineNo = this.relationLineMap[id];
                    this.draw.tryMoveLineUp(lineNo);
                    this.getRelationById(id).svg.group.remove();
                };
                Annotator.prototype.removeRelationsByLabel = function (labelId) {
                    var will_remove = [];
                    for (var _i = 0, _a = this.lines['relation_meta']; _i < _a.length; _i++) {
                        var line = _a[_i];
                        for (var i = line.length - 1; i >= 0; i--) {
                            var _b = line[i], id = _b.id, src = _b.src, dst = _b.dst;
                            if (src == labelId || dst == labelId) {
                                will_remove.push(id);
                                line.splice(i, 1);
                            }
                        }
                    }
                    for (var _c = 0, _d = this.lines['relation']; _c < _d.length; _c++) {
                        var line = _d[_c];
                        for (var i = line.length - 1; i >= 0; i--) {
                            var id = line[i].attr('data-id').match(/^relation-(\d+)$/)[1];
                            if (will_remove.indexOf(+id) >= 0) {
                                line.splice(i, 1);
                            }
                        }
                    }
                    for (var _e = 0, will_remove_1 = will_remove; _e < will_remove_1.length; _e++) {
                        var id = will_remove_1[_e];
                        var _f = this.getRelationById(id).svg, group = _f.group, rect = _f.rect;
                        var top_1 = rect.y() + group.transform()['y'];
                        var lineNo = this.relationLineMap[id];
                        this.draw.tryMoveLineUp(lineNo);
                        this.getRelationById(id).svg.group.remove();
                    }
                };
                Annotator.prototype.clearLabelSelection = function () {
                    this.labelSelected = false;
                    this.trackLine.remove();
                    this.selectedLabel = {};
                };
                Annotator.prototype.clickLabelEventHandler = function (event) {
                    var target = event.target;
                    if (!target.parentElement)
                        return;
                    var previousElement = target.parentElement.previousElementSibling;
                    if (target.nodeName == 'tspan' && previousElement && previousElement.nodeName == 'rect') {
                        var dataId = previousElement.getAttribute('data-id');
                        if (dataId) {
                            var labelId = dataId.match(/^label-(\d+)$/)[1];
                            this.labelSelected = !this.labelSelected;
                            if (!this.labelSelected && this.selectedLabel !== null && this.trackLine)
                                this.trackLine.remove();
                            this.selectedLabel = this.getLabelById(+labelId);
                            this.emit('selected label', +labelId);
                        }
                    }
                };
                Annotator.prototype.clickRelationEventHandler = function (event) {
                    var target = event.target;
                    if (!target.parentElement)
                        return;
                    var grandparentElement = target.parentElement.parentElement;
                    if (target.nodeName == 'tspan' && grandparentElement && grandparentElement.nodeName == 'g') {
                        var dataId = grandparentElement.getAttribute('data-id');
                        if (dataId) {
                            var relationId = dataId.match(/^relation-(\d+)$/)[1];
                            this.emit('selected relation', +relationId);
                        }
                    }
                };
                Annotator.prototype.selectionParagraphEventHandler = function () {
                    try {
                        var _a = TextSelector_1.TextSelector.paragraph(), startOffset = _a.startOffset, endOffset = _a.endOffset, startLineNo = _a.startLineNo, endLineNo = _a.endLineNo;
                        endOffset -= 1;
                        var paragraph = new Paragraph_1.Paragraph(this, startLineNo, startOffset, endLineNo, endOffset);
                        this.emit('selected', {
                            pos: { start: paragraph.startPos, end: paragraph.endPos },
                            offset: { start: paragraph.startOffset, end: paragraph.endOffset },
                            line: { start: startLineNo, end: endLineNo },
                            text: paragraph.text,
                            rect: TextSelector_1.TextSelector.rect()
                        });
                        if (this.underscorable) {
                            this.draw.underscore(paragraph);
                        }
                    }
                    catch (e) {
                        if (e instanceof TextSelector_1.SelectorDummyException)
                            return;
                        throw e;
                    }
                };
                Annotator.prototype.mousemoveEventHandler = function (event) {
                    if (this.labelSelected && this.config.selectable) {
                        var label = this.getLabelById(this.selectedLabel['id']);
                        var root = this.svg.node.getClientRects()[0];
                        var left = event.clientX, top_2 = event.clientY;
                        this.draw.trackLine(label, left - root.left, top_2 - root.top - 3);
                    }
                };
                Annotator.prototype.moveoverEventHandler = function (event) {
                    var target = event.target;
                    if (!target.parentElement)
                        return;
                    var previousElement = target.parentElement.previousElementSibling;
                    var grandparentElement = target.parentElement.parentElement;
                    if (target.nodeName == 'tspan' && grandparentElement && grandparentElement.nodeName == 'g') {
                        var dataId = grandparentElement.getAttribute('data-id');
                        if (dataId) {
                            var relationId = dataId.match(/^relation-(\d+)$/)[1];
                            var svg = this.getRelationById(relationId).svg;
                            svg.path.stroke({ width: 2 });
                        }
                    }
                    if (target.nodeName == 'tspan' && previousElement && previousElement.nodeName == 'rect') {
                        var dataId = previousElement.getAttribute('data-id');
                        if (dataId) {
                            var labelId = dataId.match(/^label-(\d+)$/)[1];
                            for (var _i = 0, _a = this.lines['relation_meta']; _i < _a.length; _i++) {
                                var line = _a[_i];
                                for (var _b = 0, line_5 = line; _b < line_5.length; _b++) {
                                    var relation = line_5[_b];
                                    var id = relation.id, src = relation.src, dst = relation.dst;
                                    if (src == labelId || dst == labelId) {
                                        var svg = this.getRelationById(id).svg;
                                        svg.path.stroke({ width: 2 });
                                    }
                                }
                            }
                        }
                    }
                };
                Annotator.prototype.moveoutEventHandler = function (event) {
                    var target = event.target;
                    if (!target.parentElement)
                        return;
                    var previousElement = target.parentElement.previousElementSibling;
                    var grandparentElement = target.parentElement.parentElement;
                    if (target.nodeName == 'tspan' && grandparentElement && grandparentElement.nodeName == 'g') {
                        var dataId = grandparentElement.getAttribute('data-id');
                        if (dataId) {
                            var relationId = dataId.match(/^relation-(\d+)$/)[1];
                            var svg = this.getRelationById(relationId).svg;
                            svg.path.stroke({ width: 1 });
                        }
                    }
                    if (target.nodeName == 'tspan' && previousElement && previousElement.nodeName == 'rect') {
                        var dataId = previousElement.getAttribute('data-id');
                        if (dataId) {
                            var labelId = dataId.match(/^label-(\d+)$/)[1];
                            for (var _i = 0, _a = this.lines['relation_meta']; _i < _a.length; _i++) {
                                var line = _a[_i];
                                for (var _b = 0, line_6 = line; _b < line_6.length; _b++) {
                                    var relation = line_6[_b];
                                    var id = relation.id, src = relation.src, dst = relation.dst;
                                    if (src == labelId || dst == labelId) {
                                        var svg = this.getRelationById(id).svg;
                                        svg.path.stroke({ width: 1 });
                                    }
                                }
                            }
                        }
                    }
                };
                Annotator.prototype.posInLine = function (x, y) {
                    var lineNo = 0;
                    for (var _i = 0, _a = this.lines['raw']; _i < _a.length; _i++) {
                        var raw = _a[_i];
                        lineNo += 1;
                        if (x - raw.length < 0)
                            break;
                        x -= raw.length;
                    }
                    for (var _b = 0, _c = this.lines['raw']; _b < _c.length; _b++) {
                        var raw = _c[_b];
                        if (y - raw.length < 0)
                            break;
                        y -= raw.length;
                    }
                    if (x > y)
                        throw new InvalidLabelError("Invalid selection, x:" + x + ", y:" + y + ", line no: " + lineNo);
                    return { x: x, y: y, no: lineNo };
                };
                Annotator.prototype.requestAnimeFrame = function (callback) {
                    if (window.requestAnimationFrame)
                        window.requestAnimationFrame(callback);
                    else
                        setTimeout(callback, 16);
                };
                Annotator.prototype.transformRelationMeta = function () {
                    var transformedRelationMeta = [];
                    for (var _i = 0, _a = this.lines['relation_meta']; _i < _a.length; _i++) {
                        var line = _a[_i];
                        transformedRelationMeta.push([]);
                        for (var _b = 0, line_7 = line; _b < line_7.length; _b++) {
                            var relation = line_7[_b];
                            var id = relation.id, src = relation.src, dst = relation.dst;
                            var srcLineNo = this.labelLineMap[src];
                            var dstLineNo = this.labelLineMap[dst];
                            if (typeof srcLineNo == 'number' && typeof dstLineNo == 'number') {
                                var lineNo = Math.min(srcLineNo, dstLineNo);
                                transformedRelationMeta[lineNo - 1].push(relation);
                                this.relationLineMap[id] = lineNo;
                            }
                            else {
                                transformedRelationMeta[0].push(relation);
                            }
                        }
                    }
                    this.lines['relation_meta'] = transformedRelationMeta;
                };
                return Annotator;
            }(EventBase_1.EventBase));
            exports_1("Annotator", Annotator);
            InvalidLabelError = (function (_super) {
                __extends(InvalidLabelError, _super);
                function InvalidLabelError(message) {
                    _super.call(this, message);
                    this.message = message;
                }
                return InvalidLabelError;
            }(Error));
        }
    }
});
//# sourceMappingURL=Annotator.js.map