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
let formulaBar = document.querySelector(".formula-input");
let btnContainer = document.querySelector(".add-sheet_btn-container");
let newBtn = document.querySelector(".new");
let sheetList = document.querySelector(".sheet-list");
let firstSheet = document.querySelector(".sheet");
let sheetsArray = [];
let sheetsDB;
isDownloadedSheet = false;
uploadedJSON = null;
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
        //cell.innerText = `${String.fromCharCode(65+j)} ${i+1}`;
        cell.setAttribute("class", "cell");
        cell.setAttribute("rid", i);
        cell.setAttribute("cid", j);
        cell.setAttribute("contenteditable", "true");
        row.appendChild(cell);
    }
    grid.appendChild(row);
}

//to put EventListener on first sheet as it is made in the begining so we have to add it explicitly
firstSheet.addEventListener("click",makeMeActive);
firstSheet.click();

// Adding a new Sheet
btnContainer.addEventListener("click",makeSheet);
newBtn.addEventListener("click",makeSheet);

function makeSheet(){
    let AllSheets = document.querySelectorAll(".sheet");
    let lastSheet = AllSheets[AllSheets.length-1];
    let Lastidx = lastSheet.getAttribute("idx");
    Lastidx = Number(Lastidx);
    let Newsheet = document.createElement("div");
    Newsheet.setAttribute("class","sheet");
    Newsheet.setAttribute("idx",`${Lastidx + 1}`);
    Newsheet.innerText = `Sheet ${Lastidx + 2}`;
    sheetList.append(Newsheet);
    for (let i = 0; i < AllSheets.length; i++) {
        AllSheets[i].classList.remove("active");
    }
    Newsheet.classList.add("active");
    createSheet();
    sheetsDB = sheetsArray[Lastidx+1];
    Newsheet.addEventListener("click",makeMeActive);
    
    // if sheet is uploaded then simply remove the sheetDatabase added and add sheet downloaded in sheetArray
    // make sheetDB point to that database
    if(isDownloadedSheet){
        sheetsArray.splice(sheetsArray.length-1,1);
        sheetsArray.push(uploadedJSON);
        sheetsDB = sheetsArray[Lastidx+1];
        setUI();
    }
}

// to put EventListener on each sheet
function makeMeActive(e) {
    let sheet = e.currentTarget; // to access new Sheet e contains sheetObject clicked
    let AllSheets = document.querySelectorAll(".sheet");
    for (let i = 0; i < AllSheets.length; i++) {
        AllSheets[i].classList.remove("active");
    }
    sheet.classList.add("active");
    let idx = sheet.getAttribute("idx");

    // if this is first sheet then we have not made its databse then we have to explicitly make its sheet
    // database
    if(!sheetsArray[idx]){
        createSheet();
    }

    //assign sheetsDB to currently clicked sheet
    sheetsDB = sheetsArray[idx];
    setUI();
}

function setUI() {
    // console.log(sheetsDB);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let elem = 
            document.querySelector(`.grid .cell[rid='${i}'][cid='${j}']`);
            let value = sheetsDB[i][j].value;
            elem.innerText = value;
            elem.style.fontSize = sheetsDB[i][j].fontSize;
            elem.style.fontWeight = sheetsDB[i][j].bold;
            elem.style.textDecoration = sheetsDB[i][j].underline;
            elem.style.fontStyle = sheetsDB[i][j].italic;
            elem.style.textAlign = sheetsDB[i][j].hAlign
            elem.style.fontFamily = sheetsDB[i][j].fontFamily;
            elem.style.color = sheetsDB[i][j].color;
            elem.style.backgroundColor = sheetsDB[i][j].bColor;

        }
    }
}

// making 2D database for grid , each cell contains a object containing all the properties
function createSheet() {
    let NewDB = [];
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
                bColor: "#FFFFFF",
                value: '',
                formula: '',
                children : []
            };
            let elem = document.querySelector(`.grid .cell[rid='${i}'][cid='${j}']`);
            elem.innerText = "";
            elem.style.fontSize = "16px";
            elem.style.fontWeight = "normal"
            elem.style.textDecoration = "normal";
            elem.style.fontStyle = "normal";
            elem.style.textAlign = "center";
            elem.style.fontFamily = "sans-serif";
            elem.style.color = "#000000";
            elem.style.backgroundColor = "#FFFFFF";

            row.push(cell);
        }
        NewDB.push(row);
    }
    sheetsArray.push(NewDB);
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

        // set address to address bar
        addressInput.value = address;

        // get cell object so that we can check each property of the object and make that specific button active
        let cellObject = sheetsDB[rid][cid];
        
        //simply set formula bar for each cell if cell contains formula set it if not remove it.
        if(!cellObject.formula){
            formulaBar.value = "";
        }else{
            formulaBar.value = cellObject.formula;
        }

        // for bold btn
        if (cellObject.bold == 'normal') {
            boldBtn.classList.remove("active-btn")
        } else {
            boldBtn.classList.add("active-btn");
        }

        // for underline btn
        if (cellObject.underline == 'none') {
            underLineBtn.classList.remove("active-btn")
        } else {
            underLineBtn.classList.add("active-btn");
        }

        //for italic btn
        if(cellObject.italic == 'normal'){
            italicBtn.classList.remove("active-btn");
        }else{
            italicBtn.classList.add("active-btn");
        }

        //for fontSize
        fontSizeBtn.value = cellObject.fontSize;

        //for fontFaily
        fontFamilyBtn.value = cellObject.fontFamily;
        
        //for leftbtn
        if(cellObject.hAlign == 'left'){
            alignBtns[0].classList.add("active-btn");
        }else{
            alignBtns[0].classList.remove("active-btn");
        }

        //for centerBtn
        if(cellObject.hAlign == 'center'){
            alignBtns[1].classList.add("active-btn");
        }else{
            alignBtns[1].classList.remove("active-btn");
        }

        //for rightBtn
        if(cellObject.hAlign == 'right'){
            alignBtns[2].classList.add("active-btn");
        }else{
            alignBtns[2].classList.remove("active-btn");
        }

        //for color btn
        colorBtn.value = cellObject.color;

        //for background btn
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
    // fxn defined in formula.js give the cell clicked on
    let uiCellElement = findUICellElement();

    let cid = uiCellElement.getAttribute("cid");
    let rid = uiCellElement.getAttribute("rid");
    
    //getting object for sheetDB
    let cellObject = sheetsDB[rid][cid];

    //if cell is normal make bold 
    if (cellObject.bold == 'normal') {
        uiCellElement.style.fontWeight = "bold";
        boldBtn.classList.add("active-btn");
        cellObject.bold = "bold";
    } else {
        // if cell is bold make normal
        boldBtn.classList.remove("active-btn");
        uiCellElement.style.fontWeight = "normal";
        cellObject.bold = "normal";
    }
})

// to make text in cell underline
underLineBtn.addEventListener("click", function () {
    let uiCellElement = findUICellElement();
    
    //  object.style.textDecoration = "none|underline"
    let cid = uiCellElement.getAttribute("cid");
    let rid = uiCellElement.getAttribute("rid");
    
    //getting object from sheetDB
    let cellObject = sheetsDB[rid][cid];

    if (cellObject.underline == 'none') {
        uiCellElement.style.textDecoration = "underline";
        underLineBtn.classList.add("active-btn");
        cellObject.underline = "underline";
    } else {
        underLineBtn.classList.remove("active-btn");
        uiCellElement.style.textDecoration = "none";
        cellObject.underline = "none";
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
        italicBtn.classList.remove("active-btn");
    }

})

//for changing fontSize
fontSizeBtn.addEventListener("change", function () {
    let uiCellElement = findUICellElement();
    let rid = uiCellElement.getAttribute("rid");
    let cid = uiCellElement.getAttribute("cid");
    let cellObject = sheetsDB[rid][cid];
    uiCellElement.style.fontSize = `${fontSizeBtn.value}px`;
    cellObject.fontSize = fontSizeBtn.value;
})

//for chaging fontFamily
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

// to change color of background
bgColorBtn.addEventListener("change", function () {
    let uiCellElement = findUICellElement();
    let rid = uiCellElement.getAttribute("rid");
    let cid = uiCellElement.getAttribute("cid");
    let cell = sheetsDB[rid][cid];
    cell.bColor = `${bgColorBtn.value}`;
    uiCellElement.style.backgroundColor = `${bgColorBtn.value}`;
})

// to click first cell in begining as we want A1 in address bar
allCells[0].click();