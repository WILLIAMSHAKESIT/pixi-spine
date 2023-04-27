
import * as PIXI from 'pixi.js';
import Functions from '../settings/Functions'
import Block from './Block';
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";

// register the plugin
gsap.registerPlugin(PixiPlugin);

// give the plugin a reference to the PIXI object
PixiPlugin.registerPIXI(PIXI);


export default class Reel{
    private app:PIXI.Application
    private textureArray:any
    private blocks:Array<number> = []
    public reelContainer:PIXI.Container
    private maskContainer:PIXI.Container
    private maskY:number = 125
    private maskHeight:number = 830
    private reelX:number = 290
    public reelMaskContainer:PIXI.Container
    public maskReelContainer:PIXI.Container
    private reelIndex:number
    private reelData:Array<number> = []
    private block:Block
    constructor(app:PIXI.Application,data:Array<number>,textureArray:any,index:number){
        this.app = app
        this.textureArray = textureArray
        this.reelIndex = index
        this.reelData = data
        this.reelContainer = new PIXI.Container()
        this.maskContainer = new PIXI.Container()
        this.reelMaskContainer = new PIXI.Container()
        this.maskReelContainer = new PIXI.Container()
        this.reelContainer.sortableChildren = true
        this.blocks = Functions.arrayRandomizer(data)
        this.init()
    }
    private init(){
        this.createBlocks(true)
        this.createContainers()
    }
    public createBlocks(isInit:boolean){
        this.blocks.map((data,index)=>{
            this.block = new Block(this.reelContainer,this.textureArray,data,index)
            this.reelContainer.addChild(this.block.symbolSprite)
        })

        // while(this.reelContainer.children[0]) { this.reelContainer.removeChild(this.reelContainer.children[0]); }
    }
    private createContainers(){
        //mask part
        const mask = PIXI.Sprite.from(this.textureArray.slot.textures[`mask.png`])

        this.maskContainer.addChild(mask)
        this.maskContainer.height = this.maskHeight
        this.maskContainer.x = this.reelIndex*this.reelX
        this.maskContainer.y = this.maskY
        this.reelContainer.y = (this.maskContainer.height - this.reelContainer.height)+115
        this.reelMaskContainer.addChild(this.reelContainer)
        this.reelMaskContainer.x =this.reelIndex*this.reelX
        this.maskReelContainer.addChild(this.maskContainer)
        this.reelMaskContainer.mask = this.maskReelContainer
    }
}