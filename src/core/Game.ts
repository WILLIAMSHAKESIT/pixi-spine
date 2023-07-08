import 'pixi-spine' 
import * as PIXI from 'pixi.js';
import Loader from "./components/Loader";
import {Spine} from 'pixi-spine';
import { gsap } from "gsap";
import Functions from './settings/Functions';
import { PixiPlugin } from "gsap/PixiPlugin";
import $ from "jquery";
// give the plugin a reference to the PIXI object
PixiPlugin.registerPIXI(PIXI);
export default class Game{

    private app:PIXI.Application
    private gameContainer:PIXI.Container;
    private drawerContainer:PIXI.Container
    private drawerCircleContainer:PIXI.Container
    public load:Loader;
    private baseWidth:number = 0
    private baseHeight:number = 0
    private textureArray:any 
    private drawerCircle:PIXI.Sprite
    private drawerPipes:PIXI.Sprite
    private boardSprite:PIXI.Sprite
    private drawerCircleMask:PIXI.Sprite
    private drawerBase:PIXI.Sprite
    private circleCenterY:number = 0
    private ballExpand:number = -15
    private resultShowing:boolean = false
    private textstyle:PIXI.TextStyle
    private ballBatchArr = [
        {start:1,end:9,file:'balls1To9',color:'green'},
        {start:10,end:19,file:'balls10To19',color:'red'},
        {start:20,end:29,file:'balls20To29',color:'pink'},
        {start:30,end:39,file:'balls30To39',color:'yellow'},
        {start:40,end:49,file:'balls40To49',color:'black'},
        {start:50,end:59,file:'balls50To59',color:'orange'},
        {start:60,end:69,file:'balls60To69',color:'violet'},
        {start:70,end:79,file:'ball70To79',color:'light-blue'},
        {start:80,end:90,file:'balls80To90',color:'blue'},
    ]
    constructor(){
        this.gameContainer = new PIXI.Container
        this.drawerContainer = new PIXI.Container
        this.drawerCircleContainer = new PIXI.Container
        this.drawerContainer.sortableChildren = true
        this.gameContainer.sortableChildren = true
        this.drawerCircleContainer.sortableChildren = true
        this.textstyle = new PIXI.TextStyle({
            fontFamily: 'Poppins',
            fontSize: 220,
            fontWeight: 'bold',
            fillGradientType: 0,
            fill: ['#f1c001', '#bf6600'],
            fillGradientStops: [0.4, 0.9],
        });
        new Loader(this.init.bind(this))

        window.addEventListener('pointerdown',()=>{
            if(!this.resultShowing){
                this.startResultAnimation()
            }
        })
    }
    private init(res:any,app:PIXI.Application){
        this.app = app
        this.baseWidth = this.app.screen.width
        this.baseHeight = this.app.screen.height
        this.textureArray = res
        this.createDrawer()
        this.createBalls()
        this.gameContainer.addChild(this.drawerContainer)
        this.gameContainer.x = 110
        this.app.stage.addChild(this.gameContainer)
    }
    private createDrawer(){
        this.drawerCircle = new PIXI.Sprite(this.textureArray.drawer.textures['circle.png'])
        this.drawerCircle.zIndex = 10
        this.drawerCircleContainer.addChild(this.drawerCircle)
        this.drawerCircleContainer.zIndex = 10
        this.drawerContainer.addChild(this.drawerCircleContainer)
        this.drawerCircleMask = new PIXI.Sprite(this.textureArray.drawer.textures['circle_mask.png'])
        this.drawerContainer.addChild(this.drawerCircleMask)
        this.drawerCircleContainer.mask = this.drawerCircleMask

        this.drawerBase = new PIXI.Sprite(this.textureArray.drawer.textures['base.png'])
        this.drawerBase.x = (this.drawerCircle.width - this.drawerBase.width)/2
        this.drawerBase.y = (this.drawerCircle.height * 0.92)

        this.drawerContainer.addChild(this.drawerBase)
        this.drawerContainer.scale.set(0.7)
        this.drawerContainer.x = (this.baseWidth - this.drawerContainer.width)/2
        this.drawerContainer.y = (this.baseHeight - this.drawerContainer.height)/2

        this.drawerPipes = new PIXI.Sprite(this.textureArray.drawer.textures['pipes.png'])
        this.drawerPipes.x = -290.5
        this.drawerPipes.y = 426.5
        this.drawerPipes.zIndex = 15
        this.drawerContainer.addChild(this.drawerPipes)

        //set the center of the circle
        this.circleCenterY = (this.drawerCircle.height + this.drawerCircle.y)/2
    }

    private createBalls(){
        this.ballBatchArr.forEach((data:any,index:number)=>{
            for(let i = data.start;i<=data.end;i++){
                const ballSpine = new Spine(this.textureArray[`${data.file}`].spineData)
                ballSpine.skeleton.setSkinByName(`${i}`)
                ballSpine.x = this.randMinMax(this.drawerBase.x*2,(this.drawerBase.width+this.drawerBase.x)*0.85)
                ballSpine.y = this.circleCenterY
                ballSpine.width = 180
                ballSpine.height = 180
                Functions.loadSpineAnimation(ballSpine,'animation',true,this.randMinMax(0.8,1))
                this.drawerCircleContainer.addChild(ballSpine)
                let dx = this.randMinMax(0,8)
                let dy = this.randMinMax(-10,-15)
                this.app.ticker.add(() => {
                    if(ballSpine.x >= (this.drawerCircle.x + this.drawerCircle.width) - 100 || ballSpine.x < 70)
                        dx *= -1;
                    if(ballSpine.y >= (this.drawerCircle.y + this.drawerCircle.height) - 100)
                      dy = this.randMinMax(-10,this.ballExpand);
                    
                    ballSpine.x += dx;
                    dy += .5;
                    ballSpine.y += dy
                });
                this.app.ticker.start()
            }
        })
    }

    private startResultAnimation(){
        this.resultShowing = true

        this.ballExpand = -27
        let randomResult = this.ballBatchArr[Math.floor(Math.random()*this.ballBatchArr.length)]
        const ballResult = new Spine(this.textureArray[`${randomResult.file}`].spineData)
        const resultNo = Math.round(this.randMinMax(randomResult.start,randomResult.end))

        ballResult.zIndex = -10
        ballResult.x = 107
        ballResult.y = 543
        ballResult.skeleton.setSkinByName(`${resultNo}`)
        Functions.loadSpineAnimation(ballResult,'animation',true,0.6)
        ballResult.width = 180
        ballResult.height = 180
        this.drawerContainer.addChild(ballResult)
        
        let toLeft = gsap.to(ballResult,{
            x: -148, 
            duration: 1, 
            onComplete:()=>{
                toLeft.kill()
                let toDown = gsap.to(ballResult,{
                    y: 1191.5, 
                    duration: 1, 
                    onComplete:()=>{
                        toDown.kill()
                        let toLeft = gsap.to(ballResult,{
                            x: 358.5, 
                            duration: 2, 
                            onComplete:()=>{
                                toLeft.kill()
                                $('.game-wrapper').append(`<div class="ball ${resultNo==90?'light-green':randomResult.color}"><span>${resultNo}</span></div>`)
                                this.boardResult(resultNo,randomResult.color)
                            }
                        })
                    }
                })
            }
        })
    }
    private boardResult(resultNo:number,color:string){
        this.boardSprite = new PIXI.Sprite(this.textureArray.drawer.textures['board-result.png'])
        this.boardSprite.scale.set(0.3)
        this.boardSprite.x = 64.5
        this.boardSprite.y = -this.boardSprite.height
        this.gameContainer.addChild(this.boardSprite)
        
        const text = new PIXI.Text('ROUND 1 RESULT', this.textstyle);
        text.x = this.boardSprite.width/2
        text.y = 1200
        this.boardSprite.addChild(text)

        let show = gsap.to(this.boardSprite,{
            y: 0, 
            duration: 1, 
            onComplete:()=>{
                show.kill()
                $('.game-wrapper').append(`<div class="ball board ${resultNo==90?'light-green':color}"><span>${resultNo}</span></div>`)
                let hide = gsap.to(this.boardSprite,{
                    y: -this.boardSprite.height, 
                    duration: 1, 
                    delay:5,
                    onStart:()=>{
                        // remove previous ball result
                        $('.game-wrapper .ball').remove()
                    },
                    onComplete:()=>{
                        this.resultShowing = false
                        hide.kill()
                        this.gameContainer.removeChild(this.boardSprite)
                        this.startResultAnimation()
                    }
                })
            }
        })
    }
    private randMinMax(min:number, max:number){
        let random = Math.random() * (max - min) + min;
        return random;
    }
}