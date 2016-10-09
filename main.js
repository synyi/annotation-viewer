/**
 * Created by yjh on 2016/10/8.
 */
System.register(['./node_modules/synyi-annotation-tool/src/Annotator'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Annotator_1;
    var categories;
    function loadContentOfFile(file) {
        var fr = new FileReader();
        return new Promise(function (resolve) {
            fr.onload = function () {
                resolve(fr.result);
            };
            fr.readAsText(file, 'utf-8');
        });
    }
    function run() {
        document.querySelector('#con').innerHTML = '';
        var contentInput = document.querySelector('input#content');
        var annotationInput = document.querySelector('input#annotation');
        Promise.all([loadContentOfFile(contentInput.files[0]), loadContentOfFile(annotationInput.files[0])])
            .then(function (results) {
            var ann = new Annotator_1.Annotator(document.querySelector('#con'));
            var annotations = JSON.parse(results[1]);
            var relations = [];
            var counter = 0;
            var labels = annotations['concepts'].map(function (concept) {
                concept['relations'] = concept['relations'] || [];
                concept['relations'].forEach(function (relation) {
                    if (relation['attribute_id'] != undefined) {
                        relations.push({
                            id: counter,
                            dst: concept['meta']['id'],
                            src: relation['attribute_id'],
                            text: relation['relation_type']
                        });
                        counter += 1;
                    }
                });
                return {
                    'category': Annotator_1.Categories[concept['meta']['category']],
                    'pos': [concept['meta']['start_index'], concept['meta']['end_index'] - 1],
                    'id': concept['meta']['id']
                };
            }).filter(function (x) { return !(x['category'] == undefined); });
            ann.import(results[0], categories, labels, relations);
        });
    }
    return {
        setters:[
            function (Annotator_1_1) {
                Annotator_1 = Annotator_1_1;
            }],
        execute: function() {
            categories = [
                { id: 1, fill: 'rgb(174, 214, 241)', boader: 'rgb(93, 173, 226)', highlight: 'rgba(174, 214, 241,0.4)', text: "症状、表现", },
                { id: 2, fill: 'rgb(169, 204, 227)', boader: 'rgb(84, 153, 199)', highlight: 'rgba(169, 204, 227,0.4)', text: "疾病", },
                { id: 3, fill: 'rgb(210, 180, 222)', boader: 'rgb(165, 105, 189)', highlight: 'rgba(210, 180, 222,0.4)', text: "检查、评分", },
                { id: 4, fill: 'rgb(215, 189, 226)', boader: 'rgb(175, 122, 197)', highlight: 'rgba(215, 189, 226,0.4)', text: "治疗", },
                { id: 5, fill: 'rgb(245, 183, 177)', boader: 'rgb(236, 112, 99)', highlight: 'rgba(245, 183, 177,0.4)', text: "指标", },
                { id: 6, fill: 'rgb(230, 176, 170)', boader: 'rgb(205, 97, 85)', highlight: 'rgba(230, 176, 170,0.4)', text: "药物", },
                { id: 7, fill: 'rgb(237, 187, 153)', boader: 'rgb(245, 176, 65)', highlight: 'rgba(237, 187, 153,0.4)', text: "部位、方位", },
                { id: 8, fill: 'rgb(245, 203, 167)', boader: 'rgb(244, 208, 63)', highlight: 'rgba(245, 203, 167,0.4)', text: "频率", },
                { id: 9, fill: 'rgb(250, 215, 160)', boader: 'rgb(252, 220, 160)', highlight: 'rgba(250, 215, 160,0.4)', text: "值", },
                { id: 10, fill: 'rgb(171, 235, 198)', boader: 'rgb(181, 222, 190)', highlight: 'rgba(171, 235, 198,0.4)', text: "症状变化", },
                { id: 11, fill: 'rgb(169, 223, 191)', boader: 'rgb(175, 220, 190)', highlight: 'rgba(169, 223, 191,0.4)', text: "其他修饰词" },
                { id: 12, fill: 'rgb(249, 231, 159)', boader: 'rgb(82, 190, 128)', highlight: 'rgba(249, 231, 159,0.4)', text: "时间", },
            ];
            document.querySelector('#run').addEventListener('click', function () { return run(); });
        }
    }
});
//# sourceMappingURL=main.js.map