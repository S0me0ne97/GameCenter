var startbtn = document.getElementById("startbtn");
var pausebtn = document.getElementById("pause");
var savebtn = document.getElementById("save");
var loadbtn = document.getElementById("load");

var easybtn = document.getElementById("easy");
var mediumbtn = document.getElementById("medium");
var hardbtn = document.getElementById("hard");

var gameDiv = document.getElementById("game");
var menuDiv = document.getElementById("menu");
var savesDiv = document.getElementById("savesdiv");

var saveData = document.getElementById("data");
var passData = document.getElementById("passdata");

var gametable = document.getElementById("gametable");
var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
var pointsLabel = document.getElementById("points");

let tablesize = 12;
let gamematrix = [];
let newInnerHTML = "";
let points = 0;
let totalSeconds = 101;
let gamestate = "";
let firstChosen = [];
let secondChosen = [];
let revealedarr = [];

const delay = ms => new Promise(res => setTimeout(res, ms));

/// generate table
function generateTable(size) {
    newInnerHTML = "";
        newInnerHTML += "<tr>";
        for (let j = 0; j < size / 2; j++) {
            newInnerHTML += "<th>";
            newInnerHTML += "<img src='../../media/memorycardgame/basic.png' alt='green'/>";
            newInnerHTML += "</th>";
        }
        newInnerHTML += "</tr>";
        newInnerHTML += "<tr>";
        for (let j = size / 2; j < size; j++) {
            newInnerHTML += "<th>";
            newInnerHTML += "<img src='../../media/memorycardgame/basic.png' alt='green'/>";
            newInnerHTML += "</th>";
        }
        newInnerHTML += "</tr>";
    
    gametable.innerHTML = newInnerHTML;
}

/// add event listeners to cells
function addEventListener() {
    for (let i = 0; i < gametable.rows.length; i++) {
        for (let j = 0; j < gametable.rows[i].cells.length; j++) {
        let cell = gametable.rows[i].cells[j];
        cell.addEventListener("click", getClickedCell);
        }
    }
}

/// game matrix filler function
function generateRandomMatrix(tablesize) {
    let temparr = [];
    /// fill with elements
    for( let i = 0; i < tablesize / 2; i++) {
        temparr.push(i);
        temparr.push(i);
    }

    for( let i = 0; i < tablesize; i++) {
        gamematrix.push(-1);
    }

    /// shuffle
    for (let i = 0; i < tablesize; i++) {
        let randomPlace = Math.floor(Math.random() * (tablesize - 0 + 1)) + 0;
        while(gamematrix[randomPlace] != -1)
        {
            randomPlace++;
            randomPlace = randomPlace % tablesize;
        }
        gamematrix[randomPlace] = temparr[i];
    }
}

function revealCard(row, col) {
    switch (gamematrix[row * tablesize / 2 + col]) {
        case 0:
          gametable.children[0].childNodes[row].childNodes[col].innerHTML = "<img src='../../media/memorycardgame/arrowleft.png' alt='arrowleft'/>"
          break;
        case 1:
          gametable.children[0].childNodes[row].childNodes[col].innerHTML = "<img src='../../media/memorycardgame/arrowright.png' alt='arrowright'/>"
          break;
        case 2:
          gametable.children[0].childNodes[row].childNodes[col].innerHTML = "<img src='../../media/memorycardgame/circle.png' alt='circle'/>"
          break;
        case 3:
          gametable.children[0].childNodes[row].childNodes[col].innerHTML = "<img src='../../media/memorycardgame/heart.png' alt='heart'/>"
          break;        
        case 4:
          gametable.children[0].childNodes[row].childNodes[col].innerHTML = "<img src='../../media/memorycardgame/lightning.png' alt='lightning'/>"
          break;
        default:
          gametable.children[0].childNodes[row].childNodes[col].innerHTML = "<img src='../../media/memorycardgame/stair.png' alt='stair'/>"
          break;
      }
}

function closeChosen() {
    gametable.children[0].childNodes[firstChosen[0]].childNodes[firstChosen[1]].innerHTML = "<img src='../../media/memorycardgame/basic.png' alt='green'/>";
    gametable.children[0].childNodes[secondChosen[0]].childNodes[secondChosen[1]].innerHTML = "<img src='../../media/memorycardgame/basic.png' alt='green'/>";
}

async function checkPair() {
    if (gamematrix[firstChosen[0] * (tablesize / 2) + firstChosen[1]] === gamematrix[secondChosen[0] * (tablesize / 2) + secondChosen[1]]) {
        points += 50;
        pointsLabel.innerHTML = "pontok: " + points;
        revealedarr.push(gamematrix[firstChosen[0] * (tablesize / 2) + firstChosen[1]]);
        firstChosen = [];
        secondChosen = [];
        if (revealedarr.length == tablesize / 2) {
            gamestate = "END"
        }
    }
    else {
        await delay(1000);
        closeChosen();
        firstChosen = [];
        secondChosen = [];
    }
}

function getClickedCell(event) {
    if (gamestate === "END") {
      return;
    }
    let cell = event.target;
    let row = cell.parentNode.parentNode.rowIndex;
    let col = cell.parentNode.cellIndex;
    if (revealedarr.includes(gamematrix[row * (tablesize / 2) + col])) {
        return;
    }
    if (firstChosen[0] === row && firstChosen[1] === col) {
        return;
    }
     if (firstChosen.length === 0) {
       firstChosen.push(row);
       firstChosen.push(col);
       revealCard(row, col);
     }
     else
     {
       secondChosen.push(row);
       secondChosen.push(col);
       revealCard(row, col);
     }

     if (secondChosen.length != 0) {
       checkPair();
     }
}

function setTime() {
    if (gamestate === "END") {
        return;
    }
    if (totalSeconds <= 0) {
      gamestate = "END";
      return;
    }
    --totalSeconds;
    secondsLabel.innerHTML = pad(totalSeconds % 60);
    minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}

setInterval(setTime, 1000);

generateRandomMatrix(tablesize);
generateTable(tablesize);
addEventListener();


