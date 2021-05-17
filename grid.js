let leftCol = document.querySelector(".left_col");
let topRow = document.querySelector(".top_row");
let grid = document.querySelector(".grid");
let addressInput = document.querySelector(".address-input");
let boldBtn = document.querySelector(".bold");
let underLineBtn = document.querySelector(".underline");
let italicBtn = document.querySelector(".italic");
let fontSizeBtn = document.querySelector(".font-size")
let fontFamilyBtn = document.querySelector(".font-family");
let colorBtn = document.querySelector(".color");
let bgColorBtn = document.querySelector(".bg-color");
let leftBtn = document.querySelector(".left");
let centerBtn = document.querySelector(".center");
let rightBtn = document.querySelector(".right");
let alignBtns = document.querySelectorAll(".align-container>*");
// let alignContainer = document.querySelectorAll(".>*align-container")
// console.log(alignContainer);

let rows = 100;
let cols = 26;

// to make row index for grid
for (let i = 0; i < rows; i++) {
    let colBox = document.createElement("div");
    colBox.innerText = i + 1;
    colBox.setAttribute("class", "box");
    leftCol.appendChild(colBox);
}

// to make col index for grid
for (let i = 0; i < cols; i++) {
    let cell = document.createElement("div");
    cell.innerText = String.fromCharCode(65 + i);
    cell.setAttribute("class", "cell");
    topRow.appendChild(cell);
}

// to make grid with cell(rid,cid,cell class)
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

// making 2D database for each cell containing all the properties
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
            color: "#000000",
            bColor: "#000000"
        };
        row.push(cell);
    }
    sheetsDB.push(row);
}

// to write address on addressInput using cell position
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

        if(cellObject.italic == 'normal'){
            italicBtn.classList.remove("active-btn");
        }else{
            italicBtn.classList.add("active-btn");
        }

        fontSizeBtn.value = cellObject.fontSize;

        fontFamilyBtn.value = cellObject.fontFamily;
        
        if(cellObject.hAlign == 'left'){
            alignBtns[0].classList.add("active-btn");
        }else{
            alignBtns[0].classList.remove("active-btn");
        }

        if(cellObject.hAlign == 'center'){
            alignBtns[1].classList.add("active-btn");
        }else{
            alignBtns[1].classList.remove("active-btn");
        }

        if(cellObject.hAlign == 'right'){
            alignBtns[2].classList.add("active-btn");
        }else{
            alignBtns[2].classList.remove("active-btn");
        }

        colorBtn.value = cellObject.color;
        bgColorBtn.value = cellObject.bColor;
        //     bold: "normal",
        //     italic: "normal",
        //     underline: "none",
        //     hAlign: "center",
        //     fontFamily: "sans-serif",
        //     fontSize: "16",
        //     color: "black",
        //     bColor: "none"

    })
}

// to make text in cell bold
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

// to make text in cell underline
underLineBtn.addEventListener("click", function () {
    let uiCellElement = findUICellElement();
    //  object.style.textDecoration = "none|underline
    let cid = uiCellElement.getAttribute("cid");
    let rid = uiCellElement.getAttribute("rid");
    let cellObject = sheetsDB[rid][cid];
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

// to make text in cell uderline
italicBtn.addEventListener("click", function () {
    let uiCellElement = findUICellElement();
    let rid = uiCellElement.getAttribute("rid");
    let cid = uiCellElement.getAttribute("cid");
    let cellObject = sheetsDB[rid][cid];

    if(cellObject.italic == 'normal'){
        uiCellElement.style.fontStyle = "italic";
        cellObject.italic = "italic";
        italicBtn.classList.add("active-btn");
    }else{
        uiCellElement.style.fontStyle = "normal";
        cellObject.italic = "normal";
        italicBtn.classList.remove("active-btn")
    }

})


fontSizeBtn.addEventListener("change", function () {
    let uiCellElement = findUICellElement();
    let rid = uiCellElement.getAttribute("rid");
    let cid = uiCellElement.getAttribute("cid");
    let cellObject = sheetsDB[rid][cid];
    uiCellElement.style.fontSize = `${fontSizeBtn.value}px`;
    cellObject.fontSize = fontSizeBtn.value;
})

fontFamilyBtn.addEventListener("change", function () {
    let uiCellElement = findUICellElement();
    let rid = uiCellElement.getAttribute("rid");
    let cid = uiCellElement.getAttribute("cid");
    let cellObject = sheetsDB[rid][cid];
    uiCellElement.style.fontFamily = fontFamilyBtn.value;
    cellObject.fontFamily = fontFamilyBtn.value;
})

// leftBtn.addEventListener("click", function () {
//     let uiCellElement = findUICellElement();
//     uiCellElement.style.textAlign = "left";
// })

// centerBtn.addEventListener("click", function () {
//     let uiCellElement = findUICellElement();
//     uiCellElement.style.textAlign = "center";
// })

// rightBtn.addEventListener("click", function () {
//     let uiCellElement = findUICellElement();
//     uiCellElement.style.textAlign = "right";
// })

// to align the senetence : all 3 btns
for (let i = 0; i < alignBtns.length; i++) {
    alignBtns[i].addEventListener("click",function () {
        let alignment = alignBtns[i].getAttribute("class");
        let uiCellElement = findUICellElement();
        let rid = uiCellElement.getAttribute("rid");
        let cid = uiCellElement.getAttribute("cid");
        let cell = sheetsDB[rid][cid];
        if(cell.hAlign == alignment){
            cell.hAlign = 'center';
            uiCellElement.style.textAlign = 'center';
            alignBtns[i].classList.remove("active-btn");
        }else{
            cell.hAlign = alignment;
            uiCellElement.style.textAlign = alignment;
            alignBtns[0].classList.remove("active-btn");
            alignBtns[1].classList.remove("active-btn");
            alignBtns[2].classList.remove("active-btn");
            alignBtns[i].classList.add("active-btn");
        }
        
    })
}

// to change color of text
colorBtn.addEventListener("change", function () {
    let uiCellElement = findUICellElement();
    let rid = uiCellElement.getAttribute("rid");
    let cid = uiCellElement.getAttribute("cid");
    let cell = sheetsDB[rid][cid];
    cell.color = `${colorBtn.value}`;
    uiCellElement.style.color = `${colorBtn.value}`;
})

bgColorBtn.addEventListener("change", function () {
    let uiCellElement = findUICellElement();
    let rid = uiCellElement.getAttribute("rid");
    let cid = uiCellElement.getAttribute("cid");
    let cell = sheetsDB[rid][cid];
    cell.bColor = `${bgColorBtn.value}`;
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