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
    private gameContainer:PIXI.Container
    public spine:any
    constructor(app:PIXI.Application,gameContainer:PIXI.Container,textureArray:any){
        this.app = app
        this.container = new PIXI.Container
        this.gameContainer = new PIXI.Container
        this.baseWidth = this.app.screen.width
        this.baseHeight = this.app.screen.height
        this.textureArray = textureArray
        this.init()
    }
    private init(){
        this.createParent()
    }
    private createParent(){
        const posX = 935.5
        const posY = 1025
        // create glow back drop
        this.leaves = new Spine(this.textureArray.transition.spineData)
        this.leaves.x = posX
        this.leaves.y = posY
        // animate glow
        this.container.addChild(this.leaves)
        this.spine = Functions.loadSpineAnimation(this.leaves,'animation',false,0.3)
        this.spine.state.onComplete = () => {
            let timeout = setTimeout(()=>{
                this.container.removeChild(this.leaves)
                this.gameContainer.removeChild(this.container)
                clearTimeout(timeout)
            },2000)
        };
    }
}   