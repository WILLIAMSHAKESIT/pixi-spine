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
    private gameContainer:PIXI.Container
    public spine:any
    private screenOrient:string
    private posX:number
    private posY:number
    constructor(app:PIXI.Application,gameContainer:PIXI.Container,textureArray:any,screenOrient:string){
        this.app = app
        this.container = new PIXI.Container
        this.gameContainer = new PIXI.Container
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
            this.posX = 100
            this.leaves.rotation = 190
        }else{
            this.posX = 935.5
        }
       // const posX = 935.5
        const posY = 1025
        // create glow back drop
       
         this.leaves.x = this.posX
         this.leaves.y = posY
        //this.leaves.rotation = 190
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