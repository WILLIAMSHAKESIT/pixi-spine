import 'pixi-spine' 
import * as PIXI from 'pixi.js';
import Loader from "./components/Loader";
import Slot from './components/Slot';
import Controller from './components/Controller';
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
            animation.autoUpdate = true;
        }
        setTimeout(()=>{
            // const animation2 = new Spine(this.textureArray.boots.spineData);
            
            // animation.hackTextureBySlotName('Layer 1',Functions.loadTexture(this.textureArray,'slot','boots').texture,Functions.loadTexture(this.textureArray,'slot','boots').texture.orig); 
            animation = new Spine(this.textureArray.boots.spineData)
            console.log(animation)
            // animation.spineData = animation2.spineData
            // console.log(animation2)
            // animation.update(0)
            // run forever, little boy!
            animation.state.setAnimation(0, animation.spineData.animations[0].name, true);
            console.log(animation.state.setAnimation(0, animation.spineData.animations[0].name, true))
            // dont run too fast
            animation.state.timeScale = .6;
            // update yourself
            // animation.autoUpdate = true;
            animation.update(0)
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