import 'pixi-spine' 
import * as PIXI from 'pixi.js';
import Functions from '../settings/Functions';
import json from '../settings/settings.json'
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import {Spine} from 'pixi-spine';
// register the plugin
gsap.registerPlugin(PixiPlugin);

// give the plugin a reference to the PIXI object
PixiPlugin.registerPIXI(PIXI);

export default class Slot{
    //app settings
    private app:PIXI.Application
    private textureArray:any
    private baseWidth:number
    private baseHeight:number
    public container:PIXI.Container
    private reelsContainer:PIXI.Container
    private readonly bonusType:number = 10
    private readonly wildType:number = 11
    //sprites
    public frameBg:PIXI.Sprite
    public frameBorder:PIXI.Sprite
    private blockWidth:number = 280
    private blockHeight:number = 260
    private blockSpacing:number = 258
    private reelPosX:Array<number> = [366.5,668.5,966,1263,1558.5]
    private reelEffectPosX:Array<number> = [369,666,967.5,1263,1558.5]
    public reelContainer:Array<any> = []
    private reelsSymbols:Array<any> = []
    private spinCount:number= 0
    private logo:PIXI.Sprite
    public isSpinning:boolean = false
    public notLongPress:boolean = true
    public levelBarContainer:PIXI.Container
    public levelBarIndicator:PIXI.Sprite
    public maskSprite:PIXI.Sprite
    private reelsValues:Array<Array<number>> = [
        [3,4,3,11,10,1,2,3,11,8,4,11,2,9,3,10,1,3,5,9,2,6,8,6,9,3,9,7,1,7],
        [2,8,3,11,10,7,3,11,9,1,4,2,3,4,4,7,5,10,5,9,2,6,8,6,9,3,9,11,1,7],
        [1,2,9,3,10,2,3,9,8,10,2,3,11,4,2,11,5,9,5,9,2,6,8,6,9,3,11,7,1,7],
        [1,1,1,1,11,1,1,1,11,1,1,10,11,11,1,1,1,1,5,9,2,6,8,11,9,3,9,7,1,7],
        [11,5,9,2,4,6,11,11,2,9,10,5,3,3,8,11,4,5,3,5,8,9,1,6,6,11,3,7,3,2]
        // [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10],
        // [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10],
        // [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10],
        // [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10],
        // [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,9,9,9,9,9,9,9]
        // [11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,10,10,10,10,10,10,10,10,10,10,11],
        // [11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,10,10,10,10,10,10,10,10,10,10,11],
        // [11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,10,10,10,10,10,10,10,10,10,10,11],
        // [11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,10,10,10,10,10,10,10,10,10,10,11],
        // [11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,10,10,10,10,10,10,10,10,10,10,11]
    ]
    private reelsValuesMoneySlot:Array<Array<number>> = [
        [11,4,11,2,11,1,2,11,7,8,4,11,2,8,11,2,1,11,5,8,2,6,8,6,8,11,8,7,1,7],
        [2,8,11,11,1,7,11,8,8,1,4,2,11,4,4,7,5,1,5,8,2,6,8,6,8,11,8,7,1,7],
        [1,2,8,11,2,2,11,8,8,11,2,11,4,4,2,11,5,8,5,8,2,6,8,6,8,11,8,7,1,7],
        [1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,1,5,9,2,6,8,6,8,11,8,7,1,7],
        [2,5,8,2,4,6,5,4,2,8,11,5,11,11,8,2,4,5,11,5,8,8,1,6,6,4,11,7,11,2]
    ]
    private reelsValuesMultiplierSlot:Array<Array<number>> = [
        [3,4,3,2,3,1,2,3,7,8,4,3,2,9,3,2,1,3,5,9,2,6,8,6,9,3,9,7,1,7],
        [2,8,3,3,1,7,3,8,9,1,4,2,3,4,4,7,5,1,5,9,2,6,8,6,9,3,9,7,1,7],
        [1,2,9,3,2,2,3,9,8,3,2,3,4,4,2,11,5,9,5,9,2,6,8,6,9,3,9,7,1,7],
        [1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,1,1,5,9,2,6,8,6,9,3,9,7,1,7],
        [2,5,9,2,4,6,5,4,2,9,3,5,3,3,8,2,4,5,3,5,8,9,1,6,6,4,3,7,3,2]
    ]
    private reelY:number = -6713.7
    // private reelY:number = -6773.7
    public timeScale:number = 0
    public autoPlayCount:number = 0
    private spinType:string = ''
    private spinDuration:number = 0
    // methods 
    private matchingGame:()=>void
    private freeSpinEvent:()=>void
    private createCongrats:()=>void
    private checkIfFreeSpin:(bool: boolean)=>void
    private onSpinning:()=>void
    private onSpinEnd:()=>void
    private onSpin:()=>void
    private levelBarWidth:number = 742
    // payout
    public totalWin:number = 0
    // payline animation
    public paylines:Array<any> = []
    //checkIfanimationDone
    private animateDone:boolean = true;
    //freespin
    private symbolCount = 0
    private symbolCount2 = 0
    private symbolCount3= 0
    public winFreeSpin = 0
    public isFreeSpin:boolean = false
    public isFreeSpinDone:boolean = true
    public freeSpinStart:boolean = false
    public autoplayDoneEvent:boolean = true
    public startCountWinFreeSpin:boolean = false
    public isMatchingGame:boolean = false

    //sound
    private playSound: (index: number) => void;
    private soundStop: (index: number) => void; 
    private fadeSound: (sound: number,volume:number,duration:number) => void; 
    private soundVolume: (sound: number,volume:number) => void; 

    //
    private preGeneratedTypes:Array<any> = []
    private reelEffect:Array<any> = []
    private spinReelAnimation:Array<any> = []

    public isBonusTick:boolean = false
    public whatEvent:number = 0
    public generateTypeIndex:number = 0

    private bonusSymbolsCount:number = 0
    private sound:Array<any>
    constructor(app:PIXI.Application,textureArray:any,onSpinEnd:()=>void,matchingGame:()=>void,onSpinning:()=>void,freeSpinEvent:()=>void,checkIfFreeSpin:(bool: boolean)=>void,createCongrats:()=>void,onSpin:()=>void,playSound:(index: number)=>void,soundStop:(index: number)=>void,sound:Array<any>,fadeSound: (sound: number,volume:number,duration:number) => void,soundVolume: (sound: number,volume:number) => void){
        this.app = app
        this.sound = sound
        this.baseWidth = this.app.screen.width
        this.baseHeight = this.app.screen.height
        this.textureArray = textureArray
        this.container = new PIXI.Container
        this.levelBarContainer = new PIXI.Container
        this.reelsContainer = new PIXI.Container
        this.container.sortableChildren = true
        this.onSpinEnd = onSpinEnd
        this.createCongrats = createCongrats
        this.matchingGame = matchingGame
        this.freeSpinEvent = freeSpinEvent
        this.checkIfFreeSpin = checkIfFreeSpin
        this.onSpinning = onSpinning
        this.onSpin = onSpin
        this.playSound = playSound;
        this.soundStop = soundStop;
        this.fadeSound = fadeSound
        this.soundVolume = soundVolume
        this.init()
    }

    private init(){
        this.createParent()
        this.createLogo()
        this.createLevelBar()
        this.createReels()
    }
    private createParent(){
        const frameX = 95
        const frameY = 70
        this.frameBg = Functions.loadTexture(this.textureArray,'main','slot_frame_bg')
        this.frameBg.y = ((this.baseHeight - this.frameBg.height)/2) - 30
        this.frameBg.x = (this.baseWidth - this.frameBg.width)/2 
        this.container.addChild(this.frameBg)

        this.frameBorder = Functions.loadTexture(this.textureArray,'main','slot_frame') 
        this.frameBorder.x = this.frameBg.x - frameX
        this.frameBorder.y = this.frameBg.y - frameY
        this.container.addChild(this.frameBorder)
    }
    private createLogo(){
        this.logo = Functions.loadTexture(this.textureArray,'main','logo') 
        this.logo.x = this.frameBorder.x
        this.logo.y = 20
        this.container.addChild(this.logo)
    }
    private createLevelBar(){
        //create level bar background
        const levelBarBg = Functions.loadTexture(this.textureArray,'main','bar_bg')
        levelBarBg.x = (this.frameBorder.width - levelBarBg.width)+50
        levelBarBg.y = this.frameBorder.y * 0.7
        this.levelBarContainer.addChild(levelBarBg)
        //create indicator
        this.levelBarIndicator = Functions.loadTexture(this.textureArray,'main','bar_energy')
        this.levelBarIndicator.width = 0
        this.levelBarIndicator.x = levelBarBg.x + 5
        this.levelBarIndicator.y = levelBarBg.y
        this.levelBarContainer.addChild(this.levelBarIndicator)
        //create mini item
        const itemMini = Functions.loadTexture(this.textureArray,'main','mini')
        itemMini.x = levelBarBg.x
        itemMini.y = levelBarBg.y - 30
        this.levelBarContainer.addChild(itemMini)
        //create major item
        const itemMajor = Functions.loadTexture(this.textureArray,'main','major')
        itemMajor.x = itemMini.x + itemMini.width
        itemMajor.y = itemMini.y - 13
        this.levelBarContainer.addChild(itemMajor)
        //create grand item
        const itemGrand = Functions.loadTexture(this.textureArray,'main','grand')
        itemGrand.x = itemMajor.x + itemMajor.width
        itemGrand.y = 10
        this.levelBarContainer.addChild(itemGrand)

        const style = new PIXI.TextStyle({  
            fontFamily: 'Arial',
            fontSize: 36,
            fontWeight: 'bold',
            fill: ['#ffffff', '#ffffff'], // gradient
            stroke: '#4a1850',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
            wordWrap: true,
            wordWrapWidth: 440,
            lineJoin: 'round',
        });

        //create mini text
        const miniPrize = new PIXI.Text(`${Functions.numberWithCommas(json.jackpots.mini)}`, style);
        miniPrize.x = (itemMini.width - miniPrize.width)/2;
        miniPrize.y = 40;
        itemMini.addChild(miniPrize)
        //create major text
        const majorPrize = new PIXI.Text(`${Functions.numberWithCommas(json.jackpots.major)}`, style);
        majorPrize.x = (itemMajor.width - majorPrize.width)/2;
        majorPrize.y = 53;
        itemMajor.addChild(majorPrize)
        //create grand text
        const grandPrize = new PIXI.Text(`${Functions.numberWithCommas(json.jackpots.grand)}`, style);
        grandPrize.x = (itemGrand.width - grandPrize.width)/2;
        grandPrize.y = 40;
        itemGrand.addChild(grandPrize)

        this.container.addChild(this.levelBarContainer)
    }
    private createReels(){
        let arr:Array<any> = []
        for(let i=0;i<this.reelsValues.length;i++){
            const container = new PIXI.Container
            container.zIndex = 10000
            arr = this.createReel(i)
            arr.forEach((data,index)=>{
                container.addChild(data.symbol)
                data.symbol.y = index * this.blockSpacing
                data.symbol.width = this.blockWidth
                data.symbol.height = this.blockHeight
            })
            this.reelsSymbols.push(arr)
            this.reelContainer.push(container)
        }
        
        this.reelContainer.forEach((data,index)=>{
            data.x = this.reelPosX[index]
            data.y = this.reelY
            this.reelsContainer.addChild(data)
            this.container.addChild(this.reelsContainer)

            const reelEffect = new Spine(this.textureArray.reel_effect.spineData)
            reelEffect.height = this.frameBorder.height *1.08
            reelEffect.width*=1.1
            reelEffect.x = this.reelEffectPosX[index]
            reelEffect.y = 535
            reelEffect.visible = false
            this.reelEffect.push(reelEffect)
            this.container.addChild(reelEffect)  
            reelEffect.zIndex = 1000
        })
        //create mask for reels
        this.maskSprite = Functions.loadTexture(this.textureArray,'main','mask_big') 
        this.maskSprite.height = this.maskSprite.height
        this.maskSprite.width = this.frameBorder.width 
        this.maskSprite.x = this.frameBorder.x
        this.maskSprite.y = this.frameBg.y-5
        this.reelsContainer.mask = this.maskSprite
        this.container.addChild(this.maskSprite)
    }
    public startSpin(spinType:string){
        this.bonusSymbolsCount = 0
        this.soundStop(5)
        this.spinType = spinType
        this.symbolCount = 0
        this.symbolCount2 = 0
        this.symbolCount3 = 0
        this.paylines = []
        let hiddenReelY = -100
        let dY = 250
        let bounceOffset = this.reelY-30
        let durationBounceUp:number;
        let delay:number;
        let bounceContainerArr:Array<any> = []
        this.onSpin()
        switch(spinType){
            case 'normal':
                durationBounceUp = 0.4
                this.spinDuration = 1
                delay = 0.3
            break;
            case 'quick':
                durationBounceUp = 0.2
                this.spinDuration = 0.3
                delay = 0.1
            break;
            case 'turbo':
                durationBounceUp = 0.2
                this.spinDuration = 0.1
                delay = 0
            break;
            default:
                durationBounceUp = 0.4
                this.spinDuration = 1
                delay = 0.5
            break
        }
        
        this.reelContainer.forEach((data,index)=>{
            this.isSpinning = true
            let bounceStart = gsap.to(data, {
                delay:index*delay,
                duration:durationBounceUp,
                y:bounceOffset,
                onStart:()=>{
                    if(this.timeScale == 10 && spinType !== 'turbo'){
                        bounceContainerArr[0].delay(0)
                        bounceContainerArr[1].delay(0)
                        bounceContainerArr[2].delay(0)
                        bounceContainerArr[3].delay(0)
                        bounceContainerArr[4].delay(0)
                    }
                    // reset the alpha value of symbols to 1 on spin
                    this.resetTopSymbolsAlpha(index)
                },
                onComplete:()=>{
                    bounceStart.kill()
                    let spin = gsap.to(data, {
                        duration: this.spinDuration,
                        y: dY+50,
                        ease: "bounce.in",
                        onStart:()=>{
                            this.applyMotionBlur(index,true)
                            this.spinReelAnimation.push(spin)
                            if(!this.isFreeSpin || this.freeSpinStart){
                                this.generateTypes(this.generateTypeIndex)   
                            }
                            this.generateTypeIndex++
                        },
                        onUpdate:()=>{
                            this.onSpinning()
                            if(spin.repeat() !== 2 && spin.repeat() !== 4 && spin.repeat() !== 6){
                                if(data.y > hiddenReelY){
                                    this.reelContainer[index].children[27].y = 0
                                    this.reelContainer[index].children[28].y = 260
                                    this.reelContainer[index].children[29].y = 520
                                }
                            }
                            if(this.timeScale == 10 && spinType !== 'turbo'){
                                spin.timeScale(this.timeScale)
                            }
                        },
                        onComplete:()=>{
                            if(!this.isFreeSpin || this.freeSpinStart){
                                this.reelEffectShow(index)
                            }
                            this.playSound(4);
                            spin.kill()
                            if(this.isFreeSpin && this.isFreeSpinDone){
                                this.generateNewSymbolsEvent(index)
                            }else if(this.isFreeSpin && !this.isFreeSpinDone){
                                this.generateNewSymbolsMainEvent(index)
                            }else{
                                this.generateNewSymbols(index)
                            }
                            let bounceStop = gsap.to(data,{
                                y: dY,
                                duration:0.3,
                                ease: "power1.out",
                                onComplete:()=>{
                                    bounceStop.kill()
                                    this.spinCount++
                                    data.y = this.reelY
                                    this.updateVisibleBlocks(index)
                                    this.applyMotionBlur(index,false)
                                    if(!this.isFreeSpin){
                                        this.reelContainWildAndBonus(index)
                                    }
                                    if(this.spinCount == 5){
                                        this.maskSprite.height = this.frameBorder.height 
                                        this.maskSprite.y = this.frameBorder.y 
                                        this.spinReelAnimation = []
                                        this.generateTypeIndex = 0
                                        this.checkPattern()            
                                        this.spinCount = 0
                                        this.isSpinning = false
                                        if(this.autoPlayCount > 1){
                                            let spinSpeed = 1000;
                                            if(spinType == 'turbo'){
                                                spinSpeed = 200
                                            }else{
                                                1000
                                            }
                                            if(!this.animateDone){
                                                let settime = setTimeout(() => {
                                                    this.animateDone=true
                                                    this.startSpin(spinType)   
                                                    clearTimeout(settime);
                                                }, spinSpeed);
                                            }else{
                                                this.startSpin(spinType) 
                                            }
                                        }
                                        this.autoPlayCount--
                                        // set the credit base 
                                        this.onSpinEnd()
                                        if(this.autoPlayCount == 0 && !this.autoplayDoneEvent) {
                                            this.createCongrats()
                                        }
                                    }
                                }
                            })
                        }
                    })
                }
            })
            bounceContainerArr.push(bounceStart)
            this.timeScale = 0
        })
    }
    private reelContainWildAndBonus(index:number){
        this.reelsSymbols[index].forEach((data:any,index:number)=>{
            if(index > 26){
                //check if reel contain wild
                if(data.type == this.wildType){ 
                    this.playSound(18)
                    this.soundVolume(18,0.2)
                    Functions.loadSpineAnimation(data.symbol,'open',false,1.1)
                    const globalPos = data.symbol.getGlobalPosition()
                    this.createWildCoin(globalPos.x,globalPos.y)
                    this.levelBarIndicator.width++
                    // reset level bar and start matching game
                    if(this.levelBarIndicator.width == this.levelBarWidth){
                        this.autoPlayCount = 0
                        this.levelBarIndicator.width = this.levelBarWidth
                        this.isMatchingGame = true
                        this.matchingGame()
                    }
                }
                //check if reel contain bonus
                if(data.type == this.bonusType){
                    this.bonusSymbolsCount++
                    if(this.bonusSymbolsCount > 1){
                        this.playSound(10)
                    }else{
                        this.playSound(9)
                    }
                    Functions.loadSpineAnimation(data.symbol,'fall',false,0.6)
                }
            }
        })
    }
    private checkPattern(){
        let arr = Array.from({length: json.pattern.length}, (_, index) => index)
        this.paylines = []
        let countsArray:Array<any> = []

        json.pattern.forEach((blocks,index)=>{
            let pattern:Array<any> = []
            if(index == arr[index]){
                this.containPattern(blocks,pattern)
            }
            countsArray.push(Functions.hasConsecutiveSameValues(pattern))
        })

        countsArray.forEach((data,index)=>{
            if(index == arr[index] && data.count>2){
                let totalLinePay:number = 0
                let lineSymbols:Array<any> = []
                    for(let i=0;i<data.count;i++){
                        //add animation
                        lineSymbols.push(data.blocks[i].type)
                        // validate not to match bonus and wild symbol
                        if(lineSymbols.length == data.count){
                            if(!lineSymbols.includes(10) || !lineSymbols.includes(11)){
                                lineSymbols.forEach((el,i)=>{
                                    totalLinePay+=data.blocks[i].payout
                                    this.animatePatterns(i,data.blocks[i].block)
                                })
                            }
                        }
                    }
                if(data.arrTypes == this.bonusType && !this.freeSpinStart){
                    this.checkIfFreeSpin(false);
                    this.freeSpinStart = true
                    this.checkIfMatchingGameDone()
                }
                // validate not to add payline bonus and wild symbol
                if(lineSymbols.length == data.count){
                    if(!lineSymbols.includes(10) || !lineSymbols.includes(11)){
                        this.paylines.push({payline:index+1,symbols:lineSymbols,payout:totalLinePay})
                    }
                }
            }
        })
    }
    private resetTopSymbolsAlpha(index:number){
        this.maskSprite.height = this.frameBg.height - 8
        this.maskSprite.y = this.frameBg.y + 3
        this.reelsSymbols[index].forEach((data:any,i:number)=>{
            data.symbol.alpha = 1
        })
    }
    private checkIfMatchingGameDone(){
        if(!this.isMatchingGame){
            //this.freeSpinEvent()
        }
    }
    private containPattern(blocks:Array<number>,arr:Array<any>){
        blocks.forEach((blockNo,index)=>{
            arr.push({pattern:this.reelsSymbols[index][blockNo],blockNo:blockNo})
        })
    }
    private animatePatterns(reelIndex:number,blockIndex:number){
        let symbol = this.reelsSymbols[reelIndex][blockIndex]
        // add total win
        if(this.isFreeSpin){
            this.winFreeSpin += symbol.payout
        }
        this.totalWin += symbol.payout
        Functions.loadSpineAnimation(symbol.symbol,'animation',true,0.8)
        // this.playSound(5);
        this.animateDone = false
        if(reelIndex == 0){
            let type = symbol.type
            if(!this.isFreeSpin){
                if(!this.sound[17].playing() && !this.isFreeSpin){
                    this.playSound(17)
                }
                this.fadeSound(17,1,2000)
                this.fadeSound(16,0,2000)
                this.soundStop(0)
            }
            if(type == 1){
                this.playSound(27)
            }else if(type == 2){
                this.playSound(28)
            }else if(type == 3){
                this.playSound(25)
            }else if(type == 4){
                this.playSound(29)
            }else if(type == 5){
                this.playSound(26)
            }else{
                this.playSound(24)
            }
        } 
    }
    private applyMotionBlur(index:number,onSpin:boolean){
        this.reelsSymbols[index].forEach((data:any,index:number)=>{
            data.symbol.skeleton.setSkinByName(onSpin?'blur':'no_blur')
        })
    }
    private generateTypes(i:number){
        let arr = Functions.arrayRandomizer(this.reelsValues[i])      
        this.preGeneratedTypes.push(arr)
        if(i >= 2 ){
            if((this.preGeneratedTypes[0][0] == this.bonusType || this.preGeneratedTypes[0][1] == this.bonusType || this.preGeneratedTypes[0][2] == this.bonusType) && (this.preGeneratedTypes[1][0] == this.bonusType || this.preGeneratedTypes[1][1] == this.bonusType || this.preGeneratedTypes[1][2] == this.bonusType)){
                this.reelEffect[2].visible = true 
                if(!this.sound[11].playing()){
                    this.playSound(11)
                }
                Functions.loadSpineAnimation(this.reelEffect[2],'animation',true,1)
                if(!this.freeSpinStart){
                this.spinReelAnimation[2].repeat(2)
                }
                if(i == 3){
                    if((this.preGeneratedTypes[0][0] == this.bonusType || this.preGeneratedTypes[0][1] == this.bonusType || this.preGeneratedTypes[0][2] == this.bonusType) && (this.preGeneratedTypes[1][0] == this.bonusType || this.preGeneratedTypes[1][1] == this.bonusType || this.preGeneratedTypes[1][2] == this.bonusType) && (this.preGeneratedTypes[2][0] == this.bonusType || this.preGeneratedTypes[2][1] == this.bonusType || this.preGeneratedTypes[2][2] == this.bonusType)){
                        if(!this.freeSpinStart){
                            this.spinReelAnimation[3].repeat(4)
                        }
                        this.isBonusTick = true
                    }
                }
                if(i == 4){
                    if((this.preGeneratedTypes[0][0] == this.bonusType || this.preGeneratedTypes[0][1] == this.bonusType || this.preGeneratedTypes[0][2] == this.bonusType) && 
                    (this.preGeneratedTypes[1][0] == this.bonusType || this.preGeneratedTypes[1][1] == this.bonusType || this.preGeneratedTypes[1][2] == this.bonusType) && 
                    (this.preGeneratedTypes[2][0] == this.bonusType || this.preGeneratedTypes[2][1] == this.bonusType || this.preGeneratedTypes[2][2] == this.bonusType) &&
                    (this.preGeneratedTypes[3][0] == this.bonusType || this.preGeneratedTypes[3][1] == this.bonusType || this.preGeneratedTypes[3][2] == this.bonusType)){
                        if(!this.freeSpinStart){
                         this.spinReelAnimation[4].repeat(6)
                        }
                        this.isBonusTick = true
                    }
                }
            }
            if(this.isFreeSpin){
                this.playSound(11)
                Functions.loadSpineAnimation(this.reelEffect[2],'animation',true,1)
            }
        }
    }
    private reelEffectShow(index:number){
        if(index == 2 && !this.isFreeSpin){
            this.reelEffect[2].visible = false
            if((this.preGeneratedTypes[0][0] == this.bonusType || this.preGeneratedTypes[0][1] == this.bonusType || this.preGeneratedTypes[0][2] == this.bonusType) && (this.preGeneratedTypes[1][0] == this.bonusType || this.preGeneratedTypes[1][1] == this.bonusType || this.preGeneratedTypes[1][2] == this.bonusType) && (this.preGeneratedTypes[2][0] == this.bonusType || this.preGeneratedTypes[2][1] == this.bonusType || this.preGeneratedTypes[2][2] == this.bonusType)){
                this.reelEffect[3].visible = true
                Functions.loadSpineAnimation(this.reelEffect[3],'animation',true,1)
                this.playSound(11)
            }
        }
        if(index == 3 && !this.isFreeSpin){
            this.reelEffect[2].visible = false
            this.reelEffect[3].visible = false
            if((this.preGeneratedTypes[0][0] == this.bonusType || this.preGeneratedTypes[0][1] == this.bonusType || this.preGeneratedTypes[0][2] == this.bonusType) && 
            (this.preGeneratedTypes[1][0] == this.bonusType || this.preGeneratedTypes[1][1] == this.bonusType || this.preGeneratedTypes[1][2] == this.bonusType) && 
            (this.preGeneratedTypes[2][0] == this.bonusType || this.preGeneratedTypes[2][1] == this.bonusType || this.preGeneratedTypes[2][2] == this.bonusType) &&
            (this.preGeneratedTypes[3][0] == this.bonusType || this.preGeneratedTypes[3][1] == this.bonusType || this.preGeneratedTypes[3][2] == this.bonusType)){
                this.reelEffect[4].visible = true
                Functions.loadSpineAnimation(this.reelEffect[4],'animation',true,1)
                this.playSound(11)
            }
        }
        if(index == 4  && !this.isFreeSpin){
            this.reelEffect[4].visible = false
        }

        if(this.isFreeSpin && index == 0){
            this.reelEffect[2].visible = true
            this.isBonusTick = true
        }

        if(index == 4  && this.isFreeSpin){
            this.reelEffect[2].visible = false
        }
    }
    public generateNewSymbols(i:number){
        this.reelContainer[i].removeChildren()
        this.preGeneratedTypes[i].forEach((data:any,index:number)=>{
            let symbolIndex = data
            let type = json.symbolAssets[symbolIndex-1].type
            let payout = json.symbolAssets[symbolIndex-1].pay
            let symbol = new Spine(this.textureArray[`${json.symbolAssets[symbolIndex-1].symbol}`].spineData)
            symbol.y = index * this.blockSpacing
            let el ={
                type:type,
                symbol:symbol,
                payout:payout
            }
            data = el
            this.reelsSymbols[i][index].type = data.type
            this.reelsSymbols[i][index].symbol = data.symbol
            this.reelsSymbols[i][index].payout = data.payout
            this.reelsSymbols[i][index].symbol.skeleton.setSkinByName('no_blur')
            this.reelContainer[i].addChild(data.symbol)
            symbol.width = this.blockWidth
            symbol.height = this.blockHeight
        })
    }
    public generateNewSymbolsMainEvent(i:number){
        let arr:Array<any> = new Array(30).fill(null)
        this.reelContainer[i].removeChildren()
        let jsonType:any;
        if(this.whatEvent == 1){
            jsonType = json.symbolAssetsEvent2
        }
        else{
            jsonType = json.symbolAssetsEvent
        }
        
        arr.forEach((data,index)=>{
            let reelValue = this.reelsValuesMoneySlot[i]
            let symbolIndex = reelValue[Math.floor(Math.random() * reelValue.length)]
            let type = jsonType[symbolIndex-1].type
            let payout = jsonType[symbolIndex-1].pay
            let symbol = new Spine(this.textureArray[`${jsonType[symbolIndex-1].symbol}`].spineData)
            symbol.y = index * this.blockSpacing
            let el ={
                type:type,
                symbol:symbol,
                payout:payout
            }
            data = el
            this.reelsSymbols[i][index].type = data.type
            this.reelsSymbols[i][index].symbol = data.symbol
            this.reelsSymbols[i][index].payout = data.payout
            this.reelsSymbols[i][index].symbol.skeleton.setSkinByName('no_blur')
            this.reelContainer[i].addChild(data.symbol)
            symbol.width = this.blockWidth
            symbol.height = this.blockHeight
        })
    }
    private generateNewSymbolsEvent(i:number){
        let arr:Array<any> = new Array(30).fill(null)
        this.reelContainer[i].removeChildren()
        arr.forEach((data,index)=>{
            let reelValue = this.reelsValues[i]
            let symbolIndex = reelValue[Math.floor(Math.random() * reelValue.length)]
            
            let newSymbol1 = [9,0,4,2,3]
            let newSymbol2 = [1,9,6,1,4]
            let newSymbol3 = [4,3,9,2,2]
            let type:any;
            let payout:any;
            let symbol:any;
           
            if(index==0){
               
                type = json.symbolAssets[newSymbol1[this.symbolCount]].type
                payout = json.symbolAssets[newSymbol1[this.symbolCount]].pay
                symbol = new Spine(this.textureArray[`${json.symbolAssets[newSymbol1[this.symbolCount]].symbol}`].spineData)
                this.symbolCount++     
            }
            else if(index ==1){
                type = json.symbolAssets[newSymbol2[this.symbolCount2]].type
                payout = json.symbolAssets[newSymbol2[this.symbolCount2]].pay
                symbol = new Spine(this.textureArray[`${json.symbolAssets[newSymbol2[this.symbolCount2]].symbol}`].spineData)
                this.symbolCount2++ 
            }
            else if(index ==2){
                type = json.symbolAssets[newSymbol3[this.symbolCount3]].type
                payout = json.symbolAssets[newSymbol3[this.symbolCount3]].pay
                symbol = new Spine(this.textureArray[`${json.symbolAssets[newSymbol3[this.symbolCount3]].symbol}`].spineData)
                this.symbolCount3++ 
            }
            else{
                 type = json.symbolAssets[symbolIndex-1].type
                 payout = json.symbolAssets[symbolIndex-1].pay
                 symbol = new Spine(this.textureArray[`${json.symbolAssets[symbolIndex-1].symbol}`].spineData)
            }
            
            // let type = json.symbolAssets[symbolIndex-1].type
            // let payout = json.symbolAssets[symbolIndex-1].pay
            // let symbol = new Spine(this.textureArray[`${json.symbolAssets[symbolIndex-1].symbol}`].spineData)
           
            symbol.y = index * this.blockSpacing
            let el ={
                type:type,
                symbol:symbol,
                payout:payout
            }
            data = el
            this.reelsSymbols[i][index].type = data.type
            this.reelsSymbols[i][index].symbol = data.symbol
            this.reelsSymbols[i][index].payout = data.payout
            this.reelsSymbols[i][index].symbol.skeleton.setSkinByName('no_blur')
            this.reelContainer[i].addChild(data.symbol)
            symbol.width = this.blockWidth
            symbol.height = this.blockHeight
        })
    }
    private updateVisibleBlocks(index:number){
        let firstPosY = 6966
        let secondPosY = 7224
        let thirdPosY = 7482
        let topThree = this.reelsSymbols[index].filter((data:any,index:number)=> index < 3)
        this.reelsSymbols[index].forEach((data:any,i:number)=>{
            // hide the top symbols
            if(i > 2){
                data.symbol.alpha = 0
            }
            // show the visible symbols
            if(i == 27){
                data.type = topThree[0].type
                data.symbol = topThree[0].symbol
                data.payout = topThree[0].payout
                this.reelContainer[index].children[27] = data.symbol
                this.reelContainer[index].children[27].y = firstPosY
            }
            if(i == 28){
                data.type = topThree[1].type
                data.symbol = topThree[1].symbol
                data.payout = topThree[1].payout
                this.reelContainer[index].children[28] = data.symbol
                this.reelContainer[index].children[28].y = secondPosY
            }
            if(i == 29){
                data.type = topThree[2].type
                data.symbol = topThree[2].symbol
                data.payout = topThree[2].payout
                this.reelContainer[index].children[29] = data.symbol
                this.reelContainer[index].children[29].y = thirdPosY
            }
            data.symbol.width = this.blockWidth
            data.symbol.height = this.blockHeight
        })
    }
    private createReel(index:number){
        let arr:Array<any> = []
        let reelValue = this.reelsValues[index]
        for(let i = 0;i<reelValue.length;i++){
            const index = reelValue[Math.floor(Math.random() * reelValue.length)]
            const value = json.symbolAssets[index-1].symbol
            const type = json.symbolAssets[index-1].type
            const payout = json.symbolAssets[index-1].pay
            const symbol = new Spine(this.textureArray[`${value}`].spineData)
            symbol.skeleton.setSkinByName('no_blur')
            let data = {
                type:type,
                symbol:symbol,
                payout:payout
            }
            arr.push(data)
        }
        return arr
    }
    private createWildCoin(coinX:number,coinY:number){
        let barPosX = this.levelBarIndicator.x + this.levelBarIndicator.width
        let barPosY = this.levelBarIndicator.y
        let duration = 1
        for(let i = 0;i<=3;i++){
            const coin = Functions.animatedSprite(this.textureArray['coins'],'new_coin_spinning')
            coin.x = (coinX)
            coin.y = (coinY * 0.75)
            coin.alpha = 0.4
            coin.scale.set(0.15)
            coin.animationSpeed = 0.5
            coin.play();
            let coinAnimation = gsap.to(coin,{
                y:barPosY,
                x:barPosX - (coin.width/2),
                alpha:1,
                delay:i*0.1,
                duration:duration,
                onComplete:()=>{
                    coinAnimation.kill()
                    if(i == 0){
                        this.playSound(19)
                        this.soundVolume(19,0.2)
                    }
                    let coinFade = gsap.to(coin,{
                        delay:0.5,
                        duration:0.3,
                        alpha:0,
                        onComplete:()=>{
                            coinFade.kill()
                            this.container.removeChild(coin)
                        }
                    })
                }
            })
            this.container.addChild(coin)
        }
    }
}