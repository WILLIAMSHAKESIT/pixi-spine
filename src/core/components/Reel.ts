
import * as PIXI from 'pixi.js';
import Functions from '../settings/Functions'
import Block from './Block';
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";

// register the plugin
gsap.registerPlugin(PixiPlugin);

// give the plugin a reference to the PIXI object
PixiPlugin.registerPIXI(PIXI);


export default class Reel{
    private app:PIXI.Application
    private textureArray:any
    private blocks:Array<number> = []
    public reelContainer:PIXI.Container
    private reelIndex:number
    private maskContainer:PIXI.Container
    private maskY:number = 125
    private maskHeight:number = 830
    constructor(app:PIXI.Application,data:Array<number>,textureArray:any,reelIndex:number){
        this.app = app
        this.textureArray = textureArray
        this.reelIndex = reelIndex
        this.reelContainer = new PIXI.Container()
        this.maskContainer = new PIXI.Container()
        this.reelContainer.sortableChildren = true
        this.blocks = Functions.arrayRandomizer(data)
        this.init()
    }
    private init(){
        //create blocks
        this.blocks.map((data,index)=>{
            new Block(this.reelContainer,this.textureArray,data,index)
        })
        this.reelContainer.x = (1.1 * this.reelContainer.width)*(this.reelIndex+1)

        //mask part
        const mask = PIXI.Sprite.from(this.textureArray.slot.textures[`mask.png`])
        const maskX = 55

        this.maskContainer.addChild(mask)
        this.maskContainer.height = this.maskHeight
        this.maskContainer.x = this.reelContainer.x - maskX
        this.maskContainer.y = this.maskY
        this.reelContainer.y = (this.maskContainer.height - this.reelContainer.height)+70
        this.reelContainer.mask = this.maskContainer
        
        let spin = gsap.to(this.reelContainer, {
            delay:this.reelIndex*0.3,
            duration: 1,
            y: this.maskContainer.y + 150,
            onComplete:()=>{
                spin.kill()
                let bounce = gsap.to(this.reelContainer,{
                    y: this.maskContainer.y + 60,
                    duration:0.3,
                    ease: "power1.out",
                    onComplete:()=>{
                        bounce.kill()
                    }
                })
            }
        });

        this.app.stage.addChild(this.reelContainer,this.maskContainer)
    }
}