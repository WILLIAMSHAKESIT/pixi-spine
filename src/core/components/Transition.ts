import 'pixi-spine'
import * as PIXI from 'pixi.js';
import {Spine} from 'pixi-spine';
import Functions from '../settings/Functions';
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
export default class Transition{
    //app settings
    private app:PIXI.Application
    private textureArray:any
    private baseWidth:number
    private baseHeight:number
    public container:PIXI.Container
    private overlay:PIXI.Sprite
    private leaves:Spine
    constructor(app:PIXI.Application,textureArray:any){
        this.app = app
        this.container = new PIXI.Container
        this.baseWidth = this.app.screen.width
        this.baseHeight = this.app.screen.height
        this.textureArray = textureArray
        this.init()
    }
    private init(){
        this.createParent()
    }
    private createParent(){
        // create glow back drop
        this.leaves = new Spine(this.textureArray.transition.spineData)
        this.leaves.x = 935.5
        this.leaves.y = 1025
        // this.leaves.scale.x = 1.4
        // this.leaves.scale.y = 1.7
        // animate glow
        Functions.loadSpineAnimation(this.leaves,'animation',true,0.3)
        this.container.addChild(this.leaves)
    }
}   