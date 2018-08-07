"use strict";
var Configuration = (function () {
    function Configuration() {
        this.visible = {
            relation: true,
            highlight: true,
            label: true
        };
        this.style = {
            padding: 10,
            baseLeft: 30,
            rectColor: '',
            bgColor: 'white',
            width: 0,
            height: 0
        };
        this.puncLen = 80;
        this.linesPerRender = 15;
        this.selectable = false;
    }
    return Configuration;
}());
exports.Configuration = Configuration;
//# sourceMappingURL=Configuration.js.map