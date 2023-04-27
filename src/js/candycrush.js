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

/// variables
let tablesize = 7;
let newInnerHTML = "";
let gamematrix = [];
let minNum = 0;
let maxNum = 4;
let points = 0;
let totalSeconds = 101;
let gamestate = "";
let firstChosen = [];
let secondChosen = [];

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
                newInnerHTML += "<img src='../../media/candycrush/green.png' alt='green'/>"
                break;
              case 1:
                newInnerHTML += "<img src='../../media/candycrush/blue.png' alt='blue'/>"
                break;
              case 2:
                newInnerHTML += "<img src='../../media/candycrush/brown.png' alt='brown'/>"
                break;
              case 3:
                newInnerHTML += "<img src='../../media/candycrush/red.png' alt='red'/>"
                break;
              default:
                newInnerHTML += "<img src='../../media/candycrush/purple.png' alt='purple'/>"
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
          gametable.children[0].childNodes[i].childNodes[j].innerHTML = "<img src='../../media/candycrush/green.png' alt='green'/>"
          break;
        case 1:
          gametable.children[0].childNodes[i].childNodes[j].innerHTML = "<img src='../../media/candycrush/blue.png' alt='blue'/>"
          break;
        case 2:
          gametable.children[0].childNodes[i].childNodes[j].innerHTML = "<img src='../../media/candycrush/brown.png' alt='brown'/>"
          break;
        case 3:
          gametable.children[0].childNodes[i].childNodes[j].innerHTML = "<img src='../../media/candycrush/red.png' alt='red'/>"
          break;
        default:
          gametable.children[0].childNodes[i].childNodes[j].innerHTML = "<img src='../../media/candycrush/purple.png' alt='purple'/>"
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
        if (count >= 3) {
          return [[i,j-2],[i,j-1],[i,j]];
        }
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
        if (count >= 3) {
          return [[i-2,j],[i-1,j],[i,j]];
        }
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
        gametable.children[0].childNodes[firstChosen[0]].childNodes[firstChosen[1]].innerHTML = "<img src='../../media/candycrush/green.png' alt='green'/>"
        break;
      case 1:
        gametable.children[0].childNodes[firstChosen[0]].childNodes[firstChosen[1]].innerHTML = "<img src='../../media/candycrush/blue.png' alt='blue'/>"
        break;
      case 2:
        gametable.children[0].childNodes[firstChosen[0]].childNodes[firstChosen[1]].innerHTML = "<img src='../../media/candycrush/brown.png' alt='brown'/>"
        break;
      case 3:
        gametable.children[0].childNodes[firstChosen[0]].childNodes[firstChosen[1]].innerHTML = "<img src='../../media/candycrush/red.png' alt='red'/>"
        break;
      default:
        gametable.children[0].childNodes[firstChosen[0]].childNodes[firstChosen[1]].innerHTML = "<img src='../../media/candycrush/purple.png' alt='purple'/>"
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
          gametable.children[0].childNodes[cells[i][0]].childNodes[cells[i][1]].innerHTML = "<img src='../../media/candycrush/greenyellow.png' alt='green'/>"
          break;
        case 1:
          gametable.children[0].childNodes[cells[i][0]].childNodes[cells[i][1]].innerHTML = "<img src='../../media/candycrush/blueyellow.png' alt='blue'/>"
          break;
        case 2:
          gametable.children[0].childNodes[cells[i][0]].childNodes[cells[i][1]].innerHTML = "<img src='../../media/candycrush/brownyellow.png' alt='brown'/>"
          break;
        case 3:
          gametable.children[0].childNodes[cells[i][0]].childNodes[cells[i][1]].innerHTML = "<img src='../../media/candycrush/redyellow.png' alt='red'/>"
          break;
        default:
          gametable.children[0].childNodes[cells[i][0]].childNodes[cells[i][1]].innerHTML = "<img src='../../media/candycrush/purpleyellow.png' alt='purple'/>"
          break;
      }
    }
    await delay(1000);
    for (let i = 0; i < cells.length; i++) {
      switch (gamematrix[cells[i][0]][cells[i][1]]) {
        case 0:
          gametable.children[0].childNodes[cells[i][0]].childNodes[cells[i][1]].innerHTML = "<img src='../../media/candycrush/green.png' alt='green'/>"
          break;
        case 1:
          gametable.children[0].childNodes[cells[i][0]].childNodes[cells[i][1]].innerHTML = "<img src='../../media/candycrush/blue.png' alt='blue'/>"
          break;
        case 2:
          gametable.children[0].childNodes[cells[i][0]].childNodes[cells[i][1]].innerHTML = "<img src='../../media/candycrush/brown.png' alt='brown'/>"
          break;
        case 3:
          gametable.children[0].childNodes[cells[i][0]].childNodes[cells[i][1]].innerHTML = "<img src='../../media/candycrush/red.png' alt='red'/>"
          break;
        default:
          gametable.children[0].childNodes[cells[i][0]].childNodes[cells[i][1]].innerHTML = "<img src='../../media/candycrush/purple.png' alt='purple'/>"
          break;
      }
    }
    points += 50;
    refill(cells);
    cells = checkMatrix(gamematrix);
    updateTable();
  }
}

function getClickedCell(event) {
    if (gamestate === "END") {
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
          gametable.children[0].childNodes[firstChosen[0]].childNodes[firstChosen[1]].innerHTML = "<img src='../../media/candycrush/greengray.png' alt='green'/>"
          break;
        case 1:
          gametable.children[0].childNodes[firstChosen[0]].childNodes[firstChosen[1]].innerHTML = "<img src='../../media/candycrush/bluegray.png' alt='blue'/>"
          break;
        case 2:
          gametable.children[0].childNodes[firstChosen[0]].childNodes[firstChosen[1]].innerHTML = "<img src='../../media/candycrush/browngray.png' alt='brown'/>"
          break;
        case 3:
          gametable.children[0].childNodes[firstChosen[0]].childNodes[firstChosen[1]].innerHTML = "<img src='../../media/candycrush/redgray.png' alt='red'/>"
          break;
        default:
          gametable.children[0].childNodes[firstChosen[0]].childNodes[firstChosen[1]].innerHTML = "<img src='../../media/candycrush/purplegray.png' alt='purple'/>"
          break;
      }
     }
     else
     {
       secondChosen.push(row);
       secondChosen.push(col);
     }

     if (secondChosen.length != 0) {
       moved(firstChosen, secondChosen);
       firstChosen = [];
       secondChosen = [];
     }
}

function setTime() {
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

generateRandomMatrix(tablesize, minNum, maxNum);
generateTable(tablesize);
addEventListener();


