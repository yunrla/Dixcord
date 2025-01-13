import { INCREASE, DECREASE } from "./type";

function increment(){
    return {
        type : INCREASE,
    }
}
function decrement(){
    return {
        type : DECREASE,
    }
}

export {increment, decrement};