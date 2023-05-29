var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var startbtn = document.getElementById("startbtn");
var stageselect = document.getElementById("stageselect");
var pausebtn = document.getElementById("pause");
var savebtn = document.getElementById("save");
var loadbtn = document.getElementById("load");
var descbtn = document.getElementById("description");
var descDiv = document.getElementById("descriptionDiv");

var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
var pointsLabel = document.getElementById("points");
var gameState = "NOTYETSTARTED";
var useridDiv = document.getElementById("userid");
let userid = useridDiv.innerHTML;


window.onload = function() {
    drawChooseGame()
}


var chooseGameDiv = document.getElementById("chooseGameDiv");
var menu = document.getElementById("menu");
var gameDiv = document.getElementById("gameDiv");

var savesDiv = document.getElementById("savesdiv");
var passData = document.getElementById("passdata");

const delay = ms => new Promise(res => setTimeout(res, ms));

let gamesArr = [];
let canvasArr = [];
let startupArr = [];

let gameTime = 0;
let points = 0;
let basesize = 100;
let gamebases = [];
let gamepath = [];
var chosenGame = 4;

var allgames = [
    [
        [(canvas.width / 3 - basesize) / 2, (canvas.height - basesize) / 2, 10, "player", 0, ""],
        [(canvas.width - basesize) / 2, (canvas.height / 2 - basesize) / 2, 10, "", 1, ""],
        [(canvas.width - basesize) / 2, (canvas.height * 7 / 8 - basesize), 10, "", 2, ""],
        [(canvas.width * 7 / 8 - basesize), (canvas.height - basesize) / 2, 10, "enemy", 3, ""],
    ],
    [
        [(canvas.width / 3 - basesize) / 2, (canvas.height - basesize) / 2, 10, "enemy", 0, ""],
        [(canvas.width - basesize) / 2, (canvas.height / 2 - basesize) / 3, 10, "", 1, ""],
        [(canvas.width - basesize) / 2, ((canvas.height - basesize) / 2), 15, "player", 2, ""],
        [(canvas.width - basesize) / 2, (canvas.height * 11 / 12 - basesize), 10, "", 3, ""],
        [(canvas.width * 7 / 8 - basesize), (canvas.height - basesize) / 2, 10, "enemy", 4, ""],
    ],
    [
        [(canvas.width / 3 - basesize) / 2, (canvas.height - basesize) / 2, 10, "player", 0, ""],
        [(canvas.width - basesize) / 2, (canvas.height / 2 - basesize) / 3, 20, "", 1, ""],
        [(canvas.width - basesize) / 2, ((canvas.height - basesize) / 2), 30, "enemy", 2, ""],
        [(canvas.width - basesize) / 2, (canvas.height * 11 / 12 - basesize), 20, "", 3, ""],
        [(canvas.width * 7 / 8 - basesize), (canvas.height - basesize) / 2, 10, "player", 4, ""],
    ],
    [
        [(canvas.width / 3 - basesize) / 2, (canvas.height / 2 - basesize) / 3, 10, "player", 0, ""],
        [(canvas.width * 7 / 8 - basesize), (canvas.height / 2 - basesize) / 3, 10, "player", 1, ""],
        [(canvas.width - basesize) / 2, ((canvas.height - basesize) / 2), 40, "enemy", 2, ""],
        [(canvas.width / 3 - basesize) / 2, (canvas.height * 11 / 12 - basesize), 10, "player", 3, ""],
        [(canvas.width * 7 / 8 - basesize), (canvas.height * 11 / 12 - basesize), 10, "player", 4, ""],
    ],
    [
        [(canvas.width / 3 - basesize) / 2, (canvas.height / 2 - basesize) / 3, 10, "enemy", 0, ""],
        [(canvas.width * 7 / 8 - basesize), (canvas.height / 2 - basesize) / 3, 10, "enemy", 1, ""],
        [(canvas.width - basesize) / 2, ((canvas.height - basesize) / 2), 40, "player", 2, ""],
        [(canvas.width / 3 - basesize) / 2, (canvas.height * 11 / 12 - basesize), 10, "enemy", 3, ""],
        [(canvas.width * 7 / 8 - basesize), (canvas.height * 11 / 12 - basesize), 10, "enemy", 4, ""],
    ]
];

var allpaths = [
    [
        [0,1],
        [1,0],
        [0,2],
        [2,0],
        [1,2],
        [2,1],
        [1,3],
        [3,1],
        [2,3],
        [3,2]
    ],
    [
        [0,1],
        [1,0],
        [0,3],
        [3,0],
        [1,2],
        [2,1],
        [2,3],
        [3,2],
        [1,4],
        [4,1],
        [3,4],
        [4,3]
    ],
    [
        [0,1],
        [1,0],
        [0,3],
        [3,0],
        [1,2],
        [2,1],
        [2,3],
        [3,2],
        [1,4],
        [4,1],
        [3,4],
        [4,3]
    ],
    [
        [0,1],
        [1,0],
        [0,3],
        [0,2],
        [2,0],
        [3,0],
        [1,2],
        [2,1],
        [2,3],
        [3,2],
        [1,4],
        [4,1],
        [4,2],
        [2,4],
        [3,4],
        [4,3]
    ],
    [
        [0,1],
        [1,0],
        [0,3],
        [0,2],
        [2,0],
        [3,0],
        [1,2],
        [2,1],
        [2,3],
        [3,2],
        [1,4],
        [4,1],
        [4,2],
        [2,4],
        [3,4],
        [4,3]
    ]
]

let firstchosen = -1;
let secondchosen = -1;

function copyGame() {
    allgames[chosenGame].forEach(base => {
        let temparr = [];
        for (let i = 0; i < base.length; i++) {
            temparr[i] = base[i];
        }
        gamebases.push(temparr);
    });
    allpaths[chosenGame].forEach(path => {
        let temparr = [];
        for (let i = 0; i < path.length; i++) {
            temparr[i] = path[i];
        }
        gamepath.push(temparr);
    })
}

function draw() {
    const image = new Image();
    image.src = '../media/bg_load.png';
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "blue";
    ctx.lineWidth = 5;
    gamepath.forEach(path => {
        ctx.beginPath();

        if (path[0] < path[1] && (gamebases[path[0]][0] != gamebases[path[1]][0])) {
            ctx.moveTo(gamebases[path[0]][0] + basesize / 2, gamebases[path[0]][1] + basesize / 2 + 5);
            ctx.lineTo(gamebases[path[1]][0] + basesize / 2, gamebases[path[1]][1] + basesize / 2 + 5);
        }
        else if(path[0] < path[1] && (gamebases[path[0]][0] == gamebases[path[1]][0])) {
            ctx.moveTo(gamebases[path[0]][0] + basesize / 2 + 5, gamebases[path[0]][1] + basesize / 2);
            ctx.lineTo(gamebases[path[1]][0] + basesize / 2 + 5, gamebases[path[1]][1] + basesize / 2);
        }
        else if(path[0] > path[1] && (gamebases[path[0]][0] == gamebases[path[1]][0])) {
            ctx.moveTo(gamebases[path[0]][0] + basesize / 2 - 5, gamebases[path[0]][1] + basesize / 2);
            ctx.lineTo(gamebases[path[1]][0] + basesize / 2 - 5, gamebases[path[1]][1] + basesize / 2);
        }
        else {
            ctx.moveTo(gamebases[path[0]][0] + basesize / 2, gamebases[path[0]][1] + basesize / 2 - 5);
            ctx.lineTo(gamebases[path[1]][0] + basesize / 2, gamebases[path[1]][1] + basesize / 2 - 5);
        }
        ctx.stroke();
    });

    gamebases.forEach(base => {
        ctx.fillStyle = "black";
        switch (base[3]) {
            case "player":
                ctx.fillStyle = "blue";
                break;
            
            case "enemy":
                ctx.fillStyle = "red";
                break;
        
            default:
                ctx.fillStyle = "gray";
                break;
        }
        if (base[5] === "CHOSEN") {
            ctx.fillStyle = "orange"
        }
        ctx.fillRect(base[0], base[1], basesize, basesize);
        ctx.fillStyle = "white";
        ctx.font = '20px Arial'
        ctx.fillText(base[2], base[0] + basesize / 2 - 10, base[1] + basesize / 2 + 5)
    });
}

function baseClicked(x, y) {
    if (gameState != "INGAME") {
        return;
    }
    let foundbase = -1;
    let index = 0;
    gamebases.forEach(base => {
        let left = base[0];
        let right = base[0] + basesize;
        let top = base[1];
        let bottom = base[1] + basesize;
        if (right >= x
            && left <= x
            && bottom >= y
            && top <= y) 
        {
            foundbase = index;
        }
        index++;
    });
    
    return foundbase;
}

function attack(first, second) {
    gamepath.forEach(path => {
        if(path[0] == first && path[1] == second)
        {
            if (gamebases[first][3] === "player" && gamebases[second][3] != "player") {
                if (gamebases[first][2] > gamebases[second][2]) {
                    updatePoints(50);
                }
            }
            if (gamebases[first][3] === "enemy" && gamebases[second][3] === "player") {
                if (gamebases[first][2] > gamebases[second][2]) {
                    updatePoints(-20);
                }
            }
            gamebases[second][2] = gamebases[first][3] == gamebases[second][3] ? gamebases[second][2] + gamebases[first][2] : gamebases[second][2] - gamebases[first][2];
            gamebases[first][2] = 0;
            if (gamebases[second][2] <= 0) {
                gamebases[second][2] = Math.abs(gamebases[second][2]);
                gamebases[second][3] = gamebases[first][3]
            }
        }
    });
}

function getCursorPosition(canvas, event) {
    if (gameState != "INGAME") {
        return;
    }
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const clickedbase = baseClicked(x, y);

    if (clickedbase != -1) {
        if (firstchosen === -1) {
            if (gamebases[clickedbase][3] != "player") {
                return;
            }
            firstchosen = clickedbase;
            gamebases[firstchosen][5] = "CHOSEN"
        }
        else {
            secondchosen = clickedbase;
            attack(firstchosen, secondchosen)
            gamebases[firstchosen][5] = ""
            firstchosen = -1;
            secondchosen = -1;
            draw();
        }
    }
}

function postScore() {
    var jsonString = JSON.stringify(points);
    location.replace('postscore_miniwars.php?data='+jsonString);
}

function checkEnd() {
    let end = true;
    gamebases.forEach(base => {
        end = end && base[3] === "player"; 
    });
    if (end) {
        gameState = "END";
        if (userid != 0) {
            postScore();
        }
    }
    else {
        end = true;
        gamebases.forEach(base => 
            end = end && base[3] === "enemy"   
        )
        if (end) {
            gameState = "END";
            if (userid != 0) {
                postScore();
            }
        }
    }
}

function enemyAttack() {
    gamebases.forEach(base => {
        if (base[3] === "enemy") {
            let neighbours = gamepath.filter(path => base[4] == path[0]);
            if(Math.floor(Math.random() * 20) == 1)
            {
                let whichbasetoattack = Math.floor(Math.random() * neighbours.length);
                attack(base[4], neighbours[whichbasetoattack][1])
            }
        }
    });
}

function updatePoints(change) {
    points += change;
    pointsLabel.innerHTML = "pontok: " + points;
}

function timePass() {
    if (gameState === "NOTYETSTARTED") {
        return;
    }
    startbtn.disabled = false;
    pausebtn.disabled = false;
    if (userid != 0) {
        savebtn.disabled = false;
    }
    if (gameState === "PAUSED" || gameState === "LOADPAGE") {
        setTimeout(timePass, 1000);
        return;
    }
    checkEnd()
    if(gameState === "END") {
        savebtn.disabled = true;
        pausebtn.disabled = true;
        return;
    }
    ++gameTime;
    gamebases.forEach(base => {
        if (gameTime % 3 === 0 && base[3] != "") {
            base[2]++;
        }
    });
    enemyAttack();
    draw();
    secondsLabel.innerHTML = pad(gameTime % 60);
    minutesLabel.innerHTML = pad(parseInt(gameTime / 60));
    setTimeout(timePass, 1000);
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
    if (gameState === 'NOTYETSTARTED') {
        return;
    }
    if (gameState === "INGAME") {
        copyGame();
        gameTime = 0;
    }
    if (gameState === "LOADPAGE") {
        savesDiv.toggleAttribute("hidden");
        gameDiv.toggleAttribute('hidden');
        gameState = "INGAME";
    }
    if (gameState === "LOADPAGENOGAMESTARTED") {
        savesDiv.toggleAttribute("hidden");
        gameDiv.toggleAttribute('hidden');
        gameState = "INGAME";
        timePass();
    }
    if (gameState === "END") {
        copyGame();
        gameTime = 0;
        gameState = "INGAME";
        timePass();
    }
}

function onPauseClicked() {
    if (gameState != "INGAME" && gameState != "PAUSED") {
        return;
    }
    pausebtn.innerHTML = gameState === "INGAME" ? "Folytatás" : "Szünet"; 
    gameState = gameState === "INGAME" ? "PAUSED" : "INGAME";
}

function onSaveClicked() {
    if (gameState != "INGAME" && gameState != "PAUSED") {
        return;
    }
    gamebases.forEach(base => {
        base[5] = "";
    });
    gameState = 'PAUSED';
    var gameObj = {
        points,
        gameTime,
        gamebases,
        gamepath
    }
    var jsonObj = JSON.stringify(gameObj);

    location.replace('save_miniwars.php?data='+jsonObj);
}

function loadcanvasloop() {
    if (gameState != "LOADPAGE" && gameState != "LOADPAGENOGAMESTARTED" && gameState != "LOADPAGEEND") {
        return;
    }
    let i = 0
    canvasArr.forEach(element => {
        drawMiniCanvas(element, gamesArr[i]);
        ++i;
    });
    setTimeout(loadcanvasloop, 1000);
}

function onLoadClicked() {
    savesDiv.toggleAttribute("hidden");
    if(gameState === 'LOADPAGE') {
        gameDiv.toggleAttribute("hidden");
        loadbtn.innerHTML = "Betöltés";
        gameState = 'INGAME';
    } else if (gameState === 'INGAME') {
      loadbtn.innerHTML = "Vissza a játékhoz";
      gameState = 'LOADPAGE';
      chooseGameDiv.hidden = true;
      loadcanvasloop();
      gameDiv.toggleAttribute("hidden");
    }
    if (gameState === "LOADPAGENOGAMESTARTED") {
        loadbtn.innerHTML = "Betöltés"
        chooseGameDiv.hidden = false;
        gameState = "NOTYETSTARTED";
    } else if (gameState === "NOTYETSTARTED") {
        chooseGameDiv.hidden = true;
        loadbtn.innerHTML = "Vissza a játékhoz";
        gameState = 'LOADPAGENOGAMESTARTED';
        loadcanvasloop();
    }
    if (gameState === "LOADPAGEEND") {
        loadbtn.innerHTML = "Betöltés"
        gameState = "END";
        gameDiv.toggleAttribute("hidden");
    } else if (gameState === "END") {
      chooseGameDiv.hidden = true;
      loadbtn.innerHTML = "Vissza a játékhoz";
      gameState = 'LOADPAGEEND';
      loadcanvasloop();
      gameDiv.toggleAttribute("hidden");
    }

}

function drawMiniCanvas(minicanvas, data) {
    const image = new Image();
    image.src = '../media/bg_load.png';
    let minictx = minicanvas.getContext('2d');
    minictx.fillStyle = "white";
    minictx.drawImage(image, 0, 0, minicanvas.width, minicanvas.height);

    minictx.fillStyle = "blue";
    minictx.lineWidth = 5;
    data.gamepath.forEach(path => {
        minictx.beginPath();
        if (path[0] < path[1] && (data.gamebases[path[0]][0] != data.gamebases[path[1]][0])) {
            minictx.moveTo(data.gamebases[path[0]][0] + basesize / 2, data.gamebases[path[0]][1] + basesize / 2 + 5);
            minictx.lineTo(data.gamebases[path[1]][0] + basesize / 2, data.gamebases[path[1]][1] + basesize / 2 + 5);
        }
        else if(path[0] < path[1] && (data.gamebases[path[0]][0] == data.gamebases[path[1]][0])) {
            minictx.moveTo(data.gamebases[path[0]][0] + basesize / 2 + 5, data.gamebases[path[0]][1] + basesize / 2);
            minictx.lineTo(data.gamebases[path[1]][0] + basesize / 2 + 5, data.gamebases[path[1]][1] + basesize / 2);
        }
        else if(path[0] > path[1] && (data.gamebases[path[0]][0] == data.gamebases[path[1]][0])) {
            minictx.moveTo(data.gamebases[path[0]][0] + basesize / 2 - 5, data.gamebases[path[0]][1] + basesize / 2);
            minictx.lineTo(data.gamebases[path[1]][0] + basesize / 2 - 5, data.gamebases[path[1]][1] + basesize / 2);
        }
        else {
            minictx.moveTo(data.gamebases[path[0]][0] + basesize / 2, data.gamebases[path[0]][1] + basesize / 2 - 5);
            minictx.lineTo(data.gamebases[path[1]][0] + basesize / 2, data.gamebases[path[1]][1] + basesize / 2 - 5);
        }
        minictx.stroke();
    });

    data.gamebases.forEach(base => {
        minictx.fillStyle = "black";
        switch (base[3]) {
            case "player":
                minictx.fillStyle = "blue";
                break;
            
            case "enemy":
                minictx.fillStyle = "red";
                break;
        
            default:
                minictx.fillStyle = "gray";
                break;
        }
        if (base[5] === "CHOSEN") {
            minictx.fillStyle = "yellow"
        }
        minictx.fillRect(base[0], base[1], basesize, basesize);
        minictx.fillStyle = "white";
        minictx.font = '20px Arial'
        minictx.fillText(base[2], base[0] + basesize / 2 - 10, base[1] + basesize / 2 + 5)
    });
}

function loadNewGame(id) {
    let data = gamesArr[id];
    points = data.points;
    gameTime = data.gameTime;
    gamebases = [];
    data.gamebases.forEach(col => {
        let arr = []
        col.forEach(cell => {
          arr.push(cell);
        });
        gamebases.push(arr);
    });
    gamepath = data.gamepath;

    savesDiv.toggleAttribute("hidden");
    gameDiv.toggleAttribute("hidden");
    if (gameState === "LOADPAGENOGAMESTARTED" || gameState === "LOADPAGEEND") {
        loadbtn.innerHTML = "Betöltés";
        gameState = "INGAME";
        pointsLabel.innerHTML = "pontok: " + points;
        draw()
        timePass();
    }
    else {
        loadbtn.innerHTML = "Betöltés"
        gameState = "INGAME";
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
        if (element[1]["game"] === "miniwars" && element[1]["userid"] === userid.trim()) {
            gamesArr.push(JSON.parse(element[1]["gamedata"]));
        }
    }
    let divstr = "<br><ul>";
    let i = 0;
    gamesArr.forEach(elem => {
        divstr += "<li>";
        divstr += "<p>pontok: " + elem.points + "</p>";
        divstr += "<canvas id=\"" + i + "\" width=" + 700 + " height=" + 500 + "></canvas><br>";
        divstr += "</li><br><br>";
        ++i;
    })
    divstr += "</ul>"
    savesDiv.innerHTML = divstr;
    canvasArr = [];
    for (let index = 0; index < gamesArr.length; index++) {
        canvasArr.push(document.getElementById(index));
    }

    i = 0
    canvasArr.forEach(element => {
        drawMiniCanvas(element, gamesArr[i]);
        ++i;
    });
}

function onPageClicked(event) {
    if (gameState != 'LOADPAGE' && gameState != 'LOADPAGENOGAMESTARTED' && gameState != "LOADPAGEEND" && gameState != "NOTYETSTARTED") return;
    if (event.explicitOriginalTarget.nodeName != "CANVAS") {
        return;
    }
    if (gameState === "NOTYETSTARTED") {
        loadNewStartupGame(parseInt(event.explicitOriginalTarget.id))
    } else {
        loadNewGame(parseInt(event.explicitOriginalTarget.id));
    }
}

function drawStartupCanvas(minicanvas, database, datapath) {
    const image = new Image();
    image.src = '../media/bg_load.png';
    let minictx = minicanvas.getContext('2d');
    minictx.drawImage(image, 0, 0, canvas.width, canvas.height);

    minictx.fillStyle = "blue";
    minictx.lineWidth = 5;
    datapath.forEach(path => {
        minictx.beginPath();

        if (path[0] < path[1] && (database[path[0]][0] != database[path[1]][0])) {
            minictx.moveTo(database[path[0]][0] + basesize / 2, database[path[0]][1] + basesize / 2 + 5);
            minictx.lineTo(database[path[1]][0] + basesize / 2, database[path[1]][1] + basesize / 2 + 5);
        }
        else if(path[0] < path[1] && (database[path[0]][0] == database[path[1]][0])) {
            minictx.moveTo(database[path[0]][0] + basesize / 2 + 5, database[path[0]][1] + basesize / 2);
            minictx.lineTo(database[path[1]][0] + basesize / 2 + 5, database[path[1]][1] + basesize / 2);
        }
        else if(path[0] > path[1] && (database[path[0]][0] == database[path[1]][0])) {
            minictx.moveTo(database[path[0]][0] + basesize / 2 - 5, database[path[0]][1] + basesize / 2);
            minictx.lineTo(database[path[1]][0] + basesize / 2 - 5, database[path[1]][1] + basesize / 2);
        }
        else {
            minictx.moveTo(database[path[0]][0] + basesize / 2, database[path[0]][1] + basesize / 2 - 5);
            minictx.lineTo(database[path[1]][0] + basesize / 2, database[path[1]][1] + basesize / 2 - 5);
        }
        minictx.stroke();
    });

    database.forEach(base => {
        minictx.fillStyle = "black";
        switch (base[3]) {
            case "player":
                minictx.fillStyle = "blue";
                break;
            
            case "enemy":
                minictx.fillStyle = "red";
                break;
        
            default:
                minictx.fillStyle = "gray";
                break;
        }
        minictx.fillRect(base[0], base[1], basesize, basesize);
        minictx.fillStyle = "white";
        minictx.font = '20px Arial'
        minictx.fillText(base[2], base[0] + basesize / 2 - 10, base[1] + basesize / 2 + 5)
    });
}

function drawChooseGame() {
    if (gameState != "NOTYETSTARTED") {
        return;
    }
    let divstr = "<br><ul>";
    let i = 0;
    allgames.forEach(elem => {
        divstr += "<li>";
        divstr += "<canvas id=\"" + i + "\" width=" + 700 + " height=" + 500 + "></canvas><br>";
        divstr += "</li><br><br>";
        ++i;
    })
    divstr += "</ul>"
    chooseGameDiv.innerHTML = divstr;
    startupArr = [];
    for (let index = 0; index < allgames.length; index++) {
        startupArr.push(document.getElementById(index));
    }

    i = 0
    startupArr.forEach(element => {
        drawStartupCanvas(element, allgames[i], allpaths[i]);
        ++i;
    });
    setTimeout(drawChooseGame, 1000);
}

function loadNewStartupGame(id) {
    gamebases = [];
    gamepath = [];
    gameTime = 0;
    chosenGame = id;
    copyGame();
    gameDiv.toggleAttribute("hidden");
    chooseGameDiv.toggleAttribute("hidden");
    if (gameState === "NOTYETSTARTED") {
        gameState = "INGAME";
        draw()
        timePass();
    }
    else {
        gameState = "INGAME";
    }
}

function onStageSelectClicked() {
    if (gameState === "NOTYETSTARTED") {
        return;
    }
    chooseGameDiv.toggleAttribute("hidden");
    if (gameState === "INGAME" || gameState === "PAUSED") {
        gameDiv.toggleAttribute("hidden");
    }
    if (gameState === "LOADPAGE" || gameState === "LOADPAGENOGAMESTARTED" || gameState === "LOADPAGEEND") {
        savesDiv.toggleAttribute("hidden");
    }
    gameState = "NOTYETSTARTED";
}

function onDescriptionClicked() {
    descDiv.toggleAttribute("hidden");
}

function onload()
{
  startbtn.disabled = true;
  pausebtn.disabled = true;
  savebtn.disabled = true;
  if (userid == 0) {
    loadbtn.disabled = true;
  }
}

canvas.addEventListener('mousedown', function(e) {
    getCursorPosition(canvas, e)
})
document.addEventListener('click', onPageClicked);
startbtn.addEventListener('click', onStartClicked);
stageselect.addEventListener('click', onStageSelectClicked);
pausebtn.addEventListener('click', onPauseClicked);
savebtn.addEventListener('click', onSaveClicked);
loadbtn.addEventListener('click', onLoadClicked);
descbtn.addEventListener('click', onDescriptionClicked);

loadJSON();
onload();