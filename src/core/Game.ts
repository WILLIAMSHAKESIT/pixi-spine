import 'pixi-spine' 
import * as PIXI from 'pixi.js';
import Loader from "./components/Loader";
import Slot from './components/Slot';
import Controller from './components/Controller';
import Modal from './components/Modal';
import Functions from './settings/Functions';
import json from './settings/settings.json'
import {Spine} from 'pixi-spine';
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
// give the plugin a reference to the PIXI object
PixiPlugin.registerPIXI(PIXI);
export default class Game{
    private app:PIXI.Application
    private textureArray:any
    private gameContainer:PIXI.Container;
    private gameBackground:PIXI.Sprite
    private matchingBlocksContainer:PIXI.Container
    private baseWidth:number;
    private baseHeight:number;
    private slotGame:Slot;
    private controller:Controller   
    private modal:Modal
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
    // values
    private betAmount:number = 1
    private betIndex:number = 0
    private userCredit:number = 999
    private isAutoPlay:boolean = false
    private isMatchingGame:boolean = false
    private paylineAnimCount:number = 0
    //text style 
    private textStyle:PIXI.TextStyle
    private textStyle2:PIXI.TextStyle
    private descText:PIXI.TextStyle
    //text values
    private buyBonusText:PIXI.Text
    private paylineText:PIXI.Text
    private paylineGreetings:string
    //arrays 
    private paylineContainers:Array<any> = []
    private paylineContainersAnimation:Array<any> = []

    //grass
    private slideshowTicker: Boolean = true;
    private play: Boolean = true;
    private grass: Array<any> = [];
    private grassSprites: Array<PIXI.Sprite> = [];
    private protection: number = 0;
    constructor(){
        this.textStyle = new PIXI.TextStyle({  
            fontFamily: 'Eras ITC',
            fontSize: 55,
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
        this.textStyle2 = new PIXI.TextStyle({  
            fontFamily: 'Eras ITC',
            fontSize: 100,
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
        this.createBuyBonus()
        this.createModal()
        this.events()
        this.updateTextValues()
        this.app.stage.addChild(this.gameContainer);

        window.document.addEventListener('keydown', (e)=> {
            if(e.code === 'Space'  || e.key === 'Enter'){
                if(!this.slotGame.isSpinning && !this.isAutoPlay && !this.isMatchingGame){
                    this.slotGame.timeScale = 0 
                    if(this.slotGame.notLongPress === true) {
                        this.slotGame.notLongPress = false;
                        this.slotGame.startSpin(this.spinType)
                    }else{
                        this.slotGame.startSpin('turbo')  
                    }
                }else{ 
                    this.slotGame.timeScale = 10
                }
            }
        });
        
        window.document.addEventListener('keyup', ()=> {
            this.slotGame.notLongPress = true;
        });
        // this.createGrass();
        // this.animateGrass();

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
        this.slotGame = new Slot(this.app,this.textureArray,this.updateCreditValues.bind(this),this.onSpinEnd.bind(this),this.matchingGame.bind(this),this.onSpin.bind(this))
        this.gameContainer.addChild(this.slotGame.container)
    }
    private createController(){
        this.controller = new Controller(this.app,this.textureArray)
        this.createPaylineAnimation()
        this.gameContainer.addChild(this.controller.container)
    }
    private startSpin(spinCount:number){
        this.slotGame.autoPlayCount = spinCount
        this.slotGame.startSpin(this.spinType)
        this.modal.totalSpin = 0 
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
            this.userCredit = (this.userCredit-this.betAmount)+this.slotGame.totalWin
            this.updateCreditValues()
            if(this.slotGame.autoPlayCount <= 1){
                this.isAutoPlay = false
                this.controller.spinBtnSprite.texture = this.spinTextureOn
                this.controller.spinBtnSprite.interactive = true
            }
            this.updatePaylineAnimation(this.paylineGreetings)
        }
    }
    private onSpin(){
        this.paylineGreetings = 'GOOD LUCK'
        this.paylineContainers.forEach(data=>{
            this.controller.parentSprite.removeChild(data)
        })
        this.updatePaylineAnimation(this.paylineGreetings)
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
        let dY = -80
        // buy bonus modal 
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
        close.addEventListener('pointerdown',()=>{
            this.hideBonusPopUp(dY,sY)
            let setBooleanBoard = setTimeout(()=>{
                this.buyBonusBtn.interactive = true
                clearTimeout(setBooleanBoard);
            },1000);
        })
        check.addEventListener('pointerdown',()=>{
            this.hideBonusPopUp(dY,sY)
            let setBooleanBoard = setTimeout(()=>{
                this.buyBonusBtn.interactive = true
                clearTimeout(setBooleanBoard);
            },1000);
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
                    }
                })
            }
        })
        this.gameContainer.addChild(this.buyBonusFrame)
    }
    private hideBonusPopUp(dY:number,sY:number){
        let bonusFrameHide = gsap.to(this.buyBonusFrame, {
            delay:0,
            duration:0.5,
            y:dY*1.2,
            onComplete:()=>{
                bonusFrameHide.kill()
                let bounceDown = gsap.to(this.buyBonusFrame,{
                    delay:0,
                    duration:0.5,
                    y:sY,
                    onComplete:()=>{
                        bounceDown.kill()
                        this.gameContainer.removeChild(this.buyBonusFrame)
                    }
                })
            }
        })
    }
    private matchingGame(){
        this.isMatchingGame = true
        this.matchingBlocksContainer = new PIXI.Container()
        let randomizeArray = Functions.arrayRandomizer(json.matchgame_values)
        let arrayBlockValues:Array<any> = []
        let blockSpacing = 1.2
        let multiplier = 0
        let multiplier2 = 0
        let blockOffsetX = 25
        let miniCount = 0
        let majorCount = 0
        let grandCount = 0

        this.enableButtons(false)
        this.lightMode(false)
        //create blocks

        randomizeArray.forEach((data:string,index:number)=>{
            const symbol = Functions.loadTexture(this.textureArray,'bonus',`${data}`)
            const rock = Functions.loadTexture(this.textureArray,'bonus',`rock_block`)
            symbol.visible = false
            rock.interactive = true
            rock.cursor = 'pointer'
            symbol.scale.set(0.9)
            if(index > 3 && index < 8){
                rock.y = rock.height*blockSpacing
                rock.x = multiplier2*rock.width*blockSpacing
                symbol.x = rock.x + blockOffsetX
                symbol.y = rock.y
                multiplier2++
            }else if( index >= 8 && index <= 11){
                rock.y = (rock.height*2)*blockSpacing
                rock.x = multiplier*rock.width*blockSpacing
                symbol.x = rock.x + blockOffsetX
                symbol.y = rock.y
                multiplier++
            }else{
                rock.x = index*rock.width*blockSpacing
                symbol.x = rock.x + blockOffsetX
            }
            //click rock event
            rock.addEventListener('pointerdown',()=>{
                rock.interactive = false
                rock.visible = false
                symbol.visible = true
                if(data == 'grand'){
                    grandCount++
                    if(grandCount == 3){
                        this.matchinGameWinPop(arrayBlockValues)
                    }
                }else if(data == 'major'){
                    majorCount++
                    if(majorCount == 3){
                        this.matchinGameWinPop(arrayBlockValues)
                    }
                }else{
                    miniCount++
                    if(miniCount == 3){
                        this.matchinGameWinPop(arrayBlockValues)
                    }
                }
            })
            arrayBlockValues.push({rock:rock,symbol:symbol})
            this.matchingBlocksContainer.addChild(symbol)
            this.matchingBlocksContainer.addChild(rock)
        })
        this.matchingBlocksContainer.x = (this.slotGame.frameBg.width-this.matchingBlocksContainer.width)/2
        this.matchingBlocksContainer.y = (this.slotGame.frameBg.height-this.matchingBlocksContainer.height)/2
        this.slotGame.frameBg.addChild(this.matchingBlocksContainer)
    }
    private matchinGameWinPop(arrayBlockValues:Array<any>){
        this.isMatchingGame = false
        this.lightMode(true)
        this.enableButtons(true)
        this.slotGame.levelBarIndicator.width = 0
        this.slotGame.frameBg.removeChild(this.matchingBlocksContainer)
        arrayBlockValues.forEach(data=>{
            data.rock.visible = false
            data.symbol.visible = true
        })
    }
    private createPaylineAnimation(){
        let greetY = 30
        this.paylineText =  new PIXI.Text('SPIN TO WIN', this.textStyle)
        this.paylineText.x = (this.controller.parentSprite.width - this.paylineText.width)/2
        this.paylineText.y = greetY
        this.controller.parentSprite.addChild(this.paylineText)
    }
    private updatePaylineAnimation(greetings:string){
        this.paylineAnimCount = 0
        this.paylineContainers = []
        this.paylineContainersAnimation = []
        let paylineContent:any = this.slotGame.paylines
        let parentContainer = this.controller.parentSprite
        this.paylineText.text = greetings
        let paylineTotal = 0
        this.paylineText.x = (this.controller.parentSprite.width - this.paylineText.width)/2
        if(this.slotGame.paylines.length !== 0){
            let symbolsContainer = new PIXI.Container
            for(let i=0;i<paylineContent.length;i++){
                const container = new PIXI.Container
                const containerWithText = new PIXI.Container
                const greetingText = new PIXI.Text(`line ${paylineContent[i].payline} pays ${Functions.numberWithCommas(paylineContent[i].payout)}` , this.descText)
                paylineContent[i].symbols.forEach((data:any,index:number)=>{
                    let symbols = Functions.loadTexture(this.textureArray,'slot',`${json.symbolAssets[data-1].symbol}`)
                    symbols.x = index*65
                    symbols.scale.set(.2)
                    container.addChild(symbols)
                    paylineTotal+=json.symbolAssets[data-1].pay
                })
                container.x = greetingText.width
                containerWithText.addChild(container,greetingText)
                containerWithText.alpha = 0
                greetingText.y = (containerWithText.height - greetingText.height)/2
                symbolsContainer.addChild(containerWithText)
                this.paylineContainersAnimation.push(containerWithText)
                this.paylineContainers.push(symbolsContainer)
                this.animatePaySymbols(containerWithText,i,symbolsContainer,paylineContent.length)
            }
            symbolsContainer.x = (parentContainer.width - symbolsContainer.width)/2
            symbolsContainer.y = (parentContainer.height - symbolsContainer.height) - 10
            parentContainer.addChild(symbolsContainer)
            this.paylineText.text = `WIN ${paylineTotal}`
        }
    }

    private animatePaySymbols(containerWithText:any,i:number,symbolsContainer:any,totalLines:number){
        let parentContainer = this.controller.parentSprite
        let fadeIn = gsap.to(containerWithText,{
            delay:(i)*4,
            duration:0.1,
            alpha:1,
            onStart:()=>{
                containerWithText.x = (symbolsContainer.width - containerWithText.width)/2
                symbolsContainer.x = (parentContainer.width - symbolsContainer.width)/2
                symbolsContainer.y = (parentContainer.height - symbolsContainer.height) - 10
            },
            onComplete:()=>{
                fadeIn.kill()
                let fadeOut = gsap.to(containerWithText,{
                    delay:0,
                    duration:3,
                    alpha:1,
                    onComplete:()=>{
                        fadeOut.kill()
                        containerWithText.alpha = 0
                        this.paylineAnimCount++
                        if(this.paylineAnimCount == (this.slotGame.paylines.length)){
                            this.paylineAnimCount = 0
                            this.paylineContainersAnimation.forEach((data,index)=>{
                                this.animatePaySymbols(data,index,symbolsContainer,totalLines)
                            })
                        }
                    }
                })
            }
        })
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
        this.paylineContainers.forEach(data=>{data.visible = bool})
        this.slotGame.frameBg.texture = frameBgTexture
        this.controller.parentSprite.texture = parentSpriteTexture
        this.controller.infoBtnSprite.texture = infoBtnTexture
        this.controller.settingBtnSpite.texture = settingBtnTexture
        this.controller.spinBtnSprite.texture = spinBtnTexture
        this.controller.autoPlay.texture = autoPlayTexture
        this.gameBackground.texture = gameBackgroundTexture
        this.buyBonusBtn.visible = bool
        this.slotGame.levelBarContainer.x = bool?0:-this.slotGame.levelBarContainer.width * 0.5
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
    }
    private events(){
        //open system settings modal
        this.controller.settingBtnSpite.addEventListener('pointerdown',()=>{
            // call settings modal
            this.modal.createSystemSettings(this.isAutoPlay)
            // spin type toggle
            this.modal.betBtns.forEach((data,index)=>{
                data.addEventListener('pointerdown',()=>{
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
            this.modal.soundBtns.forEach((data,index)=>{
                data.addEventListener('pointerdown',()=>{
                    if(data.texture == this.textureToggleOff){
                        data.texture = this.textureToggleOn
                        if(index == 0){
                            console.log('music')
                        }else{
                            console.log('sfx')
                        }
                    }else{
                        data.texture = this.textureToggleOff
                    }
                })
            })
            // re position bet amount tex on click
            this.modal.betAmountText.text = this.betAmount
            this.modal.betAmountText.x = (this.modal.betAmountSpite.width - this.modal.betAmountText.width)/2
        })
        //open autoplay
        this.controller.autoPlay.addEventListener('pointerdown',()=>{
            this.isAutoPlay = false
            this.slotGame.autoPlayCount = 0
            this.modal.btnArray = []
            this.modal.createAutoPlaySettings()
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
                data.addEventListener('pointerdown',()=>{
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
            this.modal.rollBtn.addEventListener('pointerdown',()=>{
                this.controller.spinBtnSprite.texture = this.spinTextureOff
                this.controller.spinBtnSprite.interactive = false
                this.isAutoPlay = true
                this.modal.rollBtn.texture = this.textureRollOn
                if(!this.slotGame.isSpinning )
                    this.startSpin(this.modal.totalSpin)
            })
            // set background on hover
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
            this.controller.spinBtnSprite.interactive = true
            if(!this.slotGame.isSpinning){
                this.startSpin(1)
            }else{
                this.slotGame.timeScale = 10
            }
        })
        //buy bonus
        this.buyBonusBtn.addEventListener('pointerdown',()=>{
            this.buyBonusPopUp()
            this.buyBonusBtn.interactive = false
        })
    }
}