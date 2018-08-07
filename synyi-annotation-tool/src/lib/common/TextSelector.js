"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TextSelector = (function () {
    function TextSelector() {
    }
    TextSelector.rect = function () {
        var _a = this.paragraph(), startOffset = _a.startOffset, endOffset = _a.endOffset, startLineNo = _a.startLineNo, endLineNo = _a.endLineNo, tspan = _a.tspan;
        var text = tspan.textContent;
        var i = 0;
        var end = text.length - 1;
        while (text[end] == ' ')
            end -= 1;
        while (text[i] == ' ') {
            startOffset -= 1;
            endOffset -= 1;
            end -= 1;
            i += 1;
        }
        var startAt;
        var endAt;
        if (startLineNo == endLineNo) {
            startAt = tspan.getExtentOfChar(startOffset);
            endAt = tspan.getExtentOfChar(endOffset - 1);
        }
        else {
            startAt = tspan.getExtentOfChar(startOffset);
            endAt = tspan.getExtentOfChar(end);
        }
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
        var startOffset = selection.anchorOffset;
        var focusOffset = selection.focusOffset;
        if (startOffset >= focusOffset && selection.anchorNode == selection.focusNode) {
            throw new SelectorDummyException('Void selection.');
        }
        if (startOffset > focusOffset) {
            _a = [focusOffset, startOffset], startOffset = _a[0], focusOffset = _a[1];
        }
        var tspan = selection.anchorNode.parentElement;
        var text = tspan.textContent;
        while (text[startOffset] == ' ') {
            startOffset += 1;
        }
        while (text[focusOffset - 1] == ' ') {
            focusOffset -= 1;
        }
        if (startOffset >= text.length || focusOffset <= 0 ||
            (startOffset >= focusOffset && selection.anchorNode == selection.focusNode)) {
            throw new SelectorDummyException('Void selection.');
        }
        return {
            startOffset: startOffset,
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
        if (startOffset >= startTextContent.length || endOffset <= 0 || (startOffset >= endOffset && startLineNo == endLineNo)) {
            throw new SelectorDummyException('Void selection.');
        }
        var tspan = startNode.parentElement;
        return {
            startOffset: startOffset,
            endOffset: endOffset,
            startLineNo: startLineNo,
            endLineNo: endLineNo,
            tspan: tspan
        };
        var _a, _b, _c, _d;
    };
    TextSelector.clear = function () {
        var selection = window.getSelection();
        selection.removeAllRanges();
    };
    return TextSelector;
}());
exports.TextSelector = TextSelector;
var SelectorDummyException = (function (_super) {
    __extends(SelectorDummyException, _super);
    function SelectorDummyException(message) {
        _super.call(this, message);
        this.message = message;
    }
    return SelectorDummyException;
}(Error));
exports.SelectorDummyException = SelectorDummyException;
//# sourceMappingURL=TextSelector.js.map