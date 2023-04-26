
import * as PIXI from 'pixi.js';
import Functions from '../settings/Functions'
import Block from './Block';

export default class Reel{
    private app:PIXI.Application
    private textureArray:any
    private blocks:Array<number> = []
    public reelContainer:PIXI.Container
    private reelIndex:number
    constructor(app:PIXI.Application,data:Array<number>,textureArray:any,reelIndex:number){
        this.app = app
        this.textureArray = textureArray
        this.reelIndex = reelIndex
        this.reelContainer = new PIXI.Container()
        this.blocks = Functions.arrayRandomizer(data)
        this.init()
    }
    private init(){
        this.blocks.map((data,index)=>{
            new Block(this.reelContainer,this.textureArray,data,index)
        })
        this.reelContainer.x = (1.1 * this.reelContainer.width)*(this.reelIndex+1)
        this.app.stage.addChild(this.reelContainer)
    }
}