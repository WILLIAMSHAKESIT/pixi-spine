import * as PIXI from 'pixi.js';
import Reel from './Reel';
export default class Slot{
    private app:PIXI.Application
    private slotLogo:PIXI.Sprite
    private slotBg:PIXI.Sprite
    private textureArray:any
    private baseWidth:number
    private baseHeight:number
    private reel:Reel
    private slotContainer:PIXI.Container
    private reelsContainer:PIXI.Container
    private reelsValues:Array<Array<number>> = [
        [4,5,6,7,4,5,3,3,5,6,7,5,7,5,3,5,4,0,7,3,2,1,3,4,0,8,7,6,5,4],
        [1,4,5,3,4,8,3,8,0,3,2,5,7,7,2,1,3,4,3,3,0,6,4,4,2,6,0,8,4,6],
        [0,4,7,6,4,2,2,2,4,6,8,5,4,2,5,7,3,0,3,3,4,4,3,2,7,5,8,7,5,4],
        [0,4,7,6,4,2,2,2,4,6,8,5,4,2,5,7,3,0,3,3,4,4,3,2,7,5,8,7,5,2],
        [1,3,6,7,3,2,2,4,5,8,0,3,1,2,7,7,3,3,1,0,0,8,3,2,2,3,0,8,1,4],
    ]
    constructor(app:PIXI.Application,textureArray:any){
        this.app = app
        this.baseWidth = this.app.screen.width
        this.baseHeight = this.app.screen.height
        this.textureArray = textureArray
        this.slotContainer = new PIXI.Container
        this.reelsContainer = new PIXI.Container
        this.init()
    }
    private init(){
        this.createSlotFrame()
        this.createReels()
    }
    private createReels(){
        this.reelsValues.forEach((data,index)=>{
            this.reel = new Reel(this.app,data,this.textureArray,index)
            this.reelsContainer.addChild(this.reel.reelContainer)
            this.slotContainer.addChild(this.reelsContainer)
        })
        this.reelsContainer.addChild(this.reel.reelContainer)
        this.slotContainer.addChild(this.reelsContainer)
        
        this.reelsContainer.y = (this.slotBg.height - this.reelsContainer.height) + 60
        this.reelsContainer.x = -50
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

        this.app.stage.addChild(this.slotContainer)
    }
}