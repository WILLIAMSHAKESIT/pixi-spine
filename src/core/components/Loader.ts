import 'pixi-spine' // Do this once at the very start of your code. This registers the loader!
import * as PIXI from 'pixi.js';
import {Spine} from 'pixi-spine';
import WebFont from 'webfontloader';

export default class Loader{
    private app:PIXI.Application
    constructor(loadedAssets:(assets:any,app:PIXI.Application)=>void){
        this.app = new PIXI.Application({ width: 1920, height: 1080, antialias: false});
        (globalThis as any).__PIXI_APP__ = this.app;
        document.body.appendChild(this.app.view as any);
        this.init(loadedAssets)
        WebFont.load({
            custom: {
              families: ['Eras ITC'],
            },
          });
    }

    private init(loadedAssets:(assets:any,app:PIXI.Application)=>void){
        //added assets
        PIXI.Assets.add('main', 'assets/main/sprites/main.json');
        PIXI.Assets.add('controller', 'assets/controller/sprites/controller.json');
        PIXI.Assets.add('slot', 'assets/slot/sprites/slot.json');
        PIXI.Assets.add('bag_of_gold', 'assets/slot/sprites/bag_of_gold.json');
        PIXI.Assets.add('barrels', 'assets/slot/sprites/barrels.json');
        PIXI.Assets.add('boots', 'assets/slot/sprites/boots.json');
        PIXI.Assets.add('dynamite_crate', 'assets/slot/sprites/dynamite_crate.json');
        PIXI.Assets.add('gas_lamp', 'assets/slot/sprites/gas_lamp.json');
        PIXI.Assets.add('pile_of_gold', 'assets/slot/sprites/pile_of_gold.json');
        PIXI.Assets.add('snake', 'assets/slot/sprites/snake.json');
        PIXI.Assets.add('trolley', 'assets/slot/sprites/trolley.json');
        PIXI.Assets.add('wild', 'assets/slot/sprites/wild.json');
        PIXI.Assets.add('modal', 'assets/modal/sprites/modal.json');
        PIXI.Assets.add('bonus', 'assets/bonus/sprites/bonus.json');
        PIXI.Assets.add('grass', 'assets/main/sprites/grass.json');
        PIXI.Assets.add('pop_glow', 'assets/bonus/sprites/pop_glow.json');
        PIXI.Assets.add('coins', 'assets/pop_ups/sprites/coins.json');
        PIXI.Assets.add('congrats', 'assets/pop_ups/sprites/congrats.json');
        PIXI.Assets.add('transition', 'assets/pop_ups/sprites/transition_leaf.json');
        PIXI.Assets.add('pop_ups', 'assets/pop_ups/sprites/pop-ups.json');
        PIXI.Assets.add('frame_glow', 'assets/bonus/sprites/frame_glow.json');
        //test
        PIXI.Assets.add('corgi', 'assets/corgi/corgi.json');
        // Load the assets and get a resolved promise once both are loaded
        const texturesPromise = PIXI.Assets.load([
            'main','slot','controller','bag_of_gold',
            'barrels','boots','dynamite_crate','gas_lamp',
            'pile_of_gold','snake','trolley','wild','modal',
            'bonus','grass','pop_glow','coins','congrats','corgi',
            'transition','pop_ups','frame_glow'
        ]);
        texturesPromise.then((resource) => {
            loadedAssets(resource,this.app)
        });
    }
}