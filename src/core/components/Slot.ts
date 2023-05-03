import * as PIXI from 'pixi.js';
import Functions from '../settings/Functions';
import json from '../settings/settings.json'
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";

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
    private reelPosX:Array<number> = [230,529,827,1125,1423]
    private maskPosX:Array<number> = [220,520,820,1118,1415]
    private maskPosY:number = 130
    private reelContainer:Array<any> = []
    private reelsSymbols:Array<any> = []
    private spinCount:number= 0
    private isSpinning:boolean = false
    private notLongPress:boolean = true
    private delta = 1500;
    private levelBarContainer:PIXI.Container
    private levelBarIndicator:PIXI.Sprite
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
    constructor(app:PIXI.Application,textureArray:any){
        this.app = app
        this.baseWidth = this.app.screen.width
        this.baseHeight = this.app.screen.height
        this.textureArray = textureArray
        this.container = new PIXI.Container
        this.levelBarContainer = new PIXI.Container
        this.init()
    }
    private init(){
        this.createParent()
        this.createLevelBar()
        this.createReels()

        // triggers space click
        // window.document.addEventListener('keydown', (e)=> {
        //     if(e.code === 'Space'  || e.key === 'Enter'){
        //         if(!this.isSpinning){
        //             if(this.notLongPress === true) {
        //                 this.notLongPress = false;
        //                 this.startSpin('normal')
        //             }else{
        //                 this.startSpin('turbo')
        //             }
        //         }
        //     }
        // });
        
        window.document.addEventListener('keyup', ()=> {
            this.notLongPress = true;
        });

        window.document.addEventListener('keydown', (e)=> {
            this.keyHandler(e)
        })
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
    private createLevelBar(){
        //create level bar background
        const levelBarBg = Functions.loadTexture(this.textureArray,'main','bar_bg')
        levelBarBg.x = (this.frameBorder.width - levelBarBg.width)+50
        levelBarBg.y = this.frameBorder.y * 0.7
        this.levelBarContainer.addChild(levelBarBg)
        //create indicator
        this.levelBarIndicator = Functions.loadTexture(this.textureArray,'main','bar_energy')
        // this.levelBarIndicator.width = 0
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

        // let width = 0
        // let levelBarBgInterval = setInterval(()=>{
        //     width = width+10
        //     if(width < 742){
        //         this.levelBarIndicator.width = width
        //     }else{
        //         width = 0 
        //         this.levelBarIndicator.width = 0
        //     }
        // },1000) 

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
            data.y = (this.frameBg.height + this.frameBg.y) - data.height
            this.container.addChild(data)

            const maskSprite = Functions.loadTexture(this.textureArray,'main','mask') 
            maskSprite.x = this.maskPosX[index]
            maskSprite.y = this.maskPosY
            
            this.container.addChild(maskSprite)
            data.mask = maskSprite
        })
    }
    public startSpin(spinType:string){
        let dY = this.frameBg.y
        let bounceOffset = -7230
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
                delay = 0
            break;
            case 'turbo':
                durationBounceUp = 0.2
                duration = 0.1
                delay = 0
            break;
            default:
                durationBounceUp = 0.4
                duration = 1
                delay = 0
            break
        }

        this.reelContainer.forEach((data,index)=>{
            let bounceStart = gsap.to(data, {
                delay:index*delay,
                duration:durationBounceUp,
                y:bounceOffset,
                onStart:()=>{
                    this.isSpinning = true
                },
                onComplete:()=>{
                    bounceStart.kill()
                    let spin = gsap.to(data, {
                        duration: duration,
                        y: dY+40,
                        ease: "bounce.in",
                        onStart:()=>{
                            this.isSpinning = true
                            this.applyMotionBlur(index,true)
                        },
                        onComplete:()=>{
                            spin.kill()
                            this.updateVisibleBlocks(index)
                            let bounceStop = gsap.to(data,{
                                y: dY,
                                duration:0.3,
                                ease: "power1.out",
                                onComplete:()=>{
                                    bounceStop.kill()
                                    this.spinCount++
                                    data.y = (this.frameBg.height + this.frameBg.y) - data.height
                                    if(this.spinCount == 5){
                                        this.spinCount = 0
                                        this.generateNewSymbols()
                                        this.isSpinning = false
                                        this.checkPattern()
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

        json.pattern.forEach((data,index)=>{
            //pattern 1
            if(index == 0){
                this.containPattern(data,pattern1)
            }
            //pattern 2
            else if(index == 1){
                this.containPattern(data,pattern2)
            }
            //pattern 3
            else if(index == 2){
                this.containPattern(data,pattern3)
            }
            //pattern 4
            else if(index == 3){
                this.containPattern(data,pattern4)
            }
            //pattern 5
            else if(index == 4){
                this.containPattern(data,pattern5)
            }
            //pattern 6
            else if(index == 5){
                this.containPattern(data,pattern6)
            }
            //pattern 7
            else if(index == 6){
                this.containPattern(data,pattern7)
            }
            //pattern 8
            else if(index == 7){
                this.containPattern(data,pattern8)
            }
            //pattern 9
            else if(index == 8){
                this.containPattern(data,pattern9)
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
            if(data>2){
                if(index == 0){
                    for(let i=0;i<data;i++){
                        console.log(pattern1[i].type,pattern1)
                    }
                }else if(index == 1){
                    for(let i=0;i<data;i++){
                        console.log(pattern2[i].type,pattern2)
                    }
                }else if(index == 2){
                    for(let i=0;i<data;i++){
                        console.log(pattern3[i].type,pattern3)
                    }
                }else if(index == 3){
                    for(let i=0;i<data;i++){
                        console.log(pattern4[i].type,pattern4)
                    }
                }else if(index == 4){
                    for(let i=0;i<data;i++){
                        console.log(pattern5[i].type,pattern5)
                    }
                }else if(index == 5){
                    for(let i=0;i<data;i++){
                        console.log(pattern6[i].type,pattern6)
                    }
                }else if(index == 6){
                    for(let i=0;i<data;i++){
                        console.log(pattern7[i].type,pattern7)
                    }
                }else if(index == 7){
                    for(let i=0;i<data;i++){
                        console.log(pattern8[i].type,pattern8)
                    }
                }else if(index == 9){
                    for(let i=0;i<data;i++){
                        console.log(pattern9[i].type,pattern9)
                    }
                }
            }
        })
    }
    private containPattern(data:Array<number>,arr:Array<any>){
        data.forEach((data,index)=>{
            arr.push(this.reelsSymbols[index][data])
        })
    }
    private applyMotionBlur(index:number,onSpin:boolean){
        this.reelsSymbols[index].forEach((data:any,index:number)=>{
            const findIndex = json.symbolAssets.findIndex(object => {return object.type === data.type;});
            const blurSymbol = onSpin ? json.symbolAssets[findIndex].symbol+'_blur' : json.symbolAssets[findIndex].symbol
            data.symbol.texture = Functions.loadTexture(this.textureArray,'slot', `${blurSymbol}`).texture
        })
    }
    private generateNewSymbols(){
        this.reelContainer.forEach((data,indexUpper)=>{
            this.reelsSymbols[indexUpper].forEach((data:any,index:number)=>{
                if(index < 27){
                    let reelValue = this.reelsValues[indexUpper]
                    let symbolIndex = reelValue[Math.floor(Math.random() * reelValue.length)]
                    data.type = json.symbolAssets[symbolIndex-1].type
                    data.symbol.texture = Functions.loadTexture(this.textureArray,'slot', `${json.symbolAssets[symbolIndex-1].symbol}`).texture
                }
            })
        })
    }
    private updateVisibleBlocks(index:number){
        this.applyMotionBlur(index,false)
        let topThree = this.reelsSymbols[index].filter((data:any,index:number)=> index < 3)
        this.reelsSymbols[index].forEach((data:any,index:number)=>{
            if(index == 27){
                data.type = topThree[0].type
                data.symbol.texture = topThree[0].symbol.texture
            }
            if(index == 28){
                data.type = topThree[1].type
                data.symbol.texture = topThree[1].symbol.texture
            }
            if(index == 29){
                data.type = topThree[2].type
                data.symbol.texture = topThree[2].symbol.texture
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
            const symbol = Functions.loadTexture(this.textureArray,'slot', `${value}`)
            let data = {
                type:type,
                symbol:symbol
            }
            arr.push(data)
        }
        return arr
    }
}