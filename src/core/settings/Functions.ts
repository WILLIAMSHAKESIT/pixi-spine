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
    // let count = 1;
    // let currentVal = arr[0].type;
  
    // for (let i = 0; i < arr.length; i++) {
    //   if (arr[i].type === currentVal) {
    //     count++;
    //     if(count > 3) {
    //       return true;
    //     }
    //   } else {
    //     count = 1;
    //     currentVal = arr[i].type;
    //   }
    //   // check if the current value is different from the first value
    //   if (i === 3 && currentVal !== arr[0].type) {
    //     return false;
    //   }
    // }
  
    // return false;
    let count = 1; 
    for (let i = 1; i < arr.length; i++) {
        if (arr[i].type === arr[i-1].type) {
        count++;
        } else {
        break; 
        }
    }
    return count;      
}  
  
// const textt
export default{
    arrayRandomizer,
    symbolRandomizer,
    loadTexture,
    hasConsecutiveSameValues
}