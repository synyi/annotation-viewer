/**
 * Created by yjh on 2016/10/8.
 */

import {Annotator, Categories} from './synyi-annotation-tool/src/Annotator'
function loadContentOfFile(file: File) {
    let fr = new FileReader();
    return new Promise(resolve=> {
        fr.onload = function () {
            resolve(fr.result)
        };
        fr.readAsText(file, 'utf-8')
    })
}


function jsonp(url, callbackName?): Promise<any> {
    if (!callbackName) {
        callbackName = '__callback__' + Math.round(Math.random() * 1000000)
    }
    return new Promise((resolve, reject) => {
        window[callbackName] = function (content) {
            resolve(content);
            document.body.removeChild(scp);
            window[callbackName] = undefined
        };
        let scp = document.createElement('script');
        scp.src = url+callbackName;
        scp.onerror = reject;
        document.body.appendChild(scp)
    })
}


class AnnotationService {
    relCache;
    catCache;

    constructor() {
    }

    async getRelation() {
        if (!this.relCache) {
            this.relCache = await jsonp('https://yi-ai.cn/api/category/relation/export?callback=');
        }
        return this.relCache
    }

    async getCategory() {
        if (!this.catCache) {
            this.catCache = await jsonp('https://yi-ai.cn/api/category/label/export?callback=');
        }
        return this.catCache
    }

}
let annotationService=new AnnotationService();



let ann = new Annotator(document.querySelector('#con'));
async function run() {
    let contentInput: HTMLInputElement = document.querySelector('#content') as HTMLInputElement;
    let result: string = await loadContentOfFile(contentInput.files[0]) as string;
    let nlpResult = JSON.parse(result);
    let rel_labels = await annotationService.getRelation();
    let relationDict = {};
    rel_labels.forEach(x => relationDict[x.id] = x.text);
    let category_labels = await annotationService.getCategory();
    let text = nlpResult.rawText;
    let concepts = nlpResult.NLPResult.concepts;
    let labels = concepts.map(x => {
        return {
            category: x.category,
            pos: [x.pos[0], x.pos[1] - 1],
            id: x.id
        }
    });
    let relations = [];
    let rid = 0;
    concepts.forEach(x => {
        x.relations.forEach(r => {
            relations.push({
                src: r.src_id,
                text: relationDict[r.type],
                id: rid++,
                dst: x.id
            })
        })

    });
    ann.import(text, category_labels, labels, relations)
}
document.querySelector('#run').addEventListener('click',()=>run());
