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
const  hasConsecutiveSameValues=(arr:Array<any>)=> {
    // return false;
    let count = 1; 
    let arrRes:Array<any> = []
    for (let i = 0; i < arr.length; i++) {
        arrRes.push(arr[i].blockNo)
    }
    for (let i = 1; i < arr.length; i++) {
        if (arr[i].pattern.type === arr[i-1].pattern.type) {
            count++;
        } else {
            break; 
        }
    }
    return {count:count,blocks:arrRes};      
}  
const numberWithCommas =(x:number)=> {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
  
// const textt
export default{
    arrayRandomizer,
    symbolRandomizer,
    loadTexture,
    hasConsecutiveSameValues,
    numberWithCommas
}