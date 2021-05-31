function detectCycleTillNow(childObject,formula) {
    let formulaTokens = formula.split(" ");
    for (let i = 0; i < formulaTokens.length; i++) {
        let ascii = formulaTokens[i].charCodeAt(0);
        if(ascii >= 65 && ascii <= 90){
            let {rid,cid} = getRIDCIDfromAddress(formulaTokens[i]);
            let parentObj = sheetsDB[rid][cid];
            if(detectForThisParent(childObject,parentObj)){
                return true;
            }
        }
    }
    return false;
}

function detectForThisParent(childObj,parentObj) {
    if(childObj == parentObj){
        return true;
    }
    console.log(childObj.children);
    for (let i = 0; i < childObj.children.length; i++) {
        let {rid,cid} = getRIDCIDfromAddress(childObj.children[i]);
        let newChildObj = sheetsDB[rid][cid];
        if(detectForThisParent(newChildObj,parentObj)){
            return true;
        }
    }
    return false;
}
