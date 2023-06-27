import 'pixi-spine' // Do this once at the very start of your code. This registers the loader!
import * as PIXI from 'pixi.js';
import {Spine} from 'pixi-spine';
import WebFont from 'webfontloader';
import {Howl} from 'howler';
import Functions from '../settings/Functions';

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

    public soundBtnsCont:PIXI.Container;
    public loadingBg:PIXI.Sprite;
    public logo:PIXI.Sprite;
    public loadingBarBg:PIXI.Sprite;
    public loadingBar:PIXI.Sprite;
    public loadingText:PIXI.Text;
    public loadingTextNew:PIXI.Text;
    public soundBtnInactive:PIXI.Sprite;
    public soundBtnActive:PIXI.Sprite;

    private screenSetting:any;

    constructor(loadedAssets:(assets:any,app:PIXI.Application)=>void, sounds: (soundInit:Boolean,bgm: Array<any>) => void){
        this.app = new PIXI.Application({ width: 1920, height: 1080, forceCanvas: false});
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
        document.getElementsByTagName("body")[0].addEventListener('touchend',()=>{
            var elem = document.documentElement;
            if(elem.requestFullscreen)
                elem.requestFullscreen();
        })
        window.addEventListener('resize',()=>{
            this.screenSize()
        })
        this.screenSize()
    }

    private async init(loadedAssets:(assets:any,app:PIXI.Application)=>void){
        // manifest
        const manifest = {
            bundles: [
            {
                name:'loading-screen-mobile',
                assets: [{name: 'loading',srcs: 'assets/mobile/loading/sprites/loading.json'},]
            },
            {
                name: 'game-screen-mobile',
                assets: [
                    {name: 'intro',srcs: 'assets/mobile/intro/sprites/intro.json'},
                    {name: 'main',srcs: 'assets/mobile/main/sprites/main.json'},
                    {name: 'controller',srcs: 'assets/mobile/controller/sprites/controller.json'},
                    {name: 'controller_mobile',srcs: 'assets/mobile/controller/sprites/controller_mobile.json'},
                    {name: 'controller_mobile_darkmode',srcs: 'assets/mobile/controller/sprites/controller_mobile_darkmode.json'},
                    {name: 'slot',srcs: 'assets/mobile/slot/sprites/slot.json'},
                    {name: 'bonus',srcs: 'assets/mobile/bonus/sprites/bonus.json'},
                    {name: 'modal',srcs: 'assets/mobile/modal/sprites/modal.json'},
                    {name: 'modal_portrait',srcs: 'assets/mobile/modal/sprites/modal_portrait.json'},
                    {name: 'grass',srcs:'assets/mobile/main/sprites/grass.json'},
                    {name: 'pop_glow',srcs: 'assets/mobile/bonus/sprites/pop_glow.json'},
                    {name: 'coins',srcs: 'assets/mobile/pop_ups/sprites/coins.json'},
                    {name: 'transition',srcs: 'assets/mobile/pop_ups/sprites/transition_leaf.json'},
                    {name: 'pop_ups',srcs: 'assets/mobile/pop_ups/sprites/pop-ups.json'},
                    {name: 'congrats',srcs: 'assets/mobile/pop_ups/sprites/congrats.json'},
                    {name: 'frame_glow',srcs: 'assets/mobile/bonus/sprites/frame_glow.json'},
                    {name: 'rock_block',srcs: 'assets/mobile/bonus/sprites/rock_block.json'},
                    {name: 'reel_effect',srcs: 'assets/mobile/bonus/sprites/reel_effect.json'},
                    {name: 'bird',srcs: 'assets/mobile/slot/sprites/bird.json'},
                    {name: 'blue_crystal',srcs: 'assets/mobile/slot/sprites/blue_crystal.json'},
                    {name: 'bonus_symbol',srcs: 'assets/mobile/slot/sprites/bonus.json'},
                    {name: 'cameleon',srcs: 'assets/mobile/slot/sprites/cameleon.json'},
                    {name: 'snake',srcs: 'assets/mobile/slot/sprites/snake.json'},
                    {name: 'violet_crystal',srcs: 'assets/mobile/slot/sprites/violet_crystal.json'},
                    {name: 'monkey',srcs: 'assets/mobile/slot/sprites/monkey.json'},
                    {name: 'tiger',srcs:'assets/mobile/slot/sprites/tiger.json'},
                    {name: 'green_crystal',srcs: 'assets/mobile/slot/sprites/green_crystal.json'},
                    {name: 'orange_crystal',srcs: 'assets/mobile/slot/sprites/orange_crystal.json'},
                    {name: 'wild',srcs: 'assets/mobile/slot/sprites/wild.json'},
                    {name: '2k',srcs: 'assets/mobile/slot/sprites/2k.json'},
                    {name: '3k',srcs: 'assets/mobile/slot/sprites/3k.json'},
                    {name: '5k',srcs: 'assets/mobile/slot/sprites/5k.json'},
                    {name: 'x2',srcs: 'assets/mobile/slot/sprites/x2.json'},
                    {name: 'x3',srcs: 'assets/mobile/slot/sprites/x3.json'},
                    {name: 'x5',srcs: 'assets/mobile/slot/sprites/x5.json'},
                    {name: 'plant_1',srcs: 'assets/mobile/main/sprites/plant_1.json'},
                    {name: 'plant_2',srcs: 'assets/mobile/main/sprites/plant2.json'},
                    {name: 'plant_3',srcs: 'assets/mobile/main/sprites/plant3.json'},
                    {name: 'plant_4',srcs: 'assets/mobile/main/sprites/plant4.json'},
                    {name: 'plant_5',srcs: 'assets/mobile/main/sprites/banana.json'},
                    {name: 'vines',srcs: 'assets/mobile/main/sprites/vines.json'},
                    {name: 'firefly',srcs: 'assets/mobile/main/sprites/firefly.json'},
                    {name: 'butterfly',srcs: 'assets/mobile/main/sprites/butterfly.json'},
                    {name: 'modal_autoplay',srcs: 'assets/mobile/modal/sprites/modal_autoplay.json'},
                    {name: 'modal_info',srcs: 'assets/mobile/modal/sprites/modal_info.json'},
                    {name: 'modal_main',srcs: 'assets/mobile/modal/sprites/modal_main.json'},
                    {name: 'modal_settings',srcs: 'assets/mobile/modal/sprites/modal_settings.json'},
                ],
            }],
        };

        this.soundSetup(`${this.soundsPath}music/main_music.mp3`,true); //0 
        this.soundSetup(`${this.soundsPath}sfx/ui/click.mp3`,false); //1
        this.soundSetup(`${this.soundsPath}sfx/ui/hover.mp3`,false); //2
        this.soundSetup(`${this.soundsPath}sfx/reel/reel_spin.mp3`,false); //3
        this.soundSetup(`${this.soundsPath}sfx/reel/reel_stop.mp3`,false); //4
        this.soundSetup(`${this.soundsPath}sfx/reel/common_effect.mp3`,false); //5
        this.soundSetup(`${this.soundsPath}music/event_music.mp3`,true); //6
        this.soundSetup(`${this.soundsPath}sfx/win/new_win.mp3`,false); //7
        this.soundSetup(`${this.soundsPath}music/matchgame_music.mp3`,true); //8 
        this.soundSetup(`${this.soundsPath}sfx/reel/bonus_impact.mp3`,false); //9 
        this.soundSetup(`${this.soundsPath}sfx/reel/bonus_impact2.mp3`,false); //10
        this.soundSetup(`${this.soundsPath}sfx/reel/bonus_power.mp3`,false); //11
        this.soundSetup(`${this.soundsPath}sfx/ui/confirm.mp3`,false); //12
        this.soundSetup(`${this.soundsPath}sfx/ui/reject.mp3`,false); //13
        this.soundSetup(`${this.soundsPath}sfx/ui/pops_show.mp3`,false); //14
        this.soundSetup(`${this.soundsPath}sfx/ui/buy_bonus_confirm.mp3`,false); //15
        this.soundSetup(`${this.soundsPath}music/spin_music.mp3`,true); //16
        this.soundSetup(`${this.soundsPath}music/win_music.mp3`,true); //17
        this.soundSetup(`${this.soundsPath}sfx/reel/wild_reveal.mp3`,false); //18
        this.soundSetup(`${this.soundsPath}sfx/reel/wild_bar_money.mp3`,false); //19
        this.soundSetup(`${this.soundsPath}sfx/bonus/rock_click.mp3`,false); //20
        this.soundSetup(`${this.soundsPath}sfx/bonus/mini.mp3`,false); //21
        this.soundSetup(`${this.soundsPath}sfx/bonus/major.mp3`,false); //22
        this.soundSetup(`${this.soundsPath}sfx/bonus/grand.mp3`,false); //23
        this.soundSetup(`${this.soundsPath}sfx/reel/normal_payline.mp3`,false); //24
        this.soundSetup(`${this.soundsPath}sfx/reel/monkey.mp3`,false); //25
        this.soundSetup(`${this.soundsPath}sfx/reel/chameleon.mp3`,false); //26
        this.soundSetup(`${this.soundsPath}sfx/reel/bird.mp3`,false); //27
        this.soundSetup(`${this.soundsPath}sfx/reel/snake.mp3`,false); //28
        this.soundSetup(`${this.soundsPath}sfx/reel/tiger.mp3`,false); //29
        this.soundSetup(`${this.soundsPath}sfx/ui/confirm2.mp3`,false); //30

        await PIXI.Assets.init({ manifest: manifest });
        
        PIXI.Assets.backgroundLoadBundle(['load-screen', 'game-screen']);

        this.loadingScreen(loadedAssets)
    }
    private async loadingScreen(loadedAssets:(assets:any,app:PIXI.Application)=>void){
        this.soundBtnsCont = new PIXI.Container
        const loadingIncrement = 11
        const loadingBarWidth = 451
        //loading assets
        this.loadingAssets = await PIXI.Assets.loadBundle('loading-screen-mobile')
        this.loadingBg = new PIXI.Sprite(this.loadingAssets.loading.textures['loading_background.png'])
        this.app.stage.addChild(this.loadingBg)

        this.logo = new PIXI.Sprite(this.loadingAssets.loading.textures['logo.png'])
        this.logo.scale.set(1.3)
        this.loadingContainer.addChild(this.logo)
        this.loadingBarBg = new PIXI.Sprite(this.loadingAssets.loading.textures['loading_bg.png'])
        this.loadingBarBg.x = (this.logo.width - this.loadingBarBg.width)/2
        this.loadingBarBg.y = this.logo.height*1.8
        this.loadingContainer.addChild(this.loadingBarBg)

        this.loadingBar = new PIXI.Sprite(this.loadingAssets.loading.textures['loading_progress.png'])
        this.loadingText = new PIXI.Text(`Loading`, this.loadingTextStyle)
        this.loadingTextNew = new PIXI.Text(`DO YOU WANT TO PLAY WITH SOUND?`, this.loadingTextStyle)
        this.screenSize()

        this.loadingBar.x = ((this.logo.width) - this.loadingBar.width)/2
        this.loadingBar.y = this.loadingBarBg.y + ((this.loadingBarBg.height - this.loadingBar.height)/2)-5
        this.loadingContainer.addChild(this.loadingBar)

        const loadingBarMask = new PIXI.Sprite(this.loadingAssets.loading.textures['loading_progress_mask.png'])
        loadingBarMask.width = 0
        loadingBarMask.x = this.loadingBar.x
        loadingBarMask.y = this.loadingBar.y
        this.loadingContainer.addChild(loadingBarMask)
        this.loadingBar.mask = loadingBarMask

        this.loadingText.x = (this.logo.width - this.loadingText.width)/2
        this.loadingText.y = this.loadingBarBg.y + (-(this.loadingText.y + (this.loadingText.height*1.3)))
        this.loadingContainer.addChild(this.loadingText)
        this.loadingContainer.x = (this.app.screen.width - this.loadingContainer.width)/2
        this.loadingContainer.y = (this.app.screen.height - this.loadingContainer.height)/2
        this.app.stage.addChild(this.loadingContainer)

        //load game assets
        this.gameAssets = await PIXI.Assets.loadBundle('game-screen-mobile',(progress) => {
            // add the bar progress here
            if(progress < 1){
                loadingBarMask.width+=loadingIncrement
            }else{
                loadingBarMask.width = loadingBarWidth
            }
        });
       
        this.loadingContainer.removeChild(this.loadingBarBg,this.loadingBar,this.loadingText)

        this.loadingTextNew.x = (this.loadingContainer.width - this.loadingTextNew.width)/2
        this.loadingTextNew.y = this.loadingText.y-26
        this.loadingContainer.addChild(this.loadingTextNew)
     

        this.soundBtnInactive = new PIXI.Sprite(this.loadingAssets.loading.textures['ex.png'])
        this.soundBtnInactive.interactive = true
        this.soundBtnInactive.cursor = 'pointer'
        this.soundBtnsCont.addChild(this.soundBtnInactive)

        this.soundBtnActive = new PIXI.Sprite(this.loadingAssets.loading.textures['check.png'])
        this.soundBtnActive.interactive = true
        this.soundBtnActive.cursor = 'pointer'
        this.soundBtnActive.x = this.soundBtnInactive.width*2.5
        this.soundBtnsCont.addChild(this.soundBtnActive)

        this.soundBtnsCont.x = (this.loadingContainer.width - this.soundBtnsCont.width)/2
        this.soundBtnsCont.y = this.loadingTextNew.y*1.3
        this.loadingContainer.addChild(this.soundBtnsCont)
        this.loadingContainer.x = (this.app.screen.width - this.loadingContainer.width)/2
        this.loadingContainer.y = (this.app.screen.height - this.loadingContainer.height)/2
        
        this.soundBtnInactive.addEventListener('pointerdown',()=>{
            this.introScreen(loadedAssets,false)
        })
        this.soundBtnActive.addEventListener('pointerdown',()=>{
            this.introScreen(loadedAssets,true)
        })
        this.screenSize()

        //this.introScreen(loadedAssets,true)
    }
    private introScreen(loadedAssets:(assets:any,app:PIXI.Application)=>void,bool:boolean){
        this.soundPrompt(bool)
        this.app.stage.removeChild(this.loadingContainer)
        this.app.stage.removeChild(this.loadingBg)
        loadedAssets(this.gameAssets,this.app)
    }

    private screenSize(){
        let el = document.getElementsByTagName("canvas")[0];
        this.screenSetting = Functions.screenSize();
        this.app.renderer.resize(this.screenSetting.baseWidth,this.screenSetting.baseHeight);
        el.style.width =  this.screenSetting.newGameWidth + "px";
        el.style.height =  this.screenSetting.newGameHeight + "px";
        el.style.margin =   this.screenSetting.newGameY + "px " + this.screenSetting.newGameX + "px";
        // let setputa = setTimeout(() => {
            if(this.screenSetting.screentype == 'portrait'){
                // el.style.width =  this.screenSetting.newGameWidth + "px";
                this.loadingBg.texture = Functions.loadTexture(this.loadingAssets,'loading','loading_background_mobile').texture
                this.loadingBg.width = this.screenSetting.baseWidth
                this.loadingBg.height = this.screenSetting.baseHeight
                this.loadingContainer.scale.set(0.9)
                this.loadingContainer.x = (this.screenSetting.baseWidth - this.loadingContainer.width)/2
                this.loadingContainer.y = (this.screenSetting.baseHeight  - this.loadingContainer.height)/2
                this.loadingTextNew.x = (this.loadingContainer.width - this.loadingTextNew.width)/2 + 50
                this.soundBtnsCont.x = (this.loadingContainer.width - this.soundBtnsCont.width)/2 + 50
            }else{
                // el.style.width =  this.screenSetting.newGameWidth+100 + "px";
                this.loadingBg.texture = Functions.loadTexture(this.loadingAssets,'loading','loading_background').texture
                this.loadingBg.width = this.screenSetting.baseWidth
                this.loadingBg.height = this.screenSetting.baseHeight
                this.loadingContainer.scale.set(1)       
                this.loadingContainer.x = (this.screenSetting.baseWidth - this.loadingContainer.width)/2
                this.loadingContainer.y = (this.screenSetting.baseHeight  - this.loadingContainer.height)/2
                this.loadingTextNew.x = (this.loadingContainer.width - this.loadingTextNew.width)/2 
            }
        //     clearInterval(setputa)
        // },60)
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