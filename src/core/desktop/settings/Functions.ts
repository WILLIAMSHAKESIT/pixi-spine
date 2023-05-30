import 'pixi-spine' 
import * as PIXI from 'pixi.js';
import {Spine} from 'pixi-spine';

const arrayRandomizer = (array:any)=> {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
}
const symbolRandomizer = (arr:Array<any>) =>{
    let val = arr[Math.floor(Math.random()*arr.length)]
    return val - 1;
}
const random2Number = (min:number,max:number)=>{
    return Math.floor(Math.random() * (max - min + 1)) + min
}
const loadTexture = (textureArray:any,objKey:string,texture:string) =>{
   return PIXI.Sprite.from(textureArray[`${objKey}`].textures[`${texture}.png`]);
}
//GET SPRITE
const animatedSprite = (spritesheet:any,animationName:string) => {
    const sprite = new PIXI.AnimatedSprite(spritesheet.animations[`${animationName}`]);
    return sprite
}
const loadSpine = (textureArray:any,objKey:string)=>{
   return new Spine(textureArray[`${objKey}`].spineData)
}
const loadSpineAnimation = (spine:any,animation:string,loop:boolean,animationSpeed:number)=>{
    if (spine.state.hasAnimation(`${animation}`)) {
        // run animation
        spine.state.setAnimation(1, `${animation}`, loop);
        // animation spee
        spine.state.timeScale = animationSpeed;
        // update yourself
        spine.autoUpdate = true;
        // return spine.stage
        return spine
    }
}
const hasConsecutiveSameValues=(arr:Array<any>)=> {
    let count = 1; 
    let arrRes:Array<any> = []
    let arrType:number = 0 ;
    for (let i = 0; i < arr.length; i++) {
        arrRes.push({block:arr[i].blockNo,payout:arr[i].pattern.payout,type:arr[i].pattern.type,symbol:arr[i].pattern.symbol})
    }
     for (let i = 1; i < arr.length; i++) {
        if(i-1 == 0 && arr[0].pattern.type == 11){
            count++;
            console.log("buzz?")
        }
        if (arr[i].pattern.type == arr[i-1].pattern.type || arr[i].pattern.type == 11  ) {
            count++;
            arrType = arr[i-1].pattern.type
        } else {
            break; 
        }
    } 
    return {count:count,blocks:arrRes,arrTypes:arrType};      
}  
const numberWithCommas =(x:number)=> {
    let num:any = Math.round(x * 100) / 100
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const containsTwoDifferentValues=(arr:any)=> {
    // Create an empty set to store unique values
    var uniqueValues = new Set();

    // Iterate over each element in the array
    for (var i = 0; i < arr.length; i++) {
        // Add the current element to the set
        uniqueValues.add(arr[i]);

        // If the set contains more than 2 values, return false
        if (uniqueValues.size > 2) {
        return false;
        }
    }

    // Return true if the set contains exactly 2 values
    return uniqueValues.size === 2;
}
  
//RANDMON INT
const getRandomInt = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
}
  
// const textt
export default{
    arrayRandomizer,
    symbolRandomizer,
    loadTexture,
    hasConsecutiveSameValues,
    numberWithCommas,
    getRandomInt,
    loadSpineAnimation,
    loadSpine,
    animatedSprite,
    random2Number,
    containsTwoDifferentValues
}