import 'pixi-spine' 
import * as PIXI from 'pixi.js';
import Functions from '../settings/Functions';
export default class Controller{
    //app settings
    private app:PIXI.Application
    private baseHeight:number
    private baseWidth:number
    public container:PIXI.Container
    private textureArray:Array<any>
    //sprites
    private parentSprite:PIXI.Sprite
    private infoBtnSprite:PIXI.Sprite
    private soundBtnSprite:PIXI.Sprite
    private spinBtnSprite:PIXI.Sprite
    private autoPlay:PIXI.Sprite
    private settingBtnSpite:PIXI.Sprite
    private betContainerSprite:PIXI.Sprite
    private creditContainerSprite:PIXI.Sprite
    constructor(app:PIXI.Application,textureArray:Array<any>){
        this.app = app
        this.baseWidth = this.app.screen.width
        this.baseHeight = this.app.screen.height
        this.textureArray = textureArray
        this.container = new PIXI.Container()
        this.init()
    }
    private init(){
        this.createParent()
        this.createChildren()
    }
    private createParent(){
        this.parentSprite = Functions.loadTexture(this.textureArray,'controller','controller_parent')
        this.parentSprite.y = this.baseHeight - this.parentSprite.height
        this.container.addChild(this.parentSprite)
    }
    private createChildren(){
        //info btn
        this.infoBtnSprite = Functions.loadTexture(this.textureArray,'controller','info_button')
        this.infoBtnSprite.y = this.parentSprite.y+10
        this.infoBtnSprite.x = this.infoBtnSprite.width*1.64
        this.infoBtnSprite.interactive = true
        this.infoBtnSprite.cursor = 'pointer'
        this.container.addChild(this.infoBtnSprite)
        //sound
        this.soundBtnSprite = Functions.loadTexture(this.textureArray,'controller','sound_off_button')
        this.soundBtnSprite.y = ((this.parentSprite.y + this.parentSprite.height) - this.soundBtnSprite.height) - 25
        this.soundBtnSprite.x = this.soundBtnSprite.width*1.01 
        this.soundBtnSprite.interactive = true
        this.soundBtnSprite.cursor = 'pointer'
        this.container.addChild(this.soundBtnSprite)
        //spin
        this.spinBtnSprite = Functions.loadTexture(this.textureArray,'controller','spin_button')
        this.spinBtnSprite.y = this.parentSprite.y + 15
        this.spinBtnSprite.x = (this.parentSprite.width - this.spinBtnSprite.width) - 147
        this.spinBtnSprite.interactive = true
        this.spinBtnSprite.cursor = 'pointer'
        this.container.addChild(this.spinBtnSprite)
        //autoplay
        this.autoPlay = Functions.loadTexture(this.textureArray,'controller','autoplay_button')
        this.autoPlay.y = (this.parentSprite.y + this.parentSprite.height) - this.autoPlay.height*1.2
        this.autoPlay.x = (this.parentSprite.width - this.autoPlay.width) - 45
        this.autoPlay.interactive = true
        this.autoPlay.cursor = 'pointer'
        this.container.addChild(this.autoPlay)
        //settings
        this.settingBtnSpite = Functions.loadTexture(this.textureArray,'controller','system_settings')
        this.settingBtnSpite.y = this.parentSprite.y+90
        this.settingBtnSpite.x = this.settingBtnSpite.width *1.5
        this.settingBtnSpite.interactive = true
        this.settingBtnSpite.cursor = 'pointer'
        this.container.addChild(this.settingBtnSpite)
        // bet container
        this.betContainerSprite = Functions.loadTexture(this.textureArray,'controller','bet_container')
        this.betContainerSprite.y = this.parentSprite.y + 90
        this.betContainerSprite.x = this.betContainerSprite.width*0.95
        this.container.addChild(this.betContainerSprite)
        // credit container
        this.creditContainerSprite = Functions.loadTexture(this.textureArray,'controller','credits_container')
        this.creditContainerSprite.y = this.parentSprite.y + 90 
        this.creditContainerSprite.x = (this.parentSprite.width - this.creditContainerSprite.width)*0.82
        this.container.addChild(this.creditContainerSprite)
    }
}