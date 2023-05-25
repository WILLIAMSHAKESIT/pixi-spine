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
    private infoFirstPageContainer:PIXI.Container
    private infoSecondPageContainer:PIXI.Container
    private infoThirdPageContainer:PIXI.Container
    private infoFourthPageContainer:PIXI.Container
    private infoFifthPageContainer:PIXI.Container
    private infoSixthPageContainer:PIXI.Container
    private infoSeventhPageContainer:PIXI.Container
    private textureArray:Array<any>
    //containers
    private autoPlaySettingsCont:PIXI.Container
    private systemContainer:PIXI.Container
    private infoContainer:PIXI.Container
    //sprites
    private overlay:PIXI.Sprite
    private modalFrame:PIXI.Sprite
    private titleY:number = 50
    public closeModal:PIXI.Sprite
    public rollBtn:PIXI.Sprite
    public minusBtn:PIXI.Sprite
    public plusBtn:PIXI.Sprite
    public betAmountSpite:PIXI.Sprite
    public musicBtnSprite:PIXI.Sprite
    public sfxBtnSprite:PIXI.Sprite
    private modalTitle:PIXI.Sprite
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

    constructor(app:PIXI.Application,textureArray:Array<any>){
        this.app = app
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
        })
        this.modalFrame.addChild(this.closeModal)
    }
    
    public createSystemSettings(betDisable:boolean){
        this.betBtns = []
        this.soundBtns = []
        this.systemContainer = new PIXI.Container
        const leftContainer = new PIXI.Container
        const rightContainer = new PIXI.Container
        //title
        this.modalTitle = Functions.loadTexture(this.textureArray,'modal','system_settings_title')
        this.modalTitle.x = (this.modalFrame.width - this.modalTitle.width)/2
        this.modalTitle.y = this.titleY
        this.modalFrame.addChild(this.modalTitle)
        // middle separator
        const separator = Functions.loadTexture(this.textureArray,'modal','separate')
        separator.x = (this.modalFrame.width - separator.width)/2
        this.systemContainer.addChild(separator)
        this.systemContainer.y = (this.modalFrame.height - this.systemContainer.height) / 2 

        // left container content
        // bet container
        this.betAmountSpite = Functions.loadTexture(this.textureArray,'modal','total_bet_container')
        this.betAmountSpite.x = 0
        leftContainer.addChild(this.betAmountSpite)
        // bet amount
        this.betAmountText = new PIXI.Text(`1`, this.textStyle)
        this.betAmountText.x = (this.betAmountSpite.width - this.betAmountText.width)/2
        this.betAmountText.y = (this.betAmountSpite.height - this.betAmountText.height)/2
        leftContainer.addChild(this.betAmountText)
        // title
        const totalBetText = new PIXI.Text(`TOTAL BET`, this.textStyle);
        totalBetText.x = (this.betAmountSpite.width - totalBetText.width)/2
        totalBetText.y = -totalBetText.height
        leftContainer.addChild(totalBetText)
        // minus btn
        this.minusBtn = Functions.loadTexture(this.textureArray,'modal','minus_bet')
        this.minusBtn.x = this.betAmountSpite.x
        this.minusBtn.y= this.betAmountSpite.height + 20
        this.minusBtn.interactive = betDisable?false:true
        this.minusBtn.cursor = 'pointer'
        this.betBtns.push(this.minusBtn)
        leftContainer.addChild(this.minusBtn)
        // plus btn
        this.plusBtn = Functions.loadTexture(this.textureArray,'modal','add_bet')
        this.plusBtn.x = (this.betAmountSpite.x + this.betAmountSpite.width) - this.plusBtn.width
        this.plusBtn.y = this.minusBtn.y
        this.plusBtn.interactive = betDisable?false:true
        this.plusBtn.cursor = 'pointer'
        this.betBtns.push(this.plusBtn)
        leftContainer.x = (separator.x - leftContainer.width) / 2 
        leftContainer.y = (separator.height - leftContainer.height)/1.3
        leftContainer.addChild(this.plusBtn)
        this.systemContainer.addChild(leftContainer)

        // right container content
        const ambientTitle = new PIXI.Text(`AMBIENT MUSIC`, this.textStyle);
        ambientTitle.x = (separator.x - ambientTitle.width)*2.1
        // ambient desc
        const ambientDesc = new PIXI.Text(`Turn on and off background music `, this.textStyle2);
        ambientDesc.x = ambientTitle.x
        ambientDesc.y = 45
        rightContainer.addChild(ambientTitle,ambientDesc)
        // ambient toggle
        this.musicBtnSprite = Functions.loadTexture(this.textureArray,'modal','off')
        this.musicBtnSprite.interactive = true
        this.musicBtnSprite.cursor = 'pointer'
        this.musicBtnSprite.x = ambientTitle.x * 1.5
        this.musicBtnSprite.y = ambientTitle.y + 15
        this.soundBtns.push(this.musicBtnSprite)
        rightContainer.addChild(this.musicBtnSprite)
        // sfx 
        const sfxTitle = new PIXI.Text(`SOUND FX`, this.textStyle);
        sfxTitle.x = ambientTitle.x
        sfxTitle.y = 120
        // ambient desc
        const sfxDesc = new PIXI.Text(`Turn on and off sound effects`, this.textStyle2);
        sfxDesc.x = sfxTitle.x
        sfxDesc.y = sfxTitle.y + 45
        rightContainer.addChild(sfxTitle,sfxDesc)
        // ambient toggle
        this.sfxBtnSprite = Functions.loadTexture(this.textureArray,'modal','off')
        this.sfxBtnSprite.interactive = true
        this.sfxBtnSprite.cursor ='pointer'
        this.sfxBtnSprite.x = sfxTitle.x * 1.5
        this.sfxBtnSprite.y = sfxTitle.y + 15
        this.soundBtns.push(this.sfxBtnSprite)
        rightContainer.addChild(this.sfxBtnSprite)
        rightContainer.y = (this.systemContainer.height - rightContainer.height)/2
        this.systemContainer.addChild(rightContainer)

        this.modalFrame.addChild(this.systemContainer)
        this.container.addChild(this.overlay,this.modalFrame)
        this.app.stage.addChild(this.container)
    }

    public createAutoPlaySettings(){
        this.autoPlaySettingsCont = new PIXI.Container
        const bottomContainer = new PIXI.Container
        const toggleX = 500
        let btns:Array<any> = []
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
            this.autoPlaySettingsCont.addChild(btn)
        })
        // quick spin
        const quickTitle = new PIXI.Text(`QUICK SPIN`, this.textStyle);
        quickTitle.y = 250
        bottomContainer.addChild(quickTitle)
        const quickDesc = new PIXI.Text(`Reduce the overall spin time to play quickly`, this.textStyle2);
        quickDesc.y = quickTitle.y * 1.2
        bottomContainer.addChild(quickDesc)
        // turbo spin
        const turboTitle = new PIXI.Text(`TURBO SPIN`, this.textStyle);
        turboTitle.y = 350
        bottomContainer.addChild(turboTitle)
        const turboDesc = new PIXI.Text(`Reduce the overall spin time to play quickly`, this.textStyle2);
        turboDesc.y = turboTitle.y * 1.13
        bottomContainer.addChild(turboDesc)
        // quick spin toggle
        const quickSprite =  Functions.loadTexture(this.textureArray,'modal','off')
        quickSprite.interactive = true
        quickSprite.cursor = 'pointer'
        quickSprite.x = toggleX
        quickSprite.y = quickTitle.y *1.05
        this.btnArray.push(quickSprite)
        bottomContainer.addChild(quickSprite)
        // turbo spin toggle
        const turboSprite =  Functions.loadTexture(this.textureArray,'modal','off')
        turboSprite.interactive = true
        turboSprite.cursor = 'pointer'
        turboSprite.x = toggleX
        turboSprite.y = turboTitle.y*1.05
        this.btnArray.push(turboSprite)
        bottomContainer.addChild(turboSprite)
        // roll sprite  
        this.rollBtn =  Functions.loadTexture(this.textureArray,'modal','roll')
        this.rollBtn.interactive = true
        this.rollBtn.cursor = 'pointer'
        this.rollBtn.x = (bottomContainer.width - this.rollBtn.width)/2
        this.rollBtn.y = turboDesc.y * 1.2
        // roll btn text 
        const rollBtnText = new PIXI.Text(`Let's Roll!`, this.textStyle);
        rollBtnText.x = (this.rollBtn.width - rollBtnText.width)/2
        rollBtnText.y = (this.rollBtn.height - rollBtnText.height)/2
        this.rollBtn.addChild(rollBtnText)
        bottomContainer.addChild(this.rollBtn)
        // bottom container positioning
        bottomContainer.x = (this.autoPlaySettingsCont.width - bottomContainer.width)/2
        //container positioning
        this.autoPlaySettingsCont.addChild(bottomContainer)
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
        
        let currentPage = 0
        let lastPage = json2.modalInfoPage.length - 1
        let paddingSide = 30
        let args:any = null
        
        const pageTitle =  Functions.loadTexture(this.textureArray,'modal','paytable_slot_title')
        pageTitle.x = (this.modalFrame.width - pageTitle.width)/2
        pageTitle.y = paddingSide
        this.infoContainer.addChild(pageTitle)

        const pageDesc =  new PIXI.Text(`${json2.modalInfoPage[currentPage].desc}`,this.textStyle3)
        pageDesc.x = (this.modalFrame.width - pageDesc.width)/2
        pageDesc.y = (pageTitle.height+paddingSide)*1.2
        this.infoContainer.addChild(pageDesc)
        
        const pageText = new PIXI.Text(`Page ${currentPage+1}/${lastPage+1}`,this.textStyle2)
        pageText.x = (this.modalFrame.width - pageText.width)*0.95
        pageText.y = (this.modalFrame.height - pageText.height)*0.95
        this.infoContainer.addChild(pageText)

        const prevBtn = Functions.loadTexture(this.textureArray,'modal','left_arrow')
        prevBtn.interactive = true
        prevBtn.cursor = 'pointer'
        prevBtn.x = paddingSide
        prevBtn.y = (this.modalFrame.height - prevBtn.height)/2
        this.infoContainer.addChild(prevBtn)

        args = {
            pageTitle:pageTitle,
            pageDesc:pageDesc,
            pageText:pageText
        }

        prevBtn.addEventListener('pointerdown',()=>{
            if(currentPage !== 0){
                currentPage--
            }
            this.updatePageContent(args,currentPage,lastPage)
        })
        
        const nextBtn = Functions.loadTexture(this.textureArray,'modal','right_arrow')
        nextBtn.interactive = true
        nextBtn.cursor = 'pointer'
        nextBtn.x = (this.modalFrame.width - nextBtn.width) - paddingSide
        nextBtn.y = (this.modalFrame.height - nextBtn.height)/2
        this.infoContainer.addChild(nextBtn)
        nextBtn.addEventListener('pointerdown',()=>{
            if(currentPage !== lastPage){
                currentPage++
            }
            this.updatePageContent(args,currentPage,lastPage)
        })

        this.infoFirstPageContainer.alpha = 1
        this.infoSecondPageContainer.alpha = 0
        this.infoThirdPageContainer.alpha = 0
        this.infoFourthPageContainer.alpha = 0
        this.infoFifthPageContainer.alpha = 0
        this.infoSixthPageContainer.alpha = 0
        this.infoSeventhPageContainer.alpha = 0
        
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
        pageText.y = (this.modalFrame.height - pageText.height)*0.95

        this.infoFirstPageContainer.alpha = 0
        this.infoSecondPageContainer.alpha = 0
        this.infoThirdPageContainer.alpha = 0
        this.infoFourthPageContainer.alpha = 0
        this.infoFifthPageContainer.alpha = 0
        this.infoSixthPageContainer.alpha = 0
        this.infoSeventhPageContainer.alpha = 0

        if(currentPage == 0){
            this.infoFirstPageContainer.alpha = 1    
        }else if(currentPage == 1){
            this.infoSecondPageContainer.alpha = 1
        }else if(currentPage == 2){
            this.infoThirdPageContainer.alpha = 1
        }else if(currentPage == 3){
            this.infoFourthPageContainer.alpha = 1
        }else if(currentPage == 4){
            this.infoFifthPageContainer.alpha = 1
        }else if(currentPage == 5){
            this.infoSixthPageContainer.alpha = 1
        }else{
            this.infoSeventhPageContainer.alpha = 1
        }

        this.infoFirstPageContainer.x = (this.infoContainer.width - this.infoFirstPageContainer.width)/2
        this.infoContainer.x = 0
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
        const imgContainer = new PIXI.Container

        json2.freeSpinImages.forEach((data,index)=>{
            const img = Functions.loadTexture(this.textureArray,'modal',`${data.img}`)
            const text = new PIXI.Text(`${data.text}`,this.textStyle)
            const desc = new PIXI.Text(`${data.desc}`,this.textStyle4Center)
            img.scale.set(0.7)
            img.x = (index==0?img.width:0)*1.3
            text.x= img.x + (img.width-text.width)/2
            text.y = -text.height
            desc.x = img.x + (img.width-desc.width)/2
            desc.y = img.height*1.2
            imgContainer.addChild(img,text,desc)
        })
        
        imgContainer.x = (this.modalFrame.width - imgContainer.width)/2
        this.infoThirdPageContainer.addChild(imgContainer)
        this.infoThirdPageContainer.x = (this.infoContainer.width - this.infoThirdPageContainer.width)/2
        this.infoThirdPageContainer.y = ((this.modalFrame.height - this.infoThirdPageContainer.height)/2)*1.4
        this.infoContainer.addChild(this.infoThirdPageContainer)
    }
    private creatFourthPage(){
        const img = Functions.loadTexture(this.textureArray,'modal',`patterns`)
        img.scale.set(0.8)
        img.x = (this.modalFrame.width - img.width)/2
        img.y = (this.modalFrame.height - img.height)/2
        this.infoFourthPageContainer.addChild(img)
        this.infoContainer.addChild(this.infoFourthPageContainer)
    }
    private createFifthPage(){
        const img = Functions.loadTexture(this.textureArray,'modal',`how_to_play_content`)
        img.x = (this.modalFrame.width-img.width)/2
        img.y = (this.modalFrame.height-img.height)/2
        this.infoFifthPageContainer.addChild(img)
        this.infoContainer.addChild(this.infoFifthPageContainer)
    }
    private createSixthPage(){
        const img = Functions.loadTexture(this.textureArray,'modal',`settings_menu_content`)
        img.x = (this.modalFrame.width-img.width)/2
        img.y = (this.modalFrame.height-img.height)/2
        this.infoSixthPageContainer.addChild(img)
        this.infoContainer.addChild(this.infoSixthPageContainer)
    }   
    private createSeventhPage(){
        this.infoContainer.addChild(this.infoSeventhPageContainer)
    }
}