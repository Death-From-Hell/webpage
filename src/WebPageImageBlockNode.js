// ----------------------------------------------
//         Copyright 2022 Leonid Petrunya
//              All rights reserved
// ----------------------------------------------
//             WebPageImageBlockNode
// ----------------------------------------------

import {WebPageBaseNode} from "./WebPageBaseNode.js";
 
class WebPageImageBlockNode extends WebPageBaseNode {
    constructor(argObject = {}, argDataVar = {}) {
        super(argObject, argDataVar);
        this.__loadInputVar(argObject,
            {name: "title", defaultValue: ""},
            {name: "eventNode"},
            {name: "src"},
            {name: "crossOrigin", defaultValue: false},
            {name: "pivotPointX", defaultValue: "center"},
            {name: "pivotPointY", defaultValue: "center"},
            {name: "scaleX", defaultValue: 1},
            {name: "scaleY", defaultValue: 1},
            {name: "translateX", defaultValue: 0},
            {name: "translateY", defaultValue: 0},
            {name: "translateZ", defaultValue: 0},
            {name: "linkUrl"},
        );
    }
    async init() {
        const nodes = [
            "graph",
            "image",
            "texture",
            "pivotPoint",
            "scale",
            "translate",
            "drawTexture",
        ];
        await this.root.importNode(...nodes);
        this.data.graph = this.root.node("Graph", {
            name: "Graph",
            clear: false
        });
        
        this.data.imageNode = this.data.graph.node("Image", {
            name: "Image Node",
            src: this.src,
            crossOrigin: this.crossOrigin
        });
        await this.data.imageNode.load().catch(e => console.warn(e));

        this.data.textureNode = this.data.graph.node("Texture", {
            name: "Texture Node",
            sourceNode: this.data.imageNode,
            instantLoad: true,
            update: false
        });
        
        const pivotPointTexture = this.data.graph.node("PivotPoint", {
            name: "Pivot Point Texture",
            x: this.pivotPointX,
            y: this.pivotPointY,
            objectNode: this.data.textureNode,
        });
    
        const scaleTexture = this.data.graph.node("Scale", {
            name: "Scale Texture",
            transformNode: pivotPointTexture,
            x: () => this.scaleX,
            y: () => this.scaleY,
            z: 1,
        });

        const translateTexture = this.data.graph.node("Translate", {
            name: "Translate Texture",
            transformNode: scaleTexture,
            x: () => this.translateX,
            y: () => this.translateY,
            z: () => this.translateZ,
        });
    
        const drawTexture = this.data.graph.node("DrawTexture", {
            name: "Draw Texture",
            textureNode: this.data.textureNode,
            transformNode: translateTexture,
            instantDraw: true,
            eventNode: this.eventNode,
            objectId: this.data.textureNode.id,
            cleanup: () => {console.log("ss");}
        });
        
        if(this.linkUrl && this.__isNode(this.eventNode)) {
            this.eventNode.addEventListener({
                phase: "down",
                func: (e) => {e.cursor("pointer");},
                event: "mouseover",
                objectId: this.data.textureNode.id
            });
            this.eventNode.addEventListener({
                phase: "down",
                func: (e) => {e.cursor("default");},
                event: "mouseout",
                objectId: this.data.textureNode.id
            });
            this.eventNode.addEventListener({
                phase: "down",
                func: (e) => {
                    history.pushState({}, this.title);
                    location.href = this.linkUrl;
                },
                event: "click",
                objectId: this.data.textureNode.id
            });
        }
        
        this.data.graph.sort();
//         this.data.graph.showSortedGraph();
    }
    __update() {
        if(this.enable) {
            this.__setup();
            this.update();
            this.__cleanup();
        }
    }
    update() {
        this.data.graph.__update();
    }
}
Object.defineProperties(WebPageImageBlockNode.prototype, {
    "width": {
        get() {return this.data.textureNode.width;},
    },
    "height": {
        get() {return this.data.textureNode.height;},
    },
    "title": {
        get() {return this.__getValue(this.input.title);},
        set(value) {this.input.title = value;}
    },
    "src": {
        get() {return this.__getValue(this.input.src);},
        set(value) {this.input.src = value;}
    },
    "crossOrigin": {
        get() {return this.__getValue(this.input.crossOrigin);},
        set(value) {this.input.crossOrigin = value;}
    },
    "eventNode": {
        get() {return this.__getValue(this.input.eventNode);},
        set(value) {this.input.eventNode = value;}
    },
    "textNodeValue": {
        get() {return this.__getValue(this.input.textNodeValue);},
        set(value) {this.input.textNodeValue = value;}
    },
    "pivotPointX": {
        get() {return this.__getValue(this.input.pivotPointX);},
        set(value) {this.input.pivotPointX = value;}
    },
    "pivotPointY": {
        get() {return this.__getValue(this.input.pivotPointY);},
        set(value) {this.input.pivotPointY = value;}
    },
    "scaleX": {
        get() {return this.__getValue(this.input.scaleX);},
        set(value) {this.input.scaleX = value;}
    },
    "scaleY": {
        get() {return this.__getValue(this.input.scaleY);},
        set(value) {this.input.scaleY = value;}
    },
    "translateX": {
        get() {return this.__getValue(this.input.translateX);},
        set(value) {this.input.translateX = value;}
    },
    "translateY": {
        get() {return this.__getValue(this.input.translateY);},
        set(value) {this.input.translateY = value;}
    },
    "translateZ": {
        get() {return this.__getValue(this.input.translateZ);},
        set(value) {this.input.translateZ = value;}
    },
    "linkUrl": {
        get() {return this.__getValue(this.input.linkUrl);},
        set(value) {this.input.linkUrl = value;}
    },
});

export {WebPageImageBlockNode};