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
        cellObject.value = data;
        updateChildren(cellObject);
    })
}


// to take input of formula
formulaBar.addEventListener("keydown",function (e) {
    if (e.key == "Enter" && formulaBar.value) {
        // user input formula
        let currentFormula = formulaBar.value;
        // formula -> value get
        let value = evaluateFormula(currentFormula);
        let address = addressInput.value;
        // given for which we are setting the formula -> ui,db update 
        setCell(value, currentFormula);
        setParentCHArray(currentFormula, address);
    }
})

// return ans of that expression
function evaluateFormula(formula) {
    let formulaTokens = formula.split(" ");
    for (let i = 0; i < formulaTokens.length; i++) {
        let ascii = formulaTokens[i].charCodeAt(0);
        if(ascii >= 65 && ascii <= 90){
            let {rid,cid} = getRIDCIDfromAddress(formulaTokens[i]);
            let value = sheetsDB[rid][cid].value;
            formulaTokens[i] = value;
        }
    }
    let evaluatedFormula = formulaTokens.join(" ");

    return eval(evaluatedFormula);
}

function setCell(value,formula) {
    let uicellElem = findUICellElement();
    uicellElem.innerText = value;
    let {rid,cid} = getRIDCIDfromAddress(addressInput.value);
    sheetsDB[rid][cid].value = value;
    sheetsDB[rid][cid].formula = formula;
}

function findUICellElement() {
    let address = addressInput.value;
    let riciObj = getRIDCIDfromAddress(address);
    let rid = riciObj.rid;
    let cid = riciObj.cid;
    // console.log(rid + " " + cid);
    let uiCellElement = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
    return uiCellElement;
}

function getRIDCIDfromAddress(address) {
    let cid = Number(address.charCodeAt(0)) - 65;
    let rid = Number(address.slice(1)) - 1;
    return { "rid": rid, "cid": cid };
}

function setParentCHArray(formula, chAddress) {
    let formulaTokens = formula.split(" ");
    for (let i = 0; i < formulaTokens.length; i++) {
        let ascii = formulaTokens[i].charCodeAt(0);
        if (ascii >= 65 && ascii <= 90) {
            let { rid, cid } = getRIDCIDfromAddress(formulaTokens[i]);
            let parentObj = sheetDB[rid][cid];
            parentObj.children.push(chAddress);

        }
    }
}

function updateChildren(cellObject) {
    let children = cellObject.children;
    for (let i = 0; i < children.length; i++) {
        // children name
        let chAddress = children[i];
        let { rid, cid } = getRIDCIDfromAddress(chAddress);
        // 2d array
        let childObj = sheetDB[rid][cid];
        // get formula of children
        let chFormula = childObj.formula;
        let newValue = evaluateFormula(chFormula);
        SetChildrenCell(newValue, chFormula, rid, cid);
        updateChildren(childObj);
    }
}

function SetChildrenCell(value, formula, rid, cid) {
    // let uicellElem = findUICellElement();
    // db update 
    let uiCellElement =
    document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
    uiCellElement.innerText = value;
    sheetDB[rid][cid].value = value;
    sheetDB[rid][cid].formula = formula;
}
