// focus when we focus at a element focus means we need to focus a element  i.e just go to cell
// click means when we click a element
// blur means when we click another element means just before another element is click prevoius blur is fired

// to set data for each cell.
for (let i = 0; i < allCells.length; i++) {
    allCells[i].addEventListener("blur",function () {
        let data = allCells[i].innerText;
        let address = addressInput.value;
        // console.log(address);
        // console.log(allCells[i]);
        let rid = allCells[i].getAttribute("rid");
        let cid = allCells[i].getAttribute("cid");
        // let {rid,cid} = getRIDCIDfromAddress(address);
        let cellObject = sheetsDB[rid][cid];

        // if we have not changed the value of cell we didnot need to change to do remove formula, or change data
        // or update children
        
        // But here we are missing a case that if we change value and again set it that value than formula will not
        // be removed
        if(cellObject.value == data){
            return;
        }

        if(cellObject.formula){
            //remove formula if value has changed
            removeFormula(cellObject,address);
            formulaBar.value = "";
        }

        cellObject.value = data;

        // update children with values recursively 
        updateChildren(cellObject);
    })
}

// remove formula from object and remove this address from parent array whon it previously depends
function removeFormula(cellObject,myName) {
    let formula = cellObject.formula;
    let formulaTokens = formula.split(" ");
    for (let i = 0; i < formulaTokens.length; i++) {
        let ascii = formulaTokens[i].charCodeAt(0);
        if(ascii >= 65 && ascii <= 90){
            let {rid,cid} = getRIDCIDfromAddress(formulaTokens[i]);
            let parentObj = sheetsDB[rid][cid];

            // finding index of child
            let idx = parentObj.children.indexOf(myName);

            //removing address
            parentObj.children.splice(idx,1);
        }
    }
    cellObject.formula = "";
}

// to take input of formula
formulaBar.addEventListener("keydown",function (e) {
    if (e.key == "Enter" && formulaBar.value) {
        // user input formula
        let currentFormula = formulaBar.value;
        let address = addressInput.value;
        let {rid,cid} = getRIDCIDfromAddress(address);
        let cellObject = sheetsDB[rid][cid];

        // if formula has changed then remove previous formula and its parent children arrray remove current address
        if(currentFormula != cellObject.formula){
            removeFormula(cellObject,address);
        }

        // get value from evaluate fxn
        let value = evaluateFormula(currentFormula);
        
        // given for which we are setting the formula -> ui,db update 
        setCell(value, currentFormula);
        // set current cell as children in parent Array
        setParentCHArray(currentFormula, address);

        updateChildren(cellObject);
    }
})

// return ans of that expression
function evaluateFormula(formula) {
    //splites formula into tokens so that we can change A1 , B1 and etc to its value
    let formulaTokens = formula.split(" ");
    for (let i = 0; i < formulaTokens.length; i++) {
        let ascii = formulaTokens[i].charCodeAt(0);
        if(ascii >= 65 && ascii <= 90){
            let {rid,cid} = getRIDCIDfromAddress(formulaTokens[i]);
            let value = sheetsDB[rid][cid].value;
            formulaTokens[i] = value;
        }
    }

    // when value is replaced in formula with A1,B1 . then simply join them 
    let evaluatedFormula = formulaTokens.join(" ");

    // eval is inbulid function to return the value
    let ans = evaluateFormulaAns(evaluatedFormula);
    return ans;
}

// set value and formula in cell
function setCell(value,formula) {
    let uicellElem = findUICellElement();
    uicellElem.innerText = value;
    let {rid,cid} = getRIDCIDfromAddress(addressInput.value);
    sheetsDB[rid][cid].value = value;
    sheetsDB[rid][cid].formula = formula;
}

// retuurn the element based on the address of cell
function findUICellElement() {
    let address = addressInput.value;
    let riciObj = getRIDCIDfromAddress(address);
    let rid = riciObj.rid;
    let cid = riciObj.cid;
    // console.log(rid + " " + cid);
    let uiCellElement = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
    return uiCellElement;
}

// return value of row id and column id on the base of column
function getRIDCIDfromAddress(address) {
    let cid = Number(address.charCodeAt(0)) - 65;
    let rid = Number(address.slice(1)) - 1;
    return { "rid": rid, "cid": cid };
}

// set children of parent array.
function setParentCHArray(formula, chAddress) {
    let formulaTokens = formula.split(" ");
    for (let i = 0; i < formulaTokens.length; i++) {
        let ascii = formulaTokens[i].charCodeAt(0);
        if (ascii >= 65 && ascii <= 90) {
            let { rid, cid } = getRIDCIDfromAddress(formulaTokens[i]);
            let parentObj = sheetsDB[rid][cid];
            
            // set children in parent Array
            parentObj.children.push(chAddress);

        }
    }
}

// update children values recursively 
function updateChildren(cellObject) {
    let children = cellObject.children;
    for (let i = 0; i < children.length; i++) {
        // children name
        let chAddress = children[i];

        //children address
        let { rid, cid } = getRIDCIDfromAddress(chAddress);
        
        //get children object
        let childObj = sheetsDB[rid][cid];
        
        // get formula of children
        let chFormula = childObj.formula;
        
        // getting value after changing value
        let newValue = evaluateFormula(chFormula);
        
        // set value on ui and database of children
        SetChildrenCell(newValue, chFormula, rid, cid);
        updateChildren(childObj);
    }
}

// set value on ui of child and in database of children
function SetChildrenCell(value, formula, rid, cid) {
    // let uicellElem = findUICellElement();
    
    // db update 
    let uiCellElement =
    document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
    uiCellElement.innerText = value;
    sheetsDB[rid][cid].value = value;
    // sheetDB[rid][cid].formula = formula;
}
