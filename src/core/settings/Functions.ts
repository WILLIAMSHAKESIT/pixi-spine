import * as PIXI from 'pixi.js';

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
const loadTexture = (textureArray:any,objKey:string,texture:string) =>{
   return PIXI.Sprite.from(textureArray[`${objKey}`].textures[`${texture}.png`]);
}
const hasConsecutiveSameValues=(arr:Array<any>)=> {
    let count = 1; 
    let arrRes:Array<any> = []
    let arrType:number = 0 ;
    for (let i = 0; i < arr.length; i++) {
        arrRes.push({block:arr[i].blockNo,payout:arr[i].pattern.payout})
    }
<<<<<<< HEAD
     for (let i = 1; i < arr.length; i++) {
=======
    for (let i = 1; i < arr.length; i++) {
>>>>>>> 28861a86829f695cb637d7787e7df17acbc3e4ef
        if ((arr[i].pattern.type === arr[i-1].pattern.type)) {
            count++;
            arrType = arr[i-1].pattern.type
        } else {
            break; 
        }
    }
    
    return {count:count,blocks:arrRes, arrTypes:arrType};      
}  
const numberWithCommas =(x:number)=> {
    let num:any = Math.round(x * 100) / 100
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
  
// const textt
export default{
    arrayRandomizer,
    symbolRandomizer,
    loadTexture,
    hasConsecutiveSameValues,
    numberWithCommas
}