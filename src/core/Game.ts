import 'pixi-spine' 
import * as PIXI from 'pixi.js';
import Loader from "./components/Loader";
import Slot from './components/Slot';
import {Spine} from 'pixi-spine';
export default class Game{
    private app:PIXI.Application
    private textureArray:any
    private gameContainer:PIXI.Container;
    private gameBackground:PIXI.Sprite
    private baseWidth:number;
    private baseHeight:number;
    private slotGame:Slot
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
    }

    private createGame(){
        this.gameBackground = PIXI.Sprite.from(this.textureArray.main.textures['bg.png']);
        this.gameBackground.width = this.baseWidth
        this.gameBackground.height = this.baseHeight

        this.gameContainer.addChild(this.gameBackground)
        this.app.stage.addChild(this.gameContainer);
        
        // create slot
        this.slotGame = new Slot(this.app,this.textureArray)
    }
}