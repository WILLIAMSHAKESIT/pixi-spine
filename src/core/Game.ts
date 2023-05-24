import 'pixi-spine' 
import * as PIXI from 'pixi.js';
import Loader from "./components/Loader";
import Slot from './components/Slot';
import Congrats from './components/Congrats';
import PopUps from './components/PopUps';
import Controller from './components/Controller';
import Modal from './components/Modal';
import Transition from './components/Transition';
import Functions from './settings/Functions';
import json from './settings/settings.json'
import {Spine} from 'pixi-spine';
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import {Howler} from 'howler';
// give the plugin a reference to the PIXI object
PixiPlugin.registerPIXI(PIXI);
export default class Game{
    private app:PIXI.Application
    private textureArray:any
    private gameContainer:PIXI.Container;
    private gameBackground:PIXI.Sprite
    private matchingBlocksContainer:PIXI.Container
    private plantContainerRight:PIXI.Container
    private plantContainerLeft:PIXI.Container
    private baseWidth:number;
    private baseHeight:number;
    private slotGame:Slot;
    private controller:Controller   
    private modal:Modal
    private congrats:Congrats
    private popUps:PopUps
    private transition:Transition
    private spinType:string = 'normal'
    //texttures
    private textureToggleOn:PIXI.Texture
    private textureToggleOff:PIXI.Texture
    private textureRollOn:PIXI.Texture
    private textureRollOff:PIXI.Texture
    private spinTextureOn:PIXI.Texture
    private spinTextureOff:PIXI.Texture
    //sprites
    private buyBonusBtn:PIXI.Sprite
    private buyBonusFrame:PIXI.Sprite
    private overlay:PIXI.Sprite
    // values
    private betAmount:number = 1
    private betIndex:number = 0
    private userCredit:number = 999
    private matchingGameWin:number = 0
    private isAutoPlay:boolean = false
    private isMatchingGame:boolean = false
    //text style 
    private textStyle:PIXI.TextStyle
    private textStyle2:PIXI.TextStyle
    private textStyle3:PIXI.TextStyle
    private whiteYellow:PIXI.TextStyle
    private descText:PIXI.TextStyle
    private textStyleSize:number = 55
    //text values
    private buyBonusText:PIXI.Text
    private paylineText:PIXI.Text
    private paylineTextBottom:PIXI.Text
    private paylineGreetings:string
    //arrays 
    private paylineContainersAnimation:Array<any> = []
    private paylineAnimations:Array<any> = []
    //spines
    private popGlow:Spine
    private popGlow2:Spine
    //free spin
    private isFreeSpin:boolean = false;
    private transitionDelay:number = 2000
    private isOpenModal:boolean = false;
    private winFreeSpin:number = 0
    private noOfSpin:number = 0
    //frame glow 
    private frameGlow:Spine
    private firefliesArray:Array<Spine> = []
    //sound
    private sounBtnSpriteOn:PIXI.Texture
    private sounBtnSpriteOff:PIXI.Texture
    //sound 
    private sound:Array<any>;
    private globalSound:Boolean = false;
    private ambientCheck:Boolean = false;
    private sfxCheck:Boolean = false;
    public load:Loader;
    //plants
    private plant1Right:Spine
    private plant2Right:Spine
    private plant3Right:Spine
    private plant4Right:Spine
    private plant5Right:Spine
    private plant1Left:Spine
    private plant2Left:Spine
    private plant3Left:Spine
    private plant4Left:Spine
    private plant5Left:Spine
    private vines:Spine
     
    constructor(){
        this.matchingBlocksContainer = new PIXI.Container
        this.gameContainer = new PIXI.Container
        this.plantContainerRight = new PIXI.Container
        this.plantContainerLeft = new PIXI.Container
        this.gameContainer.sortableChildren = true
        this.whiteYellow = new PIXI.TextStyle({  
            fontFamily: 'Eras ITC',
            fontSize: 120,
            fontWeight: 'bolder',
            fill: ['#fffdfa', '#fec159'], // gradient
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 3,
            wordWrap: false,
            wordWrapWidth: 440,
            lineJoin: 'round',
        });
        this.textStyle = new PIXI.TextStyle({  
            fontFamily: 'Eras ITC',
            fontSize: this.textStyleSize,
            fontWeight: 'bolder',
            fill: ['#ffeaa0', '#ffc260'], // gradient
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#aa521d',
            dropShadowBlur: 0,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 3,
            wordWrap: false,
            wordWrapWidth: 440,
            lineJoin: 'round',
        });
        this.textStyle2 = new PIXI.TextStyle({  
            fontFamily: 'Eras ITC',
            fontSize: 120,
            fontWeight: 'bolder',
            fill: ['#ffffff', '#ffffff'], // gradient
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 3,
            wordWrap: true,
            wordWrapWidth: 440,
            lineJoin: 'round',
        });
        this.textStyle3 = new PIXI.TextStyle({  
            fontFamily: 'Eras ITC',
            fontSize: 40,
            fontWeight: 'bolder',
            fill: ['#ffffff', '#ffffff'], // gradient
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 3,
            wordWrap: false,
            wordWrapWidth: 440,
            lineJoin: 'round',
        });
        this.descText = new PIXI.TextStyle({  
            fontFamily: 'Eras ITC',
            fontSize: 30,
            fill: ['#ffffff', '#ffffff'], // gradient
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 3,
            wordWrap: true,
            wordWrapWidth: 440,
            lineJoin: 'round',
        });
        new Loader(this.init.bind(this),this.sounds.bind(this))
    }
    private init(res:any,app:PIXI.Application){
        this.app = app
        this.baseWidth = this.app.screen.width
        this.baseHeight = this.app.screen.height
        this.textureArray = res
        this.textureToggleOn = Functions.loadTexture(this.textureArray,'modal','on').texture
        this.textureToggleOff = Functions.loadTexture(this.textureArray,'modal','off').texture
        this.textureRollOn = Functions.loadTexture(this.textureArray,'modal','roll_active').texture
        this.textureRollOff = Functions.loadTexture(this.textureArray,'modal','roll').texture
        this.textureRollOff = Functions.loadTexture(this.textureArray,'modal','roll').texture
        this.spinTextureOn = Functions.loadTexture(this.textureArray,'controller','spin_button').texture
        this.spinTextureOff = Functions.loadTexture(this.textureArray,'controller','spin_pause_button').texture
        this.sounBtnSpriteOff =  Functions.loadTexture(this.textureArray,'controller','sound_off_button').texture
        this.sounBtnSpriteOn =  Functions.loadTexture(this.textureArray,'controller','sound_on_button').texture
        this.popGlow = new Spine(this.textureArray.pop_glow.spineData)
        this.popGlow2 = new Spine(this.textureArray.pop_glow.spineData)
        //overlay
        this.overlay = Functions.loadTexture(this.textureArray,'modal','overlay')
        this.createGame()
        this.createPlants()
        this.createSlot()
        this.createFrameGlow()
        this.createController()
        this.createBuyBonus()
        this.createModal()
        this.events()
        this.updateTextValues()
        this.app.stage.addChild(this.gameContainer);

        window.document.addEventListener('keydown', (e)=> {
            if(e.code === 'Space'  || e.key === 'Enter'){         
                // console.log(this.slotGame.isSpinning, " this.slotGame.isSpinning")
                // console.log(this.isAutoPlay, " this.isAutoPlay")
                // console.log(this.isMatchingGame, " this.isMatchingGame")
                // console.log(this.isFreeSpin, " this.isFreeSpin")
                // console.log(this.isOpenModal, " this.isOpenModal")
                if(!this.slotGame.isSpinning && !this.isAutoPlay && !this.isMatchingGame && !this.isFreeSpin && !this.isOpenModal){
                  
                    this.slotGame.timeScale = 0 
                    if(this.slotGame.notLongPress === true) {
                        this.slotGame.notLongPress = false;
                        this.spinType = 'normal'
                        this.startSpin(this.spinType)
                    }else{
                        this.spinType = 'turbo'
                        this.startSpin(this.spinType)
                    }
                }else{ 
                    this.slotGame.timeScale = 10
                }
            }
        });
        window.document.addEventListener('keyup', ()=> {
            this.slotGame.notLongPress = true;
        });

        this.playSound(0)
        Howler.mute(true)
    }
    private createPlants(){
        //plant 5
        this.plant5Right = new Spine(this.textureArray.plant_5.spineData)
        this.plant5Right.scale.set(0.7)
        this.plant5Right.x = this.baseWidth-100
        this.plant5Right.y = this.baseHeight*0.15
        Functions.loadSpineAnimation(this.plant5Right,'animation',true,0.6)
        this.plantContainerRight.addChild(this.plant5Right)
        //plant 4
        this.plant4Right = new Spine(this.textureArray.plant_4.spineData)
        this.plant4Right.scale.set(0.7)
        this.plant4Right.x = this.baseWidth-100
        this.plant4Right.y = this.baseHeight*0.3
        Functions.loadSpineAnimation(this.plant4Right,'animation',true,0.6)
        this.plantContainerRight.addChild(this.plant4Right)
        //plant 3
        this.plant3Right = new Spine(this.textureArray.plant_3.spineData)
        this.plant3Right.scale.set(0.7)
        this.plant3Right.x = this.baseWidth-100
        this.plant3Right.y = this.baseHeight*0.5
        Functions.loadSpineAnimation(this.plant3Right,'animation',true,0.6)
        this.plantContainerRight.addChild(this.plant3Right)
        //plant 2
        this.plant2Right = new Spine(this.textureArray.plant_2.spineData)
        this.plant2Right.scale.set(0.7)
        this.plant2Right.x = this.baseWidth
        this.plant2Right.y = this.baseHeight*0.6
        Functions.loadSpineAnimation(this.plant2Right,'animation',true,0.7)
        this.plantContainerRight.addChild(this.plant2Right)
        //plant 1
        this.plant1Right = new Spine(this.textureArray.plant_1.spineData)
        this.plant1Right.scale.set(0.8)
        this.plant1Right.x = this.baseWidth
        this.plant1Right.y = this.baseHeight*0.9
        Functions.loadSpineAnimation(this.plant1Right,'animation',true,0.7)
        this.plantContainerRight.addChild(this.plant1Right)
        this.gameContainer.addChild(this.plantContainerRight)

        // plants left
        //plant 5
        this.plant5Left = new Spine(this.textureArray.plant_5.spineData)
        this.plant5Left.scale.set(0.7)
        this.plant5Left.x = this.baseWidth-100
        this.plant5Left.y = this.baseHeight*0.15
        Functions.loadSpineAnimation(this.plant5Left,'animation',true,0.6)
        this.plantContainerLeft.addChild(this.plant5Left)
        //plant 4
        this.plant4Left = new Spine(this.textureArray.plant_4.spineData)
        this.plant4Left.scale.set(0.7)
        this.plant4Left.scale.x = -1
        this.plant4Left.x = 100
        this.plant4Left.y = this.baseHeight*0.2
        Functions.loadSpineAnimation(this.plant4Left,'animation',true,0.6)
        this.plantContainerLeft.addChild(this.plant4Left)
        //plant 3
        this.plant3Left = new Spine(this.textureArray.plant_3.spineData)
        this.plant3Left.scale.set(0.7)
        this.plant3Left.scale.x = -1
        this.plant3Left.x = 100
        this.plant3Left.y = this.baseHeight*0.4
        Functions.loadSpineAnimation(this.plant3Left,'animation',true,0.6)
        this.plantContainerLeft.addChild(this.plant3Left)
        //plant 2
        this.plant2Left = new Spine(this.textureArray.plant_2.spineData)
        this.plant2Left.scale.set(0.7)
        this.plant2Left.scale.x = -1
        this.plant2Left.x = -10
        this.plant2Left.y = this.baseHeight*0.75
        Functions.loadSpineAnimation(this.plant2Left,'animation',true,0.7)
        this.plantContainerLeft.addChild(this.plant2Left)
        //plant 1
        this.plant1Left = new Spine(this.textureArray.plant_1.spineData)
        this.plant1Left.scale.set(0.8)
        this.plant1Left.scale.x = -1
        this.plant1Left.x = 10
        this.plant1Left.y = this.baseHeight*0.9
        Functions.loadSpineAnimation(this.plant1Left,'animation',true,0.7)
        this.plantContainerLeft.addChild(this.plant1Left)
        //plant 1
        this.vines = new Spine(this.textureArray.vines.spineData)
        this.vines.x = this.vines.width*0.6
        this.vines.y = 6
        Functions.loadSpineAnimation(this.vines,'animation',true,0.4)
        this.plantContainerLeft.addChild(this.vines)
        this.gameContainer.addChild(this.plantContainerLeft)
        this.createButterfly()
        
    }
    private createButterfly(){
        //butterfly 1
        const butterfly = new Spine(this.textureArray.butterfly.spineData)
        butterfly.scale.set(0.5)
        butterfly.x = -100
        butterfly.y = this.baseHeight
        let fly = gsap.to(butterfly,{
            x:(this.baseWidth - butterfly.width)*0.99,
            y:this.plant1Right.y * 0.85,
            delay:2,
            duration:3,
            onComplete:()=>{
                let fly2 = gsap.to(butterfly,{
                    x:this.baseWidth + butterfly.width,
                    y:this.plant1Right.y * 0.9,
                    delay:2,
                    duration:3,
                    onComplete:()=>{
                        fly.kill()
                        fly2.kill()
                        this.createButterfly()
                        this.plantContainerRight.removeChild(butterfly)
                    }
                })
            }
        })
        Functions.loadSpineAnimation(butterfly,'animation',true,5)
        butterfly.zIndex = 0
        this.plantContainerRight.addChild(butterfly)
    }
    private createCongrats(){
        this.congrats = new Congrats(this.app,this.textureArray, this.winFreeSpin, this.noOfSpin)
        this.gameContainer.addChild(this.congrats.container)
        this.playSound(7)
        
        this.congrats.container.cursor = 'pointer'
        this.congrats.container.interactive = true
        this.congrats.container.addEventListener('pointerdown',()=>{
            this.playSound(1)
            this.isAutoPlay = false
            this.congrats.container.interactive = false
            this.slotGame.isFreeSpinDone = true
            this.slotGame.freeSpinStart = false
            this.slotGame.isFreeSpin = false
            this.slotGame.maskSprite.height = this.slotGame.frameBg.height - 8
            this.slotGame.maskSprite.y = this.slotGame.frameBg.y - 8
            this.congrats.textAnimation.duration(0.3)
            this.isOpenModal= false
            this.createTransition()
            this.slotGame.startCountWinFreeSpin = false
            let timeout = setTimeout(()=>{
                this.soundStop(6)
                this.playSound(0)
                this.gameContainer.removeChild(this.congrats.container)
                this.enableButtons(true)
                this.lightModeEvent(true)
                let show = setTimeout(() => {
                    this.isFreeSpin = false
                    clearTimeout(show);
                }, 1000);
                this.slotGame.reelContainer.forEach((data,index)=>{
                    this.slotGame.generateNewSymbols(index)      
                })  
                clearTimeout(timeout)
            },this.transitionDelay)
        })
        this.slotGame.autoplayDoneEvent = true
    }
    private createModal(){
        this.modal = new Modal(this.app,this.textureArray)
        this.modal.closeModal.addEventListener('pointerdown',() =>{
            this.playSound(1)
            
            this.controller.settingBtnSpite.interactive = true
            this.controller.autoPlay.interactive = true
        })
        this.modal.closeModal.addListener('mouseover',() =>{
            this.playSound(2)
        })
    }
    private createGame(){
        this.gameBackground = Functions.loadTexture(this.textureArray,'main','bg')
        this.gameBackground.width = this.baseWidth
        this.gameBackground.height = this.baseHeight
        this.gameContainer.addChild(this.gameBackground)
    }
    private createSlot(){
        // create slot
        this.slotGame = new Slot(this.app,this.textureArray,this.onSpinEnd.bind(this),this.matchingGame.bind(this),this.onSpinning.bind(this),this.freeSpinEvent.bind(this),this.checkIfFreeSpin.bind(this),this.createCongrats.bind(this),this.onSpin.bind(this),this.playSound.bind(this),this.soundStop.bind(this))
        this.gameContainer.addChild(this.slotGame.container)
    }
    private createFrameGlow(){
        this.frameGlow = new Spine(this.textureArray.frame_glow.spineData)
        this.frameGlow.width = this.baseWidth
        this.frameGlow.x = ((this.slotGame.frameBorder.x + this.slotGame.frameBorder.width)/2)+40
        this.frameGlow.y = (this.slotGame.frameBorder.y + this.slotGame.frameBorder.height) - 20 
        this.frameGlow.visible = false
        this.gameContainer.addChild(this.frameGlow)
    }
    private createController(){
        this.controller = new Controller(this.app,this.textureArray)
        this.createPaylineAnimation()
        this.gameContainer.addChild(this.controller.container)

        this.controller.soundBtnSprite.texture = this.sounBtnSpriteOff
        this.controller.soundBtnSprite.addListener('mouseover',() =>{
            this.playSound(2)
        })
        this.controller.soundBtnSprite.addEventListener('pointerdown',()=> {
            this.playSound(1)
            
            if(this.controller.soundBtnSprite.texture == this.sounBtnSpriteOn){
                Howler.mute(true)
                this.controller.soundBtnSprite.texture = this.sounBtnSpriteOff
                this.ambientCheck = false
                this.sfxCheck = false
                this.modal.soundBtns.forEach((data,index)=>{
                    data.texture = this.textureToggleOff
                })
            }else{
                this.controller.soundBtnSprite.texture = this.sounBtnSpriteOn 
                Howler.mute(false)
                this.ambientCheck = true
                this.sfxCheck = true
                this.modal.soundBtns.forEach((data,index)=>{
                    data.texture = this.textureToggleOn
                })
            }
            this.checkSoundToggle()
       
        })
    }
    private updateTextValues(){
       this.betTextValue()    
       this.updateCreditValues()
    }
    private betTextValue(){
        //bet value
        this.controller.betText.text = this.betAmount 
        this.controller.betText.x = (this.controller.betContainerSprite.width - this.controller.betText.width)/2 
        //bet value buy bonus
        this.buyBonusText.text = this.betAmount
        this.buyBonusText.x = (this.buyBonusBtn.width - this.buyBonusText.width)/2
        this.buyBonusText.y = (this.buyBonusBtn.height - this.buyBonusText.height) - 20
    }
    private updateCreditValues(){
        //credit value
        this.controller.creditText.text = Functions.numberWithCommas(this.userCredit) 
        this.controller.creditText.x = (this.controller.creditContainerSprite.width - this.controller.creditText.width)/2  
    }
    private onSpinEnd(){
        if(!this.isMatchingGame){
            this.paylineGreetings = 'SPIN TO WIN'
            this.userCredit += this.slotGame.totalWin 
            this.updateCreditValues()
            if(this.slotGame.autoPlayCount == 0 && !this.slotGame.isFreeSpin){
                this.isAutoPlay = false
                 this.controller.spinBtnSprite.texture = this.spinTextureOn
                 this.buyBonusBtn.interactive = true
            }
            this.updatePaylineAnimation(this.paylineGreetings)
        }
        if(this.slotGame.startCountWinFreeSpin){
            this.winFreeSpin += this.slotGame.totalWin
        }   
        if(this.slotGame.isBonusTick){
            this.freeSpinEvent()
            this.slotGame.isBonusTick = false
        }
    }
    private onSpinning(){
        this.paylineGreetings = 'GOOD LUCK'
        this.paylineContainersAnimation.forEach(data=>{
            this.controller.parentSprite.removeChild(data)
        })
        this.updatePaylineAnimation(this.paylineGreetings)
    }
    private onSpin(){
        this.slotGame.totalWin = 0
        this.userCredit-=this.betAmount
        this.updateCreditValues()
    }
    private startSpin(spinType:string){
        this.slotGame.startSpin(spinType)
    }
    private startSpinAutoPlay(spinCount:number){
        this.slotGame.autoPlayCount = spinCount
        this.startSpin(this.spinType)
        this.modal.totalSpin = 0 
    }
    private createBuyBonus(){
        this.buyBonusBtn = Functions.loadTexture(this.textureArray,'bonus','buy_free_spin_btn')
        this.buyBonusBtn.interactive = true
        this.buyBonusBtn.cursor = 'pointer'
        this.buyBonusBtn.y = (this.baseHeight - this.buyBonusBtn.height)/2
        this.buyBonusText = new PIXI.Text(`${this.betAmount}`, this.textStyle)
        this.buyBonusText.x = (this.buyBonusBtn.width - this.buyBonusText.width)/2
        this.buyBonusText.y = (this.buyBonusBtn.height - this.buyBonusText.height) - 20
        this.buyBonusBtn.addChild(this.buyBonusText)
        this.gameContainer.addChild(this.buyBonusBtn)
    }
    private buyBonusPopUp(){
        let glowX = 956
        let glowY = 1044
        let dY = -80

        // buy bonus modal 
        // glow animation
        this.popGlow.x = glowX
        this.popGlow.y = glowY
        this.popGlow.alpha = 0
        this.popGlow.scale.x = 1.1
        this.popGlow.scale.y = 1.3
        Functions.loadSpineAnimation(this.popGlow,'glow',true,0.1)
        this.overlay.addChild(this.popGlow)
        
        this.buyBonusFrame = Functions.loadTexture(this.textureArray,'bonus','get_free_spin')
        this.buyBonusFrame.x = (this.baseWidth - this.buyBonusFrame.width)/2
        this.buyBonusFrame.y = dY
        //amount
        const amount = new PIXI.Text(`${this.betAmount}`, this.textStyle2)
        amount.x = (this.buyBonusFrame.width - amount.width)/2
        amount.y = (this.buyBonusFrame.height - amount.height) * 0.85
        this.buyBonusFrame.addChild(amount)
        //close buy btn
        const close = Functions.loadTexture(this.textureArray,'bonus','ex')
        close.interactive = true
        close.cursor = 'pointer'
        close.x = (close.width)
        close.y = (this.buyBonusFrame.height - close.height)*.94
        this.buyBonusFrame.addChild(close)
        //close buy btn
        const check = Functions.loadTexture(this.textureArray,'bonus','check')
        check.interactive = true
        check.cursor = 'pointer'
        check.x = (this.buyBonusFrame.width - check.width)*.85
        check.y = (this.buyBonusFrame.height - check.height)*.94
        this.buyBonusFrame.addChild(check)
        let sY = -this.buyBonusFrame.height
        close.addListener('mouseover',() =>{
            this.playSound(2)
        })
        close.addEventListener('pointerdown',()=>{
            this.playSound(1)
            
            this.hideBonusPopUp(dY,sY);
            this.isOpenModal = false
        })
        check.addListener('mouseover',() =>{
            this.playSound(2)
        })
        check.addEventListener('pointerdown',()=>{
            this.playSound(1)
            this.slotGame.freeSpinStart = true
            this.slotGame.isFreeSpin = true
            this.hideBonusPopUp(dY,sY)
        check.interactive = false
            let timeOut = setTimeout(()=>{
                this.startSpinAutoPlay(1)
                clearTimeout(timeOut)
            },1000)
            let timeOut1 = setTimeout(()=>{
                check.interactive = true
                clearTimeout(timeOut1)
            },5000)
        })
        let bonusFrameShow = gsap.from(this.buyBonusFrame, {
            delay:.3,
            y:sY,
            onComplete:()=>{
                bonusFrameShow.kill()
                let bounceUp = gsap.to(this.buyBonusFrame,{
                    y:dY-160,
                    onComplete:()=>{
                        bounceUp.kill()
                        let fadeInGlow = gsap.to(this.popGlow,{
                            delay:0,
                            duration:1,
                            alpha:1,
                            onComplete:()=>{
                                fadeInGlow.kill()
                            }
                        }) 
                    }
                })
            }
        })
        this.overlay.addChild(this.buyBonusFrame)
        this.gameContainer.addChild(this.overlay)
    }
    private hideBonusPopUp(dY:number,sY:number){
        this.enableButtons(true)
        let fadeOutGlow = gsap.to(this.popGlow,{
            duration:0.8,
            alpha:0,
            onComplete:()=>{
                fadeOutGlow.kill()
                let bonusFrameHide = gsap.to(this.buyBonusFrame, {
                    delay:0.2,
                    duration:0.2,
                    y:dY*1.2,
                    onComplete:()=>{
                        bonusFrameHide.kill()
                        let bounceDown = gsap.to(this.buyBonusFrame,{
                            duration:0.2,
                            y:sY,
                            onComplete:()=>{
                                bounceDown.kill()
                                this.gameContainer.removeChild(this.overlay)
                            }
                        })
                    }
                })
            }
        }) 
    }
    private hideBonusChoicesPopUp(dY:number,sY:number){
        this.enableButtons(true)
        let fadeOutGlow = gsap.to(this.popGlow,{
            duration:0.8,
            alpha:0,
            onComplete:()=>{
                fadeOutGlow.kill()
                let bonusFrameHide = gsap.to(this.buyBonusFrame, {
                    delay:0.2,
                    duration:0.2,
                    y:dY*1.2,
                    onComplete:()=>{
                        bonusFrameHide.kill()
                        let bounceDown = gsap.to(this.buyBonusFrame,{
                            duration:0.2,
                            y:sY,
                            onComplete:()=>{
                                bounceDown.kill()
                                this.gameContainer.removeChild(this.overlay)
                            }
                        })
                    }
                })
            }
        }) 
    }
    private matchingGame(){
        this.createTransition()
        this.isMatchingGame = true
        let timeOut = setTimeout(()=>{
            this.soundStop(0)
            this.playSound(8)
            let randomizeArray = Functions.arrayRandomizer(json.matchgame_values)
            let arrayBlockValues:Array<any> = []
            let blockSpacing = 1.2
            let multiplier = 0
            let multiplier2 = 0
            let miniCount = 0
            let majorCount = 0
            let grandCount = 0
            let result:any 
            let topText = 'MATCH 3 TO WIN'
            let bottomText = 'PICK STONE TO REVEAL JACKPOTS'
            let popUpSkin = ''
            this.enableButtons(false)
            this.lightMode(false)
            //create blocks
            randomizeArray.forEach((data:string,index:number)=>{
                const symbol = new Spine(this.textureArray.rock_block.spineData)
                symbol.interactive = true
                symbol.cursor = 'pointer'
                let status = 'close'
                if(index > 3 && index < 8){
                    symbol.y = symbol.height*blockSpacing
                    symbol.x = multiplier2*symbol.width*blockSpacing
                    multiplier2++
                }else if( index >= 8 && index <= 11){
                    symbol.y = (symbol.height*2)*blockSpacing
                    symbol.x = multiplier*symbol.width*blockSpacing
                    multiplier++
                }else{
                    symbol.x = index*symbol.width*blockSpacing
                }
                Functions.loadSpineAnimation(symbol,'close',true,0.4)
                symbol.skeleton.setSkinByName(data)
                symbol.addListener('mouseover',() =>{
                    this.playSound(2)
                })
                symbol.addEventListener('pointerdown',()=>{
                    this.playSound(1)
                    
                    symbol.interactive = false
                    status = 'open'
                    arrayBlockValues[index].status = 'open'
                    Functions.loadSpineAnimation(symbol,'reveal',false,0.7)
                    if(data == 'grand'){
                        grandCount++
                        if(grandCount == 3){
                            popUpSkin = 'excellent'
                            this.matchingGameWin = json.jackpots.grand
                            result = symbol
                            this.matchinGameWinPop(arrayBlockValues,popUpSkin,result)
                        }
                    }else if(data == 'major'){
                        majorCount++
                        if(majorCount == 3){
                            popUpSkin = 'impressive'
                            this.matchingGameWin = json.jackpots.major
                            result = symbol
                            this.matchinGameWinPop(arrayBlockValues,popUpSkin,result)
                        }
                    }else{
                        miniCount++
                        if(miniCount == 3){
                            popUpSkin = 'nice'
                            this.matchingGameWin = json.jackpots.mini
                            result = symbol
                            this.matchinGameWinPop(arrayBlockValues,popUpSkin,result)
                        }
                    }
                    this.userCredit+=this.matchingGameWin
                    this.updateCreditValues()
                })
                arrayBlockValues.push({symbol:symbol,status:status})
                this.matchingBlocksContainer.addChild(symbol)
            })
            this.matchingBlocksContainer.x = (this.slotGame.frameBg.width - this.matchingBlocksContainer.width)
            this.matchingBlocksContainer.y = (this.slotGame.frameBg.height - this.matchingBlocksContainer.height)*1.7
            this.slotGame.frameBg.addChild(this.matchingBlocksContainer)
            // update text 
            this.textStyle.fontSize = 46
            this.textStyle3.fontSize = 30 
            this.updatePaylineTopText(topText)
            this.updatePaylineBottomText(bottomText)
            clearTimeout(timeOut)
        },this.transitionDelay)
    }
    private matchinGameWinPop(arrayBlockValues:Array<any>,popUpSkin:string,result:any){
        let timeOut = 2500
        arrayBlockValues.forEach(data=>{
            data.symbol.interactive = false
            if(data.status == 'close')
                Functions.loadSpineAnimation(data.symbol,'reveal',false,0.7)
        })
        let popDelay = setTimeout(()=>{
            this.createPopUps(popUpSkin)
            this.popUps.container.addEventListener('pointerdown',()=>{
                this.playSound(1)
                
                this.popUps.container.interactive = false
                this.matchGameResult(result)
            })
            clearTimeout(popDelay)
        },timeOut)
    }
    private matchGameResult(result:any){
        let frame = this.slotGame.frameBg
        let frameBgTexture = Functions.loadTexture(this.textureArray,'bonus','matchin_game_win_board').texture
        let win = new PIXI.Text(`${Functions.numberWithCommas(this.matchingGameWin)}`, this.whiteYellow)
        let clickContinueText = new PIXI.Text(`click here to continue`, this.textStyle3)
        frame.texture = frameBgTexture
        result.x = (frame.width)/2
        result.y = frame.height - 200
        win.x = (frame.width - win.width)/2
        win.y = ((frame.height - win.height)/2)*0.85

        const textScaleAnim = gsap.timeline({ 
            repeat: -1,
            onUpdate:()=>{
                clickContinueText.x = (frame.width - clickContinueText.width)/2
                clickContinueText.y = (frame.height - clickContinueText.height)*0.96
            }
        });

        textScaleAnim.to(clickContinueText.scale, 
            { duration: 0.5,x: 1.2, y: 1.2 }
        )
        .to(clickContinueText.scale, { duration: 0.5, x: 1, y: 1 });
        // Start the animation
        textScaleAnim.play();

        clickContinueText.x = (frame.width - clickContinueText.width)/2
        clickContinueText.y = (frame.height - clickContinueText.height)*0.96
        this.popUps.closePopUp()
        frame.addChild(result)
        frame.addChild(win)
        frame.addChild(clickContinueText)
        frame.removeChild(this.matchingBlocksContainer)
        clickContinueText.interactive= true
        clickContinueText.cursor = 'pointer'
        clickContinueText.addEventListener('pointerdown',()=>{
            this.playSound(1)
            
            textScaleAnim.kill()
            this.endMatchingGame()
            clickContinueText.interactive = false
            clickContinueText.interactive = false
            let timeOut = setTimeout(()=>{
                frame.removeChild(result)
                frame.removeChild(win)
                frame.removeChild(clickContinueText)
                clearTimeout(timeOut)
            },this.transitionDelay)
        })
    }
    private endMatchingGame(){
        this.createTransition()
        this.isMatchingGame = false
        let timeOut = setTimeout(()=>{
            this.gameContainer.interactive= false
            this.gameContainer.cursor = ''
            this.lightMode(true)
            this.enableButtons(true)
            this.slotGame.levelBarIndicator.width = 0
            this.slotGame.frameBg.removeChild(this.matchingBlocksContainer)
            this.updatePaylineTopText('SPIN TO WIN')
            this.updatePaylineBottomText('Tap space or enter to skip')
            if(this.slotGame.freeSpinStart){
                this.freeSpinEvent()
            }
            clearTimeout(timeOut)
        },this.transitionDelay)
        this.slotGame.isMatchingGame = false

    }
    private createPaylineAnimation(){
        let greetY = 30
        this.paylineText =  new PIXI.Text('SPIN TO WIN', this.textStyle)
        this.paylineTextBottom = new PIXI.Text('Tap space or enter to skip', this.textStyle3)
        this.paylineText.x = (this.controller.parentSprite.width - this.paylineText.width)/2
        this.paylineText.y = greetY
        this.paylineTextBottom.x = (this.controller.parentSprite.width - this.paylineTextBottom.width)/2
        this.paylineTextBottom.y = (this.controller.parentSprite.height - this.paylineTextBottom.height)-10
        this.controller.parentSprite.addChild(this.paylineText,this.paylineTextBottom)
    }
    private updatePaylineAnimation(greetings:string){
        this.paylineContainersAnimation = []
        this.paylineAnimations.forEach(data=>{data.kill()})
        let paylineContent:any = this.slotGame.paylines
        let parentContainer = this.controller.parentSprite
        this.paylineText.text = greetings
        let paylineTotal = 0
        let bottomText = this.isAutoPlay?`Free spins left ${this.slotGame.autoPlayCount}`:'Tap space or enter to skip'
        this.updatePaylineBottomText(bottomText)       
        if(this.slotGame.paylines.length !== 0){
            for(let i=0;i<paylineContent.length;i++){
                bottomText = ''
                this.updatePaylineBottomText(bottomText)
                let payline = paylineContent[i].payline
                let payout = Functions.numberWithCommas(paylineContent[i].payout)
                const container = new PIXI.Container
                const containerWithText = new PIXI.Container
                const greetingText = new PIXI.Text(`line ${payline} pays ${payout}`, this.descText)
                paylineContent[i].symbols.forEach((data:any,index:number)=>{
                    let symbols = Functions.loadTexture(this.textureArray,'slot',`${json.symbolAssets[data-1].symbol}`)
                    symbols.x = index*65
                    container.addChild(symbols)
                    paylineTotal+=json.symbolAssets[data-1].pay
                })
                container.x = greetingText.width
                containerWithText.addChild(container,greetingText)
                containerWithText.alpha = 0
                greetingText.y = (containerWithText.height - greetingText.height)/2
                this.paylineContainersAnimation.push(containerWithText)
                this.animatePaySymbols(containerWithText,i)
                parentContainer.addChild(containerWithText)
            }
            this.updatePaylineTopText(`WIN ${Functions.numberWithCommas(paylineTotal)}`)
        }
        this.paylineText.x = (this.controller.parentSprite.width - this.paylineText.width)/2
        this.updatePaylineBottomText(bottomText)
    }
    private updatePaylineTopText(text:string){
        let greetY = 30
        this.paylineText.text = text
        this.paylineText.x = (this.controller.parentSprite.width - this.paylineText.width)/2
        this.paylineText.y = greetY
    }
    private updatePaylineBottomText(text:string){
        this.paylineTextBottom.text = text
        this.paylineTextBottom.x = (this.controller.parentSprite.width - this.paylineTextBottom.width)/2
        this.paylineTextBottom.y = (this.controller.parentSprite.height - this.paylineTextBottom.height)-10
    }
    private animatePaySymbols(containerWithText:any,i:number){
        let lastIndex = i+1
        let parentContainer = this.controller.parentSprite
        let fadeIn = gsap.to(containerWithText,{
            delay:i*2,
            duration:1,
            alpha:1,
            onStart:()=>{
                containerWithText.x = (parentContainer.width - containerWithText.width)/2
                containerWithText.y = (parentContainer.height - containerWithText.height)-10
            },
            onComplete:()=>{
                containerWithText.alpha = 0
                fadeIn.kill()
                let timeOut = setTimeout(()=>{
                    if(lastIndex == this.slotGame.paylines.length){
                        this.paylineContainersAnimation.forEach((data,index)=>{
                            this.animatePaySymbols(data,index)
                        })
                    }
                    clearTimeout(timeOut)
                },3000)
            }
        })
        this.paylineAnimations.push(fadeIn)
    }
    private lightMode(bool:boolean){
        let frameBgTexture = Functions.loadTexture(this.textureArray,'main',bool?'slot_frame_bg':'slot_frame_bg2').texture
        let parentSpriteTexture = Functions.loadTexture(this.textureArray,'controller',bool?'controller_parent':'controller_parent2').texture
        let infoBtnTexture = Functions.loadTexture(this.textureArray,'controller',bool?'info_button':'info_button2').texture
        let settingBtnTexture = Functions.loadTexture(this.textureArray,'controller',bool?'system_settings':'system_settings2').texture
        let spinBtnTexture = Functions.loadTexture(this.textureArray,'controller',bool?'spin_button':'spin_button2').texture
        let autoPlayTexture = Functions.loadTexture(this.textureArray,'controller',bool?'autoplay_button':'autoplay_button2').texture
        let gameBackgroundTexture = Functions.loadTexture(this.textureArray,'main',bool?'bg':'bg2').texture
        //change visibilities of normal game
        this.slotGame.reelContainer.forEach(data=>{data.visible = bool})
        this.paylineContainersAnimation.forEach(data=>{data.visible = bool})
        this.slotGame.frameBg.texture = frameBgTexture
        this.controller.parentSprite.texture = parentSpriteTexture
        this.controller.infoBtnSprite.texture = infoBtnTexture
        this.controller.settingBtnSpite.texture = settingBtnTexture
        this.controller.spinBtnSprite.texture = spinBtnTexture
        this.controller.autoPlay.texture = autoPlayTexture
        this.gameBackground.texture = gameBackgroundTexture
        this.buyBonusBtn.visible = bool
        this.slotGame.levelBarContainer.x = bool?0:-this.slotGame.levelBarContainer.width * 0.5
        //frame glow add
        this.frameGlow.visible = bool?false:true
        if(!bool){
            Functions.loadSpineAnimation(this.frameGlow,'animation',true,0.15)
            this.createFireflies()
        }else{
            this.firefliesArray.forEach(data=>this.gameContainer.removeChild(data))
        }
    }
    private lightModeEvent(bool:boolean){
        let frameBgTexture = Functions.loadTexture(this.textureArray,'main',bool?'slot_frame_bg':'slot_frame_bg2').texture
        let parentSpriteTexture = Functions.loadTexture(this.textureArray,'controller',bool?'controller_parent':'controller_parent2').texture
        let infoBtnTexture = Functions.loadTexture(this.textureArray,'controller',bool?'info_button':'info_button2').texture
        let settingBtnTexture = Functions.loadTexture(this.textureArray,'controller',bool?'system_settings':'system_settings2').texture
        let spinBtnTexture = Functions.loadTexture(this.textureArray,'controller',bool?'spin_button':'spin_button2').texture
        let autoPlayTexture = Functions.loadTexture(this.textureArray,'controller',bool?'autoplay_button':'autoplay_button2').texture
        let gameBackgroundTexture = Functions.loadTexture(this.textureArray,'main',bool?'bg':'bg2').texture
        //change visibilities of normal game
       // this.slotGame.frameBg.texture = frameBgTexture
        this.controller.parentSprite.texture = parentSpriteTexture
        this.controller.infoBtnSprite.texture = infoBtnTexture
        this.controller.settingBtnSpite.texture = settingBtnTexture
        this.controller.spinBtnSprite.texture = spinBtnTexture
        this.controller.autoPlay.texture = autoPlayTexture
        this.gameBackground.texture = gameBackgroundTexture
        this.buyBonusBtn.visible = bool
        this.slotGame.levelBarContainer.x = bool?0:-this.slotGame.levelBarContainer.width * 0.5
        //frame glow add
        this.frameGlow.visible = bool?false:true
        if(!bool){
            Functions.loadSpineAnimation(this.frameGlow,'animation',true,0.15)
            this.createFireflies()
        }else{
            this.firefliesArray.forEach(data=>this.gameContainer.removeChild(data))
        }
    }
    private createFireflies(){
        //left fireflies
        for(let i =0;i<= 10;i++){
            const firefly = new Spine(this.textureArray.firefly.spineData)
            firefly.x = Functions.getRandomInt(-10, this.slotGame.frameBorder.x)
            firefly.y = Functions.getRandomInt(0, this.baseHeight - this.controller.parentSprite.height)
            firefly.scale.set(Functions.getRandomInt(0.1,1))
            firefly.alpha = 0
            Functions.loadSpineAnimation(firefly,'animation',true,0.5)
            let alph = gsap.to(firefly,{
                delay:Functions.getRandomInt(1,5),
                duration:Functions.getRandomInt(1,3),
                alpha:1,
                repeat:-1
            })
            var tl = gsap.timeline ()
            .to(firefly,{
                x: Functions.getRandomInt(0, this.slotGame.frameBorder.x), 
                y: Functions.getRandomInt(this.baseHeight, 0),
                delay:Functions.getRandomInt(1,5),
                duration:Functions.getRandomInt(10,20),
                ease:"none",
                repeat:-1,
            })
            this.firefliesArray.push(firefly)
            this.gameContainer.addChild(firefly)
        }
        //right fireflies
        for(let i =0;i<= 10;i++){
            const firefly = new Spine(this.textureArray.firefly.spineData)
            firefly.x = Functions.getRandomInt(this.slotGame.frameBorder.x+this.slotGame.frameBorder.width, this.baseWidth)
            firefly.y = Functions.getRandomInt(0, this.baseHeight - this.controller.parentSprite.height)
            firefly.scale.set(Functions.getRandomInt(0.1,1))
            firefly.alpha = 0
            Functions.loadSpineAnimation(firefly,'animation',true,0.5)
            let alph = gsap.to(firefly,{
                delay:Functions.getRandomInt(1,5),
                duration:Functions.getRandomInt(1,3),
                alpha:1,
                repeat:-1
            })
            var tl = gsap.timeline ()
                .to(firefly,{
                    x: Functions.getRandomInt(this.slotGame.frameBorder.x+this.slotGame.frameBorder.width, this.baseWidth), 
                    y: Functions.getRandomInt(this.baseHeight, 0),
                    delay:Functions.getRandomInt(1,5),
                    duration:Functions.getRandomInt(10,20),
                    ease:"none",
                    repeat:-1,
                })
            this.firefliesArray.push(firefly)
            this.gameContainer.addChild(firefly)
        }
    }
    private enableButtons(bool:boolean){
        let cursor = bool?'pointer':''
        this.controller.spinBtnSprite.interactive = bool
        this.controller.spinBtnSprite.cursor = cursor
        this.controller.autoPlay.interactive = bool
        this.controller.autoPlay.cursor = cursor
        this.controller.settingBtnSpite.interactive = bool
        this.controller.settingBtnSpite.cursor = cursor
        this.controller.infoBtnSprite.interactive = bool
        this.controller.infoBtnSprite.cursor = cursor
        this.buyBonusBtn.interactive = bool
        this.buyBonusBtn.cursor = cursor
    }
    private events(){
        // open info modal
        this.controller.infoBtnSprite.addEventListener('pointerdown',()=>{
            this.modal.createInfoModal()
        })
        //open system settings modal
        this.controller.settingBtnSpite.addListener('mouseover',() =>{
            this.playSound(2)
        })
        this.controller.settingBtnSpite.addEventListener('pointerdown',()=>{
            this.playSound(1)
            
            this.controller.settingBtnSpite.interactive = false
            // call settings modal
            this.modal.createSystemSettings(this.isAutoPlay)
            // spin type toggle
            this.modal.betBtns.forEach((data,index)=>{
                data.addEventListener('pointerdown',()=>{
                    this.playSound(1)
                    data.addListener('mouseover',() =>{
                        this.playSound(2)
                    })
                    
                    if(index == 0){
                        this.betIndex--
                        this.betAmount = json.bet_amounts[this.betIndex]
                        if(this.betIndex == 0){
                            this.modal.betBtns[0].interactive = false
                        }else{
                            this.modal.betBtns[0].interactive = true
                            this.modal.betBtns[1].interactive = true
                        }
                    }else{
                        this.betIndex++
                        this.betAmount = json.bet_amounts[this.betIndex]
                        if(this.betIndex == 5){
                            this.modal.betBtns[1].interactive = false
                        }else{
                            this.modal.betBtns[0].interactive = true
                            this.modal.betBtns[1].interactive = true
                        }
                    }
                    this.modal.betAmountText.text = this.betAmount
                    this.modal.betAmountText.x = (this.modal.betAmountSpite.width - this.modal.betAmountText.width)/2
                    this.betTextValue()
                })
            })
            // disable click for adjusting bet buttons
            if(this.betIndex == 0){
                this.modal.betBtns[0].interactive = false
            }
            if(this.betIndex == 5){
                this.modal.betBtns[1].interactive = false
            }
            //sound events
            if(this.ambientCheck){
                this.modal.soundBtns[0].texture = this.textureToggleOn
            }else{
                this.modal.soundBtns[0].texture = this.textureToggleOff
            }
            if(this.sfxCheck){
                this.modal.soundBtns[1].texture = this.textureToggleOn
            }else{
                this.modal.soundBtns[1].texture = this.textureToggleOff
            }

            this.modal.soundBtns.forEach((data,index)=>{
                data.addListener('mouseover',() =>{
                    this.playSound(2)
                })
                data.addEventListener('pointerdown',()=>{
                    this.playSound(1)
                    if(data.texture == this.textureToggleOff){
                        Howler.mute(false)
                        this.controller.soundBtnSprite.texture = this.sounBtnSpriteOn
                        data.texture = this.textureToggleOn
                        if(index == 0){
                           this.ambientCheck = true
                        }else{
                           this.sfxCheck = true
                        }
                    }else{
                        data.texture = this.textureToggleOff
                        this.controller.soundBtnSprite.texture = this.sounBtnSpriteOff
                        if(index == 0){
                            this.ambientCheck = false 
                        }else{
                            this.sfxCheck = false
                        }  
                    }
                    this.checkSoundToggle()
                })
            })
            // re position bet amount tex on click
            this.modal.betAmountText.text = this.betAmount
            this.modal.betAmountText.x = (this.modal.betAmountSpite.width - this.modal.betAmountText.width)/2
        })
        //open autoplay
        this.controller.autoPlay.addListener('mouseover',() =>{
            this.playSound(2)
        })
        this.controller.autoPlay.addEventListener('pointerdown',()=>{
            this.playSound(1)
            
            if(this.isAutoPlay){
                this.controller.spinBtnSprite.interactive = true 
                this.controller.spinBtnSprite.cursor = 'pointer' 
                this.isAutoPlay = false
                this.controller.spinBtnSprite.texture = this.spinTextureOn 
                this.slotGame.autoPlayCount = 0
                this.buyBonusBtn.interactive = true
                
            }else{
                this.controller.autoPlay.interactive = false
                this.modal.btnArray = []
                this.modal.createAutoPlaySettings()
                this.controller.spinBtnSprite.texture = this.spinTextureOn
                this.controller.spinBtnSprite.interactive = true
                // initialize active spintype button
                if(this.spinType == 'quick'){
                    this.modal.btnArray[0].texture = this.textureToggleOn
                }else if(this.spinType == 'turbo'){
                    this.modal.btnArray[1].texture = this.textureToggleOn
                }else{
                    this.modal.btnArray[0].texture = this.textureToggleOff
                    this.modal.btnArray[1].texture = this.textureToggleOff
                }
                //toggle spin type
                this.modal.btnArray.forEach((data,index)=>{
                   data.addListener('mouseover',() =>{
                        this.playSound(2)
                    })
                    data.addEventListener('pointerdown',()=>{
                        this.playSound(1)
                        
                        if(index == 0){
                            this.modal.btnArray[1].texture = this.textureToggleOff
                            if(data.texture == this.textureToggleOff){
                                data.texture = this.textureToggleOn
                                this.spinType = 'quick'
                            }else{
                                this.spinType = 'normal'
                                data.texture = this.textureToggleOff
                            }
                        }else{
                            this.modal.btnArray[0].texture = this.textureToggleOff
                            if(data.texture == this.textureToggleOff){
                                this.spinType = 'turbo'
                                data.texture = this.textureToggleOn
                            }else{
                                this.spinType = 'normal'
                                data.texture = this.textureToggleOff
                            }
                        }
                    })
                })
                //start slot auto spin
                this.modal.rollBtn.addListener('mouseover',() =>{
                    this.playSound(2)
                })
                this.modal.rollBtn.addEventListener('pointerdown',()=>{
                    this.playSound(1)
                    
                    this.buyBonusBtn.interactive = false
                    this.controller.autoPlay.interactive = true
                    this.controller.spinBtnSprite.texture = this.spinTextureOff
                   // this.controller.spinBtnSprite.interactive = false
                    this.isAutoPlay = true
                    this.modal.rollBtn.texture = this.textureRollOn
                    if(!this.slotGame.isSpinning){
                        // this.startSpinAutoPlay(this.modal.totalSpin)
                        if(this.modal.totalSpin >= 1){
                             this.startSpinAutoPlay(this.modal.totalSpin)
                        }else{
                         alert("Please choose a spin count!");
                        }
                     }  
                })
                // set background on hover
                this.modal.rollBtn.addEventListener('mouseenter',()=>{
                    this.modal.rollBtn.texture = this.textureRollOn
                })
                this.modal.rollBtn.addEventListener('mouseleave',()=>{
                    this.modal.rollBtn.texture = this.textureRollOff
                })
            }       
        })
        //single spin trigger
        this.controller.spinBtnSprite.addListener('mouseover',() =>{
            this.playSound(2)
        })
        this.controller.spinBtnSprite.addEventListener('pointerdown',()=>{
            this.playSound(1)
            
            this.controller.spinBtnSprite.interactive = true
            if(!this.slotGame.isSpinning && !this.isFreeSpin && !this.isAutoPlay && !this.isMatchingGame ){
                this.controller.spinBtnSprite.texture = this.spinTextureOff
                this.startSpinAutoPlay(1)
            }else{
                this.slotGame.timeScale = 10
            }
        })
        //buy bonus
        this.buyBonusBtn.addListener('mouseover',() =>{
            this.playSound(2)
        })
        this.buyBonusBtn.addEventListener('pointerdown',()=>{
            this.playSound(1)
            
            this.buyBonusPopUp()
            this.enableButtons(false)
            this.isOpenModal = true
        })
    }
    private freeSpinEvent(){
        this.slotGame.autoPlayCount = 0
        this.isOpenModal= true

        let glowX = 570
        let glowX2 = 1370
        let glowY = 1044
        let dY = -80

        // glow animation
        this.popGlow2.x = glowX2
        this.popGlow2.y = glowY
        this.popGlow2.alpha = 0
        this.popGlow2.scale.x = 1.1
        this.popGlow2.scale.y = 1.3
        this.overlay.addChild(this.popGlow2)
        Functions.loadSpineAnimation(this.popGlow2,'glow',true,0.1)
        this.overlay.addChild(this.popGlow)
        Functions.loadSpineAnimation(this.popGlow,'glow',true,0.1)
        this.popGlow.x = glowX
        this.popGlow.y = glowY
        this.popGlow.alpha = 0
        this.popGlow.scale.x = 1.1
        this.popGlow.scale.y = 1.3
        
        const wildSlot = Functions.loadTexture(this.textureArray,'bonus','multiplier_wilds')
        wildSlot.x = (this.baseWidth - wildSlot.width)/2 - 400
        wildSlot.y = -200
        let sY = -wildSlot.height
        let wildSlotFrameShow = gsap.from(wildSlot, {
            delay:.3,
            y:sY,
            onComplete:()=>{
                wildSlotFrameShow.kill()
                let bounceUp = gsap.to(wildSlot,{
                    y:dY-160,
                    onComplete:()=>{
                        bounceUp.kill()
                        let fadeInGlow = gsap.to(this.popGlow,{
                            delay:0,
                            duration:1,
                            alpha:1,
                            onComplete:()=>{
                                fadeInGlow.kill()
                            }
                        }) 
                    }
                })
            }
        })
        this.gameContainer.addChild(this.overlay)

        //amount
        const amount = new PIXI.Text(`6`, this.textStyle2)
        amount.x = (wildSlot.width - amount.width)/2
        amount.y = (wildSlot.height - amount.height) * 0.85
        wildSlot.addChild(amount)
        wildSlot.cursor = 'pointer'
        wildSlot.interactive = true
        this.gameContainer.addChild(wildSlot)

        const moneySlot = Functions.loadTexture(this.textureArray,'bonus','money_wilds')
        moneySlot.x = (this.baseWidth - moneySlot.width)/2 + 400
        moneySlot.y = -200
        let moneySlotFrameShow = gsap.from(moneySlot, {
            delay:.3,
            y:sY,
            onComplete:()=>{
                moneySlotFrameShow.kill()
                let bounceUp = gsap.to(moneySlot,{
                    y:dY-160,
                    onComplete:()=>{
                        bounceUp.kill()
                        let fadeInGlow = gsap.to(this.popGlow2,{
                            delay:0,
                            duration:1,
                            alpha:1,
                            onComplete:()=>{
                                fadeInGlow.kill()
                            }
                        }) 
                    }
                })
            }
        })

        //amount
        const amount2 = new PIXI.Text(`12`, this.textStyle2)
        amount2.x = (moneySlot.width - amount2.width)/2
        amount2.y = (moneySlot.height - amount2.height) * 0.85
        moneySlot.addChild(amount2)
        moneySlot.cursor = 'pointer'
        moneySlot.interactive = true
        this.gameContainer.addChild(moneySlot)


        wildSlot.addListener('mouseover',() =>{
            this.playSound(2)
        })
        wildSlot.addEventListener('pointerdown', () =>{
            this.slotGame.whatEvent = 1
            this.playSound(1)
            
            this.overlay.removeChild(this.popGlow2)
            this.gameContainer.removeChild(this.overlay)
            this.noOfSpin=6
            this.slotGame.startCountWinFreeSpin = true
            this.slotGame.autoplayDoneEvent = false
            this.gameContainer.removeChild(wildSlot)
            this.gameContainer.removeChild(moneySlot)
            this.createTransition()
            let timeout = setTimeout(()=>{
                this.startfreeSpinEvent(this.noOfSpin)
                clearTimeout(timeout)
            },this.transitionDelay)
        })

        
        moneySlot.addListener('mouseover',() =>{
            this.playSound(2)
        })
        moneySlot.addEventListener('pointerdown', () =>{
            this.playSound(1)
            this.slotGame.whatEvent = 2
            this.overlay.removeChild(this.popGlow2)
            this.gameContainer.removeChild(this.overlay)
            this.noOfSpin=12
            this.slotGame.startCountWinFreeSpin = true
            this.slotGame.autoplayDoneEvent = false
            this.gameContainer.removeChild(wildSlot)
            this.gameContainer.removeChild(moneySlot)
            this.createTransition()
            let timeout = setTimeout(()=>{
                this.startfreeSpinEvent(this.noOfSpin)
                clearTimeout(timeout)
            },this.transitionDelay)
        })
    }
    private startfreeSpinEvent(count:number){
        this.soundStop(0)
        this.playSound(6)
        this.enableButtons(false)
        this.lightModeEvent(false)
        this.slotGame.freeSpinStart = false
        this.slotGame.isFreeSpin = true
        this.slotGame.isFreeSpinDone = false
        let show = setTimeout(() => {
            this.isFreeSpin = false
            clearTimeout(show);
        }, 100);
        this.slotGame.reelContainer.forEach((data,index)=>{
            this.slotGame.generateNewSymbolsMainEvent(index)      
        })  
        let show2 = setTimeout(() => {
            this.slotGame.autoPlayCount = count
            this.startSpinAutoPlay(count)
            clearTimeout(show2);
        }, 1000);
    }
    private checkIfFreeSpin(bool:boolean){
        this.enableButtons(false)
        this.isFreeSpin = true
    }
    private createPopUps(skin:string){
        this.popUps = new PopUps(this.app,this.gameContainer,this.textureArray,skin,this.matchingGameWin)
        this.gameContainer.addChild(this.popUps.container)
    }
    private createTransition(){
        this.transition = new Transition(this.app,this.gameContainer,this.textureArray)
        this.gameContainer.addChild(this.transition.container)
    }

    // sounds methods
    private sounds(soundInit:Boolean,soundArray:Array<any>){
        this.sound = soundArray;
        this.globalSound = soundInit;

        // prevent background music from stacking when click multiple times
        // if(!this.sound[1].playing() || !this.sound[21].playing(21)){
        //     //this.playSound(1);
        // }
    }

    private playSound(index:number){
        this.sound[index].play();
        this.soundVolume(index)
    }

    private soundStop(index:number){
        this.sound[index].stop()
    }

    private soundVolume(index:number){
        if(index == 1 || index == 2  || index == 3  || index == 4  || index == 5) // sound plinko ball collide
            this.sound[index].volume(0.2)
    }

    private checkSoundToggle(){
        if(this.ambientCheck){
            this.sound[0].mute(false)
        }
        else{
            this.sound[0].mute(true)
        }
        if(this.sfxCheck){
            this.sound[1].mute(false)
            this.sound[2].mute(false)
            this.sound[3].mute(false)
            this.sound[4].mute(false)
            this.sound[5].mute(false)
        }else{
            this.sound[1].mute(true)
            this.sound[2].mute(true)
            this.sound[3].mute(true)
            this.sound[4].mute(true)
            this.sound[5].mute(true)
        }
    }
    
}