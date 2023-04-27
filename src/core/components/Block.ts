import * as PIXI from 'pixi.js';
import json from '../settings/symbols.json'

export default class Block{
    private reelContainer:PIXI.Container
    private textureArray:any
    private symbolIndex:number
    public symbolSprite:PIXI.Sprite
    private blockIndex:number
    constructor(reelContainer:PIXI.Container,textureArray:any,textureCode:number,blockIndex:number){
        this.reelContainer = reelContainer
        this.textureArray = textureArray
        this.symbolIndex = textureCode
        this.blockIndex = blockIndex
        this.init()
    }
    private init(){
        this.symbolSprite = PIXI.Sprite.from(this.textureArray.slot.textures[`${json.symbols[this.symbolIndex].symbol}.png`])
        this.symbolSprite.y = (this.symbolSprite.height * this.blockIndex)*1.3
    }
}