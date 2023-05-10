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
    //text style 
    private textStyle:PIXI.TextStyle
    private textStyle2:PIXI.TextStyle
    //text values
    private buyBonusText:PIXI.Text
    private paylineText:PIXI.Text
    private paylineGreetings:string

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
        // this.matchingGame()
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
    private onSpin(){
        this.paylineGreetings = 'GOOD LUCK'
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
        const blocksContainer = new PIXI.Container()
        let randomizeArray = Functions.arrayRandomizer(json.matchgame_values)
        let arrayBlockValues:Array<any> = []
        let blockSpacing = 1.2
        let multiplier = 0
        let multiplier2 = 0
        let blockOffsetX = 25
        let miniCount = 0
        let majorCount = 0
        let grandCount = 0
        //change visibilities of normal game
        this.slotGame.reelContainer.forEach(data=>{
            data.visible = false
        })
        this.slotGame.frameBg.texture = Functions.loadTexture(this.textureArray,'main','slot_frame_bg2').texture
        this.slotGame.levelBarContainer.x = -this.slotGame.levelBarContainer.width * 0.5
        this.controller.parentSprite.texture = Functions.loadTexture(this.textureArray,'controller','controller_parent2').texture
        this.controller.infoBtnSprite.texture = Functions.loadTexture(this.textureArray,'controller','info_button2').texture
        this.controller.settingBtnSpite.texture = Functions.loadTexture(this.textureArray,'controller','system_settings2').texture
        this.controller.spinBtnSprite.texture = Functions.loadTexture(this.textureArray,'controller','spin_button2').texture
        this.controller.autoPlay.texture = Functions.loadTexture(this.textureArray,'controller','autoplay_button2').texture
        this.buyBonusBtn.visible = false
        this.gameBackground.texture = Functions.loadTexture(this.textureArray,'main','bg2').texture
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
            blocksContainer.addChild(symbol)
            blocksContainer.addChild(rock)
        })
        blocksContainer.x = (this.slotGame.frameBg.width-blocksContainer.width)/2
        blocksContainer.y = (this.slotGame.frameBg.height-blocksContainer.height)/2
        this.slotGame.frameBg.addChild(blocksContainer)
    }
    private matchinGameWinPop(arrayBlockValues:Array<any>){
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
        let paylineContent:any = this.slotGame.paylines
        this.paylineText.text = greetings
        // if(this.slotGame.paylines.length !== 0){
        //     paylineContent.forEach((data:any,index:number)=>{
        //         // console.log(data)
        //         data.symbols.forEach((data:any,i:number)=>{
        //             let symbols = Functions.loadTexture(this.textureArray,'slot',`${json.symbolAssets[data-1].symbol}`)
        //             this.controller.parentSprite.addChild(symbols)
        //         })
        //     })
        // }
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

    private createGrass(){
       // this.playSound(27)
        while(this.grass.length < 300){
            let bubble = {
                x: Math.round(Functions.getRandomInt(-100, this.app.screen.width)),
                y: Math.round(Functions.getRandomInt(-100, this.app.screen.height)),
                size: Math.round(Functions.getRandomInt(50, 350))
            }

            let overlapping = false;
            for(let j = 0; j < this.grass.length; j++){
                let other = this.grass[j];
                if (bubble.x < other.x + other.size &&
                    bubble.x + bubble.size > other.x &&
                    bubble.y < other.y + other.size &&
                    bubble.size + bubble.y > other.y) {
                    overlapping = true;
                    break;
                 }
            }

            if(!overlapping){
                this.grass.push(bubble);
            }

            this.protection++;
            if(this.protection > 10000){
                break;
            }
        }
    }

    private animateGrass(){
        let duration = 10;
        this.grass.forEach((element, index) => {
            let interval = duration * index;
            let show = setTimeout(() => {
                const sprite = PIXI.Sprite.from(this.textureArray.grass.textures['grass_1.png']);
                sprite.width = element.size;
                sprite.height = element.size;
                sprite.x = element.x;
                sprite.y = element.y;
                this.grassSprites.push(sprite);
                this.app.stage.addChild(sprite);
                clearTimeout(show);
            }, interval);
        });
    }
}