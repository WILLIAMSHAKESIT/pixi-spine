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
    //sprites
    public frameBg:PIXI.Sprite
    public frameBorder:PIXI.Sprite
    private reelPosX:Array<number> = [385.5,678.5,976.5,1271,1568.5]
    private maskPosX:Array<number> = [220,520,820,1118,1415]
    private maskPosY:number = 130
    public reelContainer:Array<any> = []
    private reelsSymbols:Array<any> = []
    private spinCount:number= 0
    public isSpinning:boolean = false
    public notLongPress:boolean = true
    public levelBarContainer:PIXI.Container
    public levelBarIndicator:PIXI.Sprite
    private reelsValues:Array<Array<number>> = [
        // [3,4,3,2,1,1,2,3,7,8,4,3,2,9,3,2,1,3,5,9,2,6,8,6,9,3,9,7,1,7],
        // [2,8,3,3,6,7,3,8,9,1,4,2,3,4,4,7,5,3,5,9,2,6,8,6,9,3,9,7,1,7],
        // [1,2,9,3,2,2,3,9,8,2,2,3,4,4,2,3,5,9,5,9,2,6,8,6,9,3,9,7,1,7],
        // [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,9,2,6,8,6,9,3,9,7,1,7],
        // [2,5,9,2,4,6,5,4,2,9,8,5,3,3,8,2,4,5,3,5,8,9,1,6,6,4,3,7,3,2]
        // [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
        // [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
        // [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
        // [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
        // [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3]
        [3,3,3,3,3,3,3,3,3,3,3,3,3,3,7,6,6,6,6,6,6,6,6,9,9,9,9,9,9,9],
        [3,3,3,3,3,3,3,3,3,3,3,3,3,3,7,6,6,6,6,6,6,6,6,9,9,9,9,9,9,9],
        [3,3,3,3,3,3,3,3,3,3,3,3,3,3,7,6,6,6,6,6,6,6,6,9,9,9,9,9,9,9],
        [3,3,3,3,3,3,3,3,3,3,3,3,3,3,7,6,6,6,6,6,6,6,6,9,9,9,9,9,9,9],
        [3,3,3,3,3,3,3,3,3,3,3,3,3,3,7,6,6,6,6,6,6,6,6,9,9,9,9,9,9,9]
        // [1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,2,2,3,3,4,4,4,5,7,7,6,5,4,2],
        // [1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,2,2,3,3,4,4,4,5,7,7,6,5,4,2],
        // [1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,2,2,3,3,4,4,4,5,7,7,6,5,4,2],
        // [1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,2,2,3,3,4,4,4,5,7,7,6,5,4,2],
        // [1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,2,2,3,3,4,4,4,5,7,7,6,5,4,2]
    ]
    private reelY:number = -6941.2
    public timeScale:number = 0
    public autoPlayCount:number = 0
    // methods 
    private updateCreditValues:()=>void
    private matchingGame:()=>void
    private onSpin:()=>void
    private onSpinEnd:()=>void
    private levelBarWidth:number = 742
    // payout
    public totalWin:number = 0
    // payline animation
    public paylines:Array<any> = []
    //checkIfanimationDone
    private animateDone:boolean = true;
    
    //grass
    private slideshowTicker: Boolean = true;
    private play: Boolean = true;
    private grass: Array<any> = [];
    private grassSprites: Array<PIXI.Sprite> = [];
    private protection: number = 0;
    constructor(app:PIXI.Application,textureArray:any,updateCreditValues:()=>void,onSpinEnd:()=>void,matchingGame:()=>void,onSpin:()=>void){
        this.app = app
        this.baseWidth = this.app.screen.width
        this.baseHeight = this.app.screen.height
        this.textureArray = textureArray
        this.container = new PIXI.Container
        this.levelBarContainer = new PIXI.Container
        this.updateCreditValues = updateCreditValues
        this.onSpinEnd = onSpinEnd
        this.matchingGame = matchingGame
        this.onSpin = onSpin
        this.init()
    }
    private init(){
        this.createParent()
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
        const miniPrize = new PIXI.Text(`${json.jackpots.mini}`, style);
        miniPrize.x = (itemMini.width - miniPrize.width)/2;
        miniPrize.y = 40;
        itemMini.addChild(miniPrize)
        //create major text
        const majorPrize = new PIXI.Text(`${json.jackpots.major}`, style);
        majorPrize.x = (itemMajor.width - majorPrize.width)/2;
        majorPrize.y = 53;
        itemMajor.addChild(majorPrize)
        //create grand text
        const grandPrize = new PIXI.Text(`${json.jackpots.grand}`, style);
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
                data.symbol.y = index * 270
                data.symbol.scale.set(0.9)
            })
            this.reelsSymbols.push(arr)
            this.reelContainer.push(container)
        }
        
        this.reelContainer.forEach((data,index)=>{
            data.x = this.reelPosX[index]
            data.y = this.reelY
            this.container.addChild(data)

            const maskSprite = Functions.loadTexture(this.textureArray,'main','mask') 
            maskSprite.x = this.maskPosX[index]
            maskSprite.y = this.maskPosY
            
            this.container.addChild(maskSprite)
            data.mask = maskSprite
        })
    }
    public startSpin(spinType:string){
        this.paylines = []
        let hiddenReelY = -5000
        let dY = 355.5
        let bounceOffset = -7000
        let durationBounceUp:number;
        let duration:number;
        let delay:number;
        let bounceContainerArr:Array<any> = []

        switch(spinType){
            case 'normal':
                durationBounceUp = 0.4
                duration = 1
                delay = 0.3
            break;
            case 'quick':
                durationBounceUp = 0.2
                duration = 0.3
                delay = 0.1
            break;
            case 'turbo':
                durationBounceUp = 0.2
                duration = 0.1
                delay = 0
            break;
            default:
                durationBounceUp = 0.4
                duration = 1
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
                },
                onComplete:()=>{
                    bounceStart.kill()
                    let spin = gsap.to(data, {
                        duration: duration,
                        y: dY+45,
                        ease: "bounce.in",
                        onStart:()=>{
                            this.applyMotionBlur(index,true)
                        },
                        onUpdate:()=>{
                            this.onSpin()
                            if(data.y > hiddenReelY){
                                this.reelContainer[index].children[27].y = 0
                                this.reelContainer[index].children[28].y = 270
                                this.reelContainer[index].children[29].y = 540
                            }
                            if(this.timeScale == 10 && spinType !== 'turbo'){
                                spin.timeScale(this.timeScale)
                                
                            }
                        },
                        onComplete:()=>{
                            spin.kill()
                            this.generateNewSymbols(index)
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
                                    this.reelContainWild(index)
                                    if(this.spinCount == 5){
                                        this.checkPattern()
                                        this.spinCount = 0
                                        this.isSpinning = false
                                        if(this.autoPlayCount > 1){
                                            this.autoPlayCount--
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
                                        // set the credit base 
                                        this.onSpinEnd()
                                    }
                                }
                            })
                        }
                    });
                }
            })
            bounceContainerArr.push(bounceStart)
            this.timeScale = 0
        })
    }
    private reelContainWild(index:number){
        this.reelsSymbols[index].forEach((data:any,index:number)=>{
            if(index > 26){
                if(data.type == 9){ 
                    this.levelBarIndicator.width++ 
                    // reset level bar and start matching game
                    if(this.levelBarIndicator.width == this.levelBarWidth){
                        this.createGrass()
                        this.animateGrass()

                        this.autoPlayCount = 0
                        this.levelBarIndicator.width = this.levelBarWidth

                        let transition = gsap.to(this.container, {
                            alpha: 0,
                            ease: "sine.in",
                            duration: 1.3,
                            onComplete: () => {
                               // this.app.stage.removeChild(this.homeComponent.container);
                                this.grassSprites.forEach((element, index) => {
                                    let delay = .005 * index;
                                    let gsapper = gsap.to(element, {
                                        delay: delay,
                                        duration: .05,
                                        alpha: 0,
                                        onStart: () => {
                                            if(index == 0){
                                                let transition2 = gsap.to(this.container, {
                                                    alpha: 1,
                                                    ease: "sine.out",
                                                    duration: 1.5,
                                                    onComplete: () => {
                                                        transition2.kill();

                                                    }
                                                });
                                            }
                                        },
                                        onComplete: () =>{
                                            this.app.stage.removeChild(element);
                                            if(index == this.grassSprites.length - 1){
                                                this.grass = [];
                                                this.grassSprites = [];
                                            }
                                            gsapper.kill();
                                        }
                                    });
                                });
                                transition.kill();
                                this.matchingGame()
                            }
                        });
                    }
                }
            }
        })
    }
    private checkPattern(){
        this.paylines = []
        let pattern1:Array<any> = []
        let pattern2:Array<any> = []
        let pattern3:Array<any> = []
        let pattern4:Array<any> = []
        let pattern5:Array<any> = []
        let pattern6:Array<any> = []
        let pattern7:Array<any> = []
        let pattern8:Array<any> = []
        let pattern9:Array<any> = []
        let countsArray:Array<any> = []

        json.pattern.forEach((blocks,index)=>{
            //pattern 1
            if(index == 0){
                this.containPattern(blocks,pattern1)
            }
            //pattern 2
            else if(index == 1){
                this.containPattern(blocks,pattern2)
            }
            //pattern 3
            else if(index == 2){
                this.containPattern(blocks,pattern3)
            }
            //pattern 4
            else if(index == 3){
                this.containPattern(blocks,pattern4)
            }
            //pattern 5
            else if(index == 4){
                this.containPattern(blocks,pattern5)
            }
            //pattern 6
            else if(index == 5){
                this.containPattern(blocks,pattern6)
            }
            //pattern 7
            else if(index == 6){
                this.containPattern(blocks,pattern7)
            }
            //pattern 8
            else if(index == 7){
                this.containPattern(blocks,pattern8)
            }
            //pattern 9
            else if(index == 8){
                this.containPattern(blocks,pattern9)
            }
        })
        
        //pattern count consecutive
        let isPattern1 = Functions.hasConsecutiveSameValues(pattern1)
        let isPattern2 = Functions.hasConsecutiveSameValues(pattern2)
        let isPattern3 = Functions.hasConsecutiveSameValues(pattern3)
        let isPattern4 = Functions.hasConsecutiveSameValues(pattern4)
        let isPattern5 = Functions.hasConsecutiveSameValues(pattern5)
        let isPattern6 = Functions.hasConsecutiveSameValues(pattern6)
        let isPattern7 = Functions.hasConsecutiveSameValues(pattern7)
        let isPattern8 = Functions.hasConsecutiveSameValues(pattern8)
        let isPattern9 = Functions.hasConsecutiveSameValues(pattern9)

        countsArray.push(isPattern1)
        countsArray.push(isPattern2)
        countsArray.push(isPattern3)
        countsArray.push(isPattern4)
        countsArray.push(isPattern5)
        countsArray.push(isPattern6)
        countsArray.push(isPattern7)
        countsArray.push(isPattern8)
        countsArray.push(isPattern9)
        
        countsArray.forEach((data,index)=>{
           
            if(index == 0 && data.count>2){
                let totalLinePay:number = 0
                let lineSymbols:Array<any> = []
                for(let i=0;i<data.count;i++){
                    //add animation
                    totalLinePay+=data.blocks[i].payout
                    lineSymbols.push(data.blocks[i].type)
                    this.animatePatterns(i,data.blocks[i].block)
                }
                this.paylines.push({payline:1,symbols:lineSymbols,payout:totalLinePay})
            }else if(index == 1 && data.count>2){
                let totalLinePay:number = 0
                let lineSymbols:Array<any> = []
                for(let i=0;i<data.count;i++){
                    //add animation
                    totalLinePay+=data.blocks[i].payout
                    lineSymbols.push(data.blocks[i].type)
                    this.animatePatterns(i,data.blocks[i].block)
                }
                this.paylines.push({payline:2,symbols:lineSymbols,payout:totalLinePay})
            }else if(index == 2 && data.count>2){
                let totalLinePay:number = 0
                let lineSymbols:Array<any> = []
                for(let i=0;i<data.count;i++){
                    //add animation
                    totalLinePay+=data.blocks[i].payout
                    lineSymbols.push(data.blocks[i].type)
                    this.animatePatterns(i,data.blocks[i].block)
                }
                this.paylines.push({payline:3,symbols:lineSymbols,payout:totalLinePay})
            }else if(index == 3 && data.count>2){
                let totalLinePay:number = 0
                let lineSymbols:Array<any> = []
                for(let i=0;i<data.count;i++){
                    //add animation
                    totalLinePay+=data.blocks[i].payout
                    lineSymbols.push(data.blocks[i].type)
                    this.animatePatterns(i,data.blocks[i].block)
                }
                this.paylines.push({payline:4,symbols:lineSymbols,payout:totalLinePay})
            }else if(index == 4 && data.count>2){
                let totalLinePay:number = 0
                let lineSymbols:Array<any> = []
                for(let i=0;i<data.count;i++){
                    //add animation
                    totalLinePay+=data.blocks[i].payout
                    lineSymbols.push(data.blocks[i].type)
                    this.animatePatterns(i,data.blocks[i].block)
                }
                this.paylines.push({payline:5,symbols:lineSymbols,payout:totalLinePay})
            }else if(index == 5 && data.count>2){
                let totalLinePay:number = 0
                let lineSymbols:Array<any> = []
                for(let i=0;i<data.count;i++){
                    //add animation
                    totalLinePay+=data.blocks[i].payout
                    lineSymbols.push(data.blocks[i].type)
                    this.animatePatterns(i,data.blocks[i].block)
                }
                this.paylines.push({payline:6,symbols:lineSymbols,payout:totalLinePay})
            }else if(index == 6 && data.count>2){
                let totalLinePay:number = 0
                let lineSymbols:Array<any> = []
                for(let i=0;i<data.count;i++){
                    //add animation
                    totalLinePay+=data.blocks[i].payout
                    lineSymbols.push(data.blocks[i].type)
                    this.animatePatterns(i,data.blocks[i].block)
                }
                this.paylines.push({payline:7,symbols:lineSymbols,payout:totalLinePay})
            }else if(index == 7 && data.count>2){
                let totalLinePay:number = 0
                let lineSymbols:Array<any> = []
                for(let i=0;i<data.count;i++){
                    //add animation
                    totalLinePay+=data.blocks[i].payout
                    lineSymbols.push(data.blocks[i].type)
                    this.animatePatterns(i,data.blocks[i].block)
                }
                this.paylines.push({payline:8,symbols:lineSymbols,payout:totalLinePay})
            }else if(index == 8 && data.count>2){
                let totalLinePay:number = 0
                let lineSymbols:Array<any> = []
                for(let i=0;i<data.count;i++){
                    //add animation
                    totalLinePay+=data.blocks[i].payout
                    lineSymbols.push(data.blocks[i].type)
                    this.animatePatterns(i,data.blocks[i].block)
                }
                this.paylines.push({payline:9,symbols:lineSymbols,payout:totalLinePay})
            }
        })
    }
    private containPattern(blocks:Array<number>,arr:Array<any>){
        blocks.forEach((blockNo,index)=>{
            arr.push({pattern:this.reelsSymbols[index][blockNo],blockNo:blockNo})
        })
    }
    private animatePatterns(reelIndex:number,blockIndex:number){
        // add total win
        this.totalWin += this.reelsSymbols[reelIndex][blockIndex].payout
        if (this.reelsSymbols[reelIndex][blockIndex].symbol.state.hasAnimation('animation')) {
            // run block animation
            this.reelsSymbols[reelIndex][blockIndex].symbol.state.setAnimation(0, 'animation', true);
            // dont run too fast
            this.reelsSymbols[reelIndex][blockIndex].symbol.state.timeScale = 1;
            // update yourself
            this.reelsSymbols[reelIndex][blockIndex].symbol.autoUpdate = true;

            this.animateDone = false
        }
    }
    private applyMotionBlur(index:number,onSpin:boolean){
        this.reelsSymbols[index].forEach((data:any,index:number)=>{
            data.symbol.skeleton.setSkinByName(onSpin?'blur':'no_blur')
        })
    }
    private generateNewSymbols(i:number){
        let arr:Array<any> = new Array(30).fill(null)
        this.reelContainer[i].removeChildren()
        arr.forEach((data,index)=>{
            let reelValue = this.reelsValues[i]
            let symbolIndex = reelValue[Math.floor(Math.random() * reelValue.length)]
            let type = json.symbolAssets[symbolIndex-1].type
            let payout = json.symbolAssets[symbolIndex-1].pay
            let symbol = new Spine(this.textureArray[`${json.symbolAssets[symbolIndex-1].symbol}`].spineData)
            symbol.y = index * 270
            symbol.scale.set(0.9)
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
        })
    }
    private updateVisibleBlocks(index:number){
        let topThree = this.reelsSymbols[index].filter((data:any,index:number)=> index < 3)
        this.reelsSymbols[index].forEach((data:any,i:number)=>{
            if(i == 27){
                data.type = topThree[0].type
                data.symbol = topThree[0].symbol
                data.payout = topThree[0].payout
                this.reelContainer[index].children[27] = data.symbol
                this.reelContainer[index].children[27].y = 7290
            }
            if(i == 28){
                data.type = topThree[1].type
                data.symbol = topThree[1].symbol
                data.payout = topThree[1].payout
                this.reelContainer[index].children[28] = data.symbol
                this.reelContainer[index].children[28].y = 7560
            }
            if(i == 29){
                data.type = topThree[2].type
                data.symbol = topThree[2].symbol
                data.payout = topThree[2].payout
                this.reelContainer[index].children[29] = data.symbol
                this.reelContainer[index].children[29].y = 7830
            }
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