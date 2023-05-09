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
    private frameBorder:PIXI.Sprite
    private reelPosX:Array<number> = [385.5,678.5,976.5,1271,1568.5]
    private maskPosX:Array<number> = [220,520,820,1118,1415]
    private maskPosY:number = 130
    public reelContainer:Array<any> = []
    private reelsSymbols:Array<any> = []
    private spinCount:number= 0
    public isSpinning:boolean = false
    private notLongPress:boolean = true
    public levelBarContainer:PIXI.Container
    private levelBarIndicator:PIXI.Sprite
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
        [3,3,3,3,3,3,3,3,3,3,3,3,3,3,7,6,6,6,6,6,6,6,6,9,9,9,9,9,9,9],
        // [1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,2,2,3,3,4,4,4,5,7,7,6,5,4,2],
        // [1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,2,2,3,3,4,4,4,5,7,7,6,5,4,2],
        // [1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,2,2,3,3,4,4,4,5,7,7,6,5,4,2],
        // [1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,2,2,3,3,4,4,4,5,7,7,6,5,4,2],
        // [1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,2,2,3,3,4,4,4,5,7,7,6,5,4,2]
    ]
    private reelY:number = -6941.2
    private timeScale:number = 0
    public autoPlayCount:number = 0
    // methods 
    private updateCreditValues:()=>void
    private onSpinEnd:()=>void
    constructor(app:PIXI.Application,textureArray:any,updateCreditValues:()=>void,onSpinEnd:()=>void){
        this.app = app
        this.baseWidth = this.app.screen.width
        this.baseHeight = this.app.screen.height
        this.textureArray = textureArray
        this.container = new PIXI.Container
        this.levelBarContainer = new PIXI.Container
        this.updateCreditValues = updateCreditValues
        this.onSpinEnd = onSpinEnd
        // this.betAmount = parseFloat(betAmount)
        this.init()
    }
    private init(){
        this.createParent()
        this.createLevelBar()
        this.createReels()
        // triggers space click
        window.document.addEventListener('keydown', (e)=> {
            if(e.code === 'Space'  || e.key === 'Enter'){
                if(!this.isSpinning){
                    this.timeScale = 0 
                    if(this.notLongPress === true) {
                        this.notLongPress = false;
                        this.startSpin('normal')
                    }else{
                        this.startSpin('turbo')  
                    }
                }else{
                    this.timeScale = 10
                }
            }
        });
        
        window.document.addEventListener('keyup', ()=> {
            this.notLongPress = true;
        });
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
        // this.levelBarIndicator.width = 
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
                                    if(this.spinCount == 5){
                                        this.checkPattern()
                                        this.spinCount = 0
                                        this.isSpinning = false
                                        if(this.autoPlayCount > 1){
                                            this.autoPlayCount--
                                            this.startSpin(spinType)
                                        }
                                        // set the credit base 
                                        // this.credit = this.credit - this.betAmount
                                        this.onSpinEnd()
                                    }
                                }
                            })
                        }
                    });
                }
            })
            bounceContainerArr.push(bounceStart)
        })
    }
    private checkPattern(){
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
        
        //pattern booleans
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
                for(let i=0;i<data.count;i++){
                    //add animation
                    console.log(data.blocks[i],'pattern 1')
                    this.animatePatterns(i,data.blocks[i])
                }
            }else if(index == 1 && data.count>2){
                for(let i=0;i<data.count;i++){
                    //add animation
                    console.log(data.blocks[i],'pattern 2')
                    this.animatePatterns(i,data.blocks[i])
                }
            }else if(index == 2 && data.count>2){
                for(let i=0;i<data.count;i++){
                    //add animation
                    console.log(data.blocks[i],'pattern 3')
                    this.animatePatterns(i,data.blocks[i])
                }
            }else if(index == 3 && data.count>2){
                for(let i=0;i<data.count;i++){
                    //add animation
                    console.log(data.blocks[i],'pattern 4')
                    this.animatePatterns(i,data.blocks[i])
                }
            }else if(index == 4 && data.count>2){
                for(let i=0;i<data.count;i++){
                    //add animation
                    console.log(data.blocks[i],'pattern 5')
                    this.animatePatterns(i,data.blocks[i])
                }
            }else if(index == 5 && data.count>2){
                for(let i=0;i<data.count;i++){
                    //add animation
                    console.log(data.blocks[i],'pattern 6')
                    this.animatePatterns(i,data.blocks[i])
                }
            }else if(index == 6 && data.count>2){
                for(let i=0;i<data.count;i++){
                    //add animation
                    console.log(data.blocks[i],'pattern 7')
                    this.animatePatterns(i,data.blocks[i])
                }
            }else if(index == 7 && data.count>2){
                for(let i=0;i<data.count;i++){
                    //add animation
                    console.log(data.blocks[i],'pattern 8')
                    this.animatePatterns(i,data.blocks[i])
                }
            }else if(index == 8 && data.count>2){
                for(let i=0;i<data.count;i++){
                    //add animation
                    console.log(data.blocks[i],'pattern 9')
                    this.animatePatterns(i,data.blocks[i])
                }
            }
        })
    }
    private containPattern(blocks:Array<number>,arr:Array<any>){
        blocks.forEach((blockNo,index)=>{
            arr.push({pattern:this.reelsSymbols[index][blockNo],blockNo:blockNo})
        })
    }
    private animatePatterns(reelIndex:number,blockIndex:number){
        this.levelBarIndicator.width++ 
        if (this.reelsSymbols[reelIndex][blockIndex].symbol.state.hasAnimation('animation')) {
            // run block animation
            this.reelsSymbols[reelIndex][blockIndex].symbol.state.setAnimation(0, 'animation', true);
            // dont run too fast
            this.reelsSymbols[reelIndex][blockIndex].symbol.state.timeScale = 1;
            // update yourself
            this.reelsSymbols[reelIndex][blockIndex].symbol.autoUpdate = true;
        }
    }
    private applyMotionBlur(index:number,onSpin:boolean){
        this.reelsSymbols[index].forEach((data:any,index:number)=>{
            onSpin ? data.symbol.skeleton.setSkinByName('blur') : data.symbol.skeleton.setSkinByName('no_blur')
        })
    }
    private generateNewSymbols(i:number){
        let arr:Array<any> = new Array(30).fill(null)
        this.reelContainer[i].removeChildren()
        arr.forEach((data,index)=>{
            let reelValue = this.reelsValues[i]
            let symbolIndex = reelValue[Math.floor(Math.random() * reelValue.length)]
            let type = json.symbolAssets[symbolIndex-1].type
            let symbol = new Spine(this.textureArray[`${json.symbolAssets[symbolIndex-1].symbol}`].spineData)
            symbol.y = index * 270
            symbol.scale.set(0.9)
            let el ={
                type:type,
                symbol:symbol
            }
            data = el
            this.reelsSymbols[i][index].type = data.type
            this.reelsSymbols[i][index].symbol = data.symbol
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
                this.reelContainer[index].children[27] = data.symbol
                this.reelContainer[index].children[27].y = 7290
            }
            if(i == 28){
                data.type = topThree[1].type
                data.symbol = topThree[1].symbol
                this.reelContainer[index].children[28] = data.symbol
                this.reelContainer[index].children[28].y = 7560
            }
            if(i == 29){
                data.type = topThree[2].type
                data.symbol = topThree[2].symbol
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
            const symbol = new Spine(this.textureArray[`${value}`].spineData)
            symbol.skeleton.setSkinByName('no_blur')
            let data = {
                type:type,
                symbol:symbol
            }
            arr.push(data)
        }
        return arr
    }
}