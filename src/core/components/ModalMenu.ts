import * as PIXI from 'pixi.js';

export default class ModalMenu {

    public container: PIXI.Container;
    private app:PIXI.Application
    //Texture Loader
    private textureArray:any

    //textures
    private modal_container: PIXI.Sprite;
    private container_design: PIXI.Sprite


    //Height and Width of screen
    private baseWidth:number
    private baseHeight:number

    private betvaluestyle: PIXI.TextStyle;
    private bettextvalue: PIXI.Text;
    private titlestyle: PIXI.TextStyle;
    private parenttitle: PIXI.TextStyle;

    //betting
    private betArray: Array<number> = [1,5,10,20,50,100];
    private betIndex: number = 0;
    public bet_value: number;


    public modal_close: PIXI.Sprite;
    private margins: number = 500;
    private bet_add: PIXI.Sprite;
    private bet_add_clicked: PIXI.Sprite;
    private bet_minus: PIXI.Sprite;
    private bet_minus_clicked: PIXI.Sprite;
    private bet_box: PIXI.Sprite;
    private middleline: PIXI.Sprite;
    private updatebet: (val: number) => void;
    private bonusprizeupdate: (val : number) => void;
    private ambienttoggleon: PIXI.Sprite;
    private ambienttoggleoff: PIXI.Sprite;
    private soundfxbtnon: PIXI.Sprite;
    private soundfxbtnoff: PIXI.Sprite;
    public ambientbtn: PIXI.Sprite;
    public soundfxbtn: PIXI.Sprite;
    private isMute:Boolean;

    
    constructor(app: PIXI.Application, textureArray:any){
        this.app = app;
        this.textureArray = textureArray

        this.container = new PIXI.Container();

        this.baseWidth = this.app.screen.width
        this.baseHeight = this.app.screen.height

        this.betvaluestyle = new PIXI.TextStyle({
            fontFamily: 'Luckiest Guy',
            fontSize: 100,
            fontWeight: 'bold',
            fill: '#FFFFFF'
        });
        this.titlestyle = new PIXI.TextStyle({
            fontFamily: 'Montserrat',
            fontSize: 50,
            fontWeight: 'bold',
            fill: '#FFFFFF'
        });
        this.parenttitle = new PIXI.TextStyle({
            fontFamily: 'Montserrat',
            fontSize: 40,
            fontWeight: 'bold',
            fill: '#FEAE4D'
        });



        this.init()
    }

    // initialize everything
    private init(){
        this.container.position.x = +320;
        this.container.position.y = (this.app.screen.height - this.container.height) / 2 - 420;
        this.ambienttoggleon = PIXI.Sprite.from(this.textureArray.jungle_slot_containers.textures['toggle_on.png']);
        this.ambienttoggleoff = PIXI.Sprite.from(this.textureArray.jungle_slot_containers.textures['toggle_off.png']);
        this.soundfxbtnon =PIXI.Sprite.from(this.textureArray.jungle_slot_containers.textures['toggle_on.png']);
        this.soundfxbtnoff = PIXI.Sprite.from(this.textureArray.jungle_slot_containers.textures['toggle_off.png']);
        //this.app.stage.addChild(this.container)
        this.createOverlay()
        this.createFrame()
        this.createContentFrame()
       ;
    }

    private createFrame(){
        this.modal_container = PIXI.Sprite.from(this.textureArray.jungle_slot_containers.textures['modal_container.png']);
        //this.modal_container.anchor.set(0.5)
        this.modal_container.position.x = 0
        this.modal_container.position.y = 0
        this.container.addChild(this.modal_container)

        this.modal_close = PIXI.Sprite.from(this.textureArray.jungle_slot_containers.textures['modal_close.png']);
        this.modal_container.addChild(this.modal_close)
        this.modal_close.position.x = (this.modal_container.width - this.modal_close.width) - 25;
        this.modal_close.position.y = 25;
        this.modal_close.interactive = true;
        this.modal_close.cursor = 'pointer';
        
    }
    private createOverlay(){
        const parent = new PIXI.Graphics();
        parent.beginFill(0x000000, .7)
                .drawRect(-320,-120,this.app.screen.width, this.app.screen.height)
                .endFill();
        this.container.addChild(parent);
    }

    private createContentFrame(){
        //title
        const title = new PIXI.Text("SYSTEM SETTINGS", this.parenttitle);
        title.y = title.height / 2;
        title.x = (this.modal_container.width - title.width) / 2;
        this.modal_container.addChild(title);

        this.container_design = PIXI.Sprite.from(this.textureArray.jungle_slot_containers.textures['container_design.png'])
        this.container_design.width = 1292
        this.container_design.position.x = 10
        this.container_design.position.y = 12;
        this.modal_container.addChild(this.container_design)

         //left
         const leftcontainer = new PIXI.Container();
         const betcontainer = new PIXI.Container();
         this.bettextvalue = new PIXI.Text(this.bet_value, this.betvaluestyle);
         const lefttitle = new PIXI.Text("TOTAL BET", this.titlestyle);
         this.bet_minus = PIXI.Sprite.from(this.textureArray.jungle_slot_containers.textures['bet_minus.png']);
         this.bet_minus_clicked = PIXI.Sprite.from(this.textureArray.jungle_slot_containers.textures['bet_minus.png']);
         this.bet_box = PIXI.Sprite.from(this.textureArray.jungle_slot_containers.textures['total_bet_container.png']); 
         this.bet_add = PIXI.Sprite.from(this.textureArray.jungle_slot_containers.textures['bet_add.png']);
         this.bet_add_clicked = PIXI.Sprite.from(this.textureArray.jungle_slot_containers.textures['bet_add.png']);
         this.bet_box.x = this.bet_minus.x + this.bet_minus.width;
         this.bet_add.x =  this.bet_box.width - 15;
         this.bet_add.y = 120;
         this.bet_minus.x = this.bet_minus.width + 15;
         this.bet_minus.y = 120;
         betcontainer.addChild(this.bet_minus);
         betcontainer.addChild(this.bet_box);
         betcontainer.addChild(this.bet_add);
         betcontainer.scale.set(.9);
         betcontainer.y = lefttitle.y + lefttitle.height + 30;
         leftcontainer.addChild(lefttitle);
         leftcontainer.addChild(betcontainer);
         betcontainer.x = -110
         lefttitle.scale.set(.8)
         lefttitle.x = (leftcontainer.width - lefttitle.width) / 2;
         this.modal_container.addChild(leftcontainer);
         this.bettextvalue.y = (this.bet_box.height - this.bettextvalue.height) / 2 + 8;
         this.bettextvalue.x = (this.bet_box.width - this.bettextvalue.width) / 2;
         this.bettextvalue.scale.set(.8)
         this.bet_box.addChild(this.bettextvalue);
         this.bet_add.cursor ='pointer';
         this.bet_add.interactive = true;
         this.bet_add.addListener("pointerdown", () => {
            // this.playSound(9);
             this.betIndex++;
             this.bet_value = this.betArray[this.betIndex];
           //  this.updateBetBox();
             if(this.betIndex == this.betArray.length - 1){
                 this.bet_add.interactive = false;
             }
             if(this.betIndex == 1){
                 this.bet_minus.interactive = true;
             }
             const originaltexture = this.bet_add.texture;
             this.bet_add.texture = this.bet_add_clicked.texture;
             let settexture = setTimeout(()=>{
                 this.bet_add.texture = originaltexture;
                 clearTimeout(settexture);
             },100);
         });
 
         this.bet_minus.interactive = false;
         this.bet_minus.cursor = 'pointer';
         this.bet_minus.addListener("pointerdown", () => {
             //this.playSound(9);
             this.betIndex--;
             this.bet_value = this.betArray[this.betIndex];
            // this.updateBetBox();
             if(this.betIndex == 0){
                 this.bet_minus.interactive = false;
             }
             if(this.betIndex == this.betArray.length - 2){
                 this.bet_add.interactive = true;
             }
             const originaltexture = this.bet_minus.texture;
             this.bet_minus.texture = this.bet_minus_clicked.texture;
             let settexture = setTimeout(()=>{
                 this.bet_minus.texture = originaltexture;
                 clearTimeout(settexture);
             },100);
         });
         leftcontainer.y = (this.modal_container.height - leftcontainer.height) / 2;
         leftcontainer.x = ((this.modal_container.width / 2) - leftcontainer.width) / 2;

        //middle
        const middlecontainer = new PIXI.Container();
        this.middleline =  PIXI.Sprite.from(this.textureArray.jungle_slot_containers.textures['straight_line.png']); 
        middlecontainer.addChild(this.middleline);
        middlecontainer.x = (this.modal_container.width - middlecontainer.width) / 2;
        middlecontainer.y = (this.modal_container.height - middlecontainer.height) / 2;
        this.modal_container.addChild(middlecontainer);

        //right
        const rightcontainer = new PIXI.Container();
        const ambientcontainer = new PIXI.Container();
        const soundfxcontainer = new PIXI.Container();
        const ambientstyle = new PIXI.TextStyle({
            fontFamily: 'Luckiest Guy',
            fontSize: 35,
            fontWeight: 'bold',
            fill: '#FFFFFF'
        });
        const ambientstyle2 = new PIXI.TextStyle({
            fontFamily: 'Montserrat',
            fontSize: 20,
            fontWeight: 'bold',
            fill: '#FFFFFF'
        });
        const ambienttext = new PIXI.Text("AMBIENT MUSIC", ambientstyle);
        const ambientsubtext = new PIXI.Text("Turn on and off the music", ambientstyle2);
        const soundfxtext = new PIXI.Text("SOUND FX", ambientstyle);
        const soundfxsubtext = new PIXI.Text("Turn on and off the sound", ambientstyle2);
        //ambient
        ambientcontainer.addChild(ambienttext);
        ambientcontainer.addChild(ambientsubtext);
        ambientsubtext.y = ambienttext.y + ambienttext.height;
        this.ambientbtn = new PIXI.Sprite(this.ambienttoggleoff.texture);
        this.ambientbtn.scale.set(.9);
        this.ambientbtn.y = (ambientcontainer.height - this.ambientbtn.height) / 2;
        this.ambientbtn.x = (ambienttext.x + ambienttext.width) + 85;
        ambientcontainer.addChild(this.ambientbtn);
        rightcontainer.addChild(ambientcontainer);
        //soundfx
        soundfxcontainer.addChild(soundfxtext);
        soundfxcontainer.addChild(soundfxsubtext);
        soundfxsubtext.y = soundfxtext.y + soundfxtext.height;
        this.soundfxbtn = new PIXI.Sprite(this.ambienttoggleoff.texture);
        this.soundfxbtn.scale.set(.9);
        this.soundfxbtn.y = (soundfxcontainer.height - this.soundfxbtn.height) / 2;
        this.soundfxbtn.x = (soundfxtext.x + soundfxtext.width) + 200;
        soundfxcontainer.addChild(this.soundfxbtn);
        soundfxcontainer.y = ambientcontainer.y + ambientcontainer.height + 50;
        rightcontainer.addChild(soundfxcontainer);

        this.modal_container.addChild(rightcontainer);
        rightcontainer.y = (this.modal_container.height - rightcontainer.height) / 2;
        rightcontainer.x = (this.modal_container.width / 2) + (rightcontainer.width / 4);

        //events
        this.ambientbtn.cursor = 'pointer';
        this.ambientbtn.interactive = true;
        this.soundfxbtn.cursor = 'pointer';
        this.soundfxbtn.interactive = true;
        this.ambientbtn.addListener("pointerdown", () => {
          // this.playSound(9)
            if(this.ambientbtn.texture == this.ambienttoggleoff.texture){
                this.ambientbtn.texture = this.ambienttoggleon.texture;
                //this.muteSound('ambient', false);
               // this.checkSounds(false);
                if(this.soundfxbtn.texture == this.soundfxbtnoff.texture){
               //     this.muteSound('sfx', true)
                }
            }else{
                this.ambientbtn.texture = this.ambienttoggleoff.texture;
                //this.muteSound('ambient', true)
                if(this.ambientbtn.texture == this.ambienttoggleoff.texture && this.soundfxbtn.texture == this.soundfxbtnoff.texture){
                 //   this.checkSounds(true);
                }
            }
            
        });
        this.soundfxbtn.addListener("pointerdown", () => {
            //this.playSound(9)
            if(this.soundfxbtn.texture == this.soundfxbtnoff.texture){
                this.soundfxbtn.texture = this.soundfxbtnon.texture;
              //  this.muteSound('sfx', false)
               // this.checkSounds(false);
                if(this.ambientbtn.texture == this.ambienttoggleoff.texture){
                //    this.muteSound('ambient', true)
                }
            }else{
                this.soundfxbtn.texture = this.soundfxbtnoff.texture;
               // this.muteSound('sfx', true)
                if(this.ambientbtn.texture == this.ambienttoggleoff.texture && this.soundfxbtn.texture == this.soundfxbtnoff.texture){
                  //  this.checkSounds(true);
                }
            }
            
        });
    }
}