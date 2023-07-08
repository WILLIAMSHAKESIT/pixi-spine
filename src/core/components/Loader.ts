import 'pixi-spine' // Do this once at the very start of your code. This registers the loader!
import * as PIXI from 'pixi.js';
import $ from "jquery";

export default class Loader{
    private app:PIXI.Application
    private gameAssets:any
    constructor(loadedAssets:(assets:any,app:PIXI.Application)=>void){
        this.app = new PIXI.Application({ backgroundColor: 0x101927,width: 1100, height: 1000});
        (globalThis as any).__PIXI_APP__ = this.app;
        $('.game-wrapper').append(this.app.view as any)
        this.init(loadedAssets)
    }

    private async init(loadedAssets:(assets:any,app:PIXI.Application)=>void){
        // manifest
        const manifest = {
            bundles: [
            {
                name: 'game-assets',
                assets: [
                    {name:'balls1To9',srcs: 'assets/1to9.json'},
                    {name:'balls10To19',srcs: 'assets/10to19.json'},
                    {name:'balls20To29',srcs: 'assets/20to29.json'},
                    {name:'balls30To39',srcs: 'assets/30to39.json'},
                    {name:'balls40To49',srcs: 'assets/40t49.json'},
                    {name:'balls50To59',srcs: 'assets/50to59.json'},
                    {name:'balls60To69',srcs: 'assets/60to69.json'},
                    {name:'ball70To79',srcs: 'assets/70to79.json'},
                    {name:'balls80To90',srcs: 'assets/80to90.json'},
                    {name:'drawer',srcs: 'assets/drawer.json'},
                ],
            }],
        };

        await PIXI.Assets.init({ manifest: manifest });
        
        PIXI.Assets.backgroundLoadBundle(['game-assets']);

        this.loadingScreen(loadedAssets)
    }
    private async loadingScreen(loadedAssets:(assets:any,app:PIXI.Application)=>void){
        const soundBtnsCont = new PIXI.Container
        // this.loadingBg = new PIXI.Sprite(this.loadingAssets.loading.textures['loading_background.png'])

        //load game assets
        this.gameAssets = await PIXI.Assets.loadBundle('game-assets');
        this.introScreen(loadedAssets)
    }
    private introScreen(loadedAssets:(assets:any,app:PIXI.Application)=>void){
        loadedAssets(this.gameAssets,this.app)
    }
}