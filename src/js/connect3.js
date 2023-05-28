var startbtn = document.getElementById("startbtn");
var pausebtn = document.getElementById("pause");
var savebtn = document.getElementById("save");
var loadbtn = document.getElementById("load");
var refreshbtn = document.getElementById("refresh");

var easybtn = document.getElementById("easy");
var mediumbtn = document.getElementById("medium");
var hardbtn = document.getElementById("hard");

var gameDiv = document.getElementById("game");
var menuDiv = document.getElementById("menu");
var savesDiv = document.getElementById("savesdiv");

var saveData = document.getElementById("data");
var passData = document.getElementById("passdata");
var descbtn = document.getElementById("description");
var descDiv = document.getElementById("descriptionDiv");

var gametable = document.getElementById("gametable");
var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
var pointsLabel = document.getElementById("points");
var useridDiv = document.getElementById("userid");
let userid = useridDiv.innerHTML;

/// variables
let tablesize = 7;
let newInnerHTML = "";
let gamematrix = [];
let minNum = 0;
let maxNum = 4;
let points = 0;
let totalSeconds = 101;
let gamestate = "NOTYETSTARTED";
let firstChosen = [];
let secondChosen = [];
let gamesArr = [];

const delay = ms => new Promise(res => setTimeout(res, ms));


/// generate table
function generateTable(size) {
    newInnerHTML = "";
    for (let i = 0; i < size; i++) {
        newInnerHTML += "<tr>";
        for (let j = 0; j < size; j++) {
            newInnerHTML += "<th>";
            switch (gamematrix[i][j]) {
              case 0:
                newInnerHTML += "<img src='../../media/connect3/green.png' alt='green'/>"
                break;
              case 1:
                newInnerHTML += "<img src='../../media/connect3/blue.png' alt='blue'/>"
                break;
              case 2:
                newInnerHTML += "<img src='../../media/connect3/brown.png' alt='brown'/>"
                break;
              case 3:
                newInnerHTML += "<img src='../../media/connect3/red.png' alt='red'/>"
                break;
              default:
                newInnerHTML += "<img src='../../media/connect3/purple.png' alt='purple'/>"
                break;
            }
            newInnerHTML += "</th>";
        }
        newInnerHTML += "</tr>";
    }
    
    gametable.innerHTML = newInnerHTML;
}

function updateTable()
{
  pointsLabel.innerHTML = "pontok: " + points;
  for (let i = 0; i < gametable.children[0].childNodes.length; i++) {
    for (let j = 0; j < gametable.children[0].childNodes[i].childNodes.length; j++) {
      switch (gamematrix[i][j]) {
        case 0:
          gametable.children[0].childNodes[i].childNodes[j].innerHTML = "<img src='../../media/connect3/green.png' alt='green'/>"
          break;
        case 1:
          gametable.children[0].childNodes[i].childNodes[j].innerHTML = "<img src='../../media/connect3/blue.png' alt='blue'/>"
          break;
        case 2:
          gametable.children[0].childNodes[i].childNodes[j].innerHTML = "<img src='../../media/connect3/brown.png' alt='brown'/>"
          break;
        case 3:
          gametable.children[0].childNodes[i].childNodes[j].innerHTML = "<img src='../../media/connect3/red.png' alt='red'/>"
          break;
        default:
          gametable.children[0].childNodes[i].childNodes[j].innerHTML = "<img src='../../media/connect3/purple.png' alt='purple'/>"
          break;
      }
    }
  }
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

function checkMatrix(matrix) {
  // Check rows
  for (let i = 0; i < matrix.length; i++) {
    let count = 1;
    for (let j = 1; j < matrix[i].length; j++) {
      if (matrix[i][j] === matrix[i][j-1]) {
        count++;
        if (count >= 5) {
          return [[i,j-4],[i,j-3],[i,j-2],[i,j-1],[i,j]];
        }
        if (count === 4 && j === matrix.length - 1) {
          return [[i,j-3],[i,j-2],[i,j-1],[i,j]]
        }
        if (count === 3 && j === matrix.length - 1) {
          return [[i,j-2],[i,j-1],[i,j]]
        }
      } else if (count === 4) {
        return [[i,j-4],[i,j-3],[i,j-2],[i,j-1]];
      } else if (count === 3) {
        return [[i,j-3],[i,j-2],[i,j-1]];
      } else {
        count = 1;
      }
    }
  }

  // Check columns
  for (let j = 0; j < matrix[0].length; j++) {
    let count = 1;
    for (let i = 1; i < matrix.length; i++) {
      if (matrix[i][j] === matrix[i-1][j]) {
        count++;
        if (count >= 5) {
          return [[i-4,j],[i-3,j],[i-2,j],[i-1,j],[i,j]];
        }
        if (count === 4 && i === matrix.length - 1) {
          return [[i-3,j],[i-2,j],[i-1,j],[i,j]];
        }
        if (count === 3 && i === matrix.length - 1) {
          return [[i-2,j],[i-1,j],[i,j]];
        }
      } else if (count === 4) {
        return [[i-4,j],[i-3,j],[i-2,j],[i-1,j]];
      } else if (count === 3) {
        return [[i-3,j],[i-2,j],[i-1,j]];
      } else {
        count = 1;
      }
    }
  }

  return [];
}

/// refill after found match
function refill(elementsthatneedtogo) {
  if (elementsthatneedtogo.length === 0) {
    return;
  }
  elementsthatneedtogo.forEach(element => {
    let i = element[0];
    let j = element[1];
    while (i != 0) {
      gamematrix[i][j] = gamematrix[i-1][j];
      i--;
    }
    gamematrix[i][j] = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
  });
}

/// game matrix filler function
function generateRandomMatrix(tablesize, min, max) {
  gamematrix = [];
    for (let i = 0; i < tablesize; i++) {
      let row = [];
  
      for (let j = 0; j < tablesize; j++) {
        let num = Math.floor(Math.random() * (max - min + 1)) + min;
        row.push(num);
      }
  
      gamematrix.push(row);
    }
    while (checkMatrix(gamematrix).length != 0) {
      refill(checkMatrix(gamematrix));
    }
}

function areAdjacent(coord1, coord2) {
  // Check if the coordinates are next to each other horizontally
  if (coord1[0] === coord2[0] && Math.abs(coord1[1] - coord2[1]) === 1) {
    return true;
  }

  // Check if the coordinates are next to each other vertically
  if (coord1[1] === coord2[1] && Math.abs(coord1[0] - coord2[0]) === 1) {
    return true;
  }

  // If the coordinates are not next to each other horizontally or vertically, they are not adjacent
  return false;
}


async function moved(first, second) {
  if (!areAdjacent(first,second)) {
    switch (gamematrix[firstChosen[0]][firstChosen[1]]) {
      case 0:
        gametable.children[0].childNodes[firstChosen[0]].childNodes[firstChosen[1]].innerHTML = "<img src='../../media/connect3/green.png' alt='green'/>"
        break;
      case 1:
        gametable.children[0].childNodes[firstChosen[0]].childNodes[firstChosen[1]].innerHTML = "<img src='../../media/connect3/blue.png' alt='blue'/>"
        break;
      case 2:
        gametable.children[0].childNodes[firstChosen[0]].childNodes[firstChosen[1]].innerHTML = "<img src='../../media/connect3/brown.png' alt='brown'/>"
        break;
      case 3:
        gametable.children[0].childNodes[firstChosen[0]].childNodes[firstChosen[1]].innerHTML = "<img src='../../media/connect3/red.png' alt='red'/>"
        break;
      default:
        gametable.children[0].childNodes[firstChosen[0]].childNodes[firstChosen[1]].innerHTML = "<img src='../../media/connect3/purple.png' alt='purple'/>"
        break;
    }
    firstChosen = [];
    return;
  }
  let tempgamematrix = gamematrix.slice();

  let tempcell = tempgamematrix[first[0]][first[1]];
  tempgamematrix[first[0]][first[1]] = tempgamematrix[second[0]][second[1]];
  tempgamematrix[second[0]][second[1]] = tempcell;

  if (!checkMatrix(tempgamematrix).length != 0) {
    tempcell = tempgamematrix[first[0]][first[1]];
    tempgamematrix[first[0]][first[1]] = tempgamematrix[second[0]][second[1]];
    tempgamematrix[second[0]][second[1]] = tempcell;
    switch (gamematrix[secondChosen[0]][secondChosen[1]]) {
      case 0:
        gametable.children[0].childNodes[firstChosen[0]].childNodes[firstChosen[1]].innerHTML = "<img src='../../media/connect3/green.png' alt='green'/>"
        break;
      case 1:
        gametable.children[0].childNodes[firstChosen[0]].childNodes[firstChosen[1]].innerHTML = "<img src='../../media/connect3/blue.png' alt='blue'/>"
        break;
      case 2:
        gametable.children[0].childNodes[firstChosen[0]].childNodes[firstChosen[1]].innerHTML = "<img src='../../media/connect3/brown.png' alt='brown'/>"
        break;
      case 3:
        gametable.children[0].childNodes[firstChosen[0]].childNodes[firstChosen[1]].innerHTML = "<img src='../../media/connect3/red.png' alt='red'/>"
        break;
      default:
        gametable.children[0].childNodes[firstChosen[0]].childNodes[firstChosen[1]].innerHTML = "<img src='../../media/connect3/purple.png' alt='purple'/>"
        break;
    }
    firstChosen = [];
    updateTable();
    return;
  }
  gamematrix[first[0]][first[1]] = tempgamematrix[first[0]][first[1]];
  gamematrix[second[0]][second[1]] = tempgamematrix[second[0]][second[1]];
  updateTable();
  let cells = checkMatrix(gamematrix);
  while ((cells.length) != 0) {
    for (let i = 0; i < cells.length; i++) {
      switch (gamematrix[cells[i][0]][cells[i][1]]) {
        case 0:
          gametable.children[0].childNodes[cells[i][0]].childNodes[cells[i][1]].innerHTML = "<img src='../../media/connect3/greenyellow.png' alt='green'/>"
          break;
        case 1:
          gametable.children[0].childNodes[cells[i][0]].childNodes[cells[i][1]].innerHTML = "<img src='../../media/connect3/blueyellow.png' alt='blue'/>"
          break;
        case 2:
          gametable.children[0].childNodes[cells[i][0]].childNodes[cells[i][1]].innerHTML = "<img src='../../media/connect3/brownyellow.png' alt='brown'/>"
          break;
        case 3:
          gametable.children[0].childNodes[cells[i][0]].childNodes[cells[i][1]].innerHTML = "<img src='../../media/connect3/redyellow.png' alt='red'/>"
          break;
        default:
          gametable.children[0].childNodes[cells[i][0]].childNodes[cells[i][1]].innerHTML = "<img src='../../media/connect3/purpleyellow.png' alt='purple'/>"
          break;
      }
    }
    await delay(1000);
    for (let i = 0; i < cells.length; i++) {
      switch (gamematrix[cells[i][0]][cells[i][1]]) {
        case 0:
          gametable.children[0].childNodes[cells[i][0]].childNodes[cells[i][1]].innerHTML = "<img src='../../media/connect3/green.png' alt='green'/>"
          break;
        case 1:
          gametable.children[0].childNodes[cells[i][0]].childNodes[cells[i][1]].innerHTML = "<img src='../../media/connect3/blue.png' alt='blue'/>"
          break;
        case 2:
          gametable.children[0].childNodes[cells[i][0]].childNodes[cells[i][1]].innerHTML = "<img src='../../media/connect3/brown.png' alt='brown'/>"
          break;
        case 3:
          gametable.children[0].childNodes[cells[i][0]].childNodes[cells[i][1]].innerHTML = "<img src='../../media/connect3/red.png' alt='red'/>"
          break;
        default:
          gametable.children[0].childNodes[cells[i][0]].childNodes[cells[i][1]].innerHTML = "<img src='../../media/connect3/purple.png' alt='purple'/>"
          break;
      }
    }
    points += 50;
    refill(cells);
    cells = checkMatrix(gamematrix);
    updateTable();
  }
}

async function getClickedCell(event) {
    if (gamestate != "INGAME") {
      return;
    }
    if (event.explicitOriginalTarget.nodeName != "IMG") {
      return;
  }
    let cell = event.target;
    let row = cell.parentNode.parentNode.rowIndex;
    let col = cell.parentNode.cellIndex;
     if (firstChosen.length === 0) {
       firstChosen.push(row);
       firstChosen.push(col);
       switch (gamematrix[firstChosen[0]][firstChosen[1]]) {
        case 0:
          gametable.children[0].childNodes[firstChosen[0]].childNodes[firstChosen[1]].innerHTML = "<img src='../../media/connect3/greengray.png' alt='green'/>"
          break;
        case 1:
          gametable.children[0].childNodes[firstChosen[0]].childNodes[firstChosen[1]].innerHTML = "<img src='../../media/connect3/bluegray.png' alt='blue'/>"
          break;
        case 2:
          gametable.children[0].childNodes[firstChosen[0]].childNodes[firstChosen[1]].innerHTML = "<img src='../../media/connect3/browngray.png' alt='brown'/>"
          break;
        case 3:
          gametable.children[0].childNodes[firstChosen[0]].childNodes[firstChosen[1]].innerHTML = "<img src='../../media/connect3/redgray.png' alt='red'/>"
          break;
        default:
          gametable.children[0].childNodes[firstChosen[0]].childNodes[firstChosen[1]].innerHTML = "<img src='../../media/connect3/purplegray.png' alt='purple'/>"
          break;
      }
     }
     else
     {
       secondChosen.push(row);
       secondChosen.push(col);
     }

     if (secondChosen.length != 0) {
       gamestate = "MOVING";
       await moved(firstChosen, secondChosen);
       firstChosen = [];
       secondChosen = [];
       gamestate = "INGAME"
     }
}

function setTime() {
  if (gamestate === "PAUSED" || gamestate === "LOADPAGE") {
    setTimeout(setTime, 1000);
    return;
  }
  pausebtn.disabled = false;
  if (userid != 0) {
    savebtn.disabled = false;
  }
  if (totalSeconds <= 0) {
    gamestate = "END";
    if (userid != 0) {
      postScore();
    }
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
  if (gamestate === "INGAME" || gamestate === "PAUSED") {
    if (easybtn.checked) {
      tablesize = 5;
    }
    if (mediumbtn.checked) {
      tablesize = 6;
    }
    if (hardbtn.checked) {
      tablesize = 7;
    }
    gamestate = "INGAME"
    pausebtn.innerHTML = "Szünet"
    generateRandomMatrix(tablesize, minNum, maxNum);
    generateTable(tablesize);
    addEventListener();
    totalSeconds = 101;
  }
  if (gamestate === "END") {
    if (easybtn.checked) {
      tablesize = 5;
    }
    if (mediumbtn.checked) {
      tablesize = 6;
    }
    if (hardbtn.checked) {
      tablesize = 7;
    }
    gamestate = "INGAME"
    generateRandomMatrix(tablesize, minNum, maxNum);
    generateTable(tablesize);
    addEventListener();
    totalSeconds = 101;
    setTimeout(setTime, 1000); 
  }
  if (gamestate === 'NOTYETSTARTED') {
    if (easybtn.checked) {
      tablesize = 5;
    }
    if (mediumbtn.checked) {
      tablesize = 6;
    }
    if (hardbtn.checked) {
      tablesize = 7;
    }
    totalSeconds = 101;
    gameDiv.toggleAttribute('hidden');
    gamestate = "INGAME";
    generateRandomMatrix(tablesize, minNum, maxNum);
    generateTable(tablesize);
    addEventListener();
    setTimeout(setTime, 1000);
  }
  if (gamestate === "LOADPAGENOGAMESTARTED" || gamestate === "LOADPAGEEND") {
    savesDiv.toggleAttribute("hidden");
    loadbtn.innerHTML = "Betöltés";
    if (easybtn.checked) {
        tablesize = 5;
      }
      if (mediumbtn.checked) {
        tablesize = 6;
      }
      if (hardbtn.checked) {
        tablesize = 7;
      }
      totalSeconds = 101;
      gameDiv.toggleAttribute('hidden');
      gamestate = "INGAME";
  
      generateRandomMatrix(tablesize, minNum, maxNum);
      generateTable(tablesize);
      addEventListener();
      setTimeout(setTime, 1000);
    }
    if (gamestate === "LOADPAGE") {
        savesDiv.toggleAttribute("hidden");
        loadbtn.innerHTML = "Betöltés";
        if (easybtn.checked) {
            tablesize = 5;
        }
        if (mediumbtn.checked) {
            tablesize = 6;
        }
        if (hardbtn.checked) {
            tablesize = 7;
        }
        totalSeconds = 101;
        gameDiv.toggleAttribute('hidden');
        gamestate = "INGAME";
    
        generateRandomMatrix(tablesize, minNum, maxNum);
        generateTable(tablesize);
        addEventListener();
    }
  updateTable();
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
      tablesize
  }
  var jsonObj = JSON.stringify(gameObj);

  location.replace('save_connect3.php?data='+jsonObj);
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
      if (element[1]["game"] === "connect3" && element[1]["userid"] === userid.trim()) {
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
      divstr += "<br>"
      divstr += "<table id=\"" + i + "\">"
      for (let i = 0; i < elem.tablesize; i++) {
        divstr += "<tr>";
          for (let j = 0; j < elem.tablesize; j++) {
            divstr += "<th>";
              switch (elem.gamematrix[i][j]) {
                case 0:
                  divstr += "<img src='../../media/connect3/green.png' alt='green'/>"
                  break;
                case 1:
                  divstr += "<img src='../../media/connect3/blue.png' alt='blue'/>"
                  break;
                case 2:
                  divstr += "<img src='../../media/connect3/brown.png' alt='brown'/>"
                  break;
                case 3:
                  divstr += "<img src='../../media/connect3/red.png' alt='red'/>"
                  break;
                default:
                  divstr += "<img src='../../media/connect3/purple.png' alt='purple'/>"
                  break;
              }
              divstr += "</th>";
          }
          divstr += "</tr>";
      }
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
  gamematrix = [];
  data.gamematrix.forEach(col => {
    let arr = []
    col.forEach(cell => {
      arr.push(cell);
    });
    gamematrix.push(arr);
  });
  tablesize = data.tablesize;

  savesDiv.toggleAttribute("hidden");
  gameDiv.toggleAttribute("hidden");
  if (gamestate === "LOADPAGENOGAMESTARTED" || gamestate === "LOADPAGEEND") {
    loadbtn.innerHTML = "Betöltés";
    gamestate = "INGAME";
    generateTable(tablesize);
    addEventListener();
    updateTable()
    setTime();
  }
  else {
    generateTable(tablesize);
    addEventListener();
    updateTable()
    loadbtn.innerHTML = "Betöltés"
    gamestate = "INGAME";
  }
}

function onRefreshClicked() {
  if (gamestate != "INGAME") {
    return;
  }
  points -= 100;
  generateRandomMatrix(tablesize, minNum, maxNum);
  updateTable()
}

function postScore() {
  var jsonString = JSON.stringify(points);
  location.replace('postscore_connect3.php?data='+jsonString);
}

function onDescriptionClicked() {
  descDiv.toggleAttribute("hidden");
}

document.addEventListener('click', onPageClicked);
startbtn.addEventListener('click', onStartClicked);
pausebtn.addEventListener('click', onPauseClicked);
savebtn.addEventListener('click', onSaveClicked);
loadbtn.addEventListener('click', onLoadClicked);
refreshbtn.addEventListener('click', onRefreshClicked);
descbtn.addEventListener('click', onDescriptionClicked);

function onload()
{
  savebtn.disabled = true;
  pausebtn.disabled = true;
  if (userid == 0) {
    loadbtn.disabled = true;
  }
}
onload()

loadJSON()


