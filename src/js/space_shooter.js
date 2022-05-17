//#region Variables
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var canvas_height = canvas.height;
var canvas_width = canvas.width;

var ship = 
{
    width: 40,
    height: 40,
    x: (canvas_width - 40) / 2,
    y: canvas_height - 40,
    speed: 600,
    dir: 0,
};

var enemies = [];

var powerups = [];

var lastTime = performance.now();

var pressedKey = '';

var gameState = 'INGAME' // END, PAUSED

var points = 0;

var images = {
    bg: new Image(),
    ship: new Image(),
    enemie: new Image(),
    explosion: new Image()
}
images.bg.src = '../media/bg.png';
images.ship.src = '../media/ship.png';
images.enemie.src = '../media/enemie_r.png';
images.explosion.src = '../media/explosion.png';

//#endregion Variables

//#region Function definitions
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
    if (Math.random() < 0.005) {
        enemies.push({
            x: generateRandom(0, canvas_width),
            y: 0,
            width: 50,
            height: 50,
            vx: generateRandom(-20, 20),
            vy: generateRandom(50, 120),
        })
    }

    enemies.forEach(enemie => {
        enemie.x += enemie.vx * dt;
        enemie.y += enemie.vy * dt;
        if (isCollision(ship, enemie)) {
            gameState = 'END'
        }
    })

    //delete enemie
    var oldLength =  enemies.length;
    enemies = enemies.filter(enemie => enemie.y <= canvas_height);
    enemies = enemies.filter(enemie => enemie.x <= canvas_width);
    points += oldLength - enemies.length;
    console.log(points);
    //powerup
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
    enemies.forEach(enemie => {
        ctx.drawImage(images.enemie, enemie.x, enemie.y, enemie.width, enemie.height);
    });

    //powerup-ok
    ctx.fillStyle = 'rgb(0, 0, 200)';

    //points
    ctx.fillStyle = 'white';
    ctx.font = '10px Courier New';
    ctx.fillText(`Points: ${points}`, 10, 10);

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
}

function onKeyUp(event) {
    if (event.key === pressedKey) {
        ship.dir = 0;
        pressedKey = '';
    }
}
//#endregion Function definitions

//#region Event listener
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);
//#endregion Event listener

//#region Game loop
gameLoop();
//#endregion Game loop
