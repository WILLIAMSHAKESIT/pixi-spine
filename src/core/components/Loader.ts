import 'pixi-spine' // Do this once at the very start of your code. This registers the loader!
import * as PIXI from 'pixi.js';
import {Spine} from 'pixi-spine';
import WebFont from 'webfontloader';
import {Howl} from 'howler';

export default class Loader{
    private app:PIXI.Application
    private loadingContainer:PIXI.Container
    private loadingAssets:any
    private gameAssets:any
    //sounds
    private soundsPath: string = 'assets/sounds/';
    private sounds:(soundInit:Boolean,bgm: Array<any>) => void;
    private playSound:(index:number) => void;
    private soundsGlobal: Array<any> = [];
    public isMute: Boolean;
    //text styles
    private loadingTextStyle:PIXI.TextStyle
    private loadingTextStyle2:PIXI.TextStyle
    private loadingBg:PIXI.Sprite
    constructor(loadedAssets:(assets:any,app:PIXI.Application)=>void, sounds: (soundInit:Boolean,bgm: Array<any>) => void){
        this.app = new PIXI.Application({ width: 1920, height: 1080});
        this.loadingContainer = new PIXI.Container
        this.loadingTextStyle = new PIXI.TextStyle({  
            fontFamily: 'Eras ITC',
            fontSize: 40,
            fontWeight: 'bolder',
            fill: '#ffffff', 
            wordWrap: false,
            wordWrapWidth: 440,
            lineJoin: 'round'
        });
        this.loadingTextStyle2 = new PIXI.TextStyle({  
            fontFamily: 'arial',
            fontSize: 30,
            fontWeight: 'bolder',
            fill: '#ffffff', 
            wordWrap: false,
            wordWrapWidth: 440,
            lineJoin: 'round'
        });
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

    private async init(loadedAssets:(assets:any,app:PIXI.Application)=>void){
        // manifest
        const manifest = {
            bundles: [
            {
                name:'loading-screen',
                assets: [{name: 'loading',srcs: 'assets/loading/sprites/loading.json'},]
            },
            {
                name: 'game-screen',
                assets: [
                    {name: 'main',srcs: 'assets/main/sprites/main.json'},
                    {name: 'controller',srcs: 'assets/controller/sprites/controller.json'},
                    {name: 'slot',srcs: 'assets/slot/sprites/slot.json'},
                    {name: 'bonus',srcs: 'assets/bonus/sprites/bonus.json'},
                    {name: 'modal',srcs: 'assets/modal/sprites/modal.json'},
                    {name: 'grass',srcs:'assets/main/sprites/grass.json'},
                    {name: 'pop_glow',srcs: 'assets/bonus/sprites/pop_glow.json'},
                    {name: 'coins',srcs: 'assets/pop_ups/sprites/coins.json'},
                    {name: 'transition',srcs: 'assets/pop_ups/sprites/transition_leaf.json'},
                    {name: 'pop_ups',srcs: 'assets/pop_ups/sprites/pop-ups.json'},
                    {name: 'congrats',srcs: 'assets/pop_ups/sprites/congrats.json'},
                    {name: 'frame_glow',srcs: 'assets/bonus/sprites/frame_glow.json'},
                    {name: 'rock_block',srcs: 'assets/bonus/sprites/rock_block.json'},
                    {name: 'reel_effect',srcs: 'assets/bonus/sprites/reel_effect.json'},
                    {name: 'bird',srcs: 'assets/slot/sprites/bird.json'},
                    {name: 'blue_crystal',srcs: 'assets/slot/sprites/blue_crystal.json'},
                    {name: 'bonus_symbol',srcs: 'assets/slot/sprites/bonus.json'},
                    {name: 'cameleon',srcs: 'assets/slot/sprites/chameleon.json'},
                    {name: 'snake',srcs: 'assets/slot/sprites/snake.json'},
                    {name: 'violet_crystal',srcs: 'assets/slot/sprites/violet_crystal.json'},
                    {name: 'monkey',srcs: 'assets/slot/sprites/monkey.json'},
                    {name: 'leopard',srcs:'assets/slot/sprites/leopard.json'},
                    {name: 'green_crystal',srcs: 'assets/slot/sprites/green_crystal.json'},
                    {name: 'orange_crystal',srcs: 'assets/slot/sprites/orange_crystal.json'},
                    {name: 'wild',srcs: 'assets/slot/sprites/wild.json'},
                    {name: '2k',srcs: 'assets/slot/sprites/2k.json'},
                    {name: '3k',srcs: 'assets/slot/sprites/3k.json'},
                    {name: '5k',srcs: 'assets/slot/sprites/5k.json'},
                    {name: 'x2',srcs: 'assets/slot/sprites/x2.json'},
                    {name: 'x3',srcs: 'assets/slot/sprites/x3.json'},
                    {name: 'x5',srcs: 'assets/slot/sprites/x5.json'},
                    {name: 'plant_1',srcs: 'assets/main/sprites/plant_1.json'},
                    {name: 'plant_2',srcs: 'assets/main/sprites/plant2.json'},
                    {name: 'plant_3',srcs: 'assets/main/sprites/plant3.json'},
                    {name: 'plant_4',srcs: 'assets/main/sprites/plant4.json'},
                    {name: 'plant_5',srcs: 'assets/main/sprites/banana.json'},
                    {name: 'vines',srcs: 'assets/main/sprites/vines.json'},
                    {name: 'firefly',srcs: 'assets/main/sprites/firefly.json'},
                    {name: 'butterfly',srcs: 'assets/main/sprites/butterfly.json'},
                    {name: 'intro',srcs: 'assets/intro/sprites/intro.json'},
                ],
            }],
        };

        this.soundSetup(`${this.soundsPath}music/main_music.mp3`,true); //0 
        this.soundSetup(`${this.soundsPath}sfx/ui/click.mp3`,false); //1
        this.soundSetup(`${this.soundsPath}sfx/ui/hover.mp3`,false); //2
        this.soundSetup(`${this.soundsPath}sfx/reel/reel_spin.mp3`,false); //3
        this.soundSetup(`${this.soundsPath}sfx/reel/reel_stop.mp3`,false); //4
        this.soundSetup(`${this.soundsPath}sfx/reel/common_effect.mp3`,false); //5
        this.soundSetup(`${this.soundsPath}music/event_music.mp3`,false); //6
        this.soundSetup(`${this.soundsPath}sfx/win/event_win.wav`,false); //7
        this.soundSetup(`${this.soundsPath}music/matchgame_music.mp3`,true); //8 
        this.soundSetup(`${this.soundsPath}sfx/reel/bonus_impact.mp3`,false); //9 
        this.soundSetup(`${this.soundsPath}sfx/reel/bonus_impact2.mp3`,false); //10
        this.soundSetup(`${this.soundsPath}sfx/reel/bonus_power.mp3`,false); //11
        this.soundSetup(`${this.soundsPath}sfx/ui/confirm.mp3`,false); //12
        this.soundSetup(`${this.soundsPath}sfx/ui/reject.mp3`,false); //13
        this.soundSetup(`${this.soundsPath}sfx/ui/pops_show.mp3`,false); //14
        this.soundSetup(`${this.soundsPath}sfx/ui/buy_bonus_confirm.mp3`,false); //15
        this.soundSetup(`${this.soundsPath}music/spin_music.mp3`,false); //16

        await PIXI.Assets.init({ manifest: manifest });
        
        PIXI.Assets.backgroundLoadBundle(['load-screen', 'game-screen']);

        this.loadingScreen(loadedAssets)
    }
    private async loadingScreen(loadedAssets:(assets:any,app:PIXI.Application)=>void){
        const soundBtnsCont = new PIXI.Container
        const loadingIncrement = 9
        const loadingBarWidth = 451
        //loading assets
        this.loadingAssets = await PIXI.Assets.loadBundle('loading-screen')
        this.loadingBg = new PIXI.Sprite(this.loadingAssets.loading.textures['loading_background.png'])
        this.app.stage.addChild(this.loadingBg)

        const logo = new PIXI.Sprite(this.loadingAssets.loading.textures['logo.png'])
        logo.scale.set(1.3)
        this.loadingContainer.addChild(logo)
        const loadingBarBg = new PIXI.Sprite(this.loadingAssets.loading.textures['loading_bg.png'])
        loadingBarBg.x = (logo.width - loadingBarBg.width)/2
        loadingBarBg.y = logo.height*1.8
        this.loadingContainer.addChild(loadingBarBg)

        const loadingBar = new PIXI.Sprite(this.loadingAssets.loading.textures['loading_progress.png'])
        loadingBar.x = ((logo.width) - loadingBar.width)/2
        loadingBar.y = loadingBarBg.y + ((loadingBarBg.height - loadingBar.height)/2)-8
        loadingBar.width = 0
        this.loadingContainer.addChild(loadingBar)
        const loadingText = new PIXI.Text(`Loading`, this.loadingTextStyle)
        loadingText.x = (logo.width - loadingText.width)/2
        loadingText.y = loadingBarBg.y + (-(loadingText.y + (loadingText.height*1.3)))
        this.loadingContainer.addChild(loadingText)
        this.loadingContainer.x = (this.app.screen.width - this.loadingContainer.width)/2
        this.loadingContainer.y = (this.app.screen.height - this.loadingContainer.height)/2
        this.app.stage.addChild(this.loadingContainer)

        //load game assets
        this.gameAssets = await PIXI.Assets.loadBundle('game-screen',(progress) => {
            // add the bar progress here
            if(progress < 1){
                loadingBar.width+=loadingIncrement
            }else{
                loadingBar.width = loadingBarWidth
            }
        });

        this.loadingContainer.removeChild(loadingBarBg,loadingBar,loadingText)

        const loadingTextNew = new PIXI.Text(`DO YOU WANT TO PLAY WITH SOUND?`, this.loadingTextStyle)
        loadingTextNew.x = (this.loadingContainer.width - loadingTextNew.width)/2
        loadingTextNew.y = loadingText.y-26
        this.loadingContainer.addChild(loadingTextNew)

        const soundBtnInactive = new PIXI.Sprite(this.loadingAssets.loading.textures['ex.png'])
        soundBtnInactive.interactive = true
        soundBtnInactive.cursor = 'pointer'
        soundBtnsCont.addChild(soundBtnInactive)

        const soundBtnActive = new PIXI.Sprite(this.loadingAssets.loading.textures['check.png'])
        soundBtnActive.interactive = true
        soundBtnActive.cursor = 'pointer'
        soundBtnActive.x = soundBtnInactive.width*2.5
        soundBtnsCont.addChild(soundBtnActive)

        soundBtnsCont.x = (this.loadingContainer.width - soundBtnsCont.width)/2
        soundBtnsCont.y = loadingTextNew.y*1.3
        this.loadingContainer.addChild(soundBtnsCont)
        this.loadingContainer.x = (this.app.screen.width - this.loadingContainer.width)/2
        this.loadingContainer.y = (this.app.screen.height - this.loadingContainer.height)/2
        
        soundBtnInactive.addEventListener('pointerdown',()=>{this.introScreen(loadedAssets,false)})
        soundBtnActive.addEventListener('pointerdown',()=>{this.introScreen(loadedAssets,true)})
    }
    private introScreen(loadedAssets:(assets:any,app:PIXI.Application)=>void,bool:boolean){
        this.soundPrompt(bool)
        this.app.stage.removeChild(this.loadingContainer)
        this.app.stage.removeChild(this.loadingBg)
        loadedAssets(this.gameAssets,this.app)
    }
    private soundPrompt(bool:boolean){
        this.sounds(bool,this.soundsGlobal)
    }
    private soundSetup(src:string,loop:boolean){
        const audio = new Howl({
            src: src,
            loop:loop
        })
        this.soundsGlobal.push(audio)
    }
}