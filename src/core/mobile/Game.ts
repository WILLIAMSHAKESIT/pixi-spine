import 'pixi-spine' 
import * as PIXI from 'pixi.js';
import Loader from "./components/Loader";
import Slot from './components/Slot';
import Congrats from './components/Congrats';
import PopUps from './components/PopUps';
import Controller from './components/Controller';
import Modal from './components/Modal';
import Transition from './components/Transition';
import IntroScreen from './components/IntroScreen';
import Functions from './settings/Functions';
import json from './settings/settings.json'
import {Spine} from 'pixi-spine';
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import {Howler} from 'howler';
// give the plugin a reference to the PIXI object
PixiPlugin.registerPIXI(PIXI);
export default class GameMobile{
    private app:PIXI.Application
    private textureArray:any
    private gameContainer:PIXI.Container;
    private gameBackground:PIXI.Sprite
    private matchingBlocksContainer:PIXI.Container
    private plantContainerRight:PIXI.Container
    private plantContainerLeft:PIXI.Container
    private baseWidth:number;
    private baseHeight:number;
    private slotGame:Slot;
    private controller:Controller   
    private modal:Modal
    private congrats:Congrats
    private popUps:PopUps
    private transition:Transition
    private spinType:string = 'normal'
    //texttures
    private textureToggleOn:PIXI.Texture
    private textureToggleOff:PIXI.Texture
    private textureRollOn:PIXI.Texture
    private textureRollOff:PIXI.Texture
    private spinTextureOn:PIXI.Texture
    private spinTextureOff:PIXI.Texture
    //sprites
    private buyBonusBtn:PIXI.Sprite
    private buyBonusFrame:PIXI.Sprite
    private overlay:PIXI.Sprite
    private intro:IntroScreen
    private paylineBackDrop:PIXI.Sprite
    // values
    private betAmount:number = 1
    private betIndex:number = 0
    private userCredit:number = 999
    private matchingGameWin:number = 0
    private isAutoPlay:boolean = false
    private isMatchingGame:boolean = false
    //text style 
    private textStyle:PIXI.TextStyle
    private textStyle2:PIXI.TextStyle
    private textStyle3:PIXI.TextStyle
    private whiteYellow:PIXI.TextStyle
    private descText:PIXI.TextStyle
    private textStyleSize:number = 55
    //text values
    private buyBonusText:PIXI.Text
    private paylineText:PIXI.Text
    private paylineTextBottom:PIXI.Text
    private paylineGreetings:string
    //arrays 
    private paylineContainersAnimation:Array<any> = []
    private paylineAnimations:Array<any> = []
    //spines
    private popGlow:Spine
    private popGlow2:Spine
    //free spin
    private isFreeSpin:boolean = false;
    private transitionDelay:number = 2000
    private isOpenModal:boolean = false;
    private winFreeSpin:number = 0
    private noOfSpin:number = 0
    //frame glow 
    private frameGlow:Spine
    private firefliesArray:Array<Spine> = []
    //sound
    private sounBtnSpriteOn:PIXI.Texture
    private sounBtnSpriteOff:PIXI.Texture
    //sound 
    private sound:Array<any>;
    private globalSound:Boolean = false;
    private ambientCheck:Boolean = false;
    private sfxCheck:Boolean = false;
    public load:Loader;
    //plants
    private plant1Right:Spine
    private plant2Right:Spine
    private plant3Right:Spine
    private plant4Right:Spine
    private plant5Right:Spine
    private plant1Left:Spine
    private plant2Left:Spine
    private plant3Left:Spine
    private plant4Left:Spine
    private plant5Left:Spine
    private vines:Spine


    //FOR MOBILE TEMPORARY

    //settings
    private screenSetting:any;

    private paylineTextY:number = 0
    private paylineTextX:number = 0
    
    private paylineTextBtmY:number = 0
    private paylineTextBtmX:number = 0

    private paylineSymbolX:number = 0
    private paylineSymbolY:number = 0

    private paylineContainer:PIXI.Container
    
    private infoContainer:PIXI.Sprite

    //GET BONUS
    private freeSpinHeight:number = 0
    private freeSpinWidth:number = 0
    private freeSpinX:number = 0
    private freeSpinY:number = 0
       
    private moneySlot:PIXI.Sprite
    private wildSlot:PIXI.Sprite
    private glowX:number = 0
    private glowX2:number = 0
    private glowY2:number = 0
    private moneyBoardX:number = 0
    private moneyBoardY:number = 0
    private leavesRotate:number = 0 

    private isOpenSetting:boolean = false
    private isOpenBuyBonusFrame:boolean = false
    private isOpenAutoplay:boolean = false
    private isOpenCongrats:boolean = false
    private isOpenInfo:boolean = false
    private openTransition:boolean = false

    private eventStart:boolean = false

    private isOpenFreeSpinModals:boolean = false

    //FOR MOBILE TEMPORARY


    // SOUNDS
    private fadeDurationBgm:number = 4000
    private fadeOutDelay:number = 8000
     
    constructor(){
        this.matchingBlocksContainer = new PIXI.Container
        this.gameContainer = new PIXI.Container
        this.plantContainerRight = new PIXI.Container
        this.plantContainerLeft = new PIXI.Container
        this.paylineContainer = new PIXI.Container
        this.gameContainer.sortableChildren = true
        this.whiteYellow = new PIXI.TextStyle({  
            fontFamily: 'Eras ITC',
            fontSize: 120,
            fontWeight: 'bolder',
            fill: ['#fffdfa', '#fec159'], // gradient
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 3,
            wordWrap: false,
            wordWrapWidth: 440,
            lineJoin: 'round',
        });
        this.textStyle = new PIXI.TextStyle({  
            fontFamily: 'Eras ITC',
            fontSize: this.textStyleSize,
            fontWeight: 'bolder',
            fill: ['#ffeaa0', '#ffc260'], // gradient
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#aa521d',
            dropShadowBlur: 0,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 3,
            wordWrap: false,
            wordWrapWidth: 440,
            lineJoin: 'round',
        });
        this.textStyle2 = new PIXI.TextStyle({  
            fontFamily: 'Eras ITC',
            fontSize: 120,
            fontWeight: 'bolder',
            fill: ['#ffffff', '#ffffff'], // gradient
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 3,
            wordWrap: true,
            wordWrapWidth: 440,
            lineJoin: 'round',
        });
        this.textStyle3 = new PIXI.TextStyle({  
            fontFamily: 'Eras ITC',
            fontSize: 40,
            fontWeight: 'bolder',
            fill: ['#ffffff', '#ffffff'], // gradient
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 3,
            wordWrap: false,
            wordWrapWidth: 440,
            lineJoin: 'round',
        });
        this.descText = new PIXI.TextStyle({  
            fontFamily: 'Eras ITC',
            fontSize: 30,
            fill: ['#ffffff', '#ffffff'], // gradient
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 3,
            wordWrap: true,
            wordWrapWidth: 440,
            lineJoin: 'round',
        });
        new Loader(this.init.bind(this),this.sounds.bind(this))
    }
    private init(res:any,app:PIXI.Application){
        this.app = app
        this.screenSetting = Functions.screenSize();
        this.app.renderer.resize(1920,1080);
        this.baseWidth = this.app.screen.width
        this.baseHeight = this.app.screen.height
        this.textureArray = res
        this.textureToggleOn = Functions.loadTexture(this.textureArray,'modal','on').texture
        this.textureToggleOff = Functions.loadTexture(this.textureArray,'modal','off').texture
        this.textureRollOn = Functions.loadTexture(this.textureArray,'modal','roll_active').texture
        this.textureRollOff = Functions.loadTexture(this.textureArray,'modal','roll').texture
        this.textureRollOff = Functions.loadTexture(this.textureArray,'modal','roll').texture
        this.spinTextureOn = Functions.loadTexture(this.textureArray,'controller','spin_button').texture
        this.spinTextureOff = Functions.loadTexture(this.textureArray,'controller','spin_pause_button').texture
        this.sounBtnSpriteOff =  Functions.loadTexture(this.textureArray,'controller','sound_off_button').texture
        this.sounBtnSpriteOn =  Functions.loadTexture(this.textureArray,'controller','sound_on_button').texture
        this.paylineBackDrop = Functions.loadTexture(this.textureArray,'controller_mobile','rectangle_text')
        this.popGlow = new Spine(this.textureArray.pop_glow.spineData)
        this.popGlow2 = new Spine(this.textureArray.pop_glow.spineData)

        //FOR MOBILE
        this.moneySlot = Functions.loadTexture(this.textureArray,'bonus','money_wilds')
        this.wildSlot = Functions.loadTexture(this.textureArray,'bonus','multiplier_wilds')

        this.infoContainer = Functions.loadTexture(this.textureArray,'controller_mobile','info_container')
        this.buyBonusFrame = Functions.loadTexture(this.textureArray,'bonus','get_free_spin')
        //FOR MOBILE


        //overlay
        this.overlay = Functions.loadTexture(this.textureArray,'modal','overlay')
        this.createGame()
        this.createPlants()
        this.createSlot()
        this.createFrameGlow()
        this.createController()
        this.createBuyBonus()
        this.createModal()
        this.events()
        this.updateTextValues()
        this.createIntro()
        this.app.stage.addChild(this.gameContainer);

        window.document.addEventListener('keydown', (e)=> {
            if(e.code === 'Space'  || e.key === 'Enter'){         
                // console.log(this.slotGame.isSpinning, " this.slotGame.isSpinning")
                // console.log(this.isAutoPlay, " this.isAutoPlay")
                // console.log(this.isMatchingGame, " this.isMatchingGame")
                // console.log(this.isFreeSpin, " this.isFreeSpin")
                // console.log(this.isOpenModal, " this.isOpenModal")
                if(!this.slotGame.isSpinning && !this.isAutoPlay && !this.isMatchingGame && !this.isFreeSpin && !this.isOpenModal){
                  
                    this.slotGame.timeScale = 0 
                    if(this.slotGame.notLongPress === true) {
                        this.slotGame.notLongPress = false;
                        this.spinType = 'normal'
                        this.startSpin(this.spinType)
                    }else{
                        this.spinType = 'turbo'
                        this.startSpin(this.spinType)
                    }
                }else{ 
                    this.slotGame.timeScale = 10
                }
            }
        });
        window.document.addEventListener('keyup', ()=> {
            this.slotGame.notLongPress = true;
        });
        window.addEventListener('resize',()=>{
            this.screenSize()
        })
        this.screenSize()
        Howler.mute(true)
        // toggle sound on tab enter and leave
        document.addEventListener("visibilitychange", ()=> {
            if (document.hidden){
                Howler.mute(true)
            } else {
                Howler.mute(false)
            }
        });
    }
    private screenSize(){
        this.screenSetting = Functions.screenSize();
        this.gameBackground.width = this.screenSetting.baseWidth
        this.app.renderer.resize(this.screenSetting.baseWidth,this.screenSetting.baseHeight);
        let portraitBg = Functions.loadTexture(this.textureArray,'main', `${this.slotGame.isFreeSpin || this.isMatchingGame?'bg_mobile2':'bg_mobile' }`).texture
        let landscapeBg = Functions.loadTexture(this.textureArray,'main',`${this.slotGame.isFreeSpin || this.isMatchingGame?'bg2':'bg'}`).texture
        let setputa = setTimeout(() => {
        if(this.screenSetting.screentype == 'portrait'){
            this.overlay.texture = Functions.loadTexture(this.textureArray,'controller_mobile','overlay_portrait').texture
            this.modal.overlay.texture = Functions.loadTexture(this.textureArray,'controller_mobile','overlay_portrait').texture
            //slot container rescale
            this.slotGame.container.scale.set(0.7)
            this.slotGame.container.x = -80

            //background rescale
            this.gameBackground.texture = portraitBg
            this.gameBackground.height = this.screenSetting.baseHeight
            this.gameBackground.width = this.screenSetting.baseWidth
            
            //levelbarIndicator
            this.slotGame.levelBarContainer.scale.set(1)
            this.slotGame.levelBarBg.y = this.slotGame.frameBorder.height +100
            this.slotGame.levelBarIndicator.x = this.slotGame.levelBarBg.x+3
            this.slotGame.levelBarIndicator.y = this.slotGame.levelBarBg.y
            this.slotGame.itemMini.y = this.slotGame.levelBarBg.y - 30
            this.slotGame.itemMajor.y = this.slotGame.levelBarBg.y - 42
            this.slotGame.itemGrand.y = this.slotGame.levelBarBg.y -28 
            this.slotGame.logo.scale.set(1)
            this.slotGame.logo.y = 20
            this.slotGame.levelBarContainer.x = (this.baseWidth - this.slotGame.levelBarContainer.width)/2
            this.slotGame.logo.x = (this.slotGame.frameBorder.width - this.slotGame.logo.width)/1.6
            //FREE SPIN
          
            //CONTROLLER PARENT
            if(this.isMatchingGame || this.eventStart){
                this.controller.parentSprite.texture = Functions.loadTexture(this.textureArray,'controller_mobile_darkmode','mobile_controllers_darkmode').texture
                this.controller.settingBtnSpite.texture = Functions.loadTexture(this.textureArray,'controller_mobile_darkmode','system_settings_darkmode').texture
                this.controller.infoBtnSprite.texture = Functions.loadTexture(this.textureArray,'controller_mobile_darkmode','info_darkmode').texture
                
            }else{
                this.controller.parentSprite.texture = Functions.loadTexture(this.textureArray,'controller_mobile','controller_parent').texture
                this.controller.settingBtnSpite.texture = Functions.loadTexture(this.textureArray,'controller_mobile','system_settings').texture
                this.controller.infoBtnSprite.texture = Functions.loadTexture(this.textureArray,'controller_mobile','info_button').texture
            }
         
            this.controller.parentSprite.width = this.screenSetting.baseWidth
            this.controller.container.y = this.screenSetting.baseHeight/2  -  this.controller.parentSprite.height + 100
            this.controller.container.x = 0
            //CONTROLLER CHILDREN
            this.controller.spinBtnSprite.y = this.controller.parentSprite.y + 15
            this.controller.spinBtnSprite.x = 445
            this.controller.spinBtnSprite.scale.set(2.3)

            this.controller.autoPlay.x = 878
            this.controller.autoPlay.y = this.controller.parentSprite.y + 116
            this.controller.autoPlay.scale.set(2.4)

            this.controller.settingBtnSpite.scale.set(1)
           
            this.controller.settingBtnSpite.x = 130
            this.controller.settingBtnSpite.y = this.controller.parentSprite.y + 116

            this.controller.betContainerSprite.texture = Functions.loadTexture(this.textureArray,'controller_mobile','rectangle_container').texture
            this.controller.betContainerSprite.y = this.screenSetting.baseHeight/2 + 350
            this.controller.betContainerSprite.x = 70
            this.controller.betContainerSprite.scale.set(0.8)
            this.controller.betText.x = (this.controller.betContainerSprite.width - (this.controller.betText.width/2))/2 
            this.controller.betText.y = this.controller.betContainerSprite.height / 2 - 35
            this.controller.betText.scale.set(1.3)

            
            this.controller.creditContainerSprite.texture = Functions.loadTexture(this.textureArray,'controller_mobile','rectangle_container').texture
            this.controller.creditContainerSprite.scale.set(0.8)
            
            this.controller.creditContainerSprite.y = this.screenSetting.baseHeight/2 + 350
            this.controller.creditContainerSprite.x = 730
            this.controller.creditText.scale.set(1.3)
            this.controller.creditText.x = (this.controller.creditContainerSprite.width - (this.controller.creditText.width/2))/2
            this.controller.creditText.y = this.controller.betContainerSprite.height / 2 - 35
            
            this.updatePaylineText(this.paylineTextBottom.text,this.paylineText.text)
            this.controller.parentSprite.removeChild(this.paylineContainer)
            this.gameContainer.addChild(this.paylineContainer)
            this.paylineContainer.y = (this.slotGame.container.height + this.slotGame.container.y)*1.1
            this.paylineBackDrop.visible = true
            this.paylineBackDrop.y = this.paylineContainer.y + (this.paylineContainer.height-this.paylineBackDrop.height)/2

            this.paylineSymbolX = 0
            this.paylineSymbolY = (this.controller.parentSprite.height - this.paylineTextBottom.height) - 1000

            this.controller.infoBtnSprite.scale.set(1)
            this.controller.infoBtnSprite.x = this.gameBackground.width - this.controller.infoBtnSprite.width - 16
            this.controller.infoBtnSprite.y = 700

            this.infoContainer.alpha = 111
            this.infoContainer.y = this.controller.infoBtnSprite.y - 20
            this.infoContainer.zIndex = -1
            this.infoContainer.x = this.gameBackground.width - this.infoContainer.width

            this.buyBonusBtn.y = (this.controller.container.y + this.infoContainer.y)
            this.buyBonusBtn.x = 0

            this.controller.soundBtnSprite.alpha = 0
            
            this.freeSpinHeight = 800
            this.freeSpinX = (this.screenSetting.baseWidth - this.buyBonusFrame.width)/2
            this.glowX = 590

            //BONUS FRAME
            if(this.isOpenBuyBonusFrame){
                this.buyBonusFrame.x = (this.screenSetting.baseWidth - this.buyBonusFrame.width)/2
                this.popGlow.x = this.buyBonusFrame.x + 325
            }

            //POPGLOW
            this.glowX2 = 570
            this.glowY2 = 1644
            this.popGlow2.x = 570
            this.popGlow2.y = 1644
            if(this.isOpenFreeSpinModals){
            this.moneySlot.x = (this.baseWidth - this.moneySlot.width)/2 - 400
            this.moneySlot.y = 380
            }
            //this.moneyBoardX = 
            this.moneyBoardY = 380
            //this.transition.leaves.rotation = 0
            this.leavesRotate = 190

            this.frameGlow.y = this.screenSetting.baseHeight - this.controller.parentSprite.height + 240
            this.frameGlow.x = this.frameGlow.width / 2 - 180


            //MODALS
            this.modal.modalFrame.texture = Functions.loadTexture(this.textureArray,'controller_mobile','modal_container').texture
            this.modal.modalFrame.x = (this.gameBackground.width - this.modal.modalFrame.width)  / 2
            this.modal.modalFrame.y = (this.gameBackground.height - this.modal.modalFrame.height)  / 2
           
            if(this.isOpenSetting){
                this.modal.modalTitle.x = (this.modal.modalFrame.width - this.modal.modalTitle.width)/2
                this.modal.closeModal.x = (this.modal.modalFrame.width - this.modal.closeModal.width) - 40
                this.modal.closeModal.y = 45
                this.modal.separator.alpha = 0

                this.modal.leftContainer.scale.set(1.7)
                this.modal.leftContainer.x = (this.modal.modalFrame.width - this.modal.leftContainer.width)/2 
                this.modal.leftContainer.y = 300
            
                this.modal.rightContainer.scale.set(1.5)
                this.modal.rightContainer.y = (this.modal.modalFrame.height - this.modal.rightContainer.height)/2 
                this.modal.rightContainer.x =  (this.modal.modalFrame.width - this.modal.rightContainer.width)/2 
            }

            if(this.isOpenAutoplay){
                this.modal.closeModal.x = (this.modal.modalFrame.width - this.modal.closeModal.width) - 40
                this.modal.closeModal.y = 45
                this.modal.btnContainer.visible = false
                this.modal.btn2Container.visible = true
                this.modal.autoPlaySettingsCont.x = (this.modal.modalFrame.width - this.modal.autoPlaySettingsCont.width)/2
                this.modal.autoPlaySettingsCont.y = (this.modal.modalFrame.height - this.modal.autoPlaySettingsCont.height)/2
                this.modal.btn2Container.scale.set(1.3)
                this.modal.btn2Container.x = 0
                this.modal.btn2Container.y = -300
                this.modal.bottomContainer.x = (this.modal.autoPlaySettingsCont.width - this.modal.bottomContainer.width)/2
                this.modal.bottomContainer.scale.set(1.3)
            }

            if(this.isOpenInfo){
                this.modal.closeModal.x = (this.modal.modalFrame.width - this.modal.closeModal.width) - 40
                this.modal.closeModal.y = 45
                  //PREVIOUS AND NEXT BUTTON
                this.modal.prevBtn.y = (this.modal.modalFrame.height - this.modal.prevBtn.height)/2
                this.modal.nextBtn.y = (this.modal.modalFrame.height - this.modal.nextBtn.height)/2
                this.modal.nextBtn.x = (this.modal.modalFrame.width - this.modal.nextBtn.width) -30 
                this.modal.pageTitle.x = (this.modal.modalFrame.width - this.modal.pageTitle.width)/2
                this.modal.pageDesc.x = (this.modal.modalFrame.width - this.modal.pageDesc.width)/2
                this.modal.pageText.x = (this.modal.modalFrame.width - this.modal.pageText.width)/2
           
            }

            //CONGRATS POPUP
            if(this.isOpenCongrats){
                this.congrats.overlay.texture = Functions.loadTexture(this.textureArray,'controller_mobile','overlay_portrait').texture
                this.congrats.logo.x = (this.overlay.width)/2
                this.congrats.logo.y = (this.overlay.height)/2
                this.congrats.popGlow.x =  (this.overlay.width)/2
                this.congrats.descText.x = (this.overlay.width - this.congrats.descText.width)/2
                this.congrats.descText.y = ((this.overlay.height - this.congrats.descText.height)/2)*0.46
                this.congrats.spins.x = (this.overlay.width - this.congrats.spins.width)/2
                this.congrats.spins.y = (this.overlay.height - this.congrats.spins.height)/2 - 200
                this.congrats.clickAnyTxt.x =  (this.overlay.width - this.congrats.clickAnyTxt.width)/2
                this.congrats.clickAnyTxt.y =  (this.overlay.width - this.congrats.clickAnyTxt.width) + 30
                this.congrats.money.x = (this.overlay.width - this.congrats.money.width)/2
                this.congrats.money.y = ((this.overlay.height - this.congrats.money.height)/2)- 330
            }

            // //LOADER
            // this.load.loadingContainer.x = (this.screenSetting.baseWidth - this.load.loadingContainer.width)/2
            // this.load.loadingContainer.y = (this.screenSetting.height  - this.load.loadingContainer.height)/2
            // this.load.loadingTextNew.x = 0

            //INFO MODAL
           
          

            // ALIGNING OF ALL PAGES X AXIS
            this.modal.infoFirstPageContainerPortrait.x = (this.modal.modalFrame.width - this.modal.infoFirstPageContainerPortrait.width)/2- 200
            this.modal.infoSecondPageContainer.x = (this.modal.modalFrame.width - this.modal.infoSecondPageContainer.width)/2
            this.modal.infoThirdPageContainerPortrait.x = (this.modal.modalFrame.width - this.modal.infoThirdPageContainerPortrait.width)/2 
           
            // ALIGNING OF ALL PAGES Y AXIS
                this.modal.infoSecondPageContainer.y = (this.modal.modalFrame.height - this.modal.infoFifthPageContainerPortrait.height)/2 
              this.modal.infoThirdPageContainerPortrait.y = (this.modal.modalFrame.height - this.modal.infoThirdPageContainerPortrait.height)/2 
           
            //CHECK THE CURRENT PAGE
            if(this.modal.currentPage == 0) {
                this.modal.infoFirstPageContainerPortrait.alpha = 1
                this.modal.infoFirstPageContainer.alpha = 0
            }else if(this.modal.currentPage == 1){
                this.modal.infoSecondPageContainer.alpha = 1
                this.modal.infoSecondPageContainer.scale.set(1.4)      
            }
            else if(this.modal.currentPage == 2){
                this.modal.infoThirdPageContainerPortrait.alpha = 1
                this.modal.infoThirdPageContainer.alpha = 0
                this.modal.imgContainerPortrait.x = (this.modal.modalFrame.width - this.modal.imgContainerPortrait.width)/2 + 40
                this.modal.imgContainerPortrait.y = (this.modal.modalFrame.height - this.modal.imgContainerPortrait.height)/2 - 350
            }
            else if(this.modal.currentPage == 3){
                this.modal.infoFourthPageContainerPortrait.alpha = 1
                this.modal.infoFourthPageContainer.alpha =0   
                this.modal.image4thPortrait.x = (this.modal.modalFrame.width - this.modal.image4thPortrait.width)/2
                this.modal.image4thPortrait.y = (this.modal.modalFrame.height - this.modal.image4thPortrait.height)/2 +30    
            }
            else if(this.modal.currentPage == 4){
                this.modal.infoFifthPageContainerPortrait.alpha = 1
                this.modal.infoFifthPageContainer.alpha =0   
                this.modal.image5thPortrait.x = (this.modal.modalFrame.width - this.modal.image5thPortrait.width)/2
                this.modal.image5thPortrait.y = (this.modal.modalFrame.height - this.modal.image5thPortrait.height)/2 +30    
            }
            else if(this.modal.currentPage == 5){
                this.modal.infoSixthPageContainerPortrait.alpha = 1
                this.modal.infoSixthPageContainer.alpha =0   
                this.modal.image6thPortrait.x = (this.modal.modalFrame.width - this.modal.image6thPortrait.width)/2
                this.modal.image6thPortrait.y = (this.modal.modalFrame.height - this.modal.image6thPortrait.height)/2 +30    
            }

            //HOME
            this.intro.bg.texture = portraitBg
            this.intro.bg.height = this.screenSetting.baseHeight
            this.intro.bg.width = this.screenSetting.baseWidth
            this.intro.centerContainer.x = (this.intro.bg.width - this.intro.centerContainer.width)/2 
            this.intro.centerContainer.y = (this.intro.bg.height - this.intro.centerContainer.height)/3 
            this.intro.playBtn.x = (this.screenSetting.baseWidth - this.intro.playBtn.width) / 2
            this.intro.playBtnX =  (this.screenSetting.baseWidth - this.intro.playBtn.width) / 2
            this.intro.playBtnY = (this.screenSetting.baseWidth - this.intro.playBtn.width) + 100
            this.intro.logo.x = (this.intro.centerContainer.width - this.intro.logo.width)/2
            this.intro.playBtn.y = (this.screenSetting.baseHeight - this.intro.playBtn.height)*0.8

            //TRANSITION
            if(this.openTransition){
                this.transition.leaves.rotation = 10890.6
                this.transition.leaves.x = 100 
            }

            //safe area
            if(this.screenSetting.isSafe == 'A'){
                this.slotGame.container.y = 200
                this.controller.container.y = 300
                this.buyBonusBtn.y = this.slotGame.frameBorder.height +100
                console.log('mob a')
            }
            else if(this.screenSetting.isSafe == 'B'){
                console.log('mob b')
                this.slotGame.container.y = 200
                this.controller.container.y = 350
                this.buyBonusBtn.y = (this.controller.container.y + this.infoContainer.y)
                this.paylineContainer.y = (this.slotGame.container.height + this.slotGame.container.y)*1.1
                this.paylineBackDrop.y = this.paylineContainer.y + (this.paylineContainer.height-this.paylineBackDrop.height)/2
            }
            else if(this.screenSetting.isSafe == 'C'){
                this.slotGame.container.y = 70
                this.controller.container.y = this.screenSetting.baseHeight/2  -  this.controller.parentSprite.height + 100
                console.log('mob c')
            }
            else{
                this.controller.infoBtnSprite.x = (this.gameBackground.width - this.controller.infoBtnSprite.width)*0.96
                this.infoContainer.x = (this.controller.infoBtnSprite.x)*0.98
                this.buyBonusBtn.x = 50
                console.log('mob d')
            }
        }else{ 
            //GAME BACKGROUND 
            this.gameBackground.texture = landscapeBg

            //MODAL
            this.modal.modalFrame.texture = Functions.loadTexture(this.textureArray,'modal','modal_frame').texture
            this.slotGame.container.scale.set(1)
    
            this.overlay.texture = Functions.loadTexture(this.textureArray,'modal','overlay').texture
            this.modal.overlay.texture = Functions.loadTexture(this.textureArray,'modal','overlay').texture
            
            this.slotGame.container.x = 0
            this.modal.modalFrame.x = (this.overlay.width - this.modal.modalFrame.width)/2
            this.modal.modalFrame.y = (this.overlay.height - this.modal.modalFrame.height)/2

            //CONTROLLER PARENT
            this.controller.parentSprite.texture = Functions.loadTexture(this.textureArray,'controller_mobile','tablet_controllers').texture
            this.controller.parentSprite.width = this.screenSetting.baseWidth
            this.controller.container.y = 0
            this.controller.container.x = 0

            //FREE SPIN
            this.buyBonusBtn.y =  (this.screenSetting.baseHeight - this.buyBonusBtn.height)/2
           
            //levelbarIndicator
            this.slotGame.levelBarBg.y =  this.slotGame.frameBorder.y * 0.7
            this.slotGame.levelBarContainer.scale.set(0.6)
            this.slotGame.levelBarIndicator.x = this.slotGame.levelBarBg.x+3
            this.slotGame.levelBarIndicator.y =this.slotGame.levelBarBg.y
            this.slotGame.itemMini.y =  this.slotGame.levelBarBg.y - 30
            this.slotGame.itemMajor.y = this.slotGame.itemMini.y - 13
            this.slotGame.itemGrand.y =  10
            this.slotGame.logo.scale.set(0.7)
            this.slotGame.logo.x = this.slotGame.frameBorder.x
            this.slotGame.logo.y = this.slotGame.frameBorder.y
            this.slotGame.levelBarContainer.x = (this.slotGame.frameBorder.x + (this.slotGame.frameBorder.width - this.slotGame.levelBarContainer.width))*0.96
             this.slotGame.container.y = 0

            //CONTROLLER CHILDREN
            this.controller.spinBtnSprite.scale.set(1.3)
            this.controller.spinBtnSprite.y = this.controller.parentSprite.y - 450
            this.controller.spinBtnSprite.x =  (this.controller.parentSprite.width - this.controller.spinBtnSprite.width) 
            
            this.controller.autoPlay.scale.set(1.4)
            this.controller.autoPlay.x = (this.controller.parentSprite.width - this.controller.autoPlay.width) - 45
            this.controller.autoPlay.y = (this.controller.parentSprite.y + this.controller.parentSprite.height) - this.controller.autoPlay.height*1.2 - 330
           

            this.controller.settingBtnSpite.texture = Functions.loadTexture(this.textureArray,'controller','system_settings').texture
            this.controller.settingBtnSpite.scale.set(1.3)
            this.controller.settingBtnSpite.x = this.controller.settingBtnSpite.width *1.5 -93
            this.controller.settingBtnSpite.y = this.controller.parentSprite.y+72

            this.controller.betContainerSprite.texture = Functions.loadTexture(this.textureArray,'controller','bet_container').texture
            this.controller.betContainerSprite.scale.set(1)
            this.controller.betContainerSprite.y = this.controller.parentSprite.y + 90
            this.controller.betContainerSprite.x = this.controller.betContainerSprite.width*0.95
           
            this.controller.betText.scale.set(1)
            this.controller.betText.x = (this.controller.betContainerSprite.width - this.controller.betText.width)/2 
            this.controller.betText.y = this.controller.betContainerSprite.height / 2 - 35
           
            this.controller.creditContainerSprite.scale.set(1)
            this.controller.creditContainerSprite.texture = Functions.loadTexture(this.textureArray,'controller','credits_container').texture
            this.controller.creditContainerSprite.y = this.controller.parentSprite.y + 90
            this.controller.creditContainerSprite.x =  (this.controller.parentSprite.width - this.controller.creditContainerSprite.width)*0.82
            
            this.controller.creditText.scale.set(1)
            this.controller.creditText.x =  (this.controller.creditContainerSprite.width - this.controller.creditText.width)/2
            this.controller.creditText.y = this.controller.betContainerSprite.height / 2 - 35
            
            this.paylineBackDrop.visible = false
            this.controller.parentSprite.addChild(this.paylineContainer)
            this.gameContainer.removeChild(this.paylineContainer)
            this.updatePaylineText(this.paylineTextBottom.text,this.paylineText.text)
            
            this.infoContainer.alpha = 0
            this.controller.infoBtnSprite.texture = Functions.loadTexture(this.textureArray,'controller','info_button').texture
            this.controller.infoBtnSprite.scale.set(1.2)
            this.controller.infoBtnSprite.x = (this.controller.parentSprite.width - this.controller.spinBtnSprite.width) - 89
            this.controller.infoBtnSprite.y =  this.controller.parentSprite.y+55
            
            this.paylineContainer.y = ((this.controller.parentSprite.height - this.paylineContainer.height)/2)+15
            
            this.controller.soundBtnSprite.alpha = 0

            //BONUS FRAME
            if(this.isOpenBuyBonusFrame){
                this.buyBonusFrame.x = (this.screenSetting.baseWidth - this.buyBonusFrame.width)/2
                this.popGlow.x = this.buyBonusFrame.x + 325
            }

            //POPGLOW
            this.glowX2 = 1370
            this.glowY2 = 1044
            this.popGlow2.x = 1370
            this.popGlow2.y = 1044

            if(this.isOpenFreeSpinModals){
            this.moneySlot.x = (this.baseWidth - this.moneySlot.width)/2 + 400
            this.moneySlot.y = -240
            }
            this.moneyBoardY = -240

           // this.transition.leaves.rotation = 0
           this.frameGlow.x = ((this.slotGame.frameBorder.x + this.slotGame.frameBorder.width)/2)+40
           this.frameGlow.y = (this.slotGame.frameBorder.y + this.slotGame.frameBorder.height) - 20 
           this.freeSpinX = (this.screenSetting.baseWidth - this.buyBonusFrame.width)/2
           this.glowX = 960

            //CONTROLLER PARENT
            if(this.isMatchingGame || this.eventStart){
            this.controller.parentSprite.texture = Functions.loadTexture(this.textureArray,'controller_mobile','tablet_controllers').texture
            this.controller.settingBtnSpite.texture = Functions.loadTexture(this.textureArray,'controller','system_settings2').texture
            this.controller.infoBtnSprite.texture = Functions.loadTexture(this.textureArray,'controller','info_button2').texture
            }

            //MODALS
            if(this.isOpenSetting){
            this.modal.modalTitle.x =  (this.modal.modalFrame.width - this.modal.modalTitle.width)/2
            this.modal.closeModal.x = (this.modal.modalFrame.width - this.modal.closeModal.width) - 30
            this.modal.closeModal.y = 30
            this.modal.separator.alpha = 1

            this.modal.leftContainer.scale.set(1)
            this.modal.leftContainer.x = (this.modal.separator.x - this.modal.leftContainer.width) / 2 
            this.modal.leftContainer.y =  (this.modal.modalFrame.height - this.modal.leftContainer.height)/2 + 50
            
            this.modal.rightContainer.scale.set(1)
            this.modal.rightContainer.y = (this.modal.modalFrame.height - this.modal.rightContainer.height)/2 
            this.modal.rightContainer.x =  this.modal.separator.x + 60
            this.modal.separator.x = (this.modal.modalFrame.width - this.modal.separator.width)/2
            this.modal.separator.y = (this.modal.modalFrame.height - this.modal.separator.height)/2
            }
            if(this.isOpenAutoplay){
                this.modal.closeModal.x = (this.modal.modalFrame.width - this.modal.closeModal.width) - 30
                this.modal.closeModal.y = 30
                this.modal.btnContainer.visible = true
                this.modal.btn2Container.visible = false
                this.modal.autoPlaySettingsCont.x = (this.modal.modalFrame.width - this.modal.autoPlaySettingsCont.width)/2
                this.modal.autoPlaySettingsCont.y = (this.modal.modalFrame.height - this.modal.autoPlaySettingsCont.height)/2
                this.modal.bottomContainer.x = (this.modal.autoPlaySettingsCont.width - this.modal.bottomContainer.width)/2
                this.modal.btn2Container.scale.set(1)
                this.modal.bottomContainer.scale.set(1)
            }
            
            if(this.isOpenInfo){
                this.modal.closeModal.x = (this.modal.modalFrame.width - this.modal.closeModal.width) - 30
                this.modal.closeModal.y = 30
                 //PREVIOUS AND NEXT BUTTON
                this.modal.prevBtn.y = (this.modal.modalFrame.height - this.modal.prevBtn.height)/2
                this.modal.nextBtn.y = (this.modal.modalFrame.height - this.modal.nextBtn.height)/2
                this.modal.nextBtn.x = (this.modal.modalFrame.width - this.modal.nextBtn.width) -30 
                this.modal.pageTitle.x = (this.modal.modalFrame.width - this.modal.pageTitle.width)/2
                this.modal.pageDesc.x = (this.modal.modalFrame.width - this.modal.pageDesc.width)/2
                this.modal.pageText.x = (this.modal.modalFrame.width - this.modal.pageText.width)/2
                
            }

            //CONGRATS POPUP
            if(this.isOpenCongrats){
                this.congrats.overlay.texture =  Functions.loadTexture(this.textureArray,'modal','overlay').texture
                this.congrats.logo.x = (this.overlay.width)/2
                this.congrats.logo.y = (this.overlay.height)/1.2
                this.congrats.popGlow.x =  (this.overlay.width)/2
                this.congrats.descText.x = (this.overlay.width - this.congrats.descText.width)/2
                this.congrats.descText.y = ((this.overlay.height - this.congrats.descText.height)/2)*0.74
                this.congrats.spins.x = (this.overlay.width - this.congrats.spins.width)/2
                this.congrats.spins.y = (this.overlay.height - this.congrats.spins.height)/1.5
                this.congrats.clickAnyTxt.x =  (this.overlay.width - this.congrats.clickAnyTxt.width)/2
                this.congrats.clickAnyTxt.y =  (this.overlay.height - this.congrats.clickAnyTxt.height)/1.4
                this.congrats.money.x = (this.overlay.width - this.congrats.money.width)/2
                this.congrats.money.y =((this.overlay.height - this.congrats.money.height)/2)*1.06
            }

            //INFO MODAL
            this.modal.infoSecondPageContainer.scale.set(1)

            // ALIGNING OF ALL PAGES X AXIS INFO MODAL
            this.modal.infoFirstPageContainer.x = (this.modal.modalFrame.width - this.modal.infoFirstPageContainer.width)/2
            this.modal.infoSecondPageContainer.x = (this.modal.modalFrame.width - this.modal.infoSecondPageContainer.width)/2
            this.modal.infoThirdPageContainer.x = (this.modal.modalFrame.width - this.modal.infoThirdPageContainer.width)/2 
            this.modal.infoFourthPageContainer.x =0

            // ALIGNING OF ALL PAGES Y AXIS INFO MODAL
            this.modal.infoSecondPageContainer.y = (this.modal.modalFrame.height - this.modal.infoSecondPageContainer.height)/2
            this.modal.infoThirdPageContainer.y =((this.modal.modalFrame.height - this.modal.infoThirdPageContainer.height)/2) + 50
  
            //CHECK THE CURRENT PAGE FOR INFO MODAL
            if(this.modal.currentPage == 0) {
                this.modal.infoFirstPageContainerPortrait.alpha = 0
                this.modal.infoFirstPageContainer.alpha = 1
            }
            else if(this.modal.currentPage == 1){
                this.modal.infoSecondPageContainer.alpha = 1
            }
            else if(this.modal.currentPage == 2){
                this.modal.infoThirdPageContainerPortrait.alpha = 0
                this.modal.infoThirdPageContainer.alpha = 1    
                this.modal.imgContainer.x = (this.modal.modalFrame.width - this.modal.imgContainer.width)/2
                this.modal.imgContainer.y = (this.modal.modalFrame.height - this.modal.imgContainer.height)/2 - 120
            }
            else if(this.modal.currentPage == 3){
                this.modal.infoFourthPageContainerPortrait.alpha = 0
                this.modal.infoFourthPageContainer.alpha = 1    
                this.modal.image4th.x = (this.modal.modalFrame.width - this.modal.image4th.width)/2
                this.modal.image4th.y = (this.modal.modalFrame.height - this.modal.image4th.height)/2 +30   
            }
            else if(this.modal.currentPage == 4){
                this.modal.infoFifthPageContainerPortrait.alpha = 0
                this.modal.infoFifthPageContainer.alpha = 1   
                this.modal.image5th.x = (this.modal.modalFrame.width - this.modal.image5th.width)/2
                this.modal.image5th.y = (this.modal.modalFrame.height - this.modal.image5th.height)/2 +30    
            }
            else if(this.modal.currentPage == 5){
                this.modal.infoSixthPageContainerPortrait.alpha = 0
                this.modal.infoSixthPageContainer.alpha = 1  
                this.modal.image6th.x = (this.modal.modalFrame.width - this.modal.image6th.width)/2
                this.modal.image6th.y = (this.modal.modalFrame.height - this.modal.image6th.height)/2 +30    
            }

            //HOME
            this.intro.bg.texture = landscapeBg
            this.intro.bg.height = this.screenSetting.baseHeight
            this.intro.bg.width = this.screenSetting.baseWidth
            this.intro.centerContainer.x = (this.intro.bg.width - this.intro.centerContainer.width)/2 
            this.intro.centerContainer.y = (this.intro.bg.height - this.intro.centerContainer.height)/2 
            this.intro.playBtn.x = (this.screenSetting.baseWidth - this.intro.playBtn.width)*0.9
            this.intro.playBtn.y = (this.screenSetting.baseHeight - this.intro.playBtn.height)*0.9
            this.intro.playBtnX =  (this.screenSetting.baseWidth - this.intro.playBtn.width)*0.9
            this.intro.playBtnY = (this.screenSetting.height - this.intro.playBtn.height) *0.9
            this.intro.logo.x = (this.intro.centerContainer.width - this.intro.logo.width)/2
            
            //TRANSITION
            if(this.openTransition){
                this.transition.leaves.rotation = 0
                this.transition.leaves.x = 935.5
            }
            //safe area
            if(this.screenSetting.isSafe == 'A'){
                this.controller.spinBtnSprite.x = (this.screenSetting.baseWidth - this.controller.spinBtnSprite.width);
                this.buyBonusBtn.x = 0
                //slot
                this.slotGame.levelBarContainer.y = 50
                this.controller.container.y = -50
                console.log('desk a')
            }
            else if(this.screenSetting.isSafe == 'B'){
                this.controller.spinBtnSprite.x = (this.screenSetting.baseWidth - this.controller.spinBtnSprite.width);
                this.controller.autoPlay.x = (this.screenSetting.baseWidth - this.controller.autoPlay.width);
                this.buyBonusBtn.x = 50
                this.controller.container.y = -20
                this.paylineContainer.y = ((this.controller.parentSprite.height - this.paylineContainer.height)/2)+15
                console.log('desk b')
            }
            else if(this.screenSetting.isSafe == 'C'){
                this.controller.spinBtnSprite.x = (this.screenSetting.baseWidth - this.controller.spinBtnSprite.width) - 150;
                this.controller.autoPlay.x = (this.screenSetting.baseWidth - this.controller.autoPlay.width)- 150;
                this.buyBonusBtn.x = 200
                // slot
                this.slotGame.logo.scale.set(1)
                this.slotGame.logo.y = 0
                this.slotGame.levelBarContainer.scale.set(1)
                this.slotGame.levelBarContainer.y = 0
                this.slotGame.levelBarContainer.x = (this.slotGame.frameBorder.x + (this.slotGame.frameBorder.width - this.slotGame.levelBarContainer.width))*0.96
                this.controller.container.y = 0
                console.log('desk c')
            }
            else{

                this.controller.spinBtnSprite.x = (this.screenSetting.baseWidth - this.controller.spinBtnSprite.width) - 200;
                this.controller.autoPlay.x = (this.screenSetting.baseWidth - this.controller.autoPlay.width)- 200;
                this.buyBonusBtn.x = 200
                this.slotGame.logo.scale.set(1)
                this.slotGame.logo.x = 191.5
                this.slotGame.logo.y = 10.5
                this.slotGame.levelBarContainer.scale.set(1)
                this.slotGame.levelBarContainer.y = 0
                this.slotGame.levelBarContainer.x = (this.slotGame.frameBorder.x + (this.slotGame.frameBorder.width - this.slotGame.levelBarContainer.width))*0.92
                console.log('desk d')
            }
           
        }
        clearTimeout(setputa)
        },60)
    }

    private createIntro(){
        this.enableButtons(false)
        this.intro = new IntroScreen(this.app,this.textureArray)
        this.gameContainer.addChild(this.paylineBackDrop)
        this.paylineBackDrop.visible = false
        this.gameContainer.addChild(this.intro.container)
        this.paylineContainer.visible = false
        this.intro.playBtn.addEventListener('pointerdown',()=>{
            // initialize the sound on game enter
            if(this.globalSound){
                Howler.mute(false)
                this.controller.soundBtnSprite.texture = this.sounBtnSpriteOn 
                this.ambientCheck = true
                this.sfxCheck = true
            }
            this.playSound(12)
            this.playSound(0)
            this.playSound(16)
            this.soundVolume(16,0)
            this.playSound(17)
            this.soundVolume(17,0)
            this.intro.playBtn.interactive = false
            this.createTransition()
            let timeOut = setTimeout(()=>{
                this.enableButtons(true)
                this.intro.container.removeChild(this.intro.playBtn)
                this.gameContainer.removeChild(this.intro.container)
                this.intro.btnScaleAnimation.kill()
                this.paylineContainer.visible = true
                clearTimeout(timeOut)
            },this.transitionDelay)
        })
    }
    private createPlants(){
        //plant 5
        this.plant5Right = new Spine(this.textureArray.plant_5.spineData)
        this.plant5Right.scale.set(0.7)
        this.plant5Right.x = this.baseWidth-100
        this.plant5Right.y = this.baseHeight*0.15
        Functions.loadSpineAnimation(this.plant5Right,'animation',true,0.6)
        this.plantContainerRight.addChild(this.plant5Right)
        //plant 4
        this.plant4Right = new Spine(this.textureArray.plant_4.spineData)
        this.plant4Right.scale.set(0.7)
        this.plant4Right.x = this.baseWidth-100
        this.plant4Right.y = this.baseHeight*0.3
        Functions.loadSpineAnimation(this.plant4Right,'animation',true,0.6)
        this.plantContainerRight.addChild(this.plant4Right)
        //plant 3
        this.plant3Right = new Spine(this.textureArray.plant_3.spineData)
        this.plant3Right.scale.set(0.7)
        this.plant3Right.x = this.baseWidth-100
        this.plant3Right.y = this.baseHeight*0.5
        Functions.loadSpineAnimation(this.plant3Right,'animation',true,0.6)
        this.plantContainerRight.addChild(this.plant3Right)
        //plant 2
        this.plant2Right = new Spine(this.textureArray.plant_2.spineData)
        this.plant2Right.scale.set(0.7)
        this.plant2Right.x = this.baseWidth
        this.plant2Right.y = this.baseHeight*0.6
        Functions.loadSpineAnimation(this.plant2Right,'animation',true,0.7)
        this.plantContainerRight.addChild(this.plant2Right)
        //plant 1
        this.plant1Right = new Spine(this.textureArray.plant_1.spineData)
        this.plant1Right.scale.set(0.8)
        this.plant1Right.x = this.baseWidth
        this.plant1Right.y = this.baseHeight*0.9
        Functions.loadSpineAnimation(this.plant1Right,'animation',true,0.7)
        this.plantContainerRight.addChild(this.plant1Right)
        this.gameContainer.addChild(this.plantContainerRight)

        // plants left
        //plant 5
        this.plant5Left = new Spine(this.textureArray.plant_5.spineData)
        this.plant5Left.scale.set(0.7)
        this.plant5Left.x = this.baseWidth-100
        this.plant5Left.y = this.baseHeight*0.15
        Functions.loadSpineAnimation(this.plant5Left,'animation',true,0.6)
        this.plantContainerLeft.addChild(this.plant5Left)
        //plant 4
        this.plant4Left = new Spine(this.textureArray.plant_4.spineData)
        this.plant4Left.scale.set(0.7)
        this.plant4Left.scale.x = -1
        this.plant4Left.x = 100
        this.plant4Left.y = this.baseHeight*0.2
        Functions.loadSpineAnimation(this.plant4Left,'animation',true,0.6)
        this.plantContainerLeft.addChild(this.plant4Left)
        //plant 3
        this.plant3Left = new Spine(this.textureArray.plant_3.spineData)
        this.plant3Left.scale.set(0.7)
        this.plant3Left.scale.x = -1
        this.plant3Left.x = 100
        this.plant3Left.y = this.baseHeight*0.4
        Functions.loadSpineAnimation(this.plant3Left,'animation',true,0.6)
        this.plantContainerLeft.addChild(this.plant3Left)
        //plant 2
        this.plant2Left = new Spine(this.textureArray.plant_2.spineData)
        this.plant2Left.scale.set(0.7)
        this.plant2Left.scale.x = -1
        this.plant2Left.x = -10
        this.plant2Left.y = this.baseHeight*0.75
        Functions.loadSpineAnimation(this.plant2Left,'animation',true,0.7)
        this.plantContainerLeft.addChild(this.plant2Left)
        //plant 1
        this.plant1Left = new Spine(this.textureArray.plant_1.spineData)
        this.plant1Left.scale.set(0.8)
        this.plant1Left.scale.x = -1
        this.plant1Left.x = 10
        this.plant1Left.y = this.baseHeight*0.9
        Functions.loadSpineAnimation(this.plant1Left,'animation',true,0.7)
        this.plantContainerLeft.addChild(this.plant1Left)
        //plant 1
        this.vines = new Spine(this.textureArray.vines.spineData)
        this.vines.x = this.vines.width*0.6
        this.vines.y = 6
        Functions.loadSpineAnimation(this.vines,'animation',true,0.4)
        this.plantContainerLeft.addChild(this.vines)
        this.gameContainer.addChild(this.plantContainerLeft)
        this.createButterfly()
        
    }
    private createButterfly(){
        //butterfly 1
        const butterfly = new Spine(this.textureArray.butterfly.spineData)
        butterfly.scale.set(0.5)
        butterfly.x = -100
        butterfly.y = this.baseHeight
        let fly = gsap.to(butterfly,{
            x:(this.baseWidth - butterfly.width)*0.99,
            y:this.plant1Right.y * 0.85,
            delay:2,
            duration:3,
            onComplete:()=>{
                let fly2 = gsap.to(butterfly,{
                    x:this.baseWidth + butterfly.width,
                    y:this.plant1Right.y * 0.9,
                    delay:2,
                    duration:3,
                    onComplete:()=>{
                        fly.kill()
                        fly2.kill()
                        this.createButterfly()
                        this.plantContainerRight.removeChild(butterfly)
                    }
                })
            }
        })
        Functions.loadSpineAnimation(butterfly,'animation',true,5)
        butterfly.zIndex = 0
        this.plantContainerRight.addChild(butterfly)
    }
    private createCongrats(){
        this.fadeSound(6,0,this.fadeDurationBgm)
        this.soundVolume(0,0)
        if(!this.sound[7].playing()){
            this.playSound(7)
        }
        this.fadeSound(7,1,this.fadeDurationBgm)
        this.isOpenCongrats = true
        this.congrats = new Congrats(this.app,this.textureArray, this.winFreeSpin, this.noOfSpin)
        this.gameContainer.addChild(this.congrats.container)
        this.screenSize()
        
        this.congrats.container.cursor = 'pointer'
        this.congrats.container.interactive = true
        this.congrats.container.addEventListener('pointerdown',()=>{
            this.eventStart = false
            this.isAutoPlay = false
            this.congrats.container.interactive = false
            this.slotGame.isFreeSpinDone = true
            this.slotGame.freeSpinStart = false
            this.slotGame.isFreeSpin = false
            this.slotGame.maskSprite.height = this.slotGame.frameBg.height - 8
            this.slotGame.maskSprite.y = this.slotGame.frameBg.y - 8
            this.congrats.textAnimation.duration(0.3)
            this.isOpenModal= false
            this.createTransition()
            this.slotGame.startCountWinFreeSpin = false
            let timeout = setTimeout(()=>{
                if(!this.sound[0].playing()){
                    this.playSound(0)
                }
                this.fadeSound(7,0,this.fadeDurationBgm)
                this.fadeSound(0,1,this.fadeDurationBgm)
                this.gameContainer.removeChild(this.congrats.container)
                this.enableButtons(true)
                this.lightModeEvent(true)
                
                let show = setTimeout(() => {
                    this.isFreeSpin = false
                    this.soundStop(7)
                    clearTimeout(show);
                }, 1000);
                this.slotGame.reelContainer.forEach((data,index)=>{
                    this.slotGame.generateNewSymbols(index)      
                })  
                this.screenSize()
                clearTimeout(timeout)
            },this.transitionDelay)
        })
        this.slotGame.autoplayDoneEvent = true
    }
    private createModal(){
        this.modal = new Modal(this.app,this.textureArray, this.screenSize.bind(this))
        this.modal.closeModal.addEventListener('pointerdown',() =>{
            this.playSound(1)
            this.controller.settingBtnSpite.interactive = true
            this.controller.autoPlay.interactive = true
            this.controller.infoBtnSprite.interactive = true
        })
        this.modal.closeModal.addListener('mouseover',() =>{
            this.playSound(2)
        })
    }
    private createGame(){
        this.gameBackground = Functions.loadTexture(this.textureArray,'main','bg')
        this.gameBackground.width = this.baseWidth
        this.gameBackground.height = this.baseHeight
        this.gameContainer.addChild(this.gameBackground)
    }
    private createSlot(){
        // create slot
        this.slotGame = new Slot(this.app,this.textureArray,this.onSpinEnd.bind(this),this.matchingGame.bind(this),this.onSpinning.bind(this),this.freeSpinEvent.bind(this),this.checkIfFreeSpin.bind(this),this.createCongrats.bind(this),this.onSpin.bind(this),this.playSound.bind(this),this.soundStop.bind(this),this.sound,this.fadeSound.bind(this),this.soundVolume.bind(this))
        this.gameContainer.addChild(this.slotGame.container)
    }
    private createFrameGlow(){
        this.frameGlow = new Spine(this.textureArray.frame_glow.spineData)
        this.frameGlow.width = this.baseWidth
        this.frameGlow.x = ((this.slotGame.frameBorder.x + this.slotGame.frameBorder.width)/2)+40
        this.frameGlow.y = (this.slotGame.frameBorder.y + this.slotGame.frameBorder.height) - 20 
        this.frameGlow.visible = false
        this.gameContainer.addChild(this.frameGlow)
    }
    private createController(){
        this.controller = new Controller(this.app,this.textureArray)
        // this.gameContainer.addChild(this.paylineContainer)
        this.controller.container.addChild(this.infoContainer)
        this.createPaylineAnimation()
        this.gameContainer.addChild(this.controller.container)

        this.controller.soundBtnSprite.texture = this.sounBtnSpriteOff
        this.controller.soundBtnSprite.addListener('mouseover',() =>{
            this.playSound(2)
        })
        this.controller.soundBtnSprite.addEventListener('pointerdown',()=> {
            this.playSound(1)
            
            if(this.controller.soundBtnSprite.texture == this.sounBtnSpriteOn){
                Howler.mute(true)
                this.controller.soundBtnSprite.texture = this.sounBtnSpriteOff
                this.ambientCheck = false
                this.sfxCheck = false
                this.modal.soundBtns.forEach((data,index)=>{
                    data.texture = this.textureToggleOff
                })
            }else{
                this.controller.soundBtnSprite.texture = this.sounBtnSpriteOn 
                Howler.mute(false)
                this.ambientCheck = true
                this.sfxCheck = true
                this.modal.soundBtns.forEach((data,index)=>{
                    data.texture = this.textureToggleOn
                })
            }
            this.checkSoundToggle()
       
        })
    }
    private updateTextValues(){
       this.betTextValue()    
       this.updateCreditValues()
    }
    private betTextValue(){
        //bet value
        this.controller.betText.text = this.betAmount 
        if(this.screenSetting.screentype == 'portrait'){
            this.controller.betText.x = (this.controller.betContainerSprite.width - (this.controller.betText.width/2))/2 
        }else{
            this.controller.betText.x = (this.controller.betContainerSprite.width - this.controller.betText.width)/2 
        }

        //bet value buy bonus
        this.buyBonusText.text = this.betAmount
        this.buyBonusText.x = (this.buyBonusBtn.width - this.buyBonusText.width)/2
        this.buyBonusText.y = (this.buyBonusBtn.height - this.buyBonusText.height) - 20
    }
    private updateCreditValues(){
        //credit value
        this.controller.creditText.text = Functions.numberWithCommas(this.userCredit) 
        if(this.screenSetting.screentype == 'portrait'){
            this.controller.creditText.x = (this.controller.creditContainerSprite.width - (this.controller.creditText.width/2))/2 
        }else{
            this.controller.creditText.x = (this.controller.creditContainerSprite.width - this.controller.creditText.width)/2 
        } 
    }
    private onSpinEnd(){

        if(!this.isMatchingGame){
            this.paylineGreetings = 'SPIN TO WIN'
            this.userCredit += this.slotGame.totalWin 
            this.updateCreditValues()
            if(this.slotGame.autoPlayCount >= 1 && !this.slotGame.isFreeSpin){
                this.isAutoPlay = false
                 this.controller.spinBtnSprite.texture = this.spinTextureOn
                 this.buyBonusBtn.interactive = true
            }
            this.updatePaylineAnimation(this.paylineGreetings)
        }
        if(this.slotGame.startCountWinFreeSpin){
            this.winFreeSpin += this.slotGame.totalWin
        }   
        if(this.slotGame.isBonusTick){
            this.freeSpinEvent()
            this.slotGame.isBonusTick = false
        }
        let timeout = setTimeout(()=>{
            if(!this.isAutoPlay){
                if(this.sound[16].volume() == 1){
                    this.fadeSound(16,0,this.fadeDurationBgm)
                }
                if(this.sound[17].volume() == 0 && !this.slotGame.isFreeSpin){
                    this.fadeSound(0,1,this.fadeDurationBgm)
                }
            }
            clearTimeout(timeout)
        },this.fadeOutDelay)

        if(this.userCredit < 1 || this.betAmount > this.userCredit){
            
            this.isAutoPlay = false
            this.slotGame.autoPlayCount = 0
            alert("No more balance!");
        }
    }
    private onSpinning(){
        this.paylineGreetings = 'GOOD LUCK'
        this.paylineContainersAnimation.forEach(data=>{
            this.gameContainer.removeChild(data)
        })
        this.updatePaylineAnimation(this.paylineGreetings)
    }
    private onSpin(){
        if(!this.sound[0].playing() && !this.slotGame.isFreeSpin){
            this.playSound(0)
        }
        if(!this.sound[16].playing() && !this.slotGame.isFreeSpin){
            this.playSound(16)
        }
        if(!this.slotGame.isFreeSpin){
            this.fadeSound(16,1,this.fadeDurationBgm)
            this.fadeSound(17,0,this.fadeDurationBgm)
            this.fadeSound(0,0,this.fadeDurationBgm)
        }
        this.slotGame.totalWin = 0
        this.userCredit-=this.betAmount

        this.updateCreditValues()

    }
    private startSpin(spinType:string){
        if(this.userCredit < 1 || this.betAmount > this.userCredit){
            alert("No more balance!");
        }else{
        this.slotGame.startSpin(spinType)
        }
    }
    private startSpinAutoPlay(spinCount:number){
        if(this.userCredit < 1){
            alert("No more balance!");
        }else{
            this.slotGame.autoPlayCount = spinCount
            this.startSpin(this.spinType)
            this.modal.totalSpin = 0 
        }
     
    }
    private createBuyBonus(){
        this.buyBonusBtn = Functions.loadTexture(this.textureArray,'bonus','buy_free_spin_btn')
        this.buyBonusBtn.interactive = true
        this.buyBonusBtn.cursor = 'pointer'
        this.buyBonusBtn.y = (this.baseHeight - this.buyBonusBtn.height)/2
        this.buyBonusText = new PIXI.Text(`${this.betAmount}`, this.textStyle)
        this.buyBonusText.x = (this.buyBonusBtn.width - this.buyBonusText.width)/2
        this.buyBonusText.y = (this.buyBonusBtn.height - this.buyBonusText.height) - 20
        this.buyBonusBtn.addChild(this.buyBonusText)
        this.gameContainer.addChild(this.buyBonusBtn)
    }
    private buyBonusPopUp(){
        let glowX = 956
        let glowY = 1044
        let dY = -80
        // buy bonus modal 
        // glow animation
        this.popGlow.x = this.glowX
        this.popGlow.y = glowY
        this.popGlow.alpha = 0
        this.popGlow.scale.x = 1.1
        this.popGlow.scale.y = 1.3
        Functions.loadSpineAnimation(this.popGlow,'glow',true,0.1)
        this.overlay.addChild(this.popGlow)
        
        
        this.buyBonusFrame.x = this.freeSpinX
        this.buyBonusFrame.y = dY
    
        
        //amount
        const amount = new PIXI.Text(`${this.betAmount}`, this.textStyle2)
        amount.x = (this.buyBonusFrame.width - amount.width)/2
        amount.y = (this.buyBonusFrame.height - amount.height) *0.85
        this.buyBonusFrame.addChild(amount)
        //close buy btn
        const close = Functions.loadTexture(this.textureArray,'bonus','ex')
        close.interactive = true
        close.cursor = 'pointer'
        close.x = (close.width)
        close.y = (this.buyBonusFrame.height - close.height)*.94
        this.buyBonusFrame.addChild(close)
        //close buy btn
        const check = Functions.loadTexture(this.textureArray,'bonus','check')
        check.interactive = true
        check.cursor = 'pointer'
        check.x = (this.buyBonusFrame.width - check.width)*.85
        check.y = (this.buyBonusFrame.height - check.height)*.94
        this.buyBonusFrame.addChild(check)
        let sY = -this.buyBonusFrame.height
        close.addListener('mouseover',() =>{
            this.playSound(2)
        })
        close.addEventListener('pointerdown',()=>{
            this.isOpenBuyBonusFrame = false
            this.playSound(13)
            
            this.hideBonusPopUp(dY,sY);
            this.isOpenModal = false
        })
        check.addListener('mouseover',() =>{
            this.playSound(2)
        })
        check.addEventListener('pointerdown',()=>{
            this.playSound(12)
            this.isOpenBuyBonusFrame = false
            this.slotGame.freeSpinStart = true
            this.slotGame.isFreeSpin = true
            this.hideBonusPopUp(dY,sY)
        check.interactive = false
            let timeOut = setTimeout(()=>{
                this.startSpinAutoPlay(1)
                clearTimeout(timeOut)
            },1000)
            let timeOut1 = setTimeout(()=>{
                check.interactive = true
                clearTimeout(timeOut1)
            },5000)
        })
        let bonusFrameShow = gsap.from(this.buyBonusFrame, {
            delay:.3,
            y:sY,
            onComplete:()=>{
                bonusFrameShow.kill()
                let bounceUp = gsap.to(this.buyBonusFrame,{
                    y:dY-160,
                    onComplete:()=>{
                        bounceUp.kill()
                        let fadeInGlow = gsap.to(this.popGlow,{
                            delay:0,
                            duration:1,
                            alpha:1,
                            onComplete:()=>{
                                fadeInGlow.kill()
                            }
                        }) 
                    }
                })
            }
        })
        this.overlay.addChild(this.buyBonusFrame)
        this.gameContainer.addChild(this.overlay)
    }
    private hideBonusPopUp(dY:number,sY:number){
        this.enableButtons(true)
        let fadeOutGlow = gsap.to(this.popGlow,{
            duration:0.8,
            alpha:0,
            onComplete:()=>{
                fadeOutGlow.kill()
                let bonusFrameHide = gsap.to(this.buyBonusFrame, {
                    delay:0.2,
                    duration:0.2,
                    y:dY*1.2,
                    onComplete:()=>{
                        bonusFrameHide.kill()
                        let bounceDown = gsap.to(this.buyBonusFrame,{
                            duration:0.2,
                            y:sY,
                            onComplete:()=>{
                                bounceDown.kill()
                                this.gameContainer.removeChild(this.overlay)
                            }
                        })
                    }
                })
            }
        }) 
    }
    private hideBonusChoicesPopUp(dY:number,sY:number){
        this.enableButtons(true)
        let fadeOutGlow = gsap.to(this.popGlow,{
            duration:0.8,
            alpha:0,
            onComplete:()=>{
                fadeOutGlow.kill()
                let bonusFrameHide = gsap.to(this.buyBonusFrame, {
                    delay:0.2,
                    duration:0.2,
                    y:dY*1.2,
                    onComplete:()=>{
                        bonusFrameHide.kill()
                        let bounceDown = gsap.to(this.buyBonusFrame,{
                            duration:0.2,
                            y:sY,
                            onComplete:()=>{
                                bounceDown.kill()
                                this.gameContainer.removeChild(this.overlay)
                            }
                        })
                    }
                })
            }
        }) 
    }
    private matchingGame(){
        this.fadeSound(17,0,this.fadeDurationBgm)
        this.soundStop(17)
        this.soundStop(16)
        this.soundStop(0)
        this.playSound(15)
        this.createTransition()
        this.isMatchingGame = true
        let timeOut = setTimeout(()=>{
            let randomizeArray = Functions.arrayRandomizer(json.matchgame_values)
            let arrayBlockValues:Array<any> = []
            let blockSpacing = 1.2
            let multiplier = 0
            let multiplier2 = 0
            let miniCount = 0
            let majorCount = 0
            let grandCount = 0
            let result:any 
            let topText = 'MATCH 3 TO WIN'
            let bottomText = 'PICK STONE TO REVEAL JACKPOTS'
            let popUpSkin = ''
            let soundTimeOut = 2000
            this.enableButtons(false)
            this.lightMode(false)
            //create blocks
            randomizeArray.forEach((data:string,index:number)=>{
                const symbol = new Spine(this.textureArray.rock_block.spineData)
                symbol.interactive = true
                symbol.cursor = 'pointer'
                let status = 'close'
                if(index > 3 && index < 8){
                    symbol.y = symbol.height*blockSpacing
                    symbol.x = multiplier2*symbol.width*blockSpacing
                    multiplier2++
                }else if( index >= 8 && index <= 11){
                    symbol.y = (symbol.height*2)*blockSpacing
                    symbol.x = multiplier*symbol.width*blockSpacing
                    multiplier++
                }else{
                    symbol.x = index*symbol.width*blockSpacing
                }
                Functions.loadSpineAnimation(symbol,'close',true,0.4)
                symbol.skeleton.setSkinByName(data)
                symbol.addEventListener('pointerdown',()=>{
                    this.playSound(20)
                    symbol.interactive = false
                    status = 'open'
                    arrayBlockValues[index].status = 'open'
                    Functions.loadSpineAnimation(symbol,'reveal',false,0.7)
                    if(data == 'grand'){
                        grandCount++
                        let timeOut = setTimeout(()=>{
                            this.playSound(23)
                            clearTimeout(timeOut)
                        },soundTimeOut)
                        if(grandCount == 3){
                            popUpSkin = 'excellent'
                            this.matchingGameWin = json.jackpots.grand
                            result = symbol
                            this.matchinGameWinPop(arrayBlockValues,popUpSkin,result)
                        }
                    }else if(data == 'major'){
                        majorCount++
                        let timeOut = setTimeout(()=>{
                            this.playSound(22)
                            clearTimeout(timeOut)
                        },soundTimeOut)
                        if(majorCount == 3){
                            popUpSkin = 'impressive'
                            this.matchingGameWin = json.jackpots.major
                            result = symbol
                            this.matchinGameWinPop(arrayBlockValues,popUpSkin,result)
                        }
                    }else{
                        let timeOut = setTimeout(()=>{
                            this.playSound(21)
                            clearTimeout(timeOut)
                        },soundTimeOut)
                        miniCount++
                        if(miniCount == 3){
                            popUpSkin = 'nice'
                            this.matchingGameWin = json.jackpots.mini
                            result = symbol
                            this.matchinGameWinPop(arrayBlockValues,popUpSkin,result)
                        }
                    }
                    this.userCredit+=this.matchingGameWin
                    this.updateCreditValues()
                })
                arrayBlockValues.push({symbol:symbol,status:status})
                this.matchingBlocksContainer.addChild(symbol)
            })
            this.matchingBlocksContainer.x = (this.slotGame.frameBg.width - this.matchingBlocksContainer.width)
            this.matchingBlocksContainer.y = (this.slotGame.frameBg.height - this.matchingBlocksContainer.height)*1.7
            this.slotGame.frameBg.addChild(this.matchingBlocksContainer)
            // update text 
            this.textStyle.fontSize = 46
            this.textStyle3.fontSize = 30 
            this.updatePaylineText(bottomText,topText)
            this.screenSize()
            clearTimeout(timeOut)
        },this.transitionDelay)
    }
    private matchinGameWinPop(arrayBlockValues:Array<any>,popUpSkin:string,result:any){
        let timeOut = 2500
        arrayBlockValues.forEach(data=>{
            data.symbol.interactive = false
            if(data.status == 'close')
                Functions.loadSpineAnimation(data.symbol,'reveal',false,0.7)
        })
        let popDelay = setTimeout(()=>{
            this.createPopUps(popUpSkin)
            this.playSound(7)
            this.fadeSound(8,0,2000)
            this.popUps.container.addEventListener('pointerdown',()=>{
                this.popUps.container.interactive = false
                this.matchGameResult(result)
                this.fadeSound(7,0,2000)
                this.fadeSound(8,1,2000)
            })
            clearTimeout(popDelay)
        },timeOut)
    }
    private matchGameResult(result:any){
        let frame = this.slotGame.frameBg
        let frameBgTexture = Functions.loadTexture(this.textureArray,'bonus','matchin_game_win_board').texture
        let win = new PIXI.Text(`${Functions.numberWithCommas(this.matchingGameWin)}`, this.whiteYellow)
        let clickContinueText = new PIXI.Text(`click here to continue`, this.textStyle3)
        frame.texture = frameBgTexture
        result.x = (frame.width)/2
        result.y = frame.height - 200
        win.x = (frame.width - win.width)/2
        win.y = ((frame.height - win.height)/2)*0.85

        const textScaleAnim = gsap.timeline({ 
            repeat: -1,
            onUpdate:()=>{
                clickContinueText.x = (frame.width - clickContinueText.width)/2
                clickContinueText.y = (frame.height - clickContinueText.height)*0.96
            }
        });

        textScaleAnim.to(clickContinueText.scale, 
            { duration: 0.5,x: 1.2, y: 1.2 }
        )
        .to(clickContinueText.scale, { duration: 0.5, x: 1, y: 1 });
        // Start the animation
        textScaleAnim.play();

        clickContinueText.x = (frame.width - clickContinueText.width)/2
        clickContinueText.y = (frame.height - clickContinueText.height)*0.96
        this.popUps.closePopUp()
        frame.addChild(result)
        frame.addChild(win)
        frame.addChild(clickContinueText)
        frame.removeChild(this.matchingBlocksContainer)
        clickContinueText.interactive= true
        clickContinueText.cursor = 'pointer'
        clickContinueText.addEventListener('pointerdown',()=>{
            this.playSound(0)
            this.soundStop(16)
            this.soundVolume(16,0)
            this.soundStop(17)
            this.soundVolume(17,0)
            this.fadeSound(0,1,2000)
            this.fadeSound(8,0,2000)
            this.playSound(12)
            textScaleAnim.kill()
            this.endMatchingGame()
            clickContinueText.interactive = false
            clickContinueText.interactive = false
            let timeOut = setTimeout(()=>{
                frame.removeChild(result)
                frame.removeChild(win)
                frame.removeChild(clickContinueText)
                clearTimeout(timeOut)
            },this.transitionDelay)
        })
    }
    private endMatchingGame(){
        this.createTransition()
        this.isMatchingGame = false
        let timeOut = setTimeout(()=>{
            this.gameContainer.interactive= false
            this.gameContainer.cursor = ''
            this.lightMode(true)
            this.enableButtons(true)
            this.screenSize()
            this.slotGame.levelBarIndicator.width = 0
            this.slotGame.frameBg.removeChild(this.matchingBlocksContainer)
            // update text 
            this.textStyle.fontSize = 50
            this.textStyle3.fontSize = 40 
            this.updatePaylineText('Tap space or enter to skip','SPIN TO WIN')
            if(this.slotGame.freeSpinStart){
                this.freeSpinEvent()
            }
            clearTimeout(timeOut)
        },this.transitionDelay)
        this.slotGame.isMatchingGame = false

    }
    private createPaylineAnimation(){
        this.paylineText =  new PIXI.Text('SPIN TO WIN', this.textStyle)
        this.paylineTextBottom = new PIXI.Text('Tap space or enter to skip', this.textStyle3)
        this.paylineContainer.addChild(this.paylineText,this.paylineTextBottom)
        this.updatePaylineText(this.paylineTextBottom.text,this.paylineText.text)
        this.controller.parentSprite.addChild(this.paylineContainer)
    }
    private updatePaylineText(bottomText:string,topText:string){
        this.paylineTextBottom.text = bottomText
        this.paylineText.text = topText 
        this.paylineText.x = (this.paylineContainer.width - this.paylineText.width)/2
        this.paylineTextBottom.x = (this.paylineContainer.width - this.paylineTextBottom.width)/2
        this.paylineTextBottom.y = (this.paylineText.height)
        this.paylineContainer.x = (this.controller.parentSprite.width - this.paylineContainer.width)/2
    }
    private updatePaylineAnimation(greetings:string){
        this.paylineContainersAnimation = []
        this.paylineAnimations.forEach(data=>{data.kill()})
        let paylineContent:any = this.slotGame.paylines
        this.paylineText.text = greetings
        let paylineTotal = 0
        let bottomText = this.isAutoPlay?`Free spins left ${this.slotGame.autoPlayCount}`:'Tap space or enter to skip'
        if(this.slotGame.paylines.length !== 0){
            for(let i=0;i<paylineContent.length;i++){
                bottomText = ''
                this.updatePaylineText(bottomText,this.paylineText.text)
                let payline = paylineContent[i].payline
                let payout = Functions.numberWithCommas(paylineContent[i].payout)
                const container = new PIXI.Container
                const containerWithText = new PIXI.Container
                const greetingText = new PIXI.Text(`line ${payline} pays ${payout}`, this.descText)
                paylineContent[i].symbols.forEach((data:any,index:number)=>{
                    let symbols = Functions.loadTexture(this.textureArray,'slot',`${json.symbolAssets[data-1].symbol}`)
                    symbols.x = index*65
                    container.addChild(symbols)
                    paylineTotal+=json.symbolAssets[data-1].pay
                })
                container.x = greetingText.width
                containerWithText.addChild(container,greetingText)
                containerWithText.alpha = 0
                greetingText.y = (containerWithText.height - greetingText.height)/2
                this.paylineContainersAnimation.push(containerWithText)
                this.animatePaySymbols(containerWithText,i)
                this.gameContainer.addChild(containerWithText)
            }
            this.updatePaylineText(bottomText,`WIN ${Functions.numberWithCommas(paylineTotal)}`)
        }
        this.updatePaylineText(bottomText,this.paylineText.text)
    }
    private animatePaySymbols(containerWithText:any,i:number){
        let posX = 0
        let posY = 0
        if(this.screenSetting.screentype == 'portrait'){
            posX = this.paylineContainer.x + (this.paylineContainer.width - containerWithText.width)/2
            posY = this.paylineContainer.y + this.paylineText.height
        }else{
            posX = this.paylineContainer.x + (this.paylineContainer.width - containerWithText.width)/2
            posY = this.controller.parentSprite.y + this.paylineContainer.y + this.paylineText.height
        }

        let lastIndex = i+1
        let fadeIn = gsap.to(containerWithText,{
            delay:i*2,
            duration:1,
            alpha:1,
            onStart:()=>{
                containerWithText.x = posX
                containerWithText.y = posY
            },
            onComplete:()=>{
                containerWithText.alpha = 0
                fadeIn.kill()
                let timeOut = setTimeout(()=>{
                    if(lastIndex == this.slotGame.paylines.length){
                        this.paylineContainersAnimation.forEach((data,index)=>{
                            this.animatePaySymbols(data,index)
                        })
                    }
                    clearTimeout(timeOut)
                },3000)
            }
        })
        this.paylineAnimations.push(fadeIn)
    }
    private lightMode(bool:boolean){
        let frameBgTexture = Functions.loadTexture(this.textureArray,'main',bool?'slot_frame_bg':'slot_frame_bg2').texture
        let parentSpriteTexture = Functions.loadTexture(this.textureArray,'controller',bool?'controller_parent':'controller_parent2').texture
        let infoBtnTexture = Functions.loadTexture(this.textureArray,'controller',bool?'info_button':'info_button2').texture
        let settingBtnTexture = Functions.loadTexture(this.textureArray,'controller',bool?'system_settings':'system_settings2').texture
        let spinBtnTexture = Functions.loadTexture(this.textureArray,'controller',bool?'spin_button':'spin_button2').texture
        let autoPlayTexture = Functions.loadTexture(this.textureArray,'controller',bool?'autoplay_button':'autoplay_button2').texture
        let gameBackgroundTexture = Functions.loadTexture(this.textureArray,'main',bool?'bg':'bg2').texture
        //change visibilities of normal game
        this.slotGame.reelContainer.forEach(data=>{data.visible = bool})
        this.paylineContainersAnimation.forEach(data=>{data.visible = bool})
        this.slotGame.frameBg.texture = frameBgTexture
        this.controller.parentSprite.texture = parentSpriteTexture
        this.controller.infoBtnSprite.texture = infoBtnTexture
        this.controller.settingBtnSpite.texture = settingBtnTexture
        this.controller.spinBtnSprite.texture = spinBtnTexture
        this.controller.autoPlay.texture = autoPlayTexture
        this.gameBackground.texture = gameBackgroundTexture
        this.buyBonusBtn.visible = bool
        this.slotGame.levelBarContainer.x = bool?0:-this.slotGame.levelBarContainer.width * 0.5
        //frame glow add
        this.frameGlow.visible = bool?false:true
        if(!bool){
            Functions.loadSpineAnimation(this.frameGlow,'animation',true,0.15)
            this.createFireflies()
        }else{
            this.firefliesArray.forEach(data=>this.gameContainer.removeChild(data))
        }
    }
    private lightModeEvent(bool:boolean){
        let frameBgTexture = Functions.loadTexture(this.textureArray,'main',bool?'slot_frame_bg':'slot_frame_bg2').texture
        let parentSpriteTexture = Functions.loadTexture(this.textureArray,'controller',bool?'controller_parent':'controller_parent2').texture
        let infoBtnTexture = Functions.loadTexture(this.textureArray,'controller',bool?'info_button':'info_button2').texture
        let settingBtnTexture = Functions.loadTexture(this.textureArray,'controller',bool?'system_settings':'system_settings2').texture
        let spinBtnTexture = Functions.loadTexture(this.textureArray,'controller',bool?'spin_button':'spin_button2').texture
        let autoPlayTexture = Functions.loadTexture(this.textureArray,'controller',bool?'autoplay_button':'autoplay_button2').texture
        let gameBackgroundTexture = Functions.loadTexture(this.textureArray,'main',bool?'bg':'bg2').texture
        //change visibilities of normal game
       // this.slotGame.frameBg.texture = frameBgTexture
        this.controller.parentSprite.texture = parentSpriteTexture
        this.controller.infoBtnSprite.texture = infoBtnTexture
        this.controller.settingBtnSpite.texture = settingBtnTexture
        this.controller.spinBtnSprite.texture = spinBtnTexture
        this.controller.autoPlay.texture = autoPlayTexture
        this.gameBackground.texture = gameBackgroundTexture
        this.buyBonusBtn.visible = bool
        this.slotGame.levelBarContainer.x = bool?0:-this.slotGame.levelBarContainer.width * 0.5
        //frame glow add
        this.frameGlow.visible = bool?false:true
        if(!bool){
            Functions.loadSpineAnimation(this.frameGlow,'animation',true,0.15)
            this.createFireflies()
        }else{
            this.firefliesArray.forEach(data=>this.gameContainer.removeChild(data))
        }
    }
    private createFireflies(){
        //left fireflies
        for(let i =0;i<= 10;i++){
            const firefly = new Spine(this.textureArray.firefly.spineData)
            firefly.x = Functions.getRandomInt(-10, this.slotGame.frameBorder.x)
            firefly.y = Functions.getRandomInt(0, this.baseHeight - this.controller.parentSprite.height)
            firefly.scale.set(Functions.getRandomInt(0.1,1))
            firefly.alpha = 0
            Functions.loadSpineAnimation(firefly,'animation',true,0.5)
            let alph = gsap.to(firefly,{
                delay:Functions.getRandomInt(1,5),
                duration:Functions.getRandomInt(1,3),
                alpha:1,
                repeat:-1
            })
            var tl = gsap.timeline ()
            .to(firefly,{
                x: Functions.getRandomInt(0, this.slotGame.frameBorder.x), 
                y: Functions.getRandomInt(this.baseHeight, 0),
                delay:Functions.getRandomInt(1,5),
                duration:Functions.getRandomInt(10,20),
                ease:"none",
                repeat:-1,
            })
            this.firefliesArray.push(firefly)
            this.gameContainer.addChild(firefly)
        }
        //right fireflies
        for(let i =0;i<= 10;i++){
            const firefly = new Spine(this.textureArray.firefly.spineData)
            firefly.x = Functions.getRandomInt(this.slotGame.frameBorder.x+this.slotGame.frameBorder.width, this.baseWidth)
            firefly.y = Functions.getRandomInt(0, this.baseHeight - this.controller.parentSprite.height)
            firefly.scale.set(Functions.getRandomInt(0.1,1))
            firefly.alpha = 0
            Functions.loadSpineAnimation(firefly,'animation',true,0.5)
            let alph = gsap.to(firefly,{
                delay:Functions.getRandomInt(1,5),
                duration:Functions.getRandomInt(1,3),
                alpha:1,
                repeat:-1
            })
            var tl = gsap.timeline ()
                .to(firefly,{
                    x: Functions.getRandomInt(this.slotGame.frameBorder.x+this.slotGame.frameBorder.width, this.baseWidth), 
                    y: Functions.getRandomInt(this.baseHeight, 0),
                    delay:Functions.getRandomInt(1,5),
                    duration:Functions.getRandomInt(10,20),
                    ease:"none",
                    repeat:-1,
                })
            this.firefliesArray.push(firefly)
            this.gameContainer.addChild(firefly)
        }
    }
    private enableButtons(bool:boolean){
        let cursor = bool?'pointer':''
        this.controller.spinBtnSprite.interactive = bool
        this.controller.spinBtnSprite.cursor = cursor
        this.controller.autoPlay.interactive = bool
        this.controller.autoPlay.cursor = cursor
        this.controller.settingBtnSpite.interactive = bool
        this.controller.settingBtnSpite.cursor = cursor
        this.controller.infoBtnSprite.interactive = bool
        this.controller.infoBtnSprite.cursor = cursor
        this.buyBonusBtn.interactive = bool
        this.buyBonusBtn.cursor = cursor
    }
    private events(){
        // open info modal
        this.controller.infoBtnSprite.addListener('mouseover',() =>{
            this.playSound(2)
        })
        // open info modal
        this.controller.infoBtnSprite.addEventListener('pointerdown',()=>{
            this.isOpenInfo = true
            this.controller.infoBtnSprite.interactive = false
            this.controller.settingBtnSpite.interactive = false
            this.controller.autoPlay.interactive = false
            this.modal.createInfoModal()
            this.screenSize()
        })
        //open system settings modal
        this.controller.settingBtnSpite.addListener('mouseover',() =>{
            this.playSound(2)
        })
        this.controller.settingBtnSpite.addEventListener('pointerdown',()=>{
            this.isOpenSetting = true
            this.playSound(1)

            this.controller.infoBtnSprite.interactive = false
            this.controller.settingBtnSpite.interactive = false
            this.controller.autoPlay.interactive = false

            // call settings modal
            this.modal.createSystemSettings(this.isAutoPlay)
            // spin type toggle
            this.modal.betBtns.forEach((data,index)=>{
                data.addEventListener('pointerdown',()=>{
                    this.playSound(1)
                    data.addListener('mouseover',() =>{
                        this.playSound(2)
                    })
                    
                    if(index == 0){
                        this.betIndex--
                        this.betAmount = json.bet_amounts[this.betIndex]
                        if(this.betIndex == 0){
                            this.modal.betBtns[0].interactive = false
                        }else{
                            this.modal.betBtns[0].interactive = true
                            this.modal.betBtns[1].interactive = true
                        }
                    }else{
                        this.betIndex++
                        this.betAmount = json.bet_amounts[this.betIndex]
                        if(this.betIndex == 5){
                            this.modal.betBtns[1].interactive = false
                        }else{
                            this.modal.betBtns[0].interactive = true
                            this.modal.betBtns[1].interactive = true
                        }
                    }
                    this.modal.betAmountText.text = this.betAmount
                    this.modal.betAmountText.x = (this.modal.betAmountSpite.width - this.modal.betAmountText.width)/2
                    this.betTextValue()
                })
            })
            // disable click for adjusting bet buttons
            if(this.betIndex == 0){
                this.modal.betBtns[0].interactive = false
            }
            if(this.betIndex == 5){
                this.modal.betBtns[1].interactive = false
            }
            //sound events
            if(this.ambientCheck){
                this.modal.soundBtns[0].texture = this.textureToggleOn
            }else{
                this.modal.soundBtns[0].texture = this.textureToggleOff
            }
            if(this.sfxCheck){
                this.modal.soundBtns[1].texture = this.textureToggleOn
            }else{
                this.modal.soundBtns[1].texture = this.textureToggleOff
            }

            this.modal.soundBtns.forEach((data,index)=>{
                data.addListener('mouseover',() =>{
                    this.playSound(2)
                })
                data.addEventListener('pointerdown',()=>{
                    this.playSound(1)
                    if(data.texture == this.textureToggleOff){
                        Howler.mute(false)
                        this.controller.soundBtnSprite.texture = this.sounBtnSpriteOn
                        data.texture = this.textureToggleOn
                        if(index == 0){
                           this.ambientCheck = true
                        }else{
                           this.sfxCheck = true
                        }
                    }else{
                        data.texture = this.textureToggleOff
                        this.controller.soundBtnSprite.texture = this.sounBtnSpriteOff
                        if(index == 0){
                            this.ambientCheck = false 
                        }else{
                            this.sfxCheck = false
                        }  
                    }
                    this.checkSoundToggle()
                })
            })
            // re position bet amount tex on click
            this.modal.betAmountText.text = this.betAmount
            this.modal.betAmountText.x = (this.modal.betAmountSpite.width - this.modal.betAmountText.width)/2
            this.screenSize()
        })
        //open autoplay
        this.controller.autoPlay.addListener('mouseover',() =>{
            this.playSound(2)
        })
        this.controller.autoPlay.addEventListener('pointerdown',()=>{
            let timeOut = setTimeout(()=>{
                this.fadeSound(16,0,this.fadeDurationBgm)
                this.fadeSound(0,1,this.fadeDurationBgm)
                this.playSound(1)
                clearTimeout(timeOut)
            },this.fadeOutDelay)

            this.isOpenAutoplay = true
            
            if(this.isAutoPlay){
                this.controller.spinBtnSprite.interactive = true 
                this.controller.spinBtnSprite.cursor = 'pointer' 
                this.isAutoPlay = false
                this.controller.spinBtnSprite.texture = this.spinTextureOn 
                this.slotGame.autoPlayCount = 0
                this.buyBonusBtn.interactive = true
                this.controller.settingBtnSpite.interactive = true
                this.controller.infoBtnSprite.interactive = true
                
            }else{
                this.controller.infoBtnSprite.interactive = false
                this.controller.settingBtnSpite.interactive = false
                this.controller.autoPlay.interactive = false
                this.modal.btnArray = []
                this.modal.createAutoPlaySettings()
                this.screenSize()
                this.controller.spinBtnSprite.texture = this.spinTextureOn
                this.controller.spinBtnSprite.interactive = true
                // initialize active spintype button
                if(this.spinType == 'quick'){
                    this.modal.btnArray[0].texture = this.textureToggleOn
                }else if(this.spinType == 'turbo'){
                    this.modal.btnArray[1].texture = this.textureToggleOn
                }else{
                    this.modal.btnArray[0].texture = this.textureToggleOff
                    this.modal.btnArray[1].texture = this.textureToggleOff
                }
                //toggle spin type
                this.modal.btnArray.forEach((data,index)=>{
                   data.addListener('mouseover',() =>{
                        this.playSound(2)
                    })
                    data.addEventListener('pointerdown',()=>{
                        this.playSound(1)
                        
                        if(index == 0){
                            this.modal.btnArray[1].texture = this.textureToggleOff
                            if(data.texture == this.textureToggleOff){
                                data.texture = this.textureToggleOn
                                this.spinType = 'quick'
                            }else{
                                this.spinType = 'normal'
                                data.texture = this.textureToggleOff
                            }
                        }else{
                            this.modal.btnArray[0].texture = this.textureToggleOff
                            if(data.texture == this.textureToggleOff){
                                this.spinType = 'turbo'
                                data.texture = this.textureToggleOn
                            }else{
                                this.spinType = 'normal'
                                data.texture = this.textureToggleOff
                            }
                        }
                    })
                })
                //start slot auto spin
                this.modal.rollBtn.addListener('mouseover',() =>{
                    this.playSound(2)
                })
                this.modal.rollBtn.addEventListener('pointerdown',()=>{
                    this.playSound(1)
                    
                    this.buyBonusBtn.interactive = false
                    this.controller.autoPlay.interactive = true
                    this.controller.spinBtnSprite.texture = this.spinTextureOff
                   // this.controller.spinBtnSprite.interactive = false
                    this.isAutoPlay = true
                    this.modal.rollBtn.texture = this.textureRollOn
                    if(!this.slotGame.isSpinning){
                        // this.startSpinAutoPlay(this.modal.totalSpin)
                        if(this.modal.totalSpin >= 1){
                             this.startSpinAutoPlay(this.modal.totalSpin)
                        }else{
                         alert("Please choose a spin count!");
                        }
                     }  
                })
                // set background on hover
                this.modal.rollBtn.addEventListener('mouseenter',()=>{
                    this.modal.rollBtn.texture = this.textureRollOn
                })
                this.modal.rollBtn.addEventListener('mouseleave',()=>{
                    this.modal.rollBtn.texture = this.textureRollOff
                })
            }    
            this.screenSize()   
        })
        //single spin trigger
        this.controller.spinBtnSprite.addListener('mouseover',() =>{
            this.playSound(2)
        })
        this.controller.spinBtnSprite.addEventListener('pointerdown',()=>{
            this.playSound(1)
            
            this.controller.spinBtnSprite.interactive = true
            if(!this.slotGame.isSpinning && !this.isFreeSpin && !this.isAutoPlay && !this.isMatchingGame ){
                this.controller.spinBtnSprite.texture = this.spinTextureOff
                this.startSpinAutoPlay(1)
            }else{
                this.slotGame.timeScale = 10
            }
        })
        //buy bonus
        this.buyBonusBtn.addListener('mouseover',() =>{
            this.playSound(2)
        })
        this.buyBonusBtn.addEventListener('pointerdown',()=>{
          
            this.playSound(30)
            this.isOpenBuyBonusFrame = true
            this.buyBonusPopUp()
            this.enableButtons(false)
            this.isOpenModal = true
        })
    }
    private freeSpinEvent(){
        this.playSound(14)
        this.fadeSound(16,0,this.fadeDurationBgm)
        this.fadeSound(17,0,this.fadeDurationBgm)
        this.fadeSound(0,0,this.fadeDurationBgm)
        this.playSound(6)
        this.fadeSound(6,1,this.fadeDurationBgm)
        this.soundStop(16)
        this.soundStop(17)
        this.soundStop(0)
        this.isOpenFreeSpinModals = true
        this.moneySlot = Functions.loadTexture(this.textureArray,'bonus','money_wilds')
        this.wildSlot = Functions.loadTexture(this.textureArray,'bonus','multiplier_wilds')
        this.screenSize()
        this.slotGame.autoPlayCount = 0
        this.isOpenModal= true

        let glowX = 570
        let glowX2 = 1370
        let glowY = 1044
        let glowY2 = 1644
        let dY = -80

        // glow animation
        this.popGlow2.x = this.glowX2
        this.popGlow2.y = this.glowY2
        this.popGlow2.alpha = 0
        this.popGlow2.scale.x = 1.1
        this.popGlow2.scale.y = 1.3
        this.overlay.addChild(this.popGlow2)
        Functions.loadSpineAnimation(this.popGlow2,'glow',true,0.1)
        this.overlay.addChild(this.popGlow)
        Functions.loadSpineAnimation(this.popGlow,'glow',true,0.1)
        this.popGlow.x = glowX
        this.popGlow.y = glowY
        this.popGlow.alpha = 0
        this.popGlow.scale.x = 1.1
        this.popGlow.scale.y = 1.3
        
        //const wildSlot = Functions.loadTexture(this.textureArray,'bonus','multiplier_wilds')
        this.wildSlot.x = (this.baseWidth - this.wildSlot.width)/2 - 400
        this.wildSlot.y = -200
        let sY = -this.wildSlot.height
        let wildSlotFrameShow = gsap.from(this.wildSlot, {
            delay:.3,
            y:sY,
            onComplete:()=>{
                wildSlotFrameShow.kill()
                this.playSound(15)
                let bounceUp = gsap.to(this.wildSlot,{
                    y:dY-160,
                    onComplete:()=>{
                        bounceUp.kill()
                        let fadeInGlow = gsap.to(this.popGlow,{
                            delay:0,
                            duration:1,
                            alpha:1,
                            onComplete:()=>{
                                fadeInGlow.kill()
                            }
                        }) 
                    }
                })
            }
        })
        this.gameContainer.addChild(this.overlay)

        //amount
        const amount = new PIXI.Text(`6`, this.textStyle2)
        amount.x = (this.wildSlot.width - amount.width)/2
        amount.y = (this.wildSlot.height - amount.height) * 0.85
        this.wildSlot.addChild(amount)
        this.wildSlot.cursor = 'pointer'
        this.wildSlot.interactive = true
      

       // const moneySlot = Functions.loadTexture(this.textureArray,'bonus','money_wilds')
        // moneySlot.x = (this.baseWidth - moneySlot.width)/2 + 400
        // moneySlot.y = -200
        //this.moneySlot.x = (this.baseWidth - this.moneySlot.width)/2 - 400
        //this.moneySlot.y = -200
        let moneySlotFrameShow = gsap.from(this.moneySlot, {
            delay:.3,
            y:sY,
            onComplete:()=>{
                moneySlotFrameShow.kill()
                let bounceUp = gsap.to(this.moneySlot,{
                    y:this.moneyBoardY,
                    onComplete:()=>{
                        bounceUp.kill()
                        let fadeInGlow = gsap.to(this.popGlow2,{
                            delay:0,
                            duration:1,
                            alpha:1,
                            onComplete:()=>{
                                fadeInGlow.kill()
                            }
                        }) 
                    }
                })
            }
        })

        //amount
        const amount2 = new PIXI.Text(`12`, this.textStyle2)
        amount2.x = (this.moneySlot.width - amount2.width)/2
        amount2.y = (this.moneySlot.height - amount2.height) * 0.85
        this.moneySlot.addChild(amount2)
        this.moneySlot.cursor = 'pointer'
        this.moneySlot.interactive = true
        this.gameContainer.addChild(this.moneySlot)
        this.gameContainer.addChild(this.wildSlot)


        this.wildSlot.addListener('mouseover',() =>{
            // this.playSound(2)
        })
        this.wildSlot.addEventListener('pointerdown', () =>{
            this.slotGame.whatEvent = 1
            this.playSound(12)
            
            this.overlay.removeChild(this.popGlow2)
            this.gameContainer.removeChild(this.overlay)
            this.noOfSpin=6
            this.slotGame.startCountWinFreeSpin = true
            this.slotGame.autoplayDoneEvent = false
            this.gameContainer.removeChild(this.wildSlot)
            this.gameContainer.removeChild(this.moneySlot)
            this.createTransition()
            let timeout = setTimeout(()=>{
                this.startfreeSpinEvent(this.noOfSpin)
                clearTimeout(timeout)
            },this.transitionDelay)
            this.isOpenFreeSpinModals = false
        })

        
        this.moneySlot.addListener('mouseover',() =>{
            this.playSound(2)
        })
        this.moneySlot.addEventListener('pointerdown', () =>{
            this.playSound(12)
            this.slotGame.whatEvent = 2
            
            this.overlay.removeChild(this.popGlow2)
            this.gameContainer.removeChild(this.overlay)
            this.noOfSpin=12
            this.slotGame.startCountWinFreeSpin = true
            this.slotGame.autoplayDoneEvent = false
            this.gameContainer.removeChild(this.wildSlot)
            this.gameContainer.removeChild(this.moneySlot)
            this.createTransition()
            let timeout = setTimeout(()=>{
                this.startfreeSpinEvent(this.noOfSpin)
                clearTimeout(timeout)
            },this.transitionDelay)
            this.isOpenFreeSpinModals = false
        })
    }
    private startfreeSpinEvent(count:number){
        this.eventStart = true
        this.enableButtons(false)
        this.lightModeEvent(false)
        this.slotGame.freeSpinStart = false
        this.slotGame.isFreeSpin = true
        this.slotGame.isFreeSpinDone = false
        let show = setTimeout(() => {
            this.isFreeSpin = false
            clearTimeout(show);
        }, 100);
        this.screenSize()
        this.slotGame.reelContainer.forEach((data,index)=>{
            this.slotGame.generateNewSymbolsMainEvent(index)      
        })  
        let show2 = setTimeout(() => {
            this.slotGame.autoPlayCount = count
            this.startSpinAutoPlay(count)
            clearTimeout(show2);
        }, 1000);
    }
    private checkIfFreeSpin(bool:boolean){
        // this.enableButtons(false)
        // this.isFreeSpin = true
    }
    private createPopUps(skin:string){
        this.popUps = new PopUps(this.app,this.gameContainer,this.textureArray,skin,this.matchingGameWin)
        this.gameContainer.addChild(this.popUps.container)
    }
    private createTransition(){
        this.transition = new Transition(this.app,this.gameContainer,this.textureArray, this.screenSetting.screentype)
        this.openTransition = true
        this.gameContainer.addChild(this.transition.container)
    }
    
    // sounds methods
    private sounds(soundInit:Boolean,soundArray:Array<any>){
        this.sound = soundArray;
        this.globalSound = soundInit;
    }

    private playSound(index:number){
        this.sound[index].play();
    }

    private soundStop(index:number){
        this.sound[index].stop()
    }

    private soundVolume(index:number,volume:number){
        this.sound[index].volume(volume)
    }
    private fadeSound(index:number,volumeTo:any,duration:number){
        this.sound[index].fade(this.sound[index].volume(),volumeTo,duration)
    }


    private checkSoundToggle(){
        if(this.ambientCheck){
            this.sound[0].mute(false)
            this.sound[6].mute(false)
            this.sound[8].mute(false)
            this.sound[16].mute(false)
            this.sound[17].mute(false)
        }
        else{
            this.sound[0].mute(true)
            this.sound[6].mute(true)
            this.sound[8].mute(true)
            this.sound[16].mute(true)
            this.sound[17].mute(true)
        }
        if(this.sfxCheck){
            this.sound[1].mute(false)
            this.sound[2].mute(false)
            this.sound[3].mute(false)
            this.sound[4].mute(false)
            this.sound[5].mute(false)
            this.sound[7].mute(false)
            this.sound[9].mute(false)
            this.sound[10].mute(false)
            this.sound[11].mute(false)
            this.sound[12].mute(false)
            this.sound[13].mute(false)
            this.sound[13].mute(false)
            this.sound[15].mute(false)
            this.sound[18].mute(false)
            this.sound[19].mute(false)
            this.sound[20].mute(false)
            this.sound[21].mute(false)
            this.sound[22].mute(false)
            this.sound[23].mute(false)
            this.sound[24].mute(false)
            this.sound[25].mute(false)
            this.sound[26].mute(false)
            this.sound[27].mute(false)
            this.sound[28].mute(false)
            this.sound[29].mute(false)
            this.sound[30].mute(false)
        }else{
            this.sound[1].mute(true)
            this.sound[2].mute(true)
            this.sound[3].mute(true)
            this.sound[4].mute(true)
            this.sound[5].mute(true)
            this.sound[7].mute(true)
            this.sound[9].mute(true)
            this.sound[10].mute(true)
            this.sound[11].mute(true)
            this.sound[12].mute(true)
            this.sound[13].mute(true)
            this.sound[13].mute(true)
            this.sound[15].mute(true)
            this.sound[18].mute(true)
            this.sound[19].mute(true)
            this.sound[20].mute(true)
            this.sound[21].mute(true)
            this.sound[22].mute(true)
            this.sound[23].mute(true)
            this.sound[24].mute(true)
            this.sound[25].mute(true)
            this.sound[26].mute(true)
            this.sound[27].mute(true)
            this.sound[28].mute(true)
            this.sound[29].mute(true)
            this.sound[30].mute(true)
        }
    }
    
}