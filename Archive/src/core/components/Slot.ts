import * as PIXI from 'pixi.js';
import Functions from '../settings/Functions';
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
    private reelsValues:Array<Array<number>> = [
        [4,5,9,7,4,5,9,3,5,6,7,9,7,5,3,5,4,1,7,3,2,1,3,4,1,8,7,6,5,4],
        [1,4,5,3,4,8,3,8,1,3,9,5,7,7,2,1,3,4,3,3,9,6,4,9,2,6,1,8,4,6],
        [1,4,7,6,4,2,2,2,4,6,9,5,4,2,5,7,3,1,3,3,4,4,3,2,7,5,8,7,5,4],
        [1,4,7,6,4,2,2,2,4,6,8,5,4,9,5,7,9,1,3,3,4,4,3,2,7,5,8,7,5,2],
        [1,3,6,7,3,2,2,4,5,8,1,3,1,2,7,7,3,3,1,1,1,9,3,2,2,3,1,8,1,4],
    ]
    private symbolAssets:Array<any> = [
        {
            type:1,symbol:'bag_of_gold'
        },
        {
            type:2,symbol:'barrels'
        },
        {
            type:3,symbol:'boots'
        },
        {
            type:4,symbol:'dynamite_crate'
        },
        {
            type:5,symbol:'gas_lamp'
        },
        {
            type:6,symbol:'pile_of_gold'
        },
        {
            type:7,symbol:'snake'
        },
        {
            type:8,symbol:'trolley'
        },
        {
            type:9,symbol:'wild'
        }
    ]
    private reelPosX:Array<number> = [230,529,827,1125,1423]
    private maskPosX:Array<number> = [220,520,820,1118,1415]
    private maskPosY:number = 130
    private reelContainer:Array<any> = []
    private reelsSymbols:Array<any> = []
    private spinCount:number= 0
    private isSpinning:boolean = false
    private notLongPress:boolean = true
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
                delay  = 0
            break;
            case 'turbo':
                durationBounceUp = 0.2
                duration = 0.1
                delay = 0
            break;
            default:
                durationBounceUp = 0.4
                duration = 1
                delay = 0.3
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
                        onUpdate:()=>{
                            spin.timeScale(20)
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
                                    }
                                }
                            })
                        }
                    });
                }
            })
        })
    }
    private applyMotionBlur(index:number,onSpin:boolean){
        this.reelsSymbols[index].forEach((data:any,index:number)=>{
            const findIndex = this.symbolAssets.findIndex(object => {return object.type === data.type;});
            const blurSymbol = onSpin ? this.symbolAssets[findIndex].symbol+'_blur' : this.symbolAssets[findIndex].symbol
            data.symbol.texture = Functions.loadTexture(this.textureArray,'slot', `${blurSymbol}`).texture
        })
    }
    private generateNewSymbols(){
        this.reelContainer.forEach((data,indexUpper)=>{
            this.reelsSymbols[indexUpper].forEach((data:any,index:number)=>{
                if(index < 27){
                    let reelValue = this.reelsValues[indexUpper]
                    let symbolIndex = reelValue[Math.floor(Math.random() * reelValue.length)]
                    data.type = this.symbolAssets[symbolIndex-1].type
                    data.symbol.texture = Functions.loadTexture(this.textureArray,'slot', `${this.symbolAssets[symbolIndex-1].symbol}`).texture
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
            const value = this.symbolAssets[index-1].symbol
            const type = this.symbolAssets[index-1].type
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