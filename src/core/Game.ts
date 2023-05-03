import 'pixi-spine' 
import * as PIXI from 'pixi.js';
import Loader from "./components/Loader";
import Slot from './components/Slot';
import Controller from './components/Controller';
import Modal from './components/Modal';
import Functions from './settings/Functions';
import {Spine} from 'pixi-spine';
export default class Game{
    private app:PIXI.Application
    private textureArray:any
    private gameContainer:PIXI.Container;
    private gameBackground:PIXI.Sprite
    private baseWidth:number;
    private baseHeight:number;
    private slotGame:Slot;
    private controller:Controller   

    constructor(){
        new Loader(this.init.bind(this))
    }

    private init(res:any,app:PIXI.Application){
        this.app = app
        this.baseWidth = this.app.screen.width
        this.baseHeight = this.app.screen.height
        this.textureArray = res
        this.gameContainer = new PIXI.Container
        this.createGame()
        // this.testSpine()
        this.createController()
        this.app.stage.addChild(this.gameContainer);
        this.createModal()
    }
    private createModal(){
        new Modal(this.app,this.textureArray)
    }
    private testSpine(){
        let animation = new Spine(this.textureArray.bag_of_gold.spineData);
        this.gameContainer.addChild(animation);
        animation.x = 500
        animation.y = 500
        // add the animation to the scene and render...
        this.app.stage.addChild(this.gameContainer);
        
        if (animation.state.hasAnimation('animation')) {
            // run forever, little boy!
            animation.state.setAnimation(0, 'animation', true);
            // dont run too fast
            animation.state.timeScale = .6;
            // update yourself
            // animation.autoUpdate = true;
        }
        setTimeout(()=>{
            const animation2 = new Spine(this.textureArray.boots.spineData);
            
            animation.hackTextureBySlotName('Layer 1',Functions.loadTexture(this.textureArray,'slot','boots').texture,Functions.loadTexture(this.textureArray,'slot','boots').texture.orig); 
            animation = animation2
            console.log(animation)
            // animation.spineData = animation2.spineData
            // console.log(animation2)
            // animation.update(0)
            // run forever, little boy!
            setTimeout(()=>{
                if (animation.state.hasAnimation('rotate')) {
                    // run forever, little boy!
                    animation.state.setAnimation(0, 'rotate', false);
                    // dont run too fast
                    animation.state.timeScale = .6;
                    // update yourself
                    // animation.autoUpdate = true;
                }
            },2000)
        },1000)
    }

    private createGame(){
        this.gameBackground = Functions.loadTexture(this.textureArray,'main','bg')
        this.gameBackground.width = this.baseWidth
        this.gameBackground.height = this.baseHeight
        this.gameContainer.addChild(this.gameBackground)

        // create slot
        this.slotGame = new Slot(this.app,this.textureArray)
        this.gameContainer.addChild(this.slotGame.container)
    }
    private createController(){
        this.controller = new Controller(this.app,this.textureArray)
        this.gameContainer.addChild(this.controller.container)
    }
}