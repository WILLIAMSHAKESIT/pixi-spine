import * as PIXI from 'pixi.js';

export default class ModalAutoplay {
    private app: PIXI.Application;
    public container: PIXI.Container;
    private modal_container: PIXI.Sprite;
    public modal_close: PIXI.Sprite;
    public playcount: number = 0;
    private betmodal: PIXI.Sprite;
    private betmodalclicked: PIXI.Sprite;
    private arrBtn: Array<PIXI.Sprite> = [];
    private valuestyle: PIXI.TextStyle;
    private toggleon: PIXI.Sprite;
    private toggleoff: PIXI.Sprite;
    private quicktoggle: PIXI.Sprite;
    private turbotoggle: PIXI.Sprite;
    public spintype: string = "normal";
    // private closemodal: () => void;
     private autoplay: (number: number) => void
    // private playSound: (index:number) => void

    


    //Texture Loader
    private textureArray:any

    constructor(app:PIXI.Application, textureArray:any ,autoplay: (number: number) => void ){
        this.app = app;
        this.textureArray = textureArray;
        this.betmodal = PIXI.Sprite.from(this.textureArray.jungle_slot_containers.textures['modal_betbox.png']);
        this.betmodalclicked = PIXI.Sprite.from(this.textureArray.jungle_slot_containers.textures['modal_betbox_clicked.png']);
        this.toggleon = PIXI.Sprite.from(this.textureArray.jungle_slot_containers.textures['toggle_on.png']);
        this.toggleoff = PIXI.Sprite.from(this.textureArray.jungle_slot_containers.textures['toggle_off.png']);
        this.container = new PIXI.Container();
        this.valuestyle = new PIXI.TextStyle({
            fontFamily: 'Luckiest Guy',
            fontSize: 40,
            fontWeight: 'bold',
            fill: '#FFFFFF'
        });
        this.autoplay = autoplay;
        this.init()
    }

    private init() {
        this.createOverlay();
        this.createParent();
        this.createContent();

        //positioning
        //parent modal
        this.modal_container.position.x = (this.container.width - this.modal_container.width) / 2;
        this.modal_container.position.y = 100;
        //modal close
        this.modal_close.position.x = (this.modal_container.width - this.modal_close.width) - 25;
        this.modal_close.position.y = 25;
        //main container
        this.container.position.x = 0
    }
    private createOverlay(){
        const parent = new PIXI.Graphics();
        parent.beginFill(0x000000, .7)
                .drawRect(0,0,this.app.screen.width, this.app.screen.height)
                .endFill();
        this.container.addChild(parent);
    }

    private createParent(){
        this.modal_container = PIXI.Sprite.from(this.textureArray.jungle_slot_containers.textures['modal_container.png']);
        this.container.addChild(this.modal_container);
        this.modal_close = PIXI.Sprite.from(this.textureArray.jungle_slot_containers.textures['modal_close.png']); 
        this.modal_container.addChild(this.modal_close);
        this.modal_close.interactive = true;
        this.modal_close.cursor = 'pointer';
    }

    
    private createContent(){
        const numberscointainer = new PIXI.Container();
        const quickspincontainer = new PIXI.Container();
        this.quicktoggle = new PIXI.Sprite(this.toggleoff.texture);
        this.turbotoggle = new PIXI.Sprite(this.toggleoff.texture);
        this.quicktoggle.interactive = true;
        this.quicktoggle.cursor = 'pointer';
        this.turbotoggle.interactive = true;
        this.turbotoggle.cursor = 'pointer';
        const turbospincontainer = new PIXI.Container();
        const arrCount = [1,5,10,25,50,75,100,250,500,1000];
        let posx = 0;
        let posy = 0;
        let gap = 15;
        arrCount.forEach((element, index) => {
            const btn = new PIXI.Sprite(this.betmodal.texture);
            btn.x = posx;
            btn.y = posy;
            btn.scale.set(1.2);
            btn.interactive = true;
            btn.cursor = 'pointer';
            this.arrBtn.push(btn);
            const text = new PIXI.Text(arrCount[index], this.valuestyle);
            btn.addChild(text);
            text.x = (btn.width - text.width) / 2 - 20;
            text.y = (btn.height - text.height) / 2- 8;
            numberscointainer.addChild(btn);
            posx += (btn.width + gap);
            if(index == 4){
                posx = 0;
                posy = btn.height + gap;
            }
            this.btnClicked(btn, arrCount[index]);
        });
        numberscointainer.y = 60;
        this.modal_container.addChild(numberscointainer);
        //quick spin and turbo spin
        const spinstyle = new PIXI.TextStyle({
            fontFamily: 'Luckiest Guy',
            fontSize: 45,
            fontWeight: 'bold',
            fill: '#FFFFFF'
        });
        const spinstyle2 = new PIXI.TextStyle({
            fontFamily: 'Montserrat',
            fontSize: 20,
            fontWeight: 'bold',
            fill: '#FFFFFF'
        });
        const quickspintext = new PIXI.Text("QUICK SPIN", spinstyle);
        const turbospintext = new PIXI.Text("TURBO SPIN", spinstyle);
        const quickspintextsub = new PIXI.Text("Reduce the overall spin time to play more quickly", spinstyle2);
        const turbospintextsub = new PIXI.Text("Totally remove overall spin time to play more quickly", spinstyle2);

        quickspincontainer.addChild(quickspintext);
        quickspincontainer.addChild(quickspintextsub);
        quickspincontainer.addChild(this.quicktoggle);
        quickspintextsub.style.wordWrap = true;
        quickspintextsub.style.wordWrapWidth = 400;
        quickspintextsub.style.lineHeight = 30;
        this.quicktoggle.scale.set(.9);
        this.quicktoggle.y = (quickspincontainer.height - this.quicktoggle.height) / 2;
        this.quicktoggle.x = (quickspintextsub.x + quickspintextsub.width) + 200;
        quickspintextsub.y = quickspintext.y + quickspintext.height;
        quickspincontainer.y = numberscointainer.y + numberscointainer.height + 60;
        this.modal_container.addChild(quickspincontainer);

        turbospincontainer.addChild(turbospintext);
        turbospincontainer.addChild(turbospintextsub);
        turbospincontainer.addChild(this.turbotoggle);
        turbospintextsub.style.wordWrap = true;
        turbospintextsub.style.wordWrapWidth = 400;
        turbospintextsub.style.lineHeight = 30;
        this.turbotoggle.scale.set(.9);
        this.turbotoggle.y = (turbospincontainer.height - this.turbotoggle.height) / 2;
        this.turbotoggle.x = (turbospintextsub.x + turbospintextsub.width) + 172;
        turbospintextsub.y = turbospintext.y + turbospintext.height;
        turbospincontainer.y = quickspincontainer.y + turbospincontainer.height + 40;

        //center
        numberscointainer.x = (this.modal_container.width - numberscointainer.width) / 2;
        quickspincontainer.x = (this.modal_container.width - quickspincontainer.width) / 2;
        turbospincontainer.x = quickspincontainer.x;

        this.modal_container.addChild(turbospincontainer);

        //events
        this.quicktoggle.addListener("pointerdown", () => {
          //  this.playSound(9)
            this.turbotoggle.texture = this.toggleoff.texture;
            if(this.quicktoggle.texture == this.toggleoff.texture){
                this.spintype = "quick";
                this.quicktoggle.texture = this.toggleon.texture;
            }
            else{
                this.spintype = "normal";
                this.quicktoggle.texture = this.toggleoff.texture;
            }
        });
        this.turbotoggle.addListener("pointerdown", () => {
          //  this.playSound(9)
            this.quicktoggle.texture = this.toggleoff.texture;
            if(this.turbotoggle.texture == this.toggleoff.texture){
                this.spintype = "turbo";
                this.turbotoggle.texture = this.toggleon.texture;
            }
            else{
                this.spintype = "normal";
                this.turbotoggle.texture = this.toggleoff.texture;
            }
        });

        const letrollcontainer = new PIXI.Container();
        const spinstyle3 = new PIXI.TextStyle({
            fontFamily: 'Luckiest Guy',
            fontSize: 35,
            fontWeight: 'bold',
            fill: '#FFFFFF'
        });
        const letsrolltext = new PIXI.Text("Let's Roll!", spinstyle3);
        const letrollbtn = PIXI.Sprite.from(this.textureArray.jungle_slot_containers.textures['lets_roll.png']);
        const letrollbtn2 =  PIXI.Sprite.from(this.textureArray.jungle_slot_containers.textures['lets_roll.png']);
        const letrollbtnclicked = PIXI.Sprite.from(this.textureArray.jungle_slot_containers.textures['lets_roll_clicked.png']);
        letrollbtn.addChild(letsrolltext);
        letsrolltext.x = (letrollbtn.width - letsrolltext.width) / 2;
        letsrolltext.y = (letrollbtn.height - letsrolltext.height) / 2;
        letrollbtn.scale.set(1.2);
        letrollcontainer.addChild(letrollbtn);
        this.modal_container.addChild(letrollcontainer);
        letrollcontainer.y = turbospincontainer.y + turbospincontainer.height + 35;
        letrollcontainer.x = (this.modal_container.width - letrollcontainer.width) / 2;

        //event
        letrollbtn.interactive = true;
        letrollbtn.cursor = 'pointer';
        letrollbtn.addListener("pointerdown", () => {
           // this.playSound(9)
            if(this.playcount > 0){
                letrollbtn.texture = letrollbtnclicked.texture;
                let timeout = setTimeout(() => {
                    letrollbtn.texture = letrollbtn2.texture;
                 //   this.closemodal();
                    this.autoplay(this.playcount);
                    clearTimeout(timeout)
                }, 100);
            }
            else{
                alert("Please choose a spin count!");
            }
        });
    }

    private btnClicked(btn: PIXI.Sprite, value: number){
        btn.addListener("pointerdown", () => {
            //this.playSound(9)
            this.resetTexture();
            this.playcount = value;
            btn.texture = this.betmodalclicked.texture;
        });
    }

    private resetTexture(){
        this.arrBtn.forEach(element => {
            element.texture = this.betmodal.texture;
        });
    }

}