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
     
    constructor(){
        this.matchingBlocksContainer = new PIXI.Container
        this.gameContainer = new PIXI.Container
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
        new Loader(this.init.bind(this))
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
        this.popGlow = new Spine(this.textureArray.pop_glow.spineData)
        this.popGlow2 = new Spine(this.textureArray.pop_glow.spineData)
        //overlay
        this.overlay = Functions.loadTexture(this.textureArray,'modal','overlay')
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
                // console.log(this.slotGame.isSpinning , "this.slotGame.isSpinning")
                // console.log(this.isAutoPlay , "this.isAutoPlay")
                // console.log(this.isMatchingGame , "this.isMatchingGame")
                // console.log(this.isFreeSpin , "this.isFreeSpin")
                // console.log(this.isOpenModal , "this.isOpenModal")
                if(!this.slotGame.isSpinning && !this.isAutoPlay && !this.isMatchingGame && !this.isFreeSpin && !this.isOpenModal){
                  
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
    }
    private createCongrats(){
        this.congrats = new Congrats(this.app,this.textureArray, this.winFreeSpin, this.noOfSpin)
        this.gameContainer.addChild(this.congrats.container)
        
        this.congrats.container.cursor = 'pointer'
        this.congrats.container.interactive = true
        this.congrats.container.addEventListener('pointerdown',()=>{
            this.congrats.container.interactive = false
            this.slotGame.isFreeSpinDone = true
            this.slotGame.freeSpinStart = false
            this.slotGame.isFreeSpin = false
            this.congrats.durationCount = 0.1
            this.isOpenModal= false
            this.createTransition()
            this.slotGame.startCountWinFreeSpin = false
            let timeout = setTimeout(()=>{
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
    }
    private createGame(){
        this.gameBackground = Functions.loadTexture(this.textureArray,'main','bg')
        this.gameBackground.width = this.baseWidth
        this.gameBackground.height = this.baseHeight
        this.gameContainer.addChild(this.gameBackground)
    }
    private createSlot(){
        // create slot
        this.slotGame = new Slot(this.app,this.textureArray,this.onSpinEnd.bind(this),this.matchingGame.bind(this),this.onSpin.bind(this),this.freeSpinEvent.bind(this),this.checkIfFreeSpin.bind(this),this.createCongrats.bind(this))
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
            if(this.slotGame.autoPlayCount == 0){
                this.isAutoPlay = false
                 this.controller.spinBtnSprite.texture = this.spinTextureOn
                 this.controller.spinBtnSprite.interactive = true
            }
            this.updatePaylineAnimation(this.paylineGreetings)
        }
        if(this.slotGame.startCountWinFreeSpin){
            this.winFreeSpin += this.slotGame.totalWin
        }   
        //this.slotGame.isFreeSpin = false
    }
    private onSpin(){
        this.paylineGreetings = 'GOOD LUCK'
        this.paylineContainersAnimation.forEach(data=>{
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
        Functions.loadSpineAnimation(this.popGlow,'glow',true,0.5)
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
        close.addEventListener('pointerdown',()=>{
            this.hideBonusPopUp(dY,sY);
            this.isOpenModal = false
        })
        check.addEventListener('pointerdown',()=>{
            this.slotGame.isFreeSpin = true
            this.hideBonusPopUp(dY,sY)
        check.interactive = false
            let timeOut = setTimeout(()=>{
                this.startSpin(1)
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
            let randomizeArray = Functions.arrayRandomizer(json.matchgame_values)
            let arrayBlockValues:Array<any> = []
            let blockSpacing = 1.2
            let multiplier = 0
            let multiplier2 = 0
            let blockOffsetX = 25
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
                            popUpSkin = 'excellent'
                            this.matchingGameWin = 500
                            result = symbol
                            this.matchinGameWinPop(arrayBlockValues,popUpSkin,result)
                        }
                    }else if(data == 'major'){
                        majorCount++
                        if(majorCount == 3){
                            popUpSkin = 'impressive'
                            this.matchingGameWin = 100
                            result = symbol
                            this.matchinGameWinPop(arrayBlockValues,popUpSkin,result)
                        }
                    }else{
                        miniCount++
                        if(miniCount == 3){
                            popUpSkin = 'nice'
                            this.matchingGameWin = 25
                            result = symbol
                            this.matchinGameWinPop(arrayBlockValues,popUpSkin,result)
                        }
                    }
                    this.userCredit+=this.matchingGameWin
                    this.updateCreditValues()
                })
                arrayBlockValues.push({rock:rock,symbol:symbol})
                this.matchingBlocksContainer.addChild(symbol)
                this.matchingBlocksContainer.addChild(rock)
            })
            this.matchingBlocksContainer.x = (this.slotGame.frameBg.width-this.matchingBlocksContainer.width)/2
            this.matchingBlocksContainer.y = (this.slotGame.frameBg.height-this.matchingBlocksContainer.height)/2
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
        arrayBlockValues.forEach(data=>{
            data.rock.visible = false
            data.symbol.visible = true
        })
        let popDelay = setTimeout(()=>{
            this.createPopUps(popUpSkin)
            this.popUps.container.addEventListener('pointerdown',()=>{
                this.matchGameResult(result)
            })
            clearTimeout(popDelay)
        },1000)
    }
    private matchGameResult(result:any){
        let frame = this.slotGame.frameBg
        let frameBgTexture = Functions.loadTexture(this.textureArray,'bonus','matchin_game_win_board').texture
        let win = new PIXI.Text(`${this.matchingGameWin}`, this.whiteYellow)
        let clickContinueText = new PIXI.Text(`click here to continue`, this.textStyle3)
        frame.texture = frameBgTexture
        result.x = (frame.width - result.width)/2
        result.y = (frame.height - result.height)*0.8
        win.x = (frame.width - win.width)/2
        win.y = ((frame.height - win.height)/2)*0.85

        const textScaleAnim = gsap.timeline({ 
            repeat: -1,
            onUpdate:()=>{
                clickContinueText.x = (frame.width - clickContinueText.width)/2
                clickContinueText.y = (frame.height - clickContinueText.height)*0.96
            }
        });

        textScaleAnim.to(clickContinueText.scale, { duration: 0.5, x: 1.2, y: 1.2 })
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
            clickContinueText.interactive = false
            clickContinueText.interactive = false
            textScaleAnim.kill()
            let timeOut = setTimeout(()=>{
                frame.removeChild(result)
                frame.removeChild(win)
                frame.removeChild(clickContinueText)
                clearTimeout(timeOut)
            },this.transitionDelay)
            this.endMatchingGame()
        })
    }
    private endMatchingGame(){
        this.createTransition()
        let timeOut = setTimeout(()=>{
            this.gameContainer.interactive= false
            this.gameContainer.cursor = ''
            this.isMatchingGame = false
            this.lightMode(true)
            this.enableButtons(true)
            this.slotGame.levelBarIndicator.width = 0
            this.slotGame.frameBg.removeChild(this.matchingBlocksContainer)
            this.updatePaylineTopText('SPIN TO WIN')
            this.updatePaylineBottomText('Tap space or enter to skip')
            clearTimeout(timeOut)
        },this.transitionDelay)
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
                    symbols.scale.set(.2)
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
            if(this.isAutoPlay) {
                this.controller.spinBtnSprite.interactive = true 
                this.controller.spinBtnSprite.cursor = 'pointer' 
            }
            this.isAutoPlay = false
          
            this.controller.spinBtnSprite.texture = this.spinTextureOn 
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
               // this.controller.spinBtnSprite.interactive = false
                this.isAutoPlay = true
                this.modal.rollBtn.texture = this.textureRollOn
                if(!this.slotGame.isSpinning){
                    // this.startSpin(this.modal.totalSpin)
                    if(this.modal.totalSpin >= 1){
                         this.startSpin(this.modal.totalSpin)
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
        })
        //single spin trigger
        this.controller.spinBtnSprite.addEventListener('pointerdown',()=>{
            this.controller.spinBtnSprite.interactive = true
            if(!this.slotGame.isSpinning && !this.isFreeSpin && !this.isAutoPlay ){
                this.controller.spinBtnSprite.texture = this.spinTextureOff
                this.startSpin(1)
            }else{
                this.slotGame.timeScale = 10
            }
        })
        //buy bonus
        this.buyBonusBtn.addEventListener('pointerdown',()=>{
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
        Functions.loadSpineAnimation(this.popGlow2,'glow',true,0.5)
        this.overlay.addChild(this.popGlow)
        Functions.loadSpineAnimation(this.popGlow,'glow',true,0.5)
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


        wildSlot.addEventListener('pointerdown', () =>{
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

        
        moneySlot.addEventListener('pointerdown', () =>{
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
        this.enableButtons(false)
        this.lightModeEvent(false)
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
            this.startSpin(count)
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
}