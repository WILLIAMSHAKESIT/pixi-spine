import 'pixi-spine'
import * as PIXI from 'pixi.js';
import Transition from './Transition';
import { gsap } from "gsap";

export default class IntroScreen{
    private app:PIXI.Application
    private baseWidth:number
    private baseHeight:number
    private assets:any
    public container:PIXI.Container
    private centerContainer:PIXI.Container
    private radioCont:PIXI.Container
    // sprites
    private bg:PIXI.Sprite
    private logo:PIXI.Sprite
    public playBtn:PIXI.Sprite

    private radioOn:PIXI.Texture
    private radioOff:PIXI.Texture
    private slides:Array<any>
    private textStyle:PIXI.TextStyle

    private transition:Transition
    public btnScaleAnimation:any
    private arrayContents:Array<any> = []
    constructor(app:PIXI.Application,assets:any){
        this.app = app
        this.baseWidth = this.app.screen.width
        this.baseHeight = this.app.screen.height
        this.assets = assets
        this.container = new PIXI.Container
        this.centerContainer = new PIXI.Container
        this.slides = [
            {
                img:"slide_1",
                text:"Hello my friends"
            },
            {
                img:"slide_2",
                text:"Hello my sd"
            },
            {
                img:"slide_3",
                text:"Hello my frieasdnds"
            },
            {
                img:"slide_4",
                text:"Hello my asd"
            },
        ]
        this.textStyle = new PIXI.TextStyle({  
            fontFamily: 'Eras ITC',
            fontSize: 36,
            fontWeight: 'bold',
            fill: ['#ffffff', '#ffffff'], // gradient
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
        this.init()
    }
    private init(){
        // const slideImgs:any = []
        // const radios:any = []
        // const texts:any = []
        this.radioCont = new PIXI.Container
        this.bg = new PIXI.Sprite(this.assets.intro.textures['intro_bg.png'])
        this.radioOn =  new PIXI.Sprite(this.assets.intro.textures[`radio_on.png`]).texture
        this.container.addChild(this.bg)
        
        this.logo = new PIXI.Sprite(this.assets.intro.textures['logo.png'])
        this.centerContainer.addChild(this.logo)
        
        this.slides.forEach((data,index)=>{
            const slideImg = new PIXI.Sprite(this.assets.intro.textures[`${data.img}.png`])
            if(index !== 0){
                slideImg.alpha = 0
            }
            slideImg.y = (this.logo.height+this.logo.y)*1.2
            this.centerContainer.addChild(slideImg)

            const radio = new PIXI.Sprite(this.assets.intro.textures[`radio_off.png`])
            this.radioOff = radio.texture
            if(index == 0){
                radio.texture = this.radioOn 
            }

            radio.x = (radio.width*index)*1.3
            radio.y = 750
            radio.interactive = true
            radio.cursor = 'pointer'
            this.radioCont.addChild(radio)
            this.centerContainer.addChild(this.radioCont)

            const text = new PIXI.Text(`${data.text}`,this.textStyle)
            if(index !== 0){
                text.alpha = 0
            }

            text.x = (this.centerContainer.width - text.width)/2
            text.y = radio.y*1.1
            this.centerContainer.addChild(text)

            let dataArray = {
                slideImg:slideImg,
                text:text,
                radio:radio
             }
            this.arrayContents.push(dataArray)

            radio.addEventListener('pointerdown',()=>{
                this.arrayContents.forEach((data:any)=>{data.slideImg.alpha = 0})
                slideImg.alpha = 1
                //set radios
                this.arrayContents.forEach((data:any)=>{data.radio.texture = radio.texture,data.radio.interactive = true})
                radio.interactive = false
                radio.texture = this.radioOn
                // set text
                this.arrayContents.forEach((data:any)=>{data.text.alpha = 0})
                text.alpha = 1
            })
            this.playSlideAnimation(index,slideImg)
        })

        this.radioCont.x = (this.centerContainer.width - this.radioCont.width)/2
        this.container.addChild(this.centerContainer)
        this.centerContainer.x = (this.baseWidth - this.centerContainer.width)/2
        this.centerContainer.y = (this.baseHeight - this.centerContainer.height)/2

        // create play btn 
        this.playBtn =  new PIXI.Sprite(this.assets.intro.textures[`play_btn.png`])
        this.playBtn.x = (this.baseWidth - this.playBtn.width)*0.9
        this.playBtn.y = (this.baseHeight - this.playBtn.height)*0.9
        this.playBtn.interactive = true
        this.playBtn.cursor = 'pointer'
        this.btnScaleAnimation = gsap.timeline({ 
            repeat: -1,
            onUpdate:()=>{
                this.playBtn.x = (this.baseWidth - this.playBtn.width)*0.9
                this.playBtn.y = (this.baseHeight - this.playBtn.height)*0.9
            }
        });

        this.btnScaleAnimation.to(this.playBtn.scale, 
            { duration: 0.5,x: 1.2, y: 1.2 }
        )
        .to(this.playBtn.scale, { duration: 0.5, x: 1, y: 1 });
        // Start the animation
        this.btnScaleAnimation.play();
        this.container.addChild(this.playBtn)
    }
    
    private playSlideAnimation(index:number,slideImg:PIXI.Sprite){
        let slideFadeIn = gsap.to(slideImg,{
            delay:index*3,
            duration:1,
            alpha:1,
            onStart:()=>{
                this.arrayContents.forEach((data:any)=>{data.radio.texture = this.radioOff,data.radio.interactive = true})
                this.arrayContents[index].radio.interactive = false
                this.arrayContents[index].radio.texture = this.radioOn
                this.arrayContents.forEach((data:any)=>{data.text.alpha = 0})
                this.arrayContents[index].text.alpha = 1
            },
            onComplete:()=>{
                slideFadeIn.kill()
                let slideFadeOut = gsap.to(slideImg,{
                    delay:index*3,
                    duration:1,
                    alpha:0,
                    onComplete:()=>{
                        slideFadeOut.kill()
                        if(index == 3){
                            this.arrayContents.forEach((data,index)=>{this.playSlideAnimation(index,data.slideImg)})
                        }
                    }
                })
            }
        })
    } 
}
