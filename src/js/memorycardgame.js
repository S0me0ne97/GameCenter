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
let gamestate = "NOTYETSTARTED";
let firstChosen = [];
let secondChosen = [];
let revealedarr = [];
let gamesArr = [];

const delay = ms => new Promise(res => setTimeout(res, ms));

/// generate table
function generateTable(size) {
    newInnerHTML = "";
        newInnerHTML += "<tr>";
        for (let j = 0; j < size / 2; j++) {
            newInnerHTML += "<th>";
            if (revealedarr.includes(gamematrix[j])) {
                if (gamematrix[j] === 0) {
                    newInnerHTML += "<img src='../../media/memorycardgame/arrowleft.png' alt='arrowleft'/>"
                } else if (gamematrix[j] === 1) {
                    newInnerHTML += "<img src='../../media/memorycardgame/arrowright.png' alt='arrowright'/>"
                } else if (gamematrix[j] === 2) {
                    newInnerHTML += "<img src='../../media/memorycardgame/circle.png' alt='circle'/>"
                } else if (gamematrix[j] === 3) {
                    newInnerHTML += "<img src='../../media/memorycardgame/heart.png' alt='heart'/>"
                } else if (gamematrix[j] === 4) {
                    newInnerHTML += "<img src='../../media/memorycardgame/lightning.png' alt='lightning'/>"
                } else if (gamematrix[j] === 5) {
                    newInnerHTML += "<img src='../../media/memorycardgame/stair.png' alt='stair'/>"
                }
            } else {
                newInnerHTML += "<img src='../../media/memorycardgame/basic.png' alt='hidden'/>";
            }
            newInnerHTML += "</th>";
        }
        newInnerHTML += "</tr>";
        newInnerHTML += "<tr>";
        for (let j = size / 2; j < size; j++) {
            newInnerHTML += "<th>";
            if (revealedarr.includes(gamematrix[j])) {
                if (gamematrix[j] === 0) {
                    newInnerHTML += "<img src='../../media/memorycardgame/arrowleft.png' alt='arrowleft'/>"
                } else if (gamematrix[j] === 1) {
                    newInnerHTML += "<img src='../../media/memorycardgame/arrowright.png' alt='arrowright'/>"
                } else if (gamematrix[j] === 2) {
                    newInnerHTML += "<img src='../../media/memorycardgame/circle.png' alt='circle'/>"
                } else if (gamematrix[j] === 3) {
                    newInnerHTML += "<img src='../../media/memorycardgame/heart.png' alt='heart'/>"
                } else if (gamematrix[j] === 4) {
                    newInnerHTML += "<img src='../../media/memorycardgame/lightning.png' alt='lightning'/>"
                } else if (gamematrix[j] === 5) {
                    newInnerHTML += "<img src='../../media/memorycardgame/stair.png' alt='stair'/>"
                }
            } else {
                newInnerHTML += "<img src='../../media/memorycardgame/basic.png' alt='hidden'/>";
            }
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
    gamematrix = [];
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
            points += totalSeconds * 5;
        }
    }
    else {
        gamestate = "TURNINGBACK"
        await delay(1000);
        closeChosen();
        firstChosen = [];
        secondChosen = [];
        gamestate = "INGAME"
    }
    pointsLabel.innerHTML = "pontok: " + points;
}

function getClickedCell(event) {
    if (gamestate != "INGAME") {
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
    if (gamestate === "PAUSED") {
      setTimeout(setTime, 1000);
      return;
    }
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

    setTimeout(setTime, 1000);
}

function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}

function onStartClicked() {
  startbtn.innerHTML = "Új Játék";
  points = 0;
  pointsLabel.innerHTML = "pontok: " + points;
  revealedarr = [];
  if (gamestate === "INGAME" || gamestate === "PAUSED") {
    if (easybtn.checked) {
      tablesize = 8;
    }
    if (mediumbtn.checked) {
      tablesize = 10;
    }
    if (hardbtn.checked) {
      tablesize = 12;
    }
    gamestate = "INGAME";
    pausebtn.innerHTML = "Szünet";
    generateRandomMatrix(tablesize);
    generateTable(tablesize);
    addEventListener();
    totalSeconds = 101;
  }
  if (gamestate === "END") {
    if (easybtn.checked) {
      tablesize = 8;
    }
    if (mediumbtn.checked) {
      tablesize = 10;
    }
    if (hardbtn.checked) {
      tablesize = 12;
    }
    gamestate = "INGAME"
    generateRandomMatrix(tablesize);
    generateTable(tablesize);
    addEventListener();
    totalSeconds = 101;
    setTimeout(setTime, 1000);
  }
  if (gamestate === 'NOTYETSTARTED') {
    if (easybtn.checked) {
      tablesize = 8;
    }
    if (mediumbtn.checked) {
      tablesize = 10;
    }
    if (hardbtn.checked) {
      tablesize = 12;
    }
    totalSeconds = 101;
    gameDiv.toggleAttribute('hidden');
    gamestate = "INGAME";

    generateRandomMatrix(tablesize);
    generateTable(tablesize);
    addEventListener();
    setTimeout(setTime, 1000);
  }
}

function onPauseClicked() {
    if (gamestate != "INGAME" && gamestate != "PAUSED") {
        return;
    }
    pausebtn.innerHTML = gamestate === "INGAME" ? "Folytatás" : "Szünet"; 
    gamestate = gamestate === "INGAME" ? "PAUSED" : "INGAME";
}

function onSaveClicked() {
    if (gamestate != "INGAME" && gamestate != "PAUSED") {
        return;
    }
    gamestate = 'PAUSED';
    var gameObj = {
        gamematrix,
        totalSeconds,
        points,
        tablesize,
        revealedarr
    }
    var jsonObj = JSON.stringify(gameObj);
  
    location.replace('save_memorygame.php?data='+jsonObj);
}

function onLoadClicked() {
    savesDiv.toggleAttribute("hidden");
    if(gamestate === 'LOADPAGE') {
        gameDiv.toggleAttribute("hidden");
        loadbtn.innerHTML = "Betöltés";
        gamestate = 'INGAME';
    } else if (gamestate === 'INGAME') {
      loadbtn.innerHTML = "Vissza a játékhoz";
      gamestate = 'LOADPAGE';
      gameDiv.toggleAttribute("hidden");
    }
    if (gamestate === "LOADPAGENOGAMESTARTED") {
        loadbtn.innerHTML = "Betöltés"
        gamestate = "NOTYETSTARTED";
    } else if (gamestate === "NOTYETSTARTED") {
        loadbtn.innerHTML = "Vissza a játékhoz";
        gamestate = 'LOADPAGENOGAMESTARTED';
    }
    if (gamestate === "LOADPAGEEND") {
        loadbtn.innerHTML = "Betöltés"
        gamestate = "END";
        gameDiv.toggleAttribute("hidden");
    } else if (gamestate === "END") {
      loadbtn.innerHTML = "Vissza a játékhoz";
      gamestate = 'LOADPAGEEND';
      gameDiv.toggleAttribute("hidden");
    }

}

function loadJSON() {
    let json_data = JSON.parse(passData.innerHTML);
    let gamesObj = [];
    for(let i in json_data){
        gamesObj.push([i, json_data [i]]);
    }
    gamesArr = [];
    for (const element of gamesObj) {
        if (element[1]["game"] === "memorygame") {
            gamesArr.push(JSON.parse(element[1]["gamedata"]));
        }
    }
    let divstr = "<br><ul>";
    let i = 0;
    gamesArr.forEach(elem => {
        divstr += "<li>";
        divstr += "Pontok: ";
        divstr += elem.points;
        divstr += " Hátralévő idő: ";
        divstr += elem.totalSeconds;
        divstr += "mp"
        divstr += "<br>"
        divstr += "<table id=\"" + i + "\">"
        divstr += "<tr>";
        for (let j = 0; j < elem.tablesize / 2; j++) {
            divstr += "<th>";
            if (elem.revealedarr.includes(elem.gamematrix[j])) {
                if (elem.gamematrix[j] === 0) {
                    divstr += "<img src='../../media/memorycardgame/arrowleft.png' alt='arrowleft'/>"
                } else if (elem.gamematrix[j] === 1) {
                    divstr += "<img src='../../media/memorycardgame/arrowright.png' alt='arrowright'/>"
                } else if (elem.gamematrix[j] === 2) {
                    divstr += "<img src='../../media/memorycardgame/circle.png' alt='circle'/>"
                } else if (elem.gamematrix[j] === 3) {
                    divstr += "<img src='../../media/memorycardgame/heart.png' alt='heart'/>"
                } else if (elem.gamematrix[j] === 4) {
                    divstr += "<img src='../../media/memorycardgame/lightning.png' alt='lightning'/>"
                } else if (elem.gamematrix[j] === 5) {
                    divstr += "<img src='../../media/memorycardgame/stair.png' alt='stair'/>"
                }
            } else {
                divstr += "<img src='../../media/memorycardgame/basic.png' alt='hidden'/>";
            }
            divstr += "</th>";
        }
        divstr += "</tr>";
        divstr += "<tr>";
        for (let j = elem.tablesize / 2; j < elem.tablesize; j++) {
            divstr += "<th>";
            if (elem.revealedarr.includes(elem.gamematrix[j])) {
                if (elem.gamematrix[j] === 0) {
                    divstr += "<img src='../../media/memorycardgame/arrowleft.png' alt='arrowleft'/>"
                } else if (elem.gamematrix[j] === 1) {
                    divstr += "<img src='../../media/memorycardgame/arrowright.png' alt='arrowright'/>"
                } else if (elem.gamematrix[j] === 2) {
                    divstr += "<img src='../../media/memorycardgame/circle.png' alt='circle'/>"
                } else if (elem.gamematrix[j] === 3) {
                    divstr += "<img src='../../media/memorycardgame/heart.png' alt='heart'/>"
                } else if (elem.gamematrix[j] === 4) {
                    divstr += "<img src='../../media/memorycardgame/lightning.png' alt='lightning'/>"
                } else if (elem.gamematrix[j] === 5) {
                    divstr += "<img src='../../media/memorycardgame/stair.png' alt='stair'/>"
                }
            } else {
                divstr += "<img src='../../media/memorycardgame/basic.png' alt='hidden'/>";
            }
            divstr += "</th>";
        }
        divstr += "</tr>";
        divstr += "</table>"
        divstr += "</li><br><br>";
        ++i;
    })
    divstr += "</ul>"
    savesDiv.innerHTML = divstr;
  }

function onPageClicked(event) {
    if (gamestate != 'LOADPAGE' && gamestate != "LOADPAGENOGAMESTARTED" && gamestate != "LOADPAGEEND") return;
    if (event.explicitOriginalTarget.nodeName != "IMG") {
        return;
    }
    loadNewGame(parseInt(event.target.parentNode.parentNode.parentNode.parentNode.id));
}

function loadNewGame(id) {
    let data = gamesArr[id];
    totalSeconds = data.totalSeconds;
    points = data.points;
    gamematrix = data.gamematrix.slice();
    tablesize = data.tablesize;
    revealedarr = data.revealedarr.slice();
    
    pointsLabel.innerHTML = "pontok: " + points;
  
    savesDiv.toggleAttribute("hidden");
    gameDiv.toggleAttribute("hidden");
    if (gamestate === "LOADPAGENOGAMESTARTED" || gamestate === "LOADPAGEEND") {
      loadbtn.innerHTML = "Betöltés";
      gamestate = "INGAME";
      generateTable(tablesize);
      addEventListener();
      setTime();
    }
    else {
      generateTable(tablesize);
      addEventListener();
      loadbtn.innerHTML = "Betöltés"
      gamestate = "INGAME";
    }
  }

document.addEventListener('click', onPageClicked);
startbtn.addEventListener('click', onStartClicked);
pausebtn.addEventListener('click', onPauseClicked);
savebtn.addEventListener('click', onSaveClicked);
loadbtn.addEventListener('click', onLoadClicked);

loadJSON()

