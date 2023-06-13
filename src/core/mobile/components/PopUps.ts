import 'pixi-spine'
import * as PIXI from 'pixi.js';
import {Spine} from 'pixi-spine';
import Functions from '../settings/Functions';
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
export default class PopUps{
    //app settings
    private app:PIXI.Application
    private textureArray:any
    private baseWidth:number
    private baseHeight:number
    public container:PIXI.Container
    public middleContainer:PIXI.Container
    private coinsContainer:PIXI.Container
    private gameContainer:PIXI.Container
    public overlay:PIXI.Sprite
    private popGlow:Spine
    public logo:Spine
    private leftCoinAnimation: any;
    private rightCoinAnimation: any;
    //text styles
    private textStyle:PIXI.TextStyle
    private textStyle2:PIXI.TextStyle
    private textStyle3:PIXI.TextStyle
    private textStyleYellow:PIXI.TextStyle
    //text
    private descText:PIXI.Text
    public money:PIXI.Text
    private spins:PIXI.Text
    //value 
    private noOfSpin:number = 0
    private matchingGameWin:number = 0
    // animation skin
    private animationSkin:string = ''
    constructor(app:PIXI.Application,gameContainer:PIXI.Container,textureArray:any,skin:string,matchingGameWin:number){
        this.app = app
        this.container = new PIXI.Container
        this.middleContainer = new PIXI.Container
        this.coinsContainer = new PIXI.Container
        this.gameContainer = gameContainer
        this.baseWidth = this.app.screen.width
        this.baseHeight = this.app.screen.height
        this.textureArray = textureArray
        this.animationSkin = skin
        this.matchingGameWin = matchingGameWin
        this.textStyle = new PIXI.TextStyle({  
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
            wordWrap: false,
            wordWrapWidth: 440,
            lineJoin: 'round',
        });
        this.textStyle2 = new PIXI.TextStyle({  
            fontFamily: 'Eras ITC',
            fontSize: 60,
            fontWeight: 'bolder',
            fill: ['#ffffff', '#ffffff'], // gradient
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 3,
            wordWrap: false,
            wordWrapWidth: 440,
            lineJoin: 'round',
        });
        this.textStyle3 = new PIXI.TextStyle({  
            fontFamily: 'Eras ITC',
            fontSize: 30,
            fontWeight: 'bolder',
            fill: ['#ffffff', '#ffffff'], // gradient
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 3,
            wordWrap: false,
            wordWrapWidth: 440,
            lineJoin: 'round',
        });
        this.textStyleYellow = new PIXI.TextStyle({  
            fontFamily: 'Eras ITC',
            fontSize: 80,
            fontWeight: 'bolder',
            fill: ['#ffeaa0', '#ffc260'], // gradient
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 3,
            wordWrap: false,
            wordWrapWidth: 440,
            lineJoin: 'round',
        });
        this.init()
    }
    private init(){
        this.createParent()
        this.createPopup()
        this.createMoney()
        this.createCoin()
        this.container.interactive = true
        this.container.cursor = 'pointer'
        // close pop up
        this.container.addEventListener('pointerdown',()=>{
            this.closePopUp()
        })
    }
    public closePopUp(){
        let fadeOut = gsap.to(this.container,{
            duration:2,
            alpha:0,
            onComplete:()=>{
                fadeOut.kill()
                this.gameContainer.removeChild(this.container)
            }
        })
    }
    private createParent(){
        //Functions.screenSize().screentype == 'portrait'? (this.logo.y + (this.logo.height-this.money.height)/2)*0.77: (this.logo.y + (this.logo.height-this.money.height)/2)*0.66
        this.overlay = Functions.screenSize().screentype == 'portrait'?  Functions.loadTexture(this.textureArray,'controller_mobile','overlay_portrait') : Functions.loadTexture(this.textureArray,'modal_settings','overlay')
        this.overlay.width = this.baseWidth
        this.overlay.height = this.baseHeight
        this.container.addChild(this.overlay)
        this.container.alpha = 0
        let fadeIn = gsap.to(this.container,{
            duration:1,
            alpha:1,
            onComplete:()=>{
                fadeIn.kill()
            }
        })
    }
    private createPopup(){
        const logoAnimationSpeed = 0.7
        //create pop logo
        this.logo = new Spine(this.textureArray.pop_ups.spineData)
        this.logo.scale.set(1.3)
        this.logo.x = (this.overlay.width)/2
        this.logo.y = ((this.overlay.height)/2)*0.7
        
        //set the skin
        this.logo.skeleton.setSkinByName(this.animationSkin)
        // animate glow
        Functions.loadSpineAnimation(this.logo,'animation',true,logoAnimationSpeed)
        this.middleContainer.addChild(this.logo)
        this.container.addChild(this.middleContainer)
    }
    private createMoney(){
        let moneyPosY:any;
        let moneyPosX:any;
        this.money = new PIXI.Text('0', this.textStyleYellow)
        moneyPosX = ((this.overlay.width - this.money.width)/2)*1.3
        moneyPosY = Functions.screenSize().screentype == 'portrait'? (this.logo.y + (this.logo.height-this.money.height)/2)*0.77: (this.logo.y + (this.logo.height-this.money.height)/2)*0.66
        this.money.x = moneyPosX
        this.money.y = moneyPosY
        this.middleContainer.addChild(this.money)

        // Set up animation
        const startValue = 0;
        const endValue = this.matchingGameWin;
        const duration = 2;
        const delay = 0.4;
        const ease = "power1.out";

        // Animate text value
        let textAnimation = gsap.to(this.money, {
            pixi: {
                text: endValue,
            },
            duration: duration,
            delay: delay,
            ease: ease,
            onStart: () => {
                this.money.text = startValue.toString();
            },
            onUpdate: () => {
                this.money.text = Functions.numberWithCommas(parseInt(this.money.text)).toString();
                this.money.x = ((this.overlay.width - this.money.width)/2)*1.03
                this.money.y = moneyPosY
            },
            onComplete:()=>{
                textAnimation.kill()
            }
        });
    }
    private createCoin(){
        // LEFTCOINS
        for(let count = 0; count < 10; count++){
            let coin: any = Functions.animatedSprite(this.textureArray['coins'],'new_coin_spinning');
            let accelX = this.randMinMax(7.5, 11.5);
            let coinSpeed = 0.15;
            const gravity = 0.15;
            coin.scale.set(this.randMinMax(0.2, 0.3));
            coin.anchor.set(0.5);
            coin.animationSpeed = this.randMinMax(0.3, 0.5);
            coin.x += coin.width;
            coin.y += coin.height;
            coin.x = - coin.width;
            coin.y = this.app.screen.height - this.randMinMax(100,550);
        
            this.coinsContainer.addChild(coin);
  
            this.leftCoinAnimation = gsap.to(coin, {
                rotation: Math.random() * 20,
                duration: 3,
                ease: "sine.in",
                repeat: -1,
                delay: this.randMinMax(0, 5),
                onStart: () => {
                    coin.play();
                },
                onUpdate: () => {
                    coin.y += coinSpeed;
                    coin.x += accelX;
                    coinSpeed += gravity;
        
                    if(accelX > 0)
                    accelX -= gravity/3;
                    if(accelX < 0)
                    accelX = 0
        
                    if(coin.y > this.app.screen.height){
                    coinSpeed = 0.15;
                    accelX = this.randMinMax(7.5, 11.5);
                    coin.y = this.app.screen.height - this.randMinMax(100,550);
                    coin.scale.set(this.randMinMax(0.2, 0.3));
                    coin.x = - coin.width;
                    this.leftCoinAnimation.repeat();
                    }
                }
            })
        }

        // RIGHTCOINS
        for(let count = 0; count < 10; count++){
            let coin: any = Functions.animatedSprite(this.textureArray['coins'],'new_coin_spinning');
            let accelX = this.randMinMax(7.5, 11.5);
            let coinSpeed = 0.15;
            const gravity = 0.15;
            coin.scale.set(this.randMinMax(0.2, 0.3));
            coin.anchor.set(0.5);
            coin.x += coin.width;
            coin.y += coin.height;
            coin.x = this.app.screen.width + (coin.width/2);
            coin.y = this.app.screen.height - this.randMinMax(100,550);
        
            this.coinsContainer.addChild(coin);
  
            this.rightCoinAnimation = gsap.to(coin, {
                rotation: Math.random() * 20,
                duration: 3,
                ease: "sine.in",
                repeat: -1,
                delay: this.randMinMax(0, 5),
                onStart: () => {
                    coin.play();
                },
                onUpdate: () => {
                    coin.y += coinSpeed;
                    coin.x -= accelX;
                    coinSpeed += gravity;
        
                    if(accelX > 0)
                    accelX -= gravity/3;
                    if(accelX < 0)
                    accelX = 0
        
                    if(coin.y > this.app.screen.height){
                        coinSpeed = 0.15;
                        accelX = this.randMinMax(7.5, 11.5);
                        coin.y = this.app.screen.height - this.randMinMax(100,550);
                        coin.scale.set(this.randMinMax(0.2, 0.3));
                        coin.x = this.app.screen.width;
                        this.rightCoinAnimation.repeat();
                    }
                }
            })
        }
        this.container.addChild(this.coinsContainer);
    }
    private randMinMax(min:number, max:number){
        let random = Math.random() * (max - min) + min;
        return random;
    }
}   