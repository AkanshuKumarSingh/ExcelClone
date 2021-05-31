let btnContainer = document.querySelector(".add-sheet_btn-container");
let sheetList = document.querySelector(".sheet-list");
let firstSheet = document.querySelector(".sheet");
//to put EventListener on first sheet as it is made in the begining so we have to add it explicitly
firstSheet.addEventListener("click",makeMeActive);


// Adding a new Sheet
btnContainer.addEventListener("click",function(){
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
    Newsheet.addEventListener("click",makeMeActive);
})

// to put EventListener on each sheet
function makeMeActive(e) {
    let sheet = e.currentTarget; // to access new Sheet
    let AllSheets = document.querySelectorAll(".sheet");
    for (let i = 0; i < AllSheets.length; i++) {
        AllSheets[i].classList.remove("active");
    }
    sheet.classList.add("active");
}


