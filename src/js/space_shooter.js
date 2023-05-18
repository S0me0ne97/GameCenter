//#region Variables
var startbtn = document.getElementById("startbtn");
var pausebtn = document.getElementById("pause");
var loadbtn = document.getElementById("load");
var savebtn = document.getElementById("save");

var easybtn = document.getElementById("easy");
var mediumbtn = document.getElementById("medium");
var hardbtn = document.getElementById("hard");

var gameDiv = document.getElementById("game");
var menuDiv = document.getElementById("menu");
var savesDiv = document.getElementById("savesdiv");

var saveData = document.getElementById("data");
var passData = document.getElementById("passdata");

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var canvas_height = canvas.height;
var canvas_width = canvas.width;

let json_data;
let gamesObj = [];
let gamesArr = [];
let canvasArr = [];

var gameVisible = true;
var ship;
var enemies;
var powerups;
var bullets;
var lastTime;
var pressedKey;
var gameState = 'NOTYETSTARTED' // INGAME, END, PAUSED
var points;
var enemyProb;
var bulletProb;
var killPoint;
var gameTime;

var bluePos = {
    x: 0,
    y: 2
}
var redPos = {
    x: 1,
    y: 2
}
var greenPos = {
    x: 0,
    y: 1
}

var images = {
    bg: new Image(),
    ship: new Image(),
    enemy: new Image(),
    explosion: new Image(),
    powerup: new Image()
}

images.bg.src = '../media/bg.png';
images.ship.src = '../media/ship.png';
images.enemy.src = '../media/enemie_r.png';
images.explosion.src = '../media/explosion.png';
images.powerup.src = '../media/powerups.png';

//#endregion Variables

//#region Function definitions
function startNewGame(diff) {
    switch (diff) {
        case 0:
            ship = 
            {
                width: 40,
                height: 40,
                x: (canvas_width - 40) / 2,
                y: canvas_height - 40,
                speed: 600,
                dir: 0,
                life: 5,
                blue: 0,
                green: 0
            };
            enemyProb = 0.005;
            bulletProb = 0.005;
            killPoint = 10;
            break;
        case 1:
            ship = 
            {
                width: 40,
                height: 40,
                x: (canvas_width - 40) / 2,
                y: canvas_height - 40,
                speed: 600,
                dir: 0,
                life: 5,
                blue: 0,
                green: 0
            };
            enemyProb = 0.006;
            bulletProb = 0.006;
            killPoint = 20;
            break;
        default:
            ship = 
            {
                width: 40,
                height: 40,
                x: (canvas_width - 40) / 2,
                y: canvas_height - 40,
                speed: 600,
                dir: 0,
                life: 5,
                blue: 0,
                green: 0
            };
            enemyProb = 0.009;
            bulletProb = 0.009;
            killPoint = 50;
            break;
    }

    enemies = [];

    powerups = [];

    bullets = [];

    lastTime = performance.now();

    pressedKey = '';

    gameState = 'INGAME' // INGAME, END, PAUSED

    points = 0;

    gameTime = 0;

}

function loadNewGame(id) {
    let data = gamesArr[id];
    ship = 
    {
        width: 40,
        height: 40,
        x: data.ship.x,
        y: data.ship.y,
        speed: data.ship.speed,
        dir: data.ship.dir,
        life: data.ship.life,
        blue: data.ship.blue,
        green: data.ship.green
    };
    enemyProb = data.enemyProb;
    bulletProb = data.bulletProb;
    killPoint = data.killPoint;
    enemies = data.enemies;
    powerups = data.powerups;
    bullets = data.bullets;
    pressedKey = data.pressedKey;
    gameState = 'INGAME';
    points = data.points;
    gameTime = data.gameTime;

    savesDiv.toggleAttribute("hidden");
    gameDiv.toggleAttribute("hidden");

    startAnimation();
    setTimeout(setTimeNow, 3000);
    setTimeout(timePass, 3000);
    setTimeout(gameLoop, 3000);
}

function loadJSON() {
    json_data = JSON.parse(passData.innerHTML);
    gamesObj = [];
    for(let i in json_data){
        gamesObj.push([i, json_data [i]]);
    }
    gamesArr = [];
    for (const element of gamesObj) {
        gamesArr.push(JSON.parse(element[1]["gamedata"]));
    }
    let divstr = "<br><ul>";
    let i = 0;
    gamesArr.forEach(elem => {
        divstr += "<li>";
        divstr += "<canvas id=\"" + i + "\" width=" + 500 + " height=" + 700 + "></canvas><br>";
        divstr += "Pontok: ";
        divstr += elem.points;
        divstr += " Eltelt idő: ";
        divstr += elem.gameTime;
        divstr += " Élet: ";
        divstr += elem.ship.life;
        divstr += "</li><br><br>";
        ++i;
    })
    divstr += "</ul>"
    savesDiv.innerHTML = divstr;
    for (let index = 0; index < gamesArr.length; index++) {
        canvasArr.push(document.getElementById(index));
    }

    i = 0
    canvasArr.forEach(element => {
        drawMiniCanvas(element, gamesArr[i]);
        ++i;
    });
}

function drawMiniCanvas(minicanvas, data) {
    var minictx = minicanvas.getContext('2d');

    minictx.drawImage(images.bg, 0, 0, minicanvas.width, minicanvas.height);
    
    //hajó
    data.ship.x = data.ship.x > minicanvas.width - data.ship.width ? minicanvas.width - data.ship.width : data.ship.x;
    data.ship.x = data.ship.x < 0 ? 0 : data.ship.x;
    
    if (gameState !== 'END') {
        minictx.drawImage(images.ship, data.ship.x, data.ship.y, data.ship.width, data.ship.height);
    }
    else
    {
        minictx.drawImage(images.explosion,
            3 * 192, 1 * 192, 192, 192,
            data.ship.x, data.ship.y, data.ship.width, data.ship.height);
    }

    //ellenségek
    data.enemies.forEach(enemy => {
        minictx.drawImage(images.enemy, enemy.x, enemy.y, enemy.width, enemy.height);
    });

    //lövedékek
    data.bullets.forEach(bullet => {
        minictx.fillStyle = bullet.color;
        minictx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    })

    //powerupok
    data.powerups.forEach(item => {
        switch (item.type) {
            case 0:
                minictx.drawImage(images.powerup,
                    redPos.x * 280, redPos.y * 280,  280,  280,
                    item.x, item.y, item.width, item.height);
                break;
            case 1:
                minictx.drawImage(images.powerup,
                    bluePos.x * 280, bluePos.y * 280,  280,  280,
                    item.x, item.y, item.width, item.height);
                break;
            default:
                minictx.drawImage(images.powerup,
                    greenPos.x * 280, greenPos.y * 280,  280,  280,
                    item.x, item.y, item.width, item.height);
                break;
        }
    });

    //data
    minictx.fillStyle = 'white';
    minictx.font = '15px Courier New';
    minictx.fillText(`Points: ${data.points}`, 10, 10);
    minictx.fillText(`Life: ${data.ship.life}`, 10, 30);
    minictx.fillText(`Kék: ${data.ship.blue}s`, 10, 50);
    minictx.fillText(`Zöld: ${data.ship.green}s`, 10, 70);
}

function showText(txt) {
    draw();
    ctx.fillStyle = 'white';
    ctx.font = '100px Courier New';
    ctx.fillText(txt, canvas_width / 2 - 25, canvas_height / 2);
}

function startAnimation()
{
    showText('3');
    setTimeout(showText, 1000, '2');
    setTimeout(showText, 2000, '1');
}

function setTimeNow() {
    lastTime = performance.now();
}


function timePass() {
    ++gameTime;
    ship.blue = ship.blue === 0 ? 0 : --ship.blue;
    ship.green = ship.green === 0 ? 0 : --ship.green;
    if (ship.blue === 0) {
        ship.speed = 600;
    }
    setTimeout(timePass, 1000);
}

function gameLoop(now = performance.now()) {

    const dt = (now - lastTime) / 1000;
    lastTime = now;
    
    update(dt);
    draw();

    if (gameState === 'INGAME') {
        window.requestAnimationFrame(gameLoop);
    }
}

function generateRandom(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
}

function isCollision(r1, r2) {
    return !(r2.y + r2.height < r1.y ||
    r2.x > r1.x + r1.width ||
    r2.y > r1.y + r1.height ||
    r2.x + r2.width < r1.x)
}

function update(dt) {
    //hajó
    ship.x += ship.dir * ship.speed * dt;
    
    //ellenség    
    if (Math.random() < enemyProb) {
        enemies.push({
            x: generateRandom(0, canvas_width),
            y: 0,
            width: 50,
            height: 50,
            vx: generateRandom(-20, 20),
            vy: generateRandom(50, 120),
            alive: 1
        })
    }

    enemies.forEach(enemy => {
        enemy.x += enemy.vx * dt;
        enemy.y += enemy.vy * dt;
        if (enemy.y < 0 || enemy.y > canvas_height) {
            enemy.alive = 0
        }
        if (Math.random() < bulletProb) {
            bullets.push({
                x: enemy.x + enemy.width / 2 - 2,
                y: enemy.y + 10,
                width: 4,
                height: 10,
                speed: 500,
                alive: 1,
                color: 'red'
            })
        }
        if (isCollision(ship, enemy)) {
            ship.life = ship.green === 0 ? 0 : ship.life;
            enemy.alive = 0;
        }
    })

    //lövedékek
    bullets.forEach(bullet => {
        bullet.y += bullet.speed * dt;
        if (bullet.y < 0 || bullet.y > canvas_height) {
            bullet.alive = 0
        }
        if (bullet.color === 'yellow') {
            enemies.forEach(enemy => {
                if (isCollision(enemy, bullet)) {
                    enemy.alive = 0;
                    bullet.alive = 0;
                    points += killPoint;

                    //powerup
                    if (Math.random() < 0.1) {
                        powerups.push({
                            x: enemy.x,
                            y: enemy.y,
                            width: 25,
                            height: 25,
                            speed: generateRandom(50, 120),
                            alive: 1,
                            type: generateRandom(0,100) % 3 
                        })
                    }
                }
            })
        }
        else 
        {
            if(isCollision(ship, bullet))
            {
                bullet.alive = 0;
                ship.life = ship.green === 0 ? --ship.life : ship.life;
            }
        }
    })

    powerups.forEach(item => {
        item.y += item.speed * dt;
        if (item.y > canvas_height) {
            item.alive = 0
        }
        if (isCollision(ship, item)) {
            switch (item.type) {
                case 0:
                    ++ship.life;
                    break;
                case 1:
                    ship.speed = 800;
                    ship.blue += 20;
                    break;
            
                default:
                    ship.green += 10;
                    break;
            }
            item.alive = 0;
        }
    })

    //delete bullets
    bullets = bullets.filter(bullet => bullet.alive === 1);
    //delete enemy
    enemies = enemies.filter(enemy => enemy.alive === 1);
    //delete powerup
    powerups = powerups.filter(item => item.alive === 1);

    if (ship.life <= 0) {
        gameState = 'END'
    }
}

function draw() {
    ctx.drawImage(images.bg, 0, 0, canvas.width, canvas.height);
    
    //hajó
    ship.x = ship.x > canvas_width - ship.width ? canvas_width - ship.width : ship.x;
    ship.x = ship.x < 0 ? 0 : ship.x;
    
    ctx.fillStyle = 'rgb(200, 0, 0)';
    if (gameState !== 'END') {
        ctx.drawImage(images.ship, ship.x, ship.y, ship.width, ship.height);
    }
    else
    {
        ctx.drawImage(images.explosion,
            3 * 192, 1 * 192, 192, 192,
            ship.x, ship.y, ship.width, ship.height);
    }

    //ellenségek
    ctx.fillStyle = 'rgb(0, 200, 0)';
    enemies.forEach(enemy => {
        ctx.drawImage(images.enemy, enemy.x, enemy.y, enemy.width, enemy.height);
    });

    //lövedékek
    bullets.forEach(bullet => {
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    })

    //powerupok
    powerups.forEach(item => {
        switch (item.type) {
            case 0:
                ctx.drawImage(images.powerup,
                    redPos.x * 280, redPos.y * 280,  280,  280,
                    item.x, item.y, item.width, item.height);
                break;
            case 1:
                ctx.drawImage(images.powerup,
                    bluePos.x * 280, bluePos.y * 280,  280,  280,
                    item.x, item.y, item.width, item.height);
                break;
            default:
                ctx.drawImage(images.powerup,
                    greenPos.x * 280, greenPos.y * 280,  280,  280,
                    item.x, item.y, item.width, item.height);
                break;
        }
    });

    //data
    ctx.fillStyle = 'white';
    ctx.font = '15px Courier New';
    ctx.fillText(`Points: ${points}`, 10, 10);
    ctx.fillText(`Life: ${ship.life}`, 10, 30);
    ctx.fillText(`Kék: ${ship.blue}s`, 10, 50);
    ctx.fillText(`Zöld: ${ship.green}s`, 10, 70);

    //Vege
    if (gameState === 'END') {
        ctx.fillStyle = 'white';
        ctx.font = '100px Courier New';
        ctx.fillText('The end!', 20, 200);
    }
}

function onKeyDown(event) {
    if (event.key === 'ArrowLeft') {
        ship.dir = -1;
        pressedKey = 'ArrowLeft';
    }
    if (event.key === 'ArrowRight') {
        ship.dir = 1;
        pressedKey = 'ArrowRight';
    }
    if (event.key === 'x') {
        bullets.push({
            x: ship.x + ship.width / 2 - 2,
            y: ship.y - 10,
            width: 4,
            height: 10,
            speed: -500,
            alive: 1,
            color: 'yellow'
        })
    }
}

function onKeyUp(event) {
    if (event.key === pressedKey) {
        ship.dir = 0;
        pressedKey = '';
    }
}

function onStartClicked() {
    if (gameState === 'LOADPAGE') return;
    startbtn.innerHTML= "Új Játék";
    if (gameState === 'NOTYETSTARTED') {
        gameDiv.toggleAttribute('hidden');
    }

    if (easybtn.checked) {
        startNewGame(0);
    }
    if (mediumbtn.checked) {
        startNewGame(1);
    }
    if (hardbtn.checked) {
        startNewGame(2);
    }
    gameState = 'INGAME';

    startAnimation();
    setTimeout(setTimeNow, 3000);
    setTimeout(timePass, 3000);
    setTimeout(gameLoop, 3000);
}

function onPauseClicked() {
    if (gameState === 'LOADPAGE') return;
    if (gameState === 'INGAME') {
        pausebtn.innerHTML = "Vissza a játékhoz";
        gameState = 'PAUSED';
    } else if(gameState === 'PAUSED') {
        pausebtn.innerHTML = "Pause";
        gameState = 'INGAME';
        startAnimation();
        setTimeout(setTimeNow, 3000);
        setTimeout(gameLoop, 3000);
    }
}

function onSaveClicked() {
    if (gameState === 'LOADPAGE') return;
    if (ship.life === 0) return;
    gameState = 'PAUSED';
    var gameObj = {
        killPoint,
        enemyProb,
        bulletProb,
        ship,
        enemies,
        powerups,
        bullets,
        pressedKey,
        gameState,
        points,
        gameTime
    }
    var jsonObj = JSON.stringify(gameObj);

    location.replace('save_ss.php?data='+jsonObj);
}  

function onLoadClicked() {
    savesDiv.toggleAttribute("hidden");
    if (gameState === 'INGAME') {
        loadbtn.innerHTML = "Vissza a játékhoz";
        gameState = 'LOADPAGE';
        gameDiv.toggleAttribute("hidden");
    } else if(gameState === 'LOADPAGE') {
        gameDiv.toggleAttribute("hidden");
        loadbtn.innerHTML = "Betöltés";
        gameState = 'INGAME';
        startAnimation();
        setTimeout(setTimeNow, 3000);
        setTimeout(gameLoop, 3000);
    } else if (gameState === 'NOTYETSTARTED') {
        gameState = 'LOADPAGE';
    }
}

function onPageClicked(event) {
    if (gameState !== 'LOADPAGE') return;
    if (event.explicitOriginalTarget.nodeName != "CANVAS") {
        return;
    }
    loadNewGame(parseInt(event.explicitOriginalTarget.id));
}
//#endregion Function definitions

//#region Event listener
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);
document.addEventListener('click', onPageClicked);
startbtn.addEventListener('click', onStartClicked);
pausebtn.addEventListener('click', onPauseClicked);
savebtn.addEventListener('click', onSaveClicked);
loadbtn.addEventListener('click', onLoadClicked);
//#endregion Event listener

//#region Game loop
//#endregion Game loop

loadJSON();