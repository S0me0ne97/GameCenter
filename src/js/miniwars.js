var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var startbtn = document.getElementById("startbtn");
var pausebtn = document.getElementById("pause");

var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
var gameState = "NOTYETSTARTED"

const delay = ms => new Promise(res => setTimeout(res, ms));


let gameTime = 0;
let basesize = 100;
let gamebases = [
    [(canvas.width / 3 - basesize) / 2, (canvas.height - basesize) / 2, 10, "player", 0, ""],
    [(canvas.width - basesize) / 2, (canvas.height / 2 - basesize) / 2, 10, "", 1, ""],
    [(canvas.width - basesize) / 2, (canvas.height * 7 / 8 - basesize), 10, "", 2, ""],
    [(canvas.width * 7 / 8 - basesize), (canvas.height - basesize) / 2, 10, "enemy", 3, ""],
];

let gamepath = [
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
];

let firstchosen = -1;
let secondchosen = -1;


function draw() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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
            ctx.fillStyle = "yellow"
        }
        ctx.fillRect(base[0], base[1], basesize, basesize);
        ctx.fillStyle = "black";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(
            base[0] + basesize / 2 - 20,
            base[1] - 20,
            40,
            20
        );
        ctx.stroke();
        ctx.font = '20px Arial'
        ctx.fillText(base[2], base[0] + basesize / 2 - 13, base[1] - 2)
    });

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
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const clickedbase = baseClicked(x, y);

    if (clickedbase != -1) {
        if (firstchosen === -1) {
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

function checkEnd() {
    let end = true;
    gamebases.forEach(base => {
        end = end && base[3] === "player"; 
    });
    if (end) {
        gameState = "END";
    }
    else {
        end = true;
        gamebases.forEach(base => 
            end = end && base[3] === "enemy"   
        )
        if (end) {
            gameState = "END";
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

function timePass() {
    if (gameState === "PAUSED") {
        setTimeout(timePass, 1000);
        return;
    }
    checkEnd()
    if(gameState === "END") {
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
    startbtn.innerHTML = "Új Játék";
    if (gameState === "LOADGAME") {
        console.log("Load");
    }
    if (gameState === 'NOTYETSTARTED') {
        gameDiv.toggleAttribute('hidden');
        gameState = "INGAME";
        timePass();
    }
    if (gameState === "INGAME") {
        gamebases = [
            [(canvas.width / 3 - basesize) / 2, (canvas.height - basesize) / 2, 10, "player", 0, ""],
            [(canvas.width - basesize) / 2, (canvas.height / 2 - basesize) / 2, 10, "", 1, ""],
            [(canvas.width - basesize) / 2, (canvas.height * 7 / 8 - basesize), 10, "", 2, ""],
            [(canvas.width * 7 / 8 - basesize), (canvas.height - basesize) / 2, 10, "enemy", 3, ""],
        ];
        gameTime = 0;
    }
}

function onPauseClicked() {
    if (gameState != "INGAME" && gameState != "PAUSED") {
        return;
    }
    pausebtn.innerHTML = gameState === "INGAME" ? "Folytatás" : "Szünet"; 
    gameState = gameState === "INGAME" ? "PAUSED" : "INGAME";
}

canvas.addEventListener('mousedown', function(e) {
    getCursorPosition(canvas, e)
})

startbtn.addEventListener('click', onStartClicked);
pausebtn.addEventListener('click', onPauseClicked);
