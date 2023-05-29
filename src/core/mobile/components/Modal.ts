import 'pixi-spine' 
import * as PIXI from 'pixi.js';
import Functions from '../settings/Functions';
import json from '../settings/settings.json'
import json2 from '../settings/modal-settings.json'
export default class Modal{
    //app settings
    private app:PIXI.Application
    private baseHeight:number
    private baseWidth:number
    public container:PIXI.Container
    public infoFirstPageContainer:PIXI.Container
    public infoSecondPageContainer:PIXI.Container
    public infoThirdPageContainer:PIXI.Container
    public infoFourthPageContainer:PIXI.Container
    public infoFifthPageContainer:PIXI.Container
    public infoSixthPageContainer:PIXI.Container
    public infoSeventhPageContainer:PIXI.Container
    //PORTRAIT MOBILE
    public infoFirstPageContainerPortrait:PIXI.Container
    public infoSecondPageContainerPortrait:PIXI.Container
    public infoThirdPageContainerPortrait:PIXI.Container
    public infoFourthPageContainerPortrait:PIXI.Container
    public infoFifthPageContainerPortrait:PIXI.Container
    public infoSixthPageContainerPortrait:PIXI.Container
    public infoSeventhPageContainerPortrait:PIXI.Container
    private textureArray:Array<any>
    //containers
    public autoPlaySettingsCont:PIXI.Container
    private systemContainer:PIXI.Container
    public infoContainer:PIXI.Container
    //sprites
    public overlay:PIXI.Sprite
    public modalFrame:PIXI.Sprite
    private titleY:number = 50
    public closeModal:PIXI.Sprite
    public rollBtn:PIXI.Sprite
    public minusBtn:PIXI.Sprite
    public plusBtn:PIXI.Sprite
    public betAmountSpite:PIXI.Sprite
    public musicBtnSprite:PIXI.Sprite
    public sfxBtnSprite:PIXI.Sprite
    public modalTitle:PIXI.Sprite
    //text
    private textStyle:PIXI.TextStyle
    private textStyle2:PIXI.TextStyle
    private textStyle3:PIXI.TextStyle
    private textStyle4:PIXI.TextStyle
    private textStyle4Center:PIXI.TextStyle
    public betAmountText:PIXI.Text
    //
    public betAmount:number = 1
    public totalSpin:number
    public btnArray:Array<any> = []
    private spinBtnTextureOn:PIXI.Texture
    private spinBtnTextureOff:PIXI.Texture
    public betBtns:Array<any> = []
    public soundBtns:Array<any> = []

    //FOR MOBILE
    public separator:PIXI.Sprite
    public leftContainer:PIXI.Container
    public rightContainer:PIXI.Container

    public btn:PIXI.Sprite
    public btn2:PIXI.Sprite
    
    public btnContainer:PIXI.Container
    public btn2Container:PIXI.Container
    public bottomContainer:PIXI.Container

    //settings
    private screenSetting:any;

    public currentPage:number= 0;

    private screenResize:()=> void

    public prevBtn:PIXI.Sprite
    public nextBtn:PIXI.Sprite

    public image4th:PIXI.Sprite
    public image4thPortrait:PIXI.Sprite

    public image5th:PIXI.Sprite
    public image5thPortrait:PIXI.Sprite

    public image6th:PIXI.Sprite
    public image6thPortrait:PIXI.Sprite

    public imgContainer:PIXI.Container
    public imgContainerPortrait:PIXI.Container

    public pageTitle:PIXI.Sprite
    public pageDesc:PIXI.Sprite
    public pageText:PIXI.Sprite


    constructor(app:PIXI.Application,textureArray:Array<any>,screenResize:()=> void){
        this.app = app
        this.screenResize = screenResize
        this.baseWidth = this.app.screen.width
        this.baseHeight = this.app.screen.height
        this.textureArray = textureArray
        this.spinBtnTextureOn =  Functions.loadTexture(this.textureArray,'modal','spin_amount_btn_active').texture
        this.spinBtnTextureOff =  Functions.loadTexture(this.textureArray,'modal','spin_amount_btn').texture
        this.container = new PIXI.Container()
        this.infoFirstPageContainer = new PIXI.Container
        this.infoSecondPageContainer = new PIXI.Container
        this.infoThirdPageContainer = new PIXI.Container
        this.infoFourthPageContainer = new PIXI.Container
        this.infoFifthPageContainer = new PIXI.Container
        this.infoSixthPageContainer = new PIXI.Container
        this.infoSeventhPageContainer = new PIXI.Container
        //PORTRAIT MOBILE
        this.infoFirstPageContainerPortrait = new PIXI.Container
        this.infoSecondPageContainerPortrait = new PIXI.Container
        this.infoThirdPageContainerPortrait = new PIXI.Container
        this.infoFourthPageContainerPortrait = new PIXI.Container
        this.infoFifthPageContainerPortrait = new PIXI.Container
        this.infoSixthPageContainerPortrait = new PIXI.Container
        this.infoSeventhPageContainerPortrait = new PIXI.Container

        // this.infoFirstPageContainer = new PIXI.Container
        // this.infoFirstPageContainerPortrait = new PIXI.Container

        // this.infoSecondPageContainer = new PIXI.Container
        // this.infoSecondPageContainerPortrait = new PIXI.Container
        
        // this.infoThirdPageContainer = new PIXI.Container
        // this.infoThirdPageContainerPortrait = new PIXI.Container
        
        // this.infoFourthPageContainer = new PIXI.Container
        // this.infoFourthPageContainerPortrait = new PIXI.Container

        // this.infoFifthPageContainer = new PIXI.Container
        // this.infoFifthPageContainerPortrait = new PIXI.Container

        // this.infoSixthPageContainer = new PIXI.Container
        // this.infoSixthPageContainerPortrait = new PIXI.Container

        // this.infoSeventhPageContainer = new PIXI.Container
        // this.infoSeventhPageContainerPortrait = new PIXI.Container


        this.imgContainer = new PIXI.Container
        this.imgContainerPortrait = new PIXI.Container
        this.textStyle = new PIXI.TextStyle({  
            fontFamily: 'Eras ITC',
            fontSize: 36,
            fontWeight: 'bold',
            fill: ['#ffffff', '#ffffff'], // gradient
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
            wordWrap: true,
            wordWrapWidth: 440,
            lineJoin: 'round',
        });
        this.textStyle2 = new PIXI.TextStyle({  
            fontFamily: 'Arial',
            fontSize: 20,
            fontWeight: 'normal',
            fill: '#a7a7a7', 
            wordWrapWidth: 440,
        });
        this.textStyle3 = new PIXI.TextStyle({  
            fontFamily: 'Arial',
            fontSize: 30,
            fontWeight: 'normal',
            fill: '#ffffff', 
            wordWrap: true,
            wordWrapWidth: 1200,
            align:'center'
        });
        this.textStyle4 = new PIXI.TextStyle({  
            fontFamily: 'Arial',
            fontSize: 20,
            fontWeight: 'normal',
            fill: '#fff', 
            wordWrap: true,
            wordWrapWidth: 400,
        });
        this.textStyle4Center = new PIXI.TextStyle({  
            fontFamily: 'Arial',
            fontSize: 20,
            fontWeight: 'normal',
            fill: '#fff', 
            wordWrap: true,
            wordWrapWidth: 600,
            align:'center'
        });

      
        this.init()
    }

    private init(){
        this.createParent()

        window.addEventListener('resize',()=>{
            this.screenSize()
        })
        this.screenSize()
    }
    private screenSize(){
        this.screenSetting = Functions.screenSize();
        //this.app.renderer.resize(this.screenSetting.baseWidth,this.screenSetting.baseHeight);
    }
    private createParent(){
        this.overlay = Functions.loadTexture(this.textureArray,'modal','overlay')
        this.modalFrame = Functions.loadTexture(this.textureArray,'modal','modal_frame')
        this.modalFrame.x = (this.overlay.width - this.modalFrame.width)/2
        this.modalFrame.y = (this.overlay.height - this.modalFrame.height)/2
        //close modal
        this.closeModal = Functions.loadTexture(this.textureArray,'modal','close_button') 
        this.closeModal.scale.set(.8)
        this.closeModal.cursor = 'pointer'
        this.closeModal.interactive = true
        this.closeModal.x = (this.modalFrame.width - this.closeModal.width) - 30
        this.closeModal.y = 30 
        this.closeModal.addListener("pointerdown", () => {
            this.modalFrame.removeChild(this.systemContainer)
            this.modalFrame.removeChild(this.modalTitle)
            this.modalFrame.removeChild(this.autoPlaySettingsCont)
            this.modalFrame.removeChild(this.infoContainer)
            this.app.stage.removeChild(this.container)
            this.modalFrame.removeChild(this.leftContainer)
            this.modalFrame.removeChild(this.rightContainer)
            this.modalFrame.removeChild(this.separator)

            this.infoFirstPageContainer.removeChildren()
            this.infoFirstPageContainerPortrait.removeChildren()
    
            this.infoSecondPageContainer.removeChildren()
            this.infoSecondPageContainerPortrait.removeChildren()
            
            this.infoThirdPageContainer.removeChildren()
            this.infoThirdPageContainerPortrait.removeChildren()
            
            this.infoFourthPageContainer .removeChildren()
            this.infoFourthPageContainerPortrait.removeChildren()
    
            this.infoFifthPageContainer.removeChildren()
            this.infoFifthPageContainerPortrait.removeChildren()
    
            this.infoSixthPageContainer.removeChildren()
            this.infoSixthPageContainerPortrait.removeChildren()
    
            this.infoSeventhPageContainer.removeChildren()
            this.infoSeventhPageContainerPortrait.removeChildren()

        })
        this.modalFrame.addChild(this.closeModal)
    }
    public createSystemSettings(betDisable:boolean){
        this.betBtns = []
        this.soundBtns = []
        this.systemContainer = new PIXI.Container
        this.leftContainer = new PIXI.Container
        this.rightContainer = new PIXI.Container
        //title
        this.modalTitle = Functions.loadTexture(this.textureArray,'modal','system_settings_title')
        this.modalTitle.x = (this.modalFrame.width - this.modalTitle.width)/2
        this.modalTitle.y = this.titleY
        this.modalFrame.addChild(this.modalTitle)
        // middle separator
        this.separator = Functions.loadTexture(this.textureArray,'modal','separate')
        this.separator.x = (this.modalFrame.width - this.separator.width)/2
        this.separator.y = (this.modalFrame.height - this.separator.height)/2
       // this.systemContainer.addChild(this.separator)
        this.modalFrame.addChild(this.separator)
        this.systemContainer.y = (this.modalFrame.height - this.systemContainer.height) / 2 

        // left container content
        // bet container
        this.betAmountSpite = Functions.loadTexture(this.textureArray,'modal','total_bet_container')
        this.betAmountSpite.x = 0
        this.leftContainer.addChild(this.betAmountSpite)
        // bet amount
        this.betAmountText = new PIXI.Text(`1`, this.textStyle)
        this.betAmountText.x = (this.betAmountSpite.width - this.betAmountText.width)/2
        this.betAmountText.y = (this.betAmountSpite.height - this.betAmountText.height)/2
        this.leftContainer.addChild(this.betAmountText)
        // title
        const totalBetText = new PIXI.Text(`TOTAL BET`, this.textStyle);
        totalBetText.x = (this.betAmountSpite.width - totalBetText.width)/2
        totalBetText.y = -totalBetText.height
        this.leftContainer.addChild(totalBetText)
        // minus btn
        this.minusBtn = Functions.loadTexture(this.textureArray,'modal','minus_bet')
        this.minusBtn.x = this.betAmountSpite.x
        this.minusBtn.y= this.betAmountSpite.height + 20
        this.minusBtn.interactive = betDisable?false:true
        this.minusBtn.cursor = 'pointer'
        this.betBtns.push(this.minusBtn)
        this.leftContainer.addChild(this.minusBtn)
        // plus btn
        this.plusBtn = Functions.loadTexture(this.textureArray,'modal','add_bet')
        this.plusBtn.x = (this.betAmountSpite.x + this.betAmountSpite.width) - this.plusBtn.width
        this.plusBtn.y = this.minusBtn.y
        this.plusBtn.interactive = betDisable?false:true
        this.plusBtn.cursor = 'pointer'
        this.betBtns.push(this.plusBtn)
        this.leftContainer.x = (this.separator.x - this.leftContainer.width) / 2 
        this.leftContainer.y = (this.modalFrame.height - this.leftContainer.height)/2 + 50
        this.leftContainer.addChild(this.plusBtn)
        //this.systemContainer.addChild(this.leftContainer)
        this.modalFrame.addChild(this.leftContainer)
        
        // right container content
        const ambientTitle = new PIXI.Text(`AMBIENT MUSIC`, this.textStyle);
        ambientTitle.x = 0
        // ambient desc
        const ambientDesc = new PIXI.Text(`Turn on and off background music `, this.textStyle2);
        ambientDesc.x = 0
        ambientDesc.y = 45
        this.rightContainer.addChild(ambientTitle,ambientDesc)
        // ambient toggle
        this.musicBtnSprite = Functions.loadTexture(this.textureArray,'modal','off')
        this.musicBtnSprite.interactive = true
        this.musicBtnSprite.cursor = 'pointer'
        this.musicBtnSprite.x = ambientTitle.width +50
        this.musicBtnSprite.y = ambientTitle.y + 15
        this.soundBtns.push(this.musicBtnSprite)
        this.rightContainer.addChild(this.musicBtnSprite)
        // sfx 
        const sfxTitle = new PIXI.Text(`SOUND FX`, this.textStyle);
        sfxTitle.x = 0 
        sfxTitle.y = 120
        // ambient desc
        const sfxDesc = new PIXI.Text(`Turn on and off sound effects`, this.textStyle2);
        sfxDesc.x = sfxTitle.x
        sfxDesc.y = sfxTitle.y + 45
        this.rightContainer.addChild(sfxTitle,sfxDesc)
        // ambient toggle
        this.sfxBtnSprite = Functions.loadTexture(this.textureArray,'modal','off')
        this.sfxBtnSprite.interactive = true
        this.sfxBtnSprite.cursor ='pointer'
        this.sfxBtnSprite.x = sfxTitle.width + 160
        this.sfxBtnSprite.y = sfxTitle.y + 15
        this.soundBtns.push(this.sfxBtnSprite)
        this.rightContainer.addChild(this.sfxBtnSprite)
        this.rightContainer.x = this.separator.x + 60
        this.rightContainer.y = (this.modalFrame.height - this.rightContainer.height)/2 
       // this.systemContainer.addChild(this.rightContainer)
       this.modalFrame.addChild(this.rightContainer)

        this.modalFrame.addChild(this.systemContainer)
        this.container.addChild(this.overlay,this.modalFrame)
        this.app.stage.addChild(this.container)
        
    }

    public createAutoPlaySettings(){
        this.btnContainer = new PIXI.Container
        this.btn2Container = new PIXI.Container
        this.autoPlaySettingsCont = new PIXI.Container
        this.bottomContainer = new PIXI.Container
        const toggleX = 500
        let btns:Array<any> = []
        let btns2:Array<any> = []
        // btns 
        json.auto_play_values.forEach((data,index)=>{
            const btn = Functions.loadTexture(this.textureArray,'modal','spin_amount_btn')
            const textValue = new PIXI.Text(`${data.value}`, this.textStyle)
            textValue.x = (btn.width - textValue.width)/2 
            textValue.y = (btn.height - textValue.height)/2 
            btn.addChild(textValue)
            btn.x = data.x *250
            btn.cursor = 'pointer'
            btn.interactive = true
            if(index >=5){
                btn.y = 110
            }
            btn.addEventListener('pointerdown',()=>{
                this.totalSpin = data.value
                btns.forEach(data=>{
                    data.texture = this.spinBtnTextureOff
                })
                btn.texture = this.spinBtnTextureOn
            })
            btns.push(btn)
            this.btnContainer.addChild(btn)
            this.autoPlaySettingsCont.addChild(this.btnContainer)
        })
        json.auto_play_values2.forEach((data,index)=>{
            const btn2 = Functions.loadTexture(this.textureArray,'modal','spin_amount_btn')
            const textValue = new PIXI.Text(`${data.value}`, this.textStyle)
            textValue.x = (btn2.width - textValue.width)/2 
            textValue.y = (btn2.height - textValue.height)/2 
            btn2.addChild(textValue)
            btn2.x = data.x *250
            btn2.cursor = 'pointer'
            btn2.interactive = true
            if(index >=3){
                btn2.y = 110
            }
            if(index >=6){
                btn2.y = 210
            }
            if(index >=9){
                btn2.y = 310
            }
            btn2.addEventListener('pointerdown',()=>{
                this.totalSpin = data.value
                btns2.forEach(data=>{
                    data.texture = this.spinBtnTextureOff
                })
                btn2.texture = this.spinBtnTextureOn
            })
            btns2.push(btn2)
            this.btn2Container.addChild(btn2)
            this.autoPlaySettingsCont.addChild(this.btn2Container)
        })
        // quick spin
        const quickTitle = new PIXI.Text(`QUICK SPIN`, this.textStyle);
        quickTitle.y = 250
        this.bottomContainer.addChild(quickTitle)
        const quickDesc = new PIXI.Text(`Reduce the overall spin time to play quickly`, this.textStyle2);
        quickDesc.y = quickTitle.y * 1.2
        this.bottomContainer.addChild(quickDesc)
        // turbo spin
        const turboTitle = new PIXI.Text(`TURBO SPIN`, this.textStyle);
        turboTitle.y = 350
        this.bottomContainer.addChild(turboTitle)
        const turboDesc = new PIXI.Text(`Reduce the overall spin time to play quickly`, this.textStyle2);
        turboDesc.y = turboTitle.y * 1.13
        this.bottomContainer.addChild(turboDesc)
        // quick spin toggle
        const quickSprite =  Functions.loadTexture(this.textureArray,'modal','off')
        quickSprite.interactive = true
        quickSprite.cursor = 'pointer'
        quickSprite.x = toggleX
        quickSprite.y = quickTitle.y *1.05
        this.btnArray.push(quickSprite)
        this.bottomContainer.addChild(quickSprite)
        // turbo spin toggle
        const turboSprite =  Functions.loadTexture(this.textureArray,'modal','off')
        turboSprite.interactive = true
        turboSprite.cursor = 'pointer'
        turboSprite.x = toggleX
        turboSprite.y = turboTitle.y*1.05
        this.btnArray.push(turboSprite)
        this.bottomContainer.addChild(turboSprite)
        // roll sprite  
        this.rollBtn =  Functions.loadTexture(this.textureArray,'modal','roll')
        this.rollBtn.interactive = true
        this.rollBtn.cursor = 'pointer'
        this.rollBtn.x = (this.bottomContainer.width - this.rollBtn.width)/2
        this.rollBtn.y = turboDesc.y * 1.2
        // roll btn text 
        const rollBtnText = new PIXI.Text(`Let's Roll!`, this.textStyle);
        rollBtnText.x = (this.rollBtn.width - rollBtnText.width)/2
        rollBtnText.y = (this.rollBtn.height - rollBtnText.height)/2
        this.rollBtn.addChild(rollBtnText)
        this.bottomContainer.addChild(this.rollBtn)
        // bottom container positioning
        this.bottomContainer.x = (this.autoPlaySettingsCont.width - this.bottomContainer.width)/2
        //container positioning
        this.autoPlaySettingsCont.addChild(this.bottomContainer)
        this.autoPlaySettingsCont.x = (this.modalFrame.width - this.autoPlaySettingsCont.width)/2
        this.autoPlaySettingsCont.y = (this.modalFrame.height - this.autoPlaySettingsCont.height)/2
        this.modalFrame.addChild(this.autoPlaySettingsCont)
        this.container.addChild(this.overlay,this.modalFrame)
        this.app.stage.addChild(this.container)    

        //events
        this.rollBtn.addEventListener('pointerdown',()=>{
            this.modalFrame.removeChild(this.autoPlaySettingsCont)
            this.app.stage.removeChild(this.container)   
        })
    }
    public createInfoModal(){
        this.infoContainer = new PIXI.Container
        this.prevBtn = Functions.loadTexture(this.textureArray,'modal','left_arrow')
        this.nextBtn = Functions.loadTexture(this.textureArray,'modal','right_arrow')
        this.infoContainer.removeChildren()

        
        this.currentPage = 0
        let lastPage = json2.modalInfoPage.length - 1
        let paddingSide = 30
        let args:any = null
        
        this.pageTitle =  Functions.loadTexture(this.textureArray,'modal','paytable_slot_title')
        this.pageTitle.x = (this.modalFrame.width - this.pageTitle.width)/2
        this.pageTitle.y = paddingSide
        this.infoContainer.addChild(this.pageTitle)

        this.pageDesc =  new PIXI.Text(`${json2.modalInfoPage[this.currentPage].desc}`,this.textStyle3)
        this.pageDesc.x = (this.modalFrame.width - this.pageDesc.width)/2
        this.pageDesc.y = (this.pageTitle.height+paddingSide)*1.2
       
        this.infoContainer.addChild(this.pageDesc)
        
        this.pageText = new PIXI.Text(`Page ${this.currentPage+1}/${lastPage+1}`,this.textStyle2)
        this.pageText.x = (this.modalFrame.width - this.pageText.width)*0.95
        this.pageText.y = (this.modalFrame.height - this.pageText.height)*0.95
        this.infoContainer.addChild(this.pageText)

        
        this.prevBtn.interactive = true
        this. prevBtn.cursor = 'pointer'
        this.prevBtn.x = paddingSide
        this.prevBtn.y = (this.modalFrame.height - this.prevBtn.height)/2
        this.infoContainer.addChild(this.prevBtn)

        args = {
            pageTitle:this.pageTitle,
            pageDesc:this.pageDesc,
            pageText:this.pageText
        }

        this.prevBtn.addEventListener('pointerdown',()=>{
            if(this.currentPage !== 0){
                this.currentPage--
            }
            this.updatePageContent(args,this.currentPage,lastPage)
        })

        
        this.nextBtn.interactive = true
        this.nextBtn.cursor = 'pointer'
        this.nextBtn.x = (this.modalFrame.width - this.nextBtn.width) - paddingSide
        this.nextBtn.y = (this.modalFrame.height - this.nextBtn.height)/2
        this.infoContainer.addChild(this.nextBtn)
        this.nextBtn.addEventListener('pointerdown',()=>{
            if(this.currentPage !== lastPage){
                this.currentPage++
                
            }
            this.updatePageContent(args,this.currentPage,lastPage)
        })

        this.infoFirstPageContainerPortrait.alpha = 0
        this.infoFirstPageContainer.alpha = 0
        
        if(this.screenSetting.screentype == 'portrait'){
            this.infoFirstPageContainerPortrait.alpha = 1
        }else{
            this.infoFirstPageContainer.alpha = 1
        }

       
        this.infoSecondPageContainer.alpha = 0
        this.infoThirdPageContainer.alpha = 0
        this.infoFourthPageContainer.alpha = 0
        this.infoFifthPageContainer.alpha = 0
        this.infoSixthPageContainer.alpha = 0
        this.infoSeventhPageContainer.alpha = 0

        this.infoSecondPageContainerPortrait.alpha = 0
        this.infoThirdPageContainerPortrait.alpha = 0
        this.infoFourthPageContainerPortrait.alpha = 0
        this.infoFifthPageContainerPortrait.alpha = 0
        this.infoSixthPageContainerPortrait.alpha = 0
        this.infoSeventhPageContainerPortrait.alpha = 0


        
        this.createInfoFirstPage()
        this.createInfoSecondPage()
        this.createInfoThirdPage()
        this.creatFourthPage()
        this.createFifthPage()
        this.createSixthPage()
        this.createSeventhPage()

        this.modalFrame.addChild(this.infoContainer)
        this.container.addChild(this.overlay,this.modalFrame)
        this.app.stage.addChild(this.container)
    }
    private updatePageContent(args:any,currentPage:number,lastPage:number){
        const {pageTitle,pageDesc,pageText} = args
        const elContent = json2.modalInfoPage[currentPage]

        pageTitle.texture = Functions.loadTexture(this.textureArray,'modal',`${elContent.title}`).texture
        pageTitle.x = (this.modalFrame.width - pageTitle.width)/2
        pageDesc.text = elContent.desc
        pageDesc.x = (this.modalFrame.width - pageDesc.width)/2
        pageText.text = `Page ${currentPage+1}/${lastPage+1}`
        pageText.x = (this.modalFrame.width - pageText.width)*0.95

        this.infoFirstPageContainer.alpha = 0
        this.infoSecondPageContainer.alpha = 0
        this.infoThirdPageContainer.alpha = 0
        this.infoFourthPageContainer.alpha = 0
        this.infoFifthPageContainer.alpha = 0
        this.infoSixthPageContainer.alpha = 0
        this.infoSeventhPageContainer.alpha = 0

        
        this.infoFirstPageContainerPortrait.alpha = 0
        this.infoSecondPageContainerPortrait.alpha = 0
        this.infoThirdPageContainerPortrait.alpha = 0
        this.infoFourthPageContainerPortrait.alpha = 0
        this.infoFifthPageContainerPortrait.alpha = 0
        this.infoSixthPageContainerPortrait.alpha = 0
        this.infoSeventhPageContainerPortrait.alpha = 0



        if(currentPage == 0){
            if(this.screenSetting.screentype == 'portrait'){
                this.infoFirstPageContainerPortrait.alpha = 1 
            }else{
                this.infoFirstPageContainer.alpha = 1   
            }
        }else if(currentPage == 1){
            this.infoSecondPageContainer.alpha = 1  
            if(this.screenSetting.screentype == 'portrait'){
                this.infoSecondPageContainer.scale.set(1.4)
            }else{
                this.infoSecondPageContainer.scale.set(1)
            }
        }else if(currentPage == 2){
            
            if(this.screenSetting.screentype == 'portrait'){
                this.infoThirdPageContainerPortrait.alpha = 1
            }else{
                this.infoThirdPageContainer.alpha = 1
            }
        }else if(currentPage == 3){
            if(this.screenSetting.screentype == 'portrait'){
                this.infoFourthPageContainerPortrait.alpha = 1
            }else{
                this.infoFourthPageContainer.alpha = 1
            }
        }else if(currentPage == 4){
            if(this.screenSetting.screentype == 'portrait'){
                this.infoFifthPageContainerPortrait.alpha = 1
            }else{
                this.infoFifthPageContainer.alpha = 1
            }
        }else if(currentPage == 5){
            if(this.screenSetting.screentype == 'portrait'){
                this.infoSixthPageContainerPortrait.alpha = 1
            }else{
                this.infoSixthPageContainer.alpha = 1
            }
        }else{
            if(this.screenSetting.screentype == 'portrait'){
                this.infoSeventhPageContainerPortrait.alpha = 1
            }else{
                this.infoSeventhPageContainer.alpha = 1
            }
        }

        this.infoFirstPageContainer.x = (this.infoContainer.width - this.infoFirstPageContainer.width)/2
        
        this.screenResize()
    }
    private createInfoFirstPage(){
        let paddingTop = 120
        let xGap = 1.2
        const contOne = new PIXI.Container
        const contTwo = new PIXI.Container
        const contThree = new PIXI.Container

        json2.mainSymbols.forEach((data,index)=>{
            const sprite = Functions.loadTexture(this.textureArray,'modal',`${data.img}`)
            const text = new PIXI.Text(`${data.text}`,this.textStyle4)
            sprite.scale.set(0.7)
            if(index <= 4){
                sprite.x = (sprite.width*index)*xGap
                sprite.y = 0
                text.y = sprite.height
                text.x = (sprite.x + ((sprite.width-text.width)/2))
                contOne.addChild(sprite,text)
            }else if(index >= 5 && index <=8){
                sprite.x = (sprite.width*(index-5))*xGap
                sprite.y = sprite.height*1.2
                text.y = sprite.height+sprite.y
                text.x = (sprite.x + ((sprite.width-text.width)/2))
                contTwo.addChild(sprite,text)
            }else{
                index == 10?sprite.x = 0:sprite.x = sprite.width*3.5
                sprite.y = sprite.height*2
                text.y = (sprite.y+(sprite.height-text.height)/2)
                text.x = (sprite.x + sprite.width)+10
                contThree.addChild(sprite,text)
            }
        })
        this.infoFirstPageContainer.addChild(contOne)
        contOne.x = (this.infoContainer.width - contOne.width)/2
        contOne.y = paddingTop
        this.infoFirstPageContainer.addChild(contTwo)
        contTwo.x = (this.infoContainer.width - contTwo.width)/2
        contTwo.y = paddingTop*1.2
        this.infoFirstPageContainer.addChild(contThree)
        contThree.x = (this.infoContainer.width - contThree.width)/2
        contThree.y = paddingTop*1.7
        this.infoFirstPageContainer.x = (this.infoContainer.width - this.infoFirstPageContainer.width)/2
        this.infoContainer.addChild(this.infoFirstPageContainer)
        //PORTRAIT
        const contOnePortrait = new PIXI.Container
        const contTwoPortrait = new PIXI.Container
        const contThreePortrait = new PIXI.Container
        json2.mainSymbols.forEach((data,index)=>{
            const sprite2 = Functions.loadTexture(this.textureArray,'modal',`${data.img}`)
            const text = new PIXI.Text(`${data.text}`,this.textStyle4)
            sprite2.scale.set(0.8)
            if(index <= 2){
                sprite2.x = (sprite2.width*index)*xGap - 45
                sprite2.y = 0
                text.y = sprite2.height
                text.x = (sprite2.x + ((sprite2.width-text.width)/2))
                contOnePortrait.addChild(sprite2,text)
            }else if(index <= 4 && index >2){
                sprite2.x = (sprite2.width*index)*xGap - 650
                sprite2.y = sprite2.height*1.2
                text.y = sprite2.height *2 + 45
                text.x = (sprite2.x + ((sprite2.width-text.width)/2))
                contOnePortrait.addChild(sprite2,text)
            }else if(index >= 5 && index <=6){
                sprite2.x = (sprite2.width*(index-5))*xGap  - 40
               // sprite2.y = sprite2.height*1.2
                sprite2.y = sprite2.height*2.5
                text.y = sprite2.height+sprite2.y
                text.x = (sprite2.x + ((sprite2.width-text.width)/2))
                contTwoPortrait.addChild(sprite2,text)
            }else if(index >= 7 && index <=8){
                sprite2.x = (sprite2.width*(index-5))*xGap - 520
                // sprite2.y = sprite2.height*1.2
                 sprite2.y = sprite2.height*3 + 130
                 text.y = sprite2.height+sprite2.y
                 text.x = (sprite2.x + ((sprite2.width-text.width)/2))
                 contTwoPortrait.addChild(sprite2,text)
            }else if(index == 9){
                //index == 10?sprite2.x = 0:sprite2.x = sprite2.width*2 
                sprite2.x = sprite2.width*2 - 340
                //sprite2.y = sprite2.height*2
               
                sprite2.y = sprite2.height*5 - 50
                text.y = (sprite2.y+(sprite2.height-text.height)/2) +140
                text.x = (sprite2.x + sprite2.width)/2- 140
                contThreePortrait.addChild(sprite2,text)
            }else{
                sprite2.x = sprite2.width*2  -350
                //sprite2.y = sprite2.height*2
               
                sprite2.y = sprite2.height*6 + 40
                text.y = (sprite2.y+(sprite2.height-text.height)/2)+ 160
                text.x = (sprite2.x + sprite2.width)/2- 130
                contThreePortrait.addChild(sprite2,text)
            }
        })
        this.infoFirstPageContainerPortrait.addChild(contOnePortrait)
        contOnePortrait.x = (this.infoContainer.width - contOnePortrait.width)/2
        contOnePortrait.y = paddingTop
        this.infoFirstPageContainerPortrait.addChild(contTwoPortrait)
        contTwoPortrait.x = (this.infoContainer.width - contTwoPortrait.width)/2
        contTwoPortrait.y = paddingTop*1.2
        this.infoFirstPageContainerPortrait.addChild(contThreePortrait)
        contThreePortrait.x = (this.infoContainer.width - contThreePortrait.width)/2
        contThreePortrait.y = paddingTop*1.7
        this.infoFirstPageContainerPortrait.x = (this.infoContainer.width - this.infoFirstPageContainerPortrait.width)/2-290
        this.infoContainer.addChild(this.infoFirstPageContainerPortrait)
    }
    private createInfoSecondPage(){
        const symbolsContainer = new PIXI.Container
        const jackpotView = Functions.loadTexture(this.textureArray,'modal','jackpot_img')
        const descText = 'In the jackpot game pick stone to reveal a jackpot symbol, Match 3 of the same symbol to be awarded the corresponding jackpot!'
        const desc = new PIXI.Text(`${descText}`,this.textStyle4Center)
        json2.jackpotSymbols.forEach((data,index)=>{
            const symbols = Functions.loadTexture(this.textureArray,'modal',`${data.img}`)
            const text = new PIXI.Text(`${data.text}`,this.textStyle4)
            symbols.scale.set(1.6)
            symbols.x = (symbols.width*index)*1.2
            text.x = symbols.x + (symbols.width-text.width)/2 
            text.y = symbols.height*1.1
            symbolsContainer.addChild(symbols,text)
        })
        jackpotView.y = symbolsContainer.height
        desc.y = (jackpotView.y + jackpotView.height)*1.05
        
        this.infoSecondPageContainer.addChild(symbolsContainer)
        this.infoSecondPageContainer.addChild(jackpotView)
        this.infoSecondPageContainer.addChild(desc)
        symbolsContainer.x = (this.infoSecondPageContainer.width - symbolsContainer.width)/2

        this.infoSecondPageContainer.x = (this.modalFrame.width - this.infoSecondPageContainer.width)/2
        this.infoSecondPageContainer.y = (this.modalFrame.height - this.infoSecondPageContainer.height)/2
        this.infoContainer.addChild(this.infoSecondPageContainer)
        
    }
    private createInfoThirdPage(){
        this.imgContainer = new PIXI.Container
        this.imgContainerPortrait = new PIXI.Container

        json2.freeSpinImages.forEach((data,index)=>{
            const img = Functions.loadTexture(this.textureArray,'modal',`${data.img}`)
            const text = new PIXI.Text(`${data.text}`,this.textStyle)
            const desc = new PIXI.Text(`${data.desc}`,this.textStyle4Center)
            img.scale.set(0.7)
            img.x = (index==0?img.width:0)*1.3
           // img.y = (index==0?img.width:0)*1.3
            text.x= img.x + (img.width-text.width)/2
            text.y = -text.height
            desc.x = img.x + (img.width-desc.width)/2
            desc.y = img.height*1.2
            if(index == 1){

            }
            this.imgContainer.addChild(img,text,desc)
        })
        
        this.imgContainer.x = (this.modalFrame.width - this.imgContainer.width)/2
        this.infoThirdPageContainer.addChild(this.imgContainer)
        this.infoThirdPageContainer.x = (this.modalFrame.width - this.infoThirdPageContainer.width)/2
        this.infoThirdPageContainer.y = ((this.modalFrame.height - this.infoThirdPageContainer.height)/2)*1.4
        this.infoContainer.addChild(this.infoThirdPageContainer)

        json2.freeSpinImages.forEach((data,index)=>{
            const img = Functions.loadTexture(this.textureArray,'modal',`${data.img}`)
            const text = new PIXI.Text(`${data.text}`,this.textStyle)
            const desc = new PIXI.Text(`${data.desc}`,this.textStyle4Center)
            img.scale.set(1.2)
            img.x = -140
            img.y = (index==0?img.width-250:50)*1.3
            text.x= img.x + (img.width-text.width)/2
            text.y = (index==1?-text.height+50:650)
            desc.x = img.x + (img.width-desc.width)/2
            desc.y = (index==1?img.height*1.2: 1170)
            if(index == 1){

            }
            this.imgContainerPortrait.addChild(img,text,desc)
        })
        this.imgContainerPortrait.x = (this.modalFrame.width - this.imgContainerPortrait.width)/2
        this.infoThirdPageContainerPortrait.addChild(this.imgContainerPortrait)
        this.infoThirdPageContainerPortrait.x = (this.modalFrame.width - this.infoThirdPageContainerPortrait.width)/2
        this.infoThirdPageContainerPortrait.y = ((this.modalFrame.height - this.infoThirdPageContainerPortrait.height)/2)
        this.infoContainer.addChild(this.infoThirdPageContainerPortrait)
        
    }
    private creatFourthPage(){
        this.image4th = Functions.loadTexture(this.textureArray,'modal',`patterns`)
        this.image4th.scale.set(0.8)
        this.image4th.x =(this.modalFrame.width - this.image4th.width)/2
        this.image4th.y = (this.modalFrame.height - this.image4th.height)/2
        this.infoFourthPageContainer.addChild(this.image4th)
        this.infoContainer.addChild(this.infoFourthPageContainer)

        this.image4thPortrait = Functions.loadTexture(this.textureArray,'modal_portrait',`patterns_portrait`)
        this.image4thPortrait.scale.set(1)
        this.image4thPortrait.x = (this.modalFrame.width - this.image4thPortrait.width)/2
        this.image4thPortrait.y = (this.modalFrame.height - this.image4thPortrait.height)/2
        this.infoFourthPageContainerPortrait.addChild(this.image4thPortrait)
        this.infoContainer.addChild(this.infoFourthPageContainerPortrait)
    }
    private createFifthPage(){
        this.image5th = Functions.loadTexture(this.textureArray,'modal',`how_to_play_content`)
        this.image5th.x = (this.modalFrame.width-this.image5th.width)/2
        this.image5th.y = (this.modalFrame.height-this.image5th.height)/2
        this.infoFifthPageContainer.addChild(this.image5th)
        this.infoContainer.addChild(this.infoFifthPageContainer)

        this.image5thPortrait = Functions.loadTexture(this.textureArray,'modal_portrait',`how_to_play_content_portrait`)
        this.image5thPortrait.x = (this.modalFrame.width-this.image5thPortrait.width)/2
        this.image5thPortrait.y = (this.modalFrame.height-this.image5thPortrait.height)/2
        this.infoFifthPageContainerPortrait.addChild(this.image5thPortrait)
        this.infoContainer.addChild(this.infoFifthPageContainerPortrait)
    }
    private createSixthPage(){
        this.image6th = Functions.loadTexture(this.textureArray,'modal',`settings_menu_content`)
        this.image6th.x = (this.modalFrame.width-this.image6th.width)/2
        this.image6th.y = (this.modalFrame.height-this.image6th.height)/2
        this.infoSixthPageContainer.addChild(this.image6th)
        this.infoContainer.addChild(this.infoSixthPageContainer)

        this.image6thPortrait = Functions.loadTexture(this.textureArray,'modal_portrait',`settings_menu_content_portrait`)
        this.image6thPortrait.x = (this.modalFrame.width-this.image6thPortrait.width)/2
        this.image6thPortrait.y = (this.modalFrame.height-this.image6thPortrait.height)/2
        this.infoSixthPageContainerPortrait.addChild(this.image6thPortrait)
        this.infoContainer.addChild(this.infoSixthPageContainerPortrait)
    }   
    private createSeventhPage(){
        this.infoContainer.addChild(this.infoSeventhPageContainer)
    }
}