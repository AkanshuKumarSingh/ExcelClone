let leftCol = document.querySelector(".left_col");
let topRow = document.querySelector(".top_row");
let grid = document.querySelector(".grid");
let addressInput = document.querySelector(".address-input");
let boldBtn = document.querySelector(".bold");
let underLineBtn = document.querySelector(".underline");
let italicBtn = document.querySelector(".italic");
let fontSizeBtn = document.querySelector(".font-size")
let fontFamilyBtn = document.querySelector(".font-family");
let leftBtn = document.querySelector(".left");
let centerBtn = document.querySelector(".center");
let rightBtn = document.querySelector(".right");
let colorBtn = document.querySelector(".color");
let bgColorBtn = document.querySelector(".bg-color");
// let alignContainer = document.querySelectorAll(".>*align-container")
// console.log(alignContainer);

let rows = 100;
let cols = 26;

for (let i = 0; i < rows; i++) {
    let colBox = document.createElement("div");
    colBox.innerText = i + 1;
    colBox.setAttribute("class", "box");
    leftCol.appendChild(colBox);
}

for (let i = 0; i < cols; i++) {
    let cell = document.createElement("div");
    cell.innerText = String.fromCharCode(65 + i);
    cell.setAttribute("class", "cell");
    topRow.appendChild(cell);
}

for (let i = 0; i < rows; i++) {
    let row = document.createElement("div");
    row.setAttribute("class", "row");
    for (let j = 0; j < cols; j++) {
        let cell = document.createElement("div");
        //            cell.innerText = `${String.fromCharCode(65+j)} ${i+1}`;
        cell.setAttribute("class", "cell");
        cell.setAttribute("rid", i);
        cell.setAttribute("cid", j);
        cell.setAttribute("contenteditable", "true");
        row.appendChild(cell);
    }
    grid.appendChild(row);
}

let sheetsDB = [];
for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < cols; j++) {
        let cell = {
            bold: "normal",
            italic: "normal",
            underline: "none",
            hAlign: "center",
            fontFamily: "sans-serif",
            fontSize: "16",
            color: "black",
            bColor: "none"
        };
        row.push(cell);
    }
    sheetsDB.push(row);
}

let allCells = document.querySelectorAll(".grid .cell");
for (let i = 0; i < allCells.length; i++) {
    allCells[i].addEventListener("click", function () {
        let rid = allCells[i].getAttribute("rid");
        let cid = allCells[i].getAttribute("cid");
        rid = Number(rid);
        cid = Number(cid);
        let address = `${String.fromCharCode(65 + cid)}${rid + 1}`;
        addressInput.value = address;
        let cellObject = sheetsDB[rid][cid];
        if (cellObject.bold == 'normal') {
            boldBtn.classList.remove("active-btn")
        } else {
            boldBtn.classList.add("active-btn");
        }

        if (cellObject.underline == 'none') {
            underLineBtn.classList.remove("active-btn")
        } else {
            underLineBtn.classList.add("active-btn");
        }
        

    })
}

boldBtn.addEventListener("click", function () {
    let uiCellElement = findUICellElement();
    let cid = uiCellElement.getAttribute("cid");
    let rid = uiCellElement.getAttribute("rid");
    let cellObject = sheetsDB[rid][cid];
    if (cellObject.bold == 'normal') {
        uiCellElement.style.fontWeight = "bold";
        boldBtn.classList.add("active-btn");
        cellObject.bold = "bold";
    } else {
        boldBtn.classList.remove("active-btn");
        uiCellElement.style.fontWeight = "normal";
        cellObject.bold = "normal";
    }
})

underLineBtn.addEventListener("click", function () {
    let uiCellElement = findUICellElement();
    //  object.style.textDecoration = "none|underline
    let cid = uiCellElement.getAttribute("cid");
    let rid = uiCellElement.getAttribute("rid");
    let cellObject = sheetsDB[rid][cid];
    console.log(1);
    if (cellObject.underline == 'none') {
        uiCellElement.style.textDecoration = "underline";
        underLineBtn.classList.add("active-btn");
        cellObject.underline = "underline";
        console.log("done");
    } else {
        underLineBtn.classList.remove("active-btn");
        uiCellElement.style.textDecoration = "normal";
        cellObject.underline = "none";
        console.log("not");
    }
})

italicBtn.addEventListener("click", function () {
    let uiCellElement = findUICellElement();
    uiCellElement.style.fontStyle = "italic";
})

fontSizeBtn.addEventListener("change", function () {
    let uiCellElement = findUICellElement();
    console.log(fontSizeBtn.value);
    uiCellElement.style.fontSize = `${fontSizeBtn.value}rem`;
})

fontFamilyBtn.addEventListener("change", function () {
    let uiCellElement = findUICellElement();
    uiCellElement.style.fontFamily = fontFamilyBtn.value;
})

leftBtn.addEventListener("click", function () {
    let uiCellElement = findUICellElement();
    uiCellElement.style.textAlign = "left";
})

centerBtn.addEventListener("click", function () {
    let uiCellElement = findUICellElement();
    uiCellElement.style.textAlign = "center";
})

rightBtn.addEventListener("click", function () {
    let uiCellElement = findUICellElement();
    uiCellElement.style.textAlign = "right";
})

colorBtn.addEventListener("change", function () {
    let uiCellElement = findUICellElement();
    console.log(colorBtn.value);
    uiCellElement.style.color = `${colorBtn.value}`;
})

bgColorBtn.addEventListener("change", function () {
    let uiCellElement = findUICellElement();
    console.log("d" + colorBtn.value);
    uiCellElement.style.backgroundColor = `${bgColorBtn.value}`;
})

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

allCells[0].click();