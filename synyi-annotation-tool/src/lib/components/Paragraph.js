"use strict";
var Paragraph = (function () {
    function Paragraph(context, startLine, startOffset, endLine, endOffset) {
        this.context = context;
        this.startLine = startLine;
        this.endLine = endLine;
        this.startOffset = startOffset;
        this.endOffset = endOffset;
        this.startPos = this.calcPos(startLine, startOffset);
        this.endPos = this.calcPos(endLine, endOffset);
        this.text = this.context.raw.slice(this.startPos, this.endPos + 1);
    }
    Paragraph.prototype.calcPos = function (lineNo, offset) {
        var pos = 0;
        for (var i = 0; i < lineNo - 1; i++) {
            pos += this.context.lines['raw'][i].length;
        }
        pos += offset;
        return pos;
    };
    return Paragraph;
}());
exports.Paragraph = Paragraph;
//# sourceMappingURL=Paragraph.js.map