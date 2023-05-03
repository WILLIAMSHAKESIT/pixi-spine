import 'pixi-spine' 
import * as PIXI from 'pixi.js';
import Functions from '../settings/Functions';
export default class Modal{
    //app settings
    private app:PIXI.Application
    private baseHeight:number
    private baseWidth:number
    public container:PIXI.Container
    private textureArray:Array<any>
    //sprites
    private overlay:PIXI.Sprite
    private modalFrame:PIXI.Sprite
    private titleY:number = 50
    private closeModal:PIXI.Sprite
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
        this.createSystemSettings()
    }
    private createParent(){
        this.overlay = Functions.loadTexture(this.textureArray,'modal','overlay')
        this.modalFrame = Functions.loadTexture(this.textureArray,'modal','modal_frame')
        this.modalFrame.x = (this.overlay.width - this.modalFrame.width)/2
        this.modalFrame.y = (this.overlay.height - this.modalFrame.height)/2
        //close modal
        this.closeModal = Functions.loadTexture(this.textureArray,'modal','close_button') 
        this.closeModal.cursor = 'pointer'
        this.closeModal.interactive = true
        this.closeModal.x = (this.modalFrame.width - this.closeModal.width) - 30
        this.closeModal.y = 30 
        this.modalFrame.addChild(this.closeModal)

        this.container.addChild(this.overlay,this.modalFrame)
        this.app.stage.addChild(this.container)
    }
    private createSystemSettings(){
        const leftContainer = new PIXI.Container
        const title = Functions.loadTexture(this.textureArray,'modal','system_settings_title')

        title.x = (this.modalFrame.width - title.width)/2
        title.y = this.titleY
        this.modalFrame.addChild(title)
    }
}