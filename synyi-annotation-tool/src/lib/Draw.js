System.register(['./util/Util'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Util_1;
    var Draw;
    return {
        setters:[
            function (Util_1_1) {
                Util_1 = Util_1_1;
            }],
        execute: function() {
            Draw = (function () {
                function Draw(board) {
                    this.margin = 10;
                    this.lineHeight = 25;
                    this.shoulder = 20;
                    this.needExtend = false;
                    this.style_user_select_none = {
                        'style': '-webkit-user-select: none; user-select:none; -khtml-user-select:none;-ms-user-select:none;-moz-user-select:none; cursor: default;'
                    };
                    this.board = board;
                }
                Draw.prototype.highlight = function (selector, color) {
                    if (color === void 0) { color = '#e8fbe8'; }
                    var width = selector.width, height = selector.height, left = selector.left, top = selector.top;
                    return this.board.group['highlight'].rect(width, height).move(left, top).attr({ fill: color });
                };
                Draw.prototype.textline = function (lineNo, content, left, top) {
                    return this.board.group['text'].text(content).attr({ 'data-id': "text-line-" + lineNo }).move(left, top).font({ size: 14 });
                };
                Draw.prototype.annotation = function (id, cid, selector) {
                    this.needExtend = false;
                    var margin = this.margin;
                    var lineNo = selector.lineNo;
                    var content = this.board.category[cid - 1]['text'];
                    var textDef = this.board.group['shadow'].text(content).size(12);
                    var width = Util_1.Util.width(textDef.node);
                    var height = Util_1.Util.height(textDef.node);
                    var left = selector.left + selector.width / 2 - width / 2 + 2;
                    var top = this.calcAnnotationTop(textDef, selector);
                    var text = this.board.svg.text(content).size(12).move(left, top).attr(this.style_user_select_none);
                    textDef.remove();
                    var fillColor = this.board.category[cid - 1]['fill'];
                    var strokeColor = this.board.category[cid - 1]['boader'];
                    var rect = this.board.svg.rect(width + 4, height + 4).move(left - 2, top - 2).fill(fillColor).stroke(strokeColor).radius(2).attr({ 'data-id': "label-" + id });
                    var annotateGroup = this.board.svg.group();
                    var bHeight = margin - 2;
                    var bTop = top + rect.height() - 2;
                    var bracket = this.bracket(cid, selector.left, bTop, selector.left + selector.width, bTop, bHeight);
                    annotateGroup.add(rect);
                    annotateGroup.add(text);
                    annotateGroup.add(bracket);
                    this.board.labelsSVG[id] = { rect: rect, lineNo: lineNo };
                    this.board.lines['annotation'][lineNo - 1].push(annotateGroup);
                    if (this.needExtend || this.board.lines['annotation'][lineNo - 1].length < 2) {
                        this.tryMoveLineUp(lineNo);
                    }
                    if (left < 2)
                        this.moveLineRight(lineNo, -left + 2);
                };
                Draw.prototype.label = function (id, cid, selector) {
                    if (!this.board.config.visible['label'])
                        return;
                    var extendHeight = 0;
                    var lineNo = selector.lineNo;
                    var width = selector.width, height = selector.height, left = selector.left, top = selector.top;
                    if (this.board.config.visible['highlight']) {
                        var highlight = this.highlight(selector, this.board.category[cid - 1]['highlight']).attr('data-id', "label-highlight-" + id);
                        this.board.lines['highlight'][lineNo - 1].push(highlight);
                    }
                    if (this.board.config.visible['label'])
                        this.annotation(id, cid, selector);
                };
                Draw.prototype.relation = function (id, srcId, dstId, text) {
                    if (text === void 0) { text = 'body location of'; }
                    if (!this.board.config.visible['relation'])
                        return;
                    this.needExtend = false;
                    var content = text;
                    var textDef = this.board.group['shadow'].text(content).size(12);
                    var width = Util_1.Util.width(textDef.node);
                    var height = Util_1.Util.height(textDef.node);
                    var src = this.board.labelsSVG[srcId].rect;
                    var dst = this.board.labelsSVG[dstId].rect;
                    var srcLineNo = Math.min(this.board.labelsSVG[dstId].lineNo, this.board.labelsSVG[srcId].lineNo);
                    var dstLineNo = Math.max(this.board.labelsSVG[dstId].lineNo, this.board.labelsSVG[srcId].lineNo);
                    var srcX = src.x() + src.parent().transform()['x'];
                    var srcY = src.y() + src.parent().transform()['y'];
                    var dstX = dst.x() + dst.parent().transform()['x'];
                    var dstY = dst.y() + dst.parent().transform()['y'];
                    var distance = srcX < dstX ? dstX + dst.width() - srcX : srcX + src.width() - dstX;
                    var left = srcX < dstX ? (srcX + dstX + dst.width() - width) / 2 : (dstX + srcX + src.width() - width) / 2;
                    var deltaY = srcY < dstY ? 0 : srcY - dstY;
                    var x0 = srcX < dstX ? srcX : srcX + src.width();
                    var y0 = srcY + src.height() / 2;
                    var shoulder = this.shoulder;
                    var cx1 = srcX < dstX ? x0 - shoulder : x0 + shoulder;
                    var top = this.calcRelationTop(srcLineNo, width, height, y0 - (this.margin + height + deltaY), left);
                    var cy1 = top + height / 2;
                    var x1 = x0;
                    var y1 = cy1;
                    var x2 = srcX < dstX ? dstX + dst.width() + shoulder / 2 : dstX - shoulder / 2;
                    var cx2 = srcX < dstX ? x2 + shoulder / 2 : x2 - shoulder / 2;
                    var cy2 = y1;
                    var x3 = srcX < dstX ? dstX + dst.width() : dstX;
                    var y3 = dstY - 2;
                    if (distance < width) {
                        cx1 = srcX < dstX ? left - shoulder : left + width + shoulder;
                        x1 = srcX < dstX ? left - shoulder / 2 : left + width + shoulder / 2;
                        x2 = srcX < dstX ? left + width + shoulder / 2 : left - shoulder / 2;
                        cx2 = srcX < dstX ? x2 + shoulder / 2 : x2 - shoulder / 2;
                    }
                    var group = this.board.group['relation'].group().attr('data-id', "relation-" + id);
                    var path = group.path("M" + x0 + " " + y0 + "Q" + cx1 + " " + cy1 + " " + x1 + " " + y1 + " H" + x2 + " Q" + cx2 + " " + cy2 + " " + x3 + " " + y3)
                        .fill('none').stroke({ color: '#000' });
                    path.marker('end', 5, 5, function (add) {
                        add.polyline('0,0 5,2.5 0,5 0.2,2.5');
                    });
                    group.rect(width + 4, height).move(left - 2, top).fill('#fff');
                    group.text(content).size(12).move(left, top).attr(this.style_user_select_none);
                    textDef.remove();
                    this.board.lines['relation'][srcLineNo - 1].push(group);
                    if (this.needExtend) {
                        this.tryMoveLineUp(srcLineNo);
                        this.redrawRelations(srcLineNo);
                    }
                    var leftEdge = Math.min(srcX, dstX, x0, x1, x2, x3, cx1, cx2, left);
                    if (leftEdge < 0) {
                        var lineNo = Math.min(this.board.labelsSVG[dstId].lineNo, this.board.labelsSVG[srcId].lineNo);
                        this.moveLineRight(lineNo, -leftEdge);
                    }
                };
                Draw.prototype.underscore = function (paragraph) {
                    var startLine = paragraph.startLine;
                    var startOffset = paragraph.startOffset;
                    var endLine = paragraph.endLine;
                    var endOffset = paragraph.endOffset;
                    if (startLine == endOffset) {
                        this.underscoreLine(startLine, startOffset, -1);
                        for (var i = startLine + 1; i = endLine - 1; i++) {
                            this.underscoreLine(i, 0, -1);
                        }
                        this.underscoreLine(endLine, 0, endOffset);
                    }
                    else {
                        this.underscoreLine(startLine, startOffset, endOffset);
                    }
                };
                Draw.prototype.bracket = function (cid, x1, y1, x2, y2, width, q) {
                    if (q === void 0) { q = 0.6; }
                    var dx = x1 - x2;
                    var dy = y1 - y2;
                    var len = Math.sqrt(dx * dx + dy * dy);
                    dx = dx / len;
                    dy = dy / len;
                    var qx1 = x1 + q * width * dy;
                    var qy1 = y1 - q * width * dx;
                    var qx2 = (x1 - .25 * len * dx) + (1 - q) * width * dy;
                    var qy2 = (y1 - .25 * len * dy) - (1 - q) * width * dx;
                    var tx1 = (x1 - .5 * len * dx) + width * dy;
                    var ty1 = (y1 - .5 * len * dy) - width * dx;
                    var qx3 = x2 + q * width * dy;
                    var qy3 = y2 - q * width * dx;
                    var qx4 = (x1 - .75 * len * dx) + (1 - q) * width * dy;
                    var qy4 = (y1 - .75 * len * dy) - (1 - q) * width * dx;
                    return this.board.svg.path("M" + x1 + "," + y1 + "Q" + qx1 + "," + qy1 + "," + qx2 + "," + qy2 + "T" + tx1 + "," + ty1 + "M" + x2 + "," + y2 + "Q" + qx3 + "," + qy3 + "," + qx4 + "," + qy4 + "T" + tx1 + "," + ty1)
                        .fill('none').stroke({ color: this.board.category[cid - 1]['boader'], width: 1 }).transform({ rotation: 180 });
                };
                Draw.prototype.trackLine = function (label, left, top) {
                    var _a = label.svg, group = _a.group, rect = _a.rect;
                    var src = {
                        x: group.transform()['x'] + rect.x() + rect.width() / 2, y: group.transform()['y'] + rect.y()
                    };
                    var dst = { x: left, y: top };
                    if (this.board.trackLine !== null)
                        this.board.trackLine.remove();
                    var dx = (src.x - dst.x) / 4;
                    var y2 = Math.min(src.y, dst.y) - rect.height();
                    this.board.trackLine = this.board.svg.path("M" + src.x + "," + src.y + "C" + (src.x - dx) + "," + y2 + "," + (dst.x + dx) + "," + y2 + "," + dst.x + "," + dst.y)
                        .fill('none').stroke({ color: 'black', width: 1 });
                    this.board.trackLine.marker('end', 5, 5, function (add) {
                        add.polyline('0,0 5,2.5 0,5 0.2,2.5');
                    });
                };
                Draw.prototype.tryMoveLineUp = function (lineNo) {
                    var textline = this.board.lines['text'][lineNo - 1];
                    var annotations = this.board.lines['annotation'][lineNo - 1];
                    var relations = this.board.lines['relation'][lineNo - 1];
                    var padding = this.board.config.style.padding;
                    var top = lineNo - 2 >= 0 ? this.board.lines['text'][lineNo - 2].y()
                        + Util_1.Util.height(this.board.lines['text'][lineNo - 2].node) + padding : padding;
                    var upper = Math.min(10000000, textline.y());
                    var loop = function (groups) {
                        if (!groups)
                            return;
                        for (var _i = 0, groups_1 = groups; _i < groups_1.length; _i++) {
                            var group = groups_1[_i];
                            for (var _a = 0, _b = group.children(); _a < _b.length; _a++) {
                                var element = _b[_a];
                                upper = Math.min(element.y() + group.transform()['y'], upper);
                            }
                        }
                    };
                    loop(annotations);
                    loop(relations);
                    var delta = upper - top;
                    this.moveLineVertically(lineNo, 'up', -delta);
                };
                Draw.prototype.reRelations = function (lineNo) {
                    if (lineNo === void 0) { lineNo = -1; }
                    for (var _i = 0, _a = this.board.lines['relation_meta']; _i < _a.length; _i++) {
                        var relations = _a[_i];
                        for (var _b = 0, relations_1 = relations; _b < relations_1.length; _b++) {
                            var relation = relations_1[_b];
                            var id = relation.id, src = relation.src, dst = relation.dst;
                            var srcLineNo = this.board.labelLineMap[relation['src']];
                            var dstLineNo = this.board.labelLineMap[relation['dst']];
                            if (srcLineNo < 0 || dstLineNo < 0 || srcLineNo == dstLineNo)
                                continue;
                            if (lineNo == -1 || (lineNo > Math.min(srcLineNo, dstLineNo) && lineNo <= Math.max(srcLineNo, dstLineNo))) {
                                var relationGroup = this.board.getRelationById(id).svg.group;
                                var _c = this.board.getLabelById(src).svg, srcLabelGroup = _c.group, srcLabelRect = _c.rect;
                                var _d = this.board.getLabelById(dst).svg, dstLabelGroup = _d.group, dstLabelRect = _d.rect;
                                var path = relationGroup.first();
                                var pointArr = path.array();
                                if (dstLineNo > srcLineNo) {
                                    pointArr.value[3][4] = dstLabelRect.y() + dstLabelGroup.transform()['y'] - relationGroup.transform()['y'];
                                }
                                else if (srcLineNo > dstLineNo) {
                                    pointArr.value[0][2] = srcLabelRect.y() + srcLabelRect.height() / 2 + srcLabelGroup.transform()['y']
                                        - relationGroup.transform()['y'];
                                }
                                path.plot(pointArr.toString());
                            }
                        }
                    }
                };
                Draw.prototype.moveLineRight = function (lineNo, padding) {
                    var textline = this.board.lines['text'][lineNo - 1];
                    var highlights = this.board.lines['highlight'][lineNo - 1];
                    var annotations = this.board.lines['annotation'][lineNo - 1];
                    var relations = this.board.lines['relation'][lineNo - 1];
                    textline.dx(padding);
                    var maxWidth = textline.x();
                    if (highlights) {
                        for (var _i = 0, highlights_1 = highlights; _i < highlights_1.length; _i++) {
                            var highlight = highlights_1[_i];
                            highlight.dx(padding);
                            if (maxWidth < highlight.x())
                                maxWidth = highlight.x();
                        }
                    }
                    if (annotations) {
                        for (var _a = 0, annotations_1 = annotations; _a < annotations_1.length; _a++) {
                            var annotation = annotations_1[_a];
                            var x = annotation.transform().x;
                            annotation.transform({ x: x + padding });
                            maxWidth = Math.max(annotation.x() + annotation.transform()['x'], maxWidth);
                        }
                    }
                    if (relations) {
                        for (var _b = 0, relations_2 = relations; _b < relations_2.length; _b++) {
                            var relation = relations_2[_b];
                            var x = relation.transform().x;
                            relation.transform({ x: x + padding });
                            maxWidth = Math.max(relation.x() + relation.transform()['x'], maxWidth);
                        }
                    }
                    if (maxWidth > this.board.config.style.width) {
                        this.board.config.style.width = maxWidth;
                        this.board.svg.size(this.board.config.style.width, this.board.config.style.height);
                    }
                };
                Draw.prototype.moveLineVertically = function (lineNo, type, delta) {
                    if (delta === void 0) { delta = 0; }
                    var s = lineNo - 1;
                    var textlines = this.board.lines['text'];
                    var highlights = this.board.lines['highlight'];
                    var annotations = this.board.lines['annotation'];
                    var relations = this.board.lines['relation'];
                    var lineHeight = type.indexOf('label') >= 0 ? this.lineHeight : this.lineHeight * 2 / 3;
                    if (delta !== 0)
                        lineHeight = delta;
                    for (var i = s; i < textlines.length; i++) {
                        textlines[i].dy(lineHeight);
                        if (highlights[i]) {
                            for (var _i = 0, _a = highlights[i]; _i < _a.length; _i++) {
                                var highlight = _a[_i];
                                highlight.dy(lineHeight);
                            }
                        }
                        if (annotations[i]) {
                            for (var _b = 0, _c = annotations[i]; _b < _c.length; _b++) {
                                var annotation = _c[_b];
                                var y = annotation.transform().y;
                                annotation.transform({ y: y + lineHeight });
                            }
                        }
                        if (relations[i]) {
                            for (var _d = 0, _e = relations[i]; _d < _e.length; _d++) {
                                var relation = _e[_d];
                                var y = relation.transform().y;
                                relation.transform({ y: y + lineHeight });
                            }
                        }
                    }
                    this.board.config.style.height += lineHeight;
                    this.board.resize(this.board.config.style.width, this.board.config.style.height);
                    return lineHeight;
                };
                Draw.prototype.underscoreLine = function (lineNo, start, end) {
                    if (end == -1) {
                        end = this.board.lines['raw'][lineNo - 1].length - 1;
                    }
                    var textLine = this.board.lines['text'][lineNo - 1];
                };
                Draw.prototype.calcAnnotationTop = function (text, selector) {
                    var lineNo = selector.lineNo;
                    var width = Util_1.Util.width(text.node);
                    var height = Util_1.Util.height(text.node);
                    var left = selector.left + selector.width / 2 - width / 2;
                    var top = selector.top - this.margin - height;
                    while (this.isCollisionInLine(lineNo, width + 4, height + 4, left - 2, top + 2)) {
                        top -= this.lineHeight;
                    }
                    return top;
                };
                Draw.prototype.calcRelationTop = function (lineNo, width, height, top, left) {
                    while (this.isCollisionInLine(lineNo, width + 10, height + 10, left - 5, top)) {
                        top -= this.lineHeight / 2;
                    }
                    return top;
                };
                Draw.prototype.isCollisionInLine = function (lineNo, width, height, left, top) {
                    var _this = this;
                    var annotations = this.board.lines['annotation'][lineNo - 1];
                    var relations = this.board.lines['relation'][lineNo - 1];
                    if (annotations.length < 1 && relations.length < 1) {
                        return false;
                    }
                    var minY = 100000000;
                    var testCollision = function (elements) {
                        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
                            var element = elements_1[_i];
                            var y = element.y() + element.parent().transform()['y'];
                            if (element.type == 'rect') {
                                if (minY > y) {
                                    minY = y;
                                }
                                if (_this.isCollision(left, top, width, height, element.x(), y, element.width(), element.height())) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    };
                    for (var _i = 0, annotations_2 = annotations; _i < annotations_2.length; _i++) {
                        var annotaion = annotations_2[_i];
                        var elements = annotaion.children();
                        if (testCollision(elements))
                            return true;
                    }
                    for (var _a = 0, relations_3 = relations; _a < relations_3.length; _a++) {
                        var relation = relations_3[_a];
                        var elements = relation.children();
                        if (testCollision(elements))
                            return true;
                    }
                    if (top < minY - 2) {
                        this.needExtend = true;
                    }
                    return false;
                };
                Draw.prototype.isCollision = function (x1, y1, w1, h1, x2, y2, w2, h2) {
                    if (x1 >= x2 && x1 >= x2 + w2) {
                        return false;
                    }
                    else if (x1 <= x2 && x1 + w1 <= x2) {
                        return false;
                    }
                    else if (y1 >= y2 && y1 >= y2 + h2) {
                        return false;
                    }
                    else if (y1 <= y2 && y1 + h1 <= y2) {
                        return false;
                    }
                    return true;
                };
                Draw.prototype.redrawRelations = function (lineNo) {
                    for (var i = 0; i < lineNo - 1; i++) {
                        for (var _i = 0, _a = this.board.lines['relation_meta'][i]; _i < _a.length; _i++) {
                            var relation = _a[_i];
                            var id = relation.id, src = relation.src, dst = relation.dst;
                            var srcLineNo = this.board.labelLineMap[relation['src']];
                            var dstLineNo = this.board.labelLineMap[relation['dst']];
                            if (Math.max(srcLineNo, dstLineNo) >= lineNo) {
                                var group = this.board.getRelationById(id).svg.group;
                                var path = group.first();
                                var pointArr = path.array();
                                pointArr.value[3][4] += this.lineHeight * 2 / 3;
                                path.plot(pointArr.toString());
                            }
                        }
                    }
                };
                return Draw;
            }());
            exports_1("Draw", Draw);
        }
    }
});
//# sourceMappingURL=Draw.js.map