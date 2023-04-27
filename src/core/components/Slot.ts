import * as PIXI from 'pixi.js';
import Reel from './Reel';
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";

// register the plugin
gsap.registerPlugin(PixiPlugin);

// give the plugin a reference to the PIXI object
PixiPlugin.registerPIXI(PIXI);

export default class Slot{
    private app:PIXI.Application
    private slotLogo:PIXI.Sprite
    private slotBg:PIXI.Sprite
    private textureArray:any
    private baseWidth:number
    private baseHeight:number
    private reel:Reel
    public slotContainer:PIXI.Container
    private reelsContainer:PIXI.Container
    private masksContainer:PIXI.Container
    private reelsValues:Array<Array<number>> = [
        [4,5,6,7,4,5,3,3,5,6,7,5,7,5,3,5,4,0,7,3,2,1,3,4,0,8,7,6,5,4],
        [1,4,5,3,4,8,3,8,0,3,2,5,7,7,2,1,3,4,3,3,0,6,4,4,2,6,0,8,4,6],
        [0,4,7,6,4,2,2,2,4,6,8,5,4,2,5,7,3,0,3,3,4,4,3,2,7,5,8,7,5,4],
        [0,4,7,6,4,2,2,2,4,6,8,5,4,2,5,7,3,0,3,3,4,4,3,2,7,5,8,7,5,2],
        [1,3,6,7,3,2,2,4,5,8,0,3,1,2,7,7,3,3,1,0,0,8,3,2,2,3,0,8,1,4],
    ]
    private reelContainerX:number = 245
    private maskContainerX:number = 242
    private spinCount:number = 0
    constructor(app:PIXI.Application,textureArray:any){
        this.app = app
        this.baseWidth = this.app.screen.width
        this.baseHeight = this.app.screen.height
        this.textureArray = textureArray
        this.slotContainer = new PIXI.Container
        this.reelsContainer = new PIXI.Container
        this.masksContainer = new PIXI.Container
        this.init()
        window.document.addEventListener('keypress', e => this.startSpin());
    }
    private init(){
        this.createSlotFrame()
        this.createReels()
    }
    private createReels(){
        this.reelsValues.forEach((data,index)=>{
            this.reel = new Reel(this.app,data,this.textureArray,index)  
            this.reelsContainer.addChild(this.reel.reelMaskContainer)
            this.masksContainer.addChild(this.reel.maskReelContainer)
            this.slotContainer.addChild(this.reelsContainer,this.masksContainer) 
        })

        this.reelsContainer.x = this.reelContainerX
        this.masksContainer.x = this.maskContainerX
    }
    public startSpin(){
        let dY = 7492.5
        this.reelsContainer.children.forEach((data,index)=>{
            let spin = gsap.to(data, {
                delay:index*0.3,
                duration: 3,
                y: dY + 30,
                onComplete:()=>{
                    spin.kill()
                    this.spinCount++
                    let bounce = gsap.to(data,{
                        y: dY,
                        duration:0.3,
                        ease: "power1.out",
                        onComplete:()=>{
                            bounce.kill()
                            data.y = 0
                            // this.reel.createBlocks(false)
                            this.reel.updateBlocks()
                        }
                    })
                }
            });
        })
    }
    private createSlotFrame(){
        this.slotLogo = PIXI.Sprite.from(this.textureArray.main.textures['logo.png']);
        this.slotBg = PIXI.Sprite.from(this.textureArray.main.textures['reels.png']);

        this.slotBg.anchor.set(0.5)
        this.slotBg.x = this.baseWidth/2
        this.slotBg.y = this.baseHeight/2
        this.slotContainer.addChild(this.slotBg)

        this.slotBg.addChild(this.slotLogo)
        this.slotLogo.anchor.set(0.5)
        this.slotLogo.x = 0
        this.slotLogo.y = -446

        this.slotContainer.y = -40 
    }
}