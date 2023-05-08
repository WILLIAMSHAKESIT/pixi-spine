import 'pixi-spine' 
import * as PIXI from 'pixi.js';
import Loader from "./components/Loader";
import Slot from './components/Slot';
import Controller from './components/Controller';
import Modal from './components/Modal';
import Functions from './settings/Functions';
import json from './settings/settings.json'
import {Spine} from 'pixi-spine';
export default class Game{
    private app:PIXI.Application
    private textureArray:any
    private gameContainer:PIXI.Container;
    private gameBackground:PIXI.Sprite
    private baseWidth:number;
    private baseHeight:number;
    private slotGame:Slot;
    private controller:Controller   
    private modal:Modal
    private spinType:string = 'normal'
    private textureToggleOn:PIXI.Texture
    private textureToggleOff:PIXI.Texture
    private textureRollOn:PIXI.Texture
    private textureRollOff:PIXI.Texture
    private spinTextureOn:PIXI.Texture
    private spinTextureOff:PIXI.Texture
    // values
    private betAmount:number = 1
    private betIndex:number = 0
    constructor(){
        new Loader(this.init.bind(this))
    }
    private init(res:any,app:PIXI.Application){
        this.app = app
        this.baseWidth = this.app.screen.width
        this.baseHeight = this.app.screen.height
        this.textureArray = res
        this.gameContainer = new PIXI.Container
        this.textureToggleOn = Functions.loadTexture(this.textureArray,'modal','on').texture
        this.textureToggleOff = Functions.loadTexture(this.textureArray,'modal','off').texture
        this.textureRollOn = Functions.loadTexture(this.textureArray,'modal','roll_active').texture
        this.textureRollOff = Functions.loadTexture(this.textureArray,'modal','roll').texture
        this.textureRollOff = Functions.loadTexture(this.textureArray,'modal','roll').texture
        this.spinTextureOn = Functions.loadTexture(this.textureArray,'controller','spin_button').texture
        this.spinTextureOff = Functions.loadTexture(this.textureArray,'controller','spin_pause_button').texture
        this.createGame()
        this.createSlot()
        this.createController()
        this.createModal()
        this.events()
        this.updateTextValues()
        this.app.stage.addChild(this.gameContainer);
    }
    private createModal(){
        this.modal = new Modal(this.app,this.textureArray)
    }
    private createGame(){
        this.gameBackground = Functions.loadTexture(this.textureArray,'main','bg')
        this.gameBackground.width = this.baseWidth
        this.gameBackground.height = this.baseHeight
        this.gameContainer.addChild(this.gameBackground)
    }
    private createSlot(){
        // create slot
        this.slotGame = new Slot(this.app,this.textureArray,this.updateCreditValues.bind(this),this.onSpinEnd.bind(this))
        this.gameContainer.addChild(this.slotGame.container)
    }
    private createController(){
        this.controller = new Controller(this.app,this.textureArray)
        this.gameContainer.addChild(this.controller.container)
    }
    private events(){
        //open system settings modal
        this.controller.settingBtnSpite.addEventListener('pointerdown',()=>{
            this.modal.createSystemSettings()
            this.modal.betBtns.forEach((data,index)=>{
                data.addEventListener('pointerdown',()=>{
                    if(index == 0){
                        this.betIndex--
                        this.modal.betAmount = json.bet_amounts[this.betIndex]
                        this.modal.betAmountText.text = this.betAmount
                        this.modal.betAmountText.x = (this.modal.betAmountSpite.width - this.modal.betAmountText.width)/2
                        if(this.betIndex == 0){
                            this.modal.minusBtn.interactive = false
                        }else{
                            this.modal.minusBtn.interactive = true
                            this.modal.plusBtn.interactive = true
                        }
                    }else{
                        this.betIndex++
                        this.betAmount = json.bet_amounts[this.betIndex]
                        this.modal.betAmountText.text = this.betAmount
                        this.modal.betAmountText.x = (this.modal.betAmountSpite.width - this.modal.betAmountText.width)/2
                        if(this.betIndex == 5){
                            this.modal.plusBtn.interactive = false
                        }else{
                            this.modal.plusBtn.interactive = true
                            this.modal.minusBtn.interactive = true
                        }
                    }
                    this.betTextValue()
                })
            })
        })
        //open autoplay
        this.controller.autoPlay.addEventListener('pointerdown',()=>{
            this.slotGame.autoPlayCount = 0
            this.modal.btnArray = []
            this.modal.createAutoPlaySettings()
            //toggle spin type
            this.modal.btnArray.forEach((data,index)=>{
                data.addEventListener('pointerdown',()=>{
                    if(index == 0){
                        this.spinType = 'quick'
                        this.modal.btnArray[0].texture = this.textureToggleOn
                        this.modal.btnArray[1].texture = this.textureToggleOff
                    }else{
                        this.spinType = 'turbo'
                        this.modal.btnArray[0].texture = this.textureToggleOff
                        this.modal.btnArray[1].texture = this.textureToggleOn
                    }
                })
            })
            //start slot auto spin
            this.modal.rollBtn.addEventListener('pointerdown',()=>{
                this.controller.spinBtnSprite.texture = this.spinTextureOff
                this.controller.spinBtnSprite.interactive = false
                this.modal.rollBtn.texture = this.textureRollOn
                this.startSpin(this.modal.totalSpin)
            })
            this.modal.rollBtn.addEventListener('mouseenter',()=>{
                this.modal.rollBtn.texture = this.textureRollOn
            })
            this.modal.rollBtn.addEventListener('mouseleave',()=>{
                this.modal.rollBtn.texture = this.textureRollOff
            })
        })
        //single spin trigger
        this.controller.spinBtnSprite.addEventListener('pointerdown',()=>{
            this.controller.spinBtnSprite.texture = this.spinTextureOff
            this.controller.spinBtnSprite.interactive = false
            this.spinType = 'normal'
            if(!this.slotGame.isSpinning)
                this.startSpin(1)
        })
    }
    private startSpin(spinCount:number){
        this.slotGame.autoPlayCount = spinCount
        this.slotGame.startSpin(this.spinType)
    }
    private updateTextValues(){
       this.betTextValue()    
       this.updateCreditValues()
    }
    private betTextValue(){
        console.log('test')
        //bet value
        this.controller.betText.text = this.betAmount
        this.controller.betText.x = (this.controller.betContainerSprite.width - this.controller.betText.width)/2 
    }
    private updateCreditValues(){
        //credit value
        if(this.controller !== undefined){
            this.controller.creditText.text = Functions.numberWithCommas(this.slotGame.credit) 
            this.controller.creditText.x = (this.controller.creditContainerSprite.width - this.controller.creditText.width)/2     
        }
    }
    private onSpinEnd(){
        if(this.slotGame.autoPlayCount <= 1){
            this.controller.spinBtnSprite.texture = this.spinTextureOn
            this.controller.spinBtnSprite.interactive = true
        }
    }
}