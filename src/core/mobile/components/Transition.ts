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
    public overlay:PIXI.Sprite
    public leaves:Spine
    private gameContainer:any
    public spine:any
    private screenOrient:string
    private posX:number
    private posY:number
    constructor(app:PIXI.Application,gameContainer:PIXI.Container,textureArray:any,screenOrient:string){
        this.app = app
        this.container = new PIXI.Container
        this.gameContainer = gameContainer
        this.baseWidth = this.app.screen.width
        this.baseHeight = this.app.screen.height
        this.textureArray = textureArray
        this.screenOrient = screenOrient
        this.init()
    }
    private init(){
        this.createParent()
    }
    private createParent(){
        this.leaves = new Spine(this.textureArray.transition.spineData)
        if(this.screenOrient == 'portrait'){
            this.container.rotation = PIXI.DEG_TO_RAD * 0
            this.container.x = 936
            this.container.y = 1066.5
            this.container.rotation = PIXI.DEG_TO_RAD * 90
            this.container.x = 89.5
            this.container.y = 936.5
        }else{
            this.container.rotation = PIXI.DEG_TO_RAD * 0
            this.container.x = 936
            this.container.y = 1038
        }
        // const posX = 935.5
        // const posY = 1025
        // create glow back drop
        // animate glow
        this.container.addChild(this.leaves)
        this.spine = Functions.loadSpineAnimation(this.leaves,'animation',false,0.3)
        this.spine.state.onComplete = () => {
            let timeout = setTimeout(()=>{
                this.container.removeChild(this.leaves)
                this.gameContainer.removeChild(this.container)
                clearTimeout(timeout)
            },50)
        };
    }
}   