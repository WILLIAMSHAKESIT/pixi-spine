
import * as PIXI from 'pixi.js';

export default class Slot{
    private app:PIXI.Application
    private slotLogo:PIXI.Sprite
    private slotBg:PIXI.Sprite
    private textureArray:any
    private baseWidth:number
    private baseHeight:number
    constructor(app:PIXI.Application,textureArray:any){
        this.app = app
        this.baseWidth = this.app.screen.width
        this.baseHeight = this.app.screen.height
        this.textureArray = textureArray
        this.init()
    }
    private init(){
        this.createSlotFrame()
    }
    private createSlotFrame(){
        this.slotLogo = PIXI.Sprite.from(this.textureArray.main.textures['logo.png']);
        this.slotBg = PIXI.Sprite.from(this.textureArray.main.textures['reels.png']);

        this.slotBg.anchor.set(0.5)
        this.slotBg.x = this.baseWidth/2
        this.slotBg.y = this.baseHeight/2
        this.app.stage.addChild(this.slotBg)

        this.slotBg.addChild(this.slotLogo)
        this.slotLogo.anchor.set(0.5)
        this.slotLogo.x = 0
        this.slotLogo.y = -446
    }
}