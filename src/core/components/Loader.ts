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
        PIXI.Assets.add('main', 'assets/main/sprites/main.json');
        PIXI.Assets.add('controller', 'assets/controller/sprites/controller.json');
        PIXI.Assets.add('slot', 'assets/slot/sprites/slot.json');
        PIXI.Assets.add('bag_of_gold', 'assets/slot/sprites/bag_of_gold.json');
        PIXI.Assets.add('boots', 'assets/slot/sprites/boots.json');
        // Load the assets and get a resolved promise once both are loaded
        const texturesPromise = PIXI.Assets.load(['main','slot','controller','bag_of_gold','boots']);

        texturesPromise.then((resource) => {
            loadedAssets(resource,this.app)
            // const animation = new Spine(resource.bag_of_gold.spineData);
            // animation.x = 100
            // animation.y = 100
            // this.app.stage.addChild(animation)
        });
    }
}