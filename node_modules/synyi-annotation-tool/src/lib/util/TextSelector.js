System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var TextSelector, SelectorDummyException;
    return {
        setters:[],
        execute: function() {
            TextSelector = (function () {
                function TextSelector() {
                }
                TextSelector.rect = function () {
                    var _a = this.init(), startOffset = _a.startOffset, endOffset = _a.endOffset, tspan = _a.tspan;
                    var text = tspan.textContent;
                    var i = 0;
                    while (text[i] == ' ') {
                        startOffset -= 1;
                        endOffset -= 1;
                        i += 1;
                    }
                    var startAt = tspan.getExtentOfChar(startOffset);
                    var endAt = tspan.getExtentOfChar(endOffset - 1);
                    return {
                        width: endAt.x - startAt.x + endAt.width,
                        height: endAt.height,
                        left: startAt.x,
                        top: startAt.y
                    };
                };
                TextSelector.lineNo = function () {
                    var tspan = this.init().tspan;
                    var text = tspan.parentElement;
                    var num = +text.getAttribute('data-id').match(/^text-line-(\d+)$/)[1];
                    return num;
                };
                TextSelector.init = function () {
                    var selection = window.getSelection();
                    var anchorOffset = selection.anchorOffset;
                    var focusOffset = selection.focusOffset;
                    if (anchorOffset == focusOffset || selection.anchorNode !== selection.focusNode) {
                        throw new SelectorDummyException('Void selection.');
                    }
                    if (anchorOffset > focusOffset) {
                        _a = [focusOffset, anchorOffset], anchorOffset = _a[0], focusOffset = _a[1];
                    }
                    var tspan = selection.anchorNode.parentElement;
                    var text = tspan.textContent;
                    while (text[anchorOffset] == ' ') {
                        anchorOffset += 1;
                    }
                    while (text[focusOffset - 1] == ' ') {
                        focusOffset -= 1;
                    }
                    if (anchorOffset >= text.length || focusOffset <= 0 || anchorOffset >= focusOffset) {
                        throw new SelectorDummyException('Void selection.');
                    }
                    return {
                        startOffset: anchorOffset,
                        endOffset: focusOffset,
                        startNode: selection.anchorNode,
                        endNode: selection.focusNode,
                        tspan: tspan
                    };
                    var _a;
                };
                TextSelector.paragraph = function () {
                    var selection = window.getSelection();
                    var startOffset = selection.anchorOffset;
                    var endOffset = selection.focusOffset;
                    var startNode = selection.anchorNode;
                    var endNode = selection.focusNode;
                    if (!startNode || !startNode.parentElement || !startNode.parentElement.parentElement
                        || !endNode || !endNode.parentElement || !endNode.parentElement.parentElement)
                        throw new SelectorDummyException('Invalid target element');
                    var startText = startNode.parentElement.parentElement;
                    var endText = endNode.parentElement.parentElement;
                    var startDataId = startText.getAttribute('data-id');
                    var endDataId = endText.getAttribute('data-id');
                    if (endDataId === null || startDataId === null) {
                        throw new SelectorDummyException('Void selection');
                    }
                    var startLineNo = +startDataId.match(/^text-line-(\d+)$/)[1];
                    var endLineNo = +endDataId.match(/^text-line-(\d+)$/)[1];
                    if (startLineNo == endLineNo && startOffset == endOffset)
                        throw new SelectorDummyException('Void selection');
                    if (startLineNo > endLineNo || (startLineNo == endLineNo && startOffset >= endOffset)) {
                        _a = [endNode, startNode], startNode = _a[0], endNode = _a[1];
                        _b = [endOffset, startOffset], startOffset = _b[0], endOffset = _b[1];
                        _c = [endText, startText], startText = _c[0], endText = _c[1];
                        _d = [endLineNo, startLineNo], startLineNo = _d[0], endLineNo = _d[1];
                    }
                    var startTextContent = startNode.parentElement.textContent;
                    var endTextContent = endNode.parentElement.textContent;
                    while (startTextContent[startOffset] == ' ') {
                        startOffset += 1;
                    }
                    while (endTextContent[endOffset - 1] == ' ') {
                        endOffset -= 1;
                    }
                    if (startOffset >= startTextContent.length || endOffset <= 0 || startOffset >= endOffset) {
                        throw new SelectorDummyException('Void selection.');
                    }
                    return {
                        startOffset: startOffset,
                        endOffset: endOffset,
                        startLineNo: startLineNo,
                        endLineNo: endLineNo
                    };
                    var _a, _b, _c, _d;
                };
                TextSelector.clear = function () {
                    var selection = window.getSelection();
                    selection.removeAllRanges();
                };
                return TextSelector;
            }());
            exports_1("TextSelector", TextSelector);
            SelectorDummyException = (function (_super) {
                __extends(SelectorDummyException, _super);
                function SelectorDummyException(message) {
                    _super.call(this, message);
                    this.message = message;
                }
                return SelectorDummyException;
            }(Error));
            exports_1("SelectorDummyException", SelectorDummyException);
        }
    }
});
//# sourceMappingURL=TextSelector.js.map