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
    private frameBg:PIXI.Sprite
    private frameBorder:PIXI.Sprite
    private reelPosX:Array<number> = [385.5,678.5,976.5,1271,1568.5]
    private maskPosX:Array<number> = [220,520,820,1118,1415]
    private maskPosY:number = 130
    private reelContainer:Array<any> = []
    private reelsSymbols:Array<any> = []
    private spinCount:number= 0
    private isSpinning:boolean = false
    private notLongPress:boolean = true
    private delta = 1500;
    private reelsValues:Array<Array<number>> = [
        [3,4,3,2,1,1,2,3,7,8,4,3,2,9,3,2,1,3,5,9,2,6,8,6,9,3,9,7,1,7],
        [2,8,3,3,6,7,3,8,9,1,4,2,3,4,4,7,5,3,5,9,2,6,8,6,9,3,9,7,1,7],
        [1,2,9,3,2,2,3,9,8,2,2,3,4,4,2,3,5,9,5,9,2,6,8,6,9,3,9,7,1,7],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,9,2,6,8,6,9,3,9,7,1,7],
        [2,5,9,2,4,6,5,4,2,9,8,5,3,3,8,2,4,5,3,5,8,9,1,6,6,4,3,7,3,2]
        // [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,9,2,6,8,6,9,3,9,7,1,7],
        // [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,9,2,6,8,6,9,3,9,7,1,7],
        // [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,9,2,6,8,6,9,3,9,7,1,7],
        // [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,9,2,6,8,6,9,3,9,7,1,7],
        // [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,9,2,6,8,6,9,3,9,7,1,7]
    ]
    private lastKeypressTime:any = 0;
    private reelY:number = -6941.2
    constructor(app:PIXI.Application,textureArray:any){
        this.app = app
        this.baseWidth = this.app.screen.width
        this.baseHeight = this.app.screen.height
        this.textureArray = textureArray
        this.container = new PIXI.Container
        this.init()
    }
    private init(){
        this.createParent()
        this.createReels()

        // triggers space click
        window.document.addEventListener('keydown', (e)=> {
            if(e.code === 'Space'  || e.key === 'Enter'){
                if(!this.isSpinning){
                    if(this.notLongPress === true) {
                        this.notLongPress = false;
                        this.startSpin('normal')
                    }else{
                        this.startSpin('turbo')
                    }
                }
            }
        });
        
        window.document.addEventListener('keyup', ()=> {
            this.notLongPress = true;
        });

        // window.document.addEventListener('keydown', (e)=> {
        //     this.keyHandler(e)
        // })
    }
    private keyHandler(e:any){
        if(e.code === 'Space'  || e.key === 'Enter'){
            var thisKeypressTime:any = new Date();
            if(this.notLongPress === true) {
                this.notLongPress = false;
                if (thisKeypressTime - this.lastKeypressTime <= this.delta )
                {
                    // double click
                    this.startSpin('')
                    thisKeypressTime = 0;
                }else{
                    // single click
                    if(!this.isSpinning)
                        this.startSpin('normal')
                }
            }else{
                // long press
                if(!this.isSpinning)
                    this.startSpin('turbo')
            }
            this.lastKeypressTime = thisKeypressTime;
        }
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
        let dY = 355.5
        let bounceOffset = -7000
        let durationBounceUp:number;
        let duration:number;
        let delay:number;
        switch(spinType){
            case 'normal':
                durationBounceUp = 0.4
                duration = 1
                delay = 0.3
            break;
            case 'quick':
                durationBounceUp = 0.2
                duration = 0.5
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
                delay = 0.1
            break
        }

        this.reelContainer.forEach((data,index)=>{
            this.isSpinning = true
            let bounceStart = gsap.to(data, {
                delay:index*delay,
                duration:durationBounceUp,
                y:bounceOffset,
                onComplete:()=>{
                    bounceStart.kill()
                    let spin = gsap.to(data, {
                        duration: duration,
                        y: dY+40,
                        ease: "bounce.in",
                        onStart:()=>{
                            // this.applyMotionBlur(index,true)
                            // this.generateNewSymbols()
                        },
                        onComplete:()=>{
                            spin.kill()
                            this.generateNewSymbols(index)
                            // this.updateVisibleBlocks(index)
                            let bounceStop = gsap.to(data,{
                                y: dY,
                                duration:0.3,
                                ease: "power1.out",
                                onComplete:()=>{
                                    bounceStop.kill()
                                    this.spinCount++
                                    data.y = this.reelY
                                    if(this.spinCount == 5){
                                        this.checkPattern()
                                        this.spinCount = 0
                                        this.isSpinning = false
                                    }
                                }
                            })
                        }
                    });
                }
            })
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
            if(index == 0 && data>2){
                for(let i=0;i<data;i++){
                    //add animation
                }
            }else if(index == 1 && data>2){
                for(let i=0;i<data;i++){
                    //add animation
                }
            }else if(index == 2 && data>2){
                for(let i=0;i<data;i++){
                    //add animation
                }
            }else if(index == 3 && data>2){
                for(let i=0;i<data;i++){
                    //add animation
                }
            }else if(index == 4 && data>2){
                for(let i=0;i<data;i++){
                    //add animation
                }
            }else if(index == 5 && data>2){
                for(let i=0;i<data;i++){
                    //add animation
                }
            }else if(index == 6 && data>2){
                for(let i=0;i<data;i++){
                    //add animation
                }
            }else if(index == 7 && data>2){
                for(let i=0;i<data;i++){
                }
            }else if(index == 9 && data>2){
                for(let i=0;i<data;i++){
                    //add animation
                }
            }
        })
    }
    private containPattern(blocks:Array<number>,arr:Array<any>){
        blocks.forEach((blockNo,index)=>{
            arr.push(this.reelsSymbols[index][blockNo])
        })
    }
    private applyMotionBlur(index:number,onSpin:boolean){
        this.reelsSymbols[index].forEach((data:any,index:number)=>{
            const findIndex = json.symbolAssets.findIndex(object => {return object.type === data.type;});
            const blurSymbol = onSpin ? json.symbolAssets[findIndex].symbol+'_blur' : json.symbolAssets[findIndex].symbol
            data.symbol.texture = Functions.loadTexture(this.textureArray,'slot', `${blurSymbol}`).texture
        })
    }
    private generateNewSymbols(i:number){
        this.reelContainer[i].removeChildren()
        this.reelsSymbols[i].forEach((data:any,index:number)=>{

            // if(index < 27){
            //     let reelValue = this.reelsValues[i]
            //     let symbolIndex = reelValue[Math.floor(Math.random() * reelValue.length)]
            //     data.type = json.symbolAssets[symbolIndex-1].type
            //     const symbol = new Spine(this.textureArray[`${json.symbolAssets[symbolIndex-1].symbol}`].spineData)
            //     symbol.y = index * 270
            //     symbol.scale.set(0.9)
            //     this.reelContainer[i].addChild(symbol)
            // }
            
            let reelValue = this.reelsValues[i]
            let symbolIndex = reelValue[Math.floor(Math.random() * reelValue.length)]
            data.type = json.symbolAssets[symbolIndex-1].type
            let symbol = new Spine(this.textureArray[`${json.symbolAssets[symbolIndex-1].symbol}`].spineData)
            let test:any;
            if(index == 0){
                test = symbol
            }
            if(index == 27){
                symbol = test
            }
            symbol.y = index * 270
            symbol.scale.set(0.9)
            this.reelContainer[i].addChild(symbol)
        })
        console.log(this.reelsSymbols[0])
    }
    private updateVisibleBlocks(index:number){
        // this.applyMotionBlur(index,false)
        let topThree = this.reelsSymbols[index].filter((data:any,index:number)=> index < 3)
        this.reelsSymbols[index].forEach((data:any,index:number)=>{
            // const symbol = new Spine(this.textureArray[`${json.symbolAssets[symbolIndex-1].symbol}`].spineData)
            // symbol.y = index * 270
            // symbol.scale.set(0.9)
            // this.reelContainer[i].addChild(symbol)
            if(index == 27){
                data.type = topThree[0].spinType
                // data.symbol.texture = topThree[0].symbol.texture
            }
            if(index == 28){
                data.type = topThree[1].type
                // data.symbol.texture = topThree[1].symbol.texture
            }
            if(index == 29){
                data.type = topThree[2].type
                // data.symbol.texture = topThree[2].symbol.texture
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
            // const symbol = Functions.loadTexture(this.textureArray,'slot', `${value}`)
            const symbol = new Spine(this.textureArray[`${value}`].spineData)
            let data = {
                type:type,
                symbol:symbol
            }
            arr.push(data)
        }
        return arr
    }
}