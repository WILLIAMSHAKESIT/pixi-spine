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
        // this.textSpineDynamic()
        this.createController()
        this.app.stage.addChild(this.gameContainer);
    }
    private textSpineDynamic(){
        let array:Array<any> = [
            {type:1,spine:'bag_of_gold'},
            {type:2,spine: 'boots'}
        ]
        let array2:Array<{type:number,spine:Spine}>= []
        const cont = new PIXI.Container()

        array.forEach((data,index)=>{
            const animation = new Spine(this.textureArray[`${data.spine}`].spineData)
            animation.state.setAnimation(0, 'animation', true);
            // dont run too fast
            animation.state.timeScale = 1;
            // update yourself
            animation.x = 300
            animation.y = (index+1)*300
            animation.autoUpdate = true;
            cont.addChild(animation)
            this.gameContainer.addChild(cont)
            array2.push({type:data.type,spine:animation})
        })

        array2.forEach((data:any,index:number)=>{
            setTimeout(()=>{
                cont.removeChild(data.spine)
                data.spine = new Spine(this.textureArray[`boots`].spineData)
                data.spine.state.setAnimation(0, 'animation', true);
                // dont run too fast
                data.spine.state.timeScale = 1;
                // update yourself
                data.spine.x = 300
                data.spine.y = (index+1)*300
                data.spine.autoUpdate = true;
                
                cont.addChild(data.spine)
                this.gameContainer.addChild(cont)
            },1000)
        })
        console.log(array2,cont.children)
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