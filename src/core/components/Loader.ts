import 'pixi-spine' // Do this once at the very start of your code. This registers the loader!
import * as PIXI from 'pixi.js';
import {Spine} from 'pixi-spine';
import WebFont from 'webfontloader';
import {Howl} from 'howler';

export default class Loader{
    private app:PIXI.Application
    private loadingContainer:PIXI.Container
    //sounds
    private soundsPath: string = 'assets/sounds/';
    private sounds:(soundInit:Boolean,bgm: Array<any>) => void;
    private playSound:(index:number) => void;
    private soundsGlobal: Array<any> = [];
    public isMute: Boolean;
    //text styles
    private loadingTextStyle:PIXI.TextStyle
    private loadingTextStyle2:PIXI.TextStyle
    constructor(loadedAssets:(assets:any,app:PIXI.Application)=>void, sounds: (soundInit:Boolean,bgm: Array<any>) => void){
        this.app = new PIXI.Application({ width: 1920, height: 1080});
        this.loadingContainer = new PIXI.Container
        this.loadingTextStyle = new PIXI.TextStyle({  
            fontFamily: 'arial',
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
                ],
            }],
        };

        this.soundSetup(`${this.soundsPath}music/main_music.mp3`,true); //0 
        this.soundSetup(`${this.soundsPath}sfx/ui/click.mp3`,false); //1
        this.soundSetup(`${this.soundsPath}sfx/ui/hover.mp3`,false); //2
        this.soundSetup(`${this.soundsPath}sfx/reel/reel_spin.mp3`,false); //3
        this.soundSetup(`${this.soundsPath}sfx/reel/reel_stop2.mp3`,false); //4
        this.soundSetup(`${this.soundsPath}sfx/reel/common_effect.mp3`,false); //5
        this.soundSetup(`${this.soundsPath}music/event_music.wav`,false); //6
        this.soundSetup(`${this.soundsPath}sfx/win/event_win.wav`,false); //7
        this.soundSetup(`${this.soundsPath}music/matchgame_music.mp3`,true); //8 

        await PIXI.Assets.init({ manifest: manifest });
        
        PIXI.Assets.backgroundLoadBundle(['load-screen', 'game-screen']);

        this.loadingScreen(loadedAssets)
    }
    private async loadingScreen(loadedAssets:(assets:any,app:PIXI.Application)=>void){
        const soundBtnsCont = new PIXI.Container
        const loadingIncrement = 18
        const loadingAssets = await PIXI.Assets.loadBundle('loading-screen')

        const loadingBarBg = new PIXI.Sprite(loadingAssets.loading.textures['loading_bg.png'])
        this.loadingContainer.addChild(loadingBarBg)

        const loadingBar = new PIXI.Sprite(loadingAssets.loading.textures['loading_progress.png'])
        loadingBar.width = 0
        this.loadingContainer.addChild(loadingBar)

        const loadingText = new PIXI.Text(`Please Wait`, this.loadingTextStyle)
        loadingText.x = (loadingBarBg.width - loadingText.width)/2
        loadingText.y = (loadingBarBg.height - loadingText.height)/2
        this.loadingContainer.addChild(loadingText)
        this.loadingContainer.x = (this.app.screen.width - this.loadingContainer.width)/2
        this.loadingContainer.y = (this.app.screen.height - this.loadingContainer.height)/2
        this.app.stage.addChild(this.loadingContainer)

        const assets = await PIXI.Assets.loadBundle('game-screen',(progress) => {
            // add the bar progress here
            if(progress < 1){
                loadingBar.width+=loadingIncrement
            }else{
                loadingBar.width = loadingBarBg.width
            }
        });
        this.loadingContainer.removeChild(loadingBarBg,loadingBar,loadingText)

        const loadingTextNew = new PIXI.Text(`DO YOU WANT TO PLAY WITH SOUND?`, this.loadingTextStyle)
        this.loadingContainer.addChild(loadingTextNew)

        const soundBtnInactive = new PIXI.Sprite(loadingAssets.loading.textures['soundBtnInActive.png'])
        soundBtnsCont.addChild(soundBtnInactive)
        const noText = new PIXI.Text(`NO`, this.loadingTextStyle2)
        noText.x = (soundBtnInactive.width - noText.width)/2
        noText.y = (soundBtnInactive.height - noText.height)/2
        soundBtnInactive.addChild(noText)

        const soundBtnActive = new PIXI.Sprite(loadingAssets.loading.textures['soundBtnActive.png'])
        soundBtnActive.x = soundBtnInactive.width*1.1
        soundBtnsCont.addChild(soundBtnActive)
        const yesText = new PIXI.Text(`YES`, this.loadingTextStyle2)
        yesText.x = (soundBtnInactive.width - yesText.width)/2
        yesText.y = (soundBtnInactive.height - yesText.height)/2
        soundBtnActive.addChild(yesText)

        soundBtnsCont.x = (this.loadingContainer.width - soundBtnsCont.width)/2
        soundBtnsCont.y = soundBtnsCont.height
        this.loadingContainer.addChild(soundBtnsCont)
        this.loadingContainer.x = (this.app.screen.width - this.loadingContainer.width)/2
        this.loadingContainer.y = (this.app.screen.height - this.loadingContainer.height)/2
        
        // soundBtnActive.addEventListener('pointerdown',()=>{this.soundPrompt()})
        // assets are now available
        this.app.stage.removeChild(this.loadingContainer)
        this.soundPrompt()
        loadedAssets(assets,this.app)
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