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
    private lastKeypressTime:any = 0;
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
    private createReels(){
        let arr:Array<any> = []
        for(let i=0;i<json.reelsValues.length;i++){
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
                data.forEach((data,index)=>{
                    pattern1.push(this.reelsSymbols[index][data])
                })
            }
            //pattern 2
            else if(index == 1){
                data.forEach((data,index)=>{
                    pattern2.push(this.reelsSymbols[index][data])
                })
            }
            //pattern 3
            else if(index == 2){
                data.forEach((data,index)=>{
                    pattern3.push(this.reelsSymbols[index][data])
                })
            }
            //pattern 4
            else if(index == 3){
                data.forEach((data,index)=>{
                    pattern4.push(this.reelsSymbols[index][data])
                })
            }
            //pattern 5
            else if(index == 4){
                data.forEach((data,index)=>{
                    pattern5.push(this.reelsSymbols[index][data])
                })
            }
            //pattern 6
            else if(index == 5){
                data.forEach((data,index)=>{
                    pattern6.push(this.reelsSymbols[index][data])
                })
            }
            //pattern 7
            else if(index == 6){
                data.forEach((data,index)=>{
                    pattern7.push(this.reelsSymbols[index][data])
                })
            }
            //pattern 8
            else if(index == 7){
                data.forEach((data,index)=>{
                    pattern8.push(this.reelsSymbols[index][data])
                })
            }
            //pattern 9
            else if(index == 8){
                data.forEach((data,index)=>{
                    pattern9.push(this.reelsSymbols[index][data])
                })
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

        //animate pattern 1
        if(isPattern1>2){   
            for(let i=1;i<=isPattern1;i++){
                console.log(pattern1[i-1].type)
            }
        }
        //animate pattern 2
        if(isPattern2>2){   
            for(let i=1;i<=isPattern2;i++){
                console.log(pattern1[i-1].type)
            }
        }
        //animate pattern 3
        if(isPattern3>2){   
            for(let i=1;i<=isPattern3;i++){
                console.log(pattern3[i-1].type)
            }
        }
        //animate pattern 4
        if(isPattern4>2){   
            for(let i=1;i<=isPattern4;i++){
                console.log(pattern4[i-1].type)
            }
        }
        //animate pattern 5
        if(isPattern5>2){   
            for(let i=1;i<=isPattern5;i++){
                console.log(pattern5[i-1].type)
            }
        }
        //animate pattern 6
        if(isPattern6>2){   
            for(let i=1;i<=isPattern6;i++){
                console.log(pattern6[i-1].type)
            }
        }
        //animate pattern 7
        if(isPattern7>2){   
            for(let i=1;i<=isPattern7;i++){
                console.log(pattern7[i-1].type)
            }
        }
        //animate pattern 8
        if(isPattern8>2){   
            for(let i=1;i<=isPattern9;i++){
                console.log(pattern8[i-1].type)
            }
        }
        //animate pattern 9
        if(isPattern9>2){   
            for(let i=1;i<=isPattern9;i++){
                console.log(pattern9[i-1].type)
            }
        }
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
                    let reelValue = json.reelsValues[indexUpper]
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
        let reelValue = json.reelsValues[index]
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