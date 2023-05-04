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
    private playcount: number = 0;
    public autoplay: Boolean = false;

    //textures
    private singlePlayTexture:PIXI.Sprite;
    private singlePauseTexture:PIXI.Sprite;
    private soundOnTexture:PIXI.Sprite;
    private soundOffTexture:PIXI.Sprite;
    private bonusFill:PIXI.Sprite;

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
        this.createController()
        this.app.stage.addChild(this.gameContainer);
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
        this.controller = new Controller(this.app,this.textureArray,this.setAutoPlay.bind(this))
        this.gameContainer.addChild(this.controller.container)

        this.bonusFill =PIXI.Sprite.from(this.textureArray.bonusFill.textures['bonusFill.png']);
        this.bonusFill.x = this.slotGame.container.width - 680
        this.bonusFill.y = 0
        this.gameContainer.addChild(this.bonusFill)

    }


    private setAutoPlay(number: number){
        console.log("present")
        this.autoplay = true;
        if(this.controller.bet <= this.controller.balance){
            //this.setButtonsBoolean(false);
            this.autoplay = true;
            // this.controller.playtext.style.fill = '#FF0000';
            this.controller.spinBtnSprite.texture = this.singlePauseTexture.texture;
            this.playcount = number;
        }
    }
}