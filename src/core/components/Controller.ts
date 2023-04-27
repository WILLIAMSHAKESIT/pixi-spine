import * as PIXI from 'pixi.js';

export default class Controller{
    private app:PIXI.Application
    public container:PIXI.Container
    private textureArray:any
    private parentSprite:PIXI.Sprite
    private soundBtnSprite:PIXI.Sprite
    private menuBtnSprite:PIXI.Sprite
    private infoBtnSprite:PIXI.Sprite
    private playBtnSprite:PIXI.Sprite
    private autoPlayBtnSprite:PIXI.Sprite
    constructor(app:PIXI.Application,textureArray:any){
        this.app = app
        this.textureArray = textureArray
        this.container = new PIXI.Container
        this.init()
    }
    private init(){
        this.createParent()
        this.createChildren()
    }
    private createParent(){
        this.parentSprite = PIXI.Sprite.from(this.textureArray.ui_menu.textures[`menu_container.png`])
        this.parentSprite.y = this.app.screen.height - this.parentSprite.height
        this.parentSprite.x = 0
        this.container.addChild(this.parentSprite)
    }
    private createChildren(){
        let sidePadding = 30

        this.playBtnSprite = PIXI.Sprite.from(this.textureArray.ui_menu.textures[`play_button.png`])
        this.playBtnSprite.cursor = 'pointer'
        this.playBtnSprite.interactive = true
        this.playBtnSprite.x = (this.parentSprite.width - this.playBtnSprite.width)/2
        this.playBtnSprite.y = ((this.parentSprite.height - this.playBtnSprite.height)/2) - (this.playBtnSprite.height/2)
        this.parentSprite.addChild(this.playBtnSprite)
        
        this.autoPlayBtnSprite = PIXI.Sprite.from(this.textureArray.ui_menu.textures[`autoplay_button.png`])
        this.autoPlayBtnSprite.cursor = 'pointer'
        this.autoPlayBtnSprite.interactive = true
        this.autoPlayBtnSprite.x = (this.parentSprite.width - this.autoPlayBtnSprite.width)/2
        this.autoPlayBtnSprite.y = ((this.parentSprite.height - this.autoPlayBtnSprite.height)) - sidePadding
        this.parentSprite.addChild(this.autoPlayBtnSprite)

        this.soundBtnSprite =  PIXI.Sprite.from(this.textureArray.ui_menu.textures[`sound_button.png`])
        this.soundBtnSprite.cursor = 'pointer'
        this.soundBtnSprite.interactive = true
        this.soundBtnSprite.x = sidePadding
        this.soundBtnSprite.y = (this.parentSprite.height - this.soundBtnSprite.height)/2
        this.parentSprite.addChild(this.soundBtnSprite)

        this.menuBtnSprite = PIXI.Sprite.from(this.textureArray.ui_menu.textures[`menu_button.png`])
        this.menuBtnSprite.cursor = 'pointer'
        this.menuBtnSprite.interactive = true
        this.menuBtnSprite.x = (this.parentSprite.width - (this.menuBtnSprite.width+sidePadding)) 
        this.menuBtnSprite.y = (this.parentSprite.height - this.menuBtnSprite.height)/2
        this.parentSprite.addChild(this.menuBtnSprite)
        
        this.infoBtnSprite = PIXI.Sprite.from(this.textureArray.ui_menu.textures[`info_button.png`])
        this.infoBtnSprite.cursor = 'pointer'
        this.infoBtnSprite.interactive = true
        this.infoBtnSprite.x = this.menuBtnSprite.x - (sidePadding*3.5) 
        this.infoBtnSprite.y = (this.parentSprite.height - this.infoBtnSprite.height)/2
        this.parentSprite.addChild(this.infoBtnSprite)
    }   
}