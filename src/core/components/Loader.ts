import 'pixi-spine' // Do this once at the very start of your code. This registers the loader!
import * as PIXI from 'pixi.js';
import {Spine} from 'pixi-spine';

export default class Loader{
    private app:PIXI.Application
    constructor(loadedAssets:(assets:any,app:PIXI.Application)=>void){
        this.app = new PIXI.Application({ width: 1920, height: 1080, antialias: false});
        (globalThis as any).__PIXI_APP__ = this.app;
        document.body.appendChild(this.app.view as any);
        this.init(loadedAssets)
    }

    private init(loadedAssets:(assets:any,app:PIXI.Application)=>void){
        //added assets
        PIXI.Assets.add('corgi', 'assets/corgi/corgi.json');
        PIXI.Assets.add('doggo', 'assets/doggo/doggo.json');
        PIXI.Assets.add('main', 'assets/main/json/main.json');

        // Load the assets and get a resolved promise once both are loaded
        const texturesPromise = PIXI.Assets.load(['corgi','doggo','main']);

        texturesPromise.then((resource) => {
            loadedAssets(resource,this.app)
        });
    }
}