import 'pixi-spine' // Do this once at the very start of your code. This registers the loader!
import * as PIXI from 'pixi.js';
import {Spine} from 'pixi-spine';
import WebFont from 'webfontloader';
import {Howl} from 'howler';

export default class Loader{
    private app:PIXI.Application
    //sounds
    private soundsPath: string = 'assets/sounds/';
    private sounds:(soundInit:Boolean,bgm: Array<any>) => void;
    private playSound:(index:number) => void;
    private soundsGlobal: Array<any> = [];
    public isMute: Boolean;
    

    constructor(loadedAssets:(assets:any,app:PIXI.Application)=>void, sounds: (soundInit:Boolean,bgm: Array<any>) => void){
        this.app = new PIXI.Application({ width: 1920, height: 1080});
        this.sounds = sounds;
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
        PIXI.Assets.add('modal', 'assets/modal/sprites/modal.json');
        PIXI.Assets.add('bonus', 'assets/bonus/sprites/bonus.json');
        PIXI.Assets.add('grass', 'assets/main/sprites/grass.json');
        PIXI.Assets.add('pop_glow', 'assets/bonus/sprites/pop_glow.json');
        PIXI.Assets.add('coins', 'assets/pop_ups/sprites/coins.json');
        PIXI.Assets.add('congrats', 'assets/pop_ups/sprites/congrats.json');
        PIXI.Assets.add('transition', 'assets/pop_ups/sprites/transition_leaf.json');
        PIXI.Assets.add('pop_ups', 'assets/pop_ups/sprites/pop-ups.json');
        PIXI.Assets.add('frame_glow', 'assets/bonus/sprites/frame_glow.json');
        PIXI.Assets.add('rock_block', 'assets/bonus/sprites/rock_block.json');
        PIXI.Assets.add('reel_effect', 'assets/bonus/sprites/reel_effect.json');
        // new characters
        PIXI.Assets.add('bird', 'assets/slot/sprites/bird.json');
        PIXI.Assets.add('blue_crystal', 'assets/slot/sprites/blue_crystal.json');
        PIXI.Assets.add('bonus_symbol', 'assets/slot/sprites/bonus.json');
        PIXI.Assets.add('cameleon', 'assets/slot/sprites/chameleon.json');
        PIXI.Assets.add('snake', 'assets/slot/sprites/snake.json');
        PIXI.Assets.add('violet_crystal', 'assets/slot/sprites/violet_crystal.json');
        PIXI.Assets.add('monkey', 'assets/slot/sprites/monkey.json');
        PIXI.Assets.add('leopard', 'assets/slot/sprites/leopard.json');
        PIXI.Assets.add('green_crystal', 'assets/slot/sprites/green_crystal.json');
        PIXI.Assets.add('wild', 'assets/slot/sprites/wild.json');
        PIXI.Assets.add('orange_crystal', 'assets/slot/sprites/orange_crystal.json');
        //Event Characters
        PIXI.Assets.add('2k', 'assets/slot/sprites/2k.json');
        PIXI.Assets.add('3k', 'assets/slot/sprites/3k.json');
        PIXI.Assets.add('5k', 'assets/slot/sprites/5k.json');
        PIXI.Assets.add('x2', 'assets/slot/sprites/x2.json');
        PIXI.Assets.add('x3', 'assets/slot/sprites/x3.json');
        PIXI.Assets.add('x5', 'assets/slot/sprites/x5.json');
        //background assetets
        PIXI.Assets.add('plant_1', 'assets/main/sprites/plant_1.json');
        PIXI.Assets.add('plant_2', 'assets/main/sprites/plant2.json');
        PIXI.Assets.add('plant_3', 'assets/main/sprites/plant3.json');
        PIXI.Assets.add('plant_4', 'assets/main/sprites/plant4.json');
        PIXI.Assets.add('plant_5', 'assets/main/sprites/banana.json');
        PIXI.Assets.add('vines', 'assets/main/sprites/vines.json');
        PIXI.Assets.add('firefly', 'assets/main/sprites/firefly.json');
        PIXI.Assets.add('butterfly', 'assets/main/sprites/butterfly.json');

        //test
        PIXI.Assets.add('corgi', 'assets/corgi/corgi.json');
        //sounds
        this.soundSetup(`${this.soundsPath}music/main_music.mp3`,true); //0 
        this.soundSetup(`${this.soundsPath}sfx/ui/click.mp3`,false); //1
        this.soundSetup(`${this.soundsPath}sfx/ui/hover.mp3`,false); //2
        this.soundSetup(`${this.soundsPath}sfx/reel/reel_spin.mp3`,false); //3
        this.soundSetup(`${this.soundsPath}sfx/reel/reel_stop2.mp3`,false); //4
        this.soundSetup(`${this.soundsPath}sfx/reel/common_effect.mp3`,false); //5
        this.soundSetup(`${this.soundsPath}music/event_music.wav`,false); //6
        this.soundSetup(`${this.soundsPath}sfx/win/event_win.wav`,false); //7
        this.soundSetup(`${this.soundsPath}music/matchgame_music.mp3`,true); //8 
        

        this.soundPrompt();

        // Load the assets and get a resolved promise once both are loaded
        const texturesPromise = PIXI.Assets.load([
            'main','slot','controller','bag_of_gold',
            'barrels','boots','dynamite_crate','gas_lamp',
            'pile_of_gold','snake','trolley','modal',
            'bonus','grass','pop_glow','coins','congrats','corgi',
            'transition','pop_ups','frame_glow','rock_block','reel_effect',
            'bird','blue_crystal','bonus','cameleon','snake','violet_crystal',
            'monkey','leopard','green_crystal','wild','orange_crystal','bonus_symbol','2k','3k','5k','x2','x3','x5',
            'plant_1','plant_2','plant_3','plant_4','plant_5','vines','firefly','butterfly'
        ]);

        texturesPromise.then((resource) => {
            console.log('test loaded')
            loadedAssets(resource,this.app)
        });
    }

    private soundPrompt(){
        this.sounds(true,this.soundsGlobal)
    }

    private soundSetup(src:string,loop:boolean){
        const audio = new Howl({
            src: src,
            loop:loop
        })
        this.soundsGlobal.push(audio)
    }
}