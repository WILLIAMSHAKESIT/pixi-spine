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
    for (let i = 0; i < arr.length; i++) {
        arrRes.push({block:arr[i].blockNo,payout:arr[i].pattern.payout,type:arr[i].pattern.type,symbol:arr[i].pattern.symbol})
    }
     for (let i = 1; i < arr.length; i++) {
        if (arr[i].pattern.type === arr[i-1].pattern.type || arr[i].pattern.type == 9 ) {
            count++;
        } else {
            break; 
        }
    } 
    return {count:count,blocks:arrRes};      
}  
const numberWithCommas =(x:number)=> {
    let num:any = Math.round(x * 100) / 100
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
    getRandomInt
}