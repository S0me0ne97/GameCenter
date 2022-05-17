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
    life: 3
};

var enemies = [];

var powerups = [];

var bullets = [];

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
            alive: 1
        })
    }

    enemies.forEach(enemie => {
        enemie.x += enemie.vx * dt;
        enemie.y += enemie.vy * dt;
        if (enemie.y < 0 || enemie.y > canvas_height) {
            enemie.alive = 0
        }
        if (Math.random() < 0.005) {
            bullets.push({
                x: enemie.x + enemie.width / 2 - 2,
                y: enemie.y + 10,
                width: 4,
                height: 10,
                speed: 500,
                alive: 1,
                color: 'red'
            })
        }
        if (isCollision(ship, enemie)) {
            ship.life = 0;
        }
    })

    //lövedékek
    bullets.forEach(bullet => {
        bullet.y += bullet.speed * dt;
        if (bullet.y < 0 || bullet.y > canvas_height) {
            bullet.alive = 0
        }
        if (bullet.color === 'yellow') {
            enemies.forEach(enemie => {
                if (isCollision(enemie, bullet)) {
                    enemie.alive = 0;
                    bullet.alive = 0;
                    points += 20;
                }
            })
        }
        else 
        {
            if(isCollision(ship, bullet))
            {
                bullet.alive = 0;
                --ship.life;
            }
        }
    })

    //delete bullets
    bullets = bullets.filter(bullet => bullet.alive === 1);
    //delete enemie
    var oldLength =  enemies.length;
    enemies = enemies.filter(enemie => enemie.alive === 1);
    points += oldLength - enemies.length;


    if (ship.life === 0) {
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
    enemies.forEach(enemie => {
        ctx.drawImage(images.enemie, enemie.x, enemie.y, enemie.width, enemie.height);
    });

    //lövedékek
    bullets.forEach(bullet => {
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    })

    //data
    ctx.fillStyle = 'white';
    ctx.font = '10px Courier New';
    ctx.fillText(`Points: ${points}`, 10, 10);
    ctx.fillText(`Life: ${ship.life}`, 10, 30);

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
    if (event.key === ' ') {
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
//#endregion Function definitions

//#region Event listener
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);
//#endregion Event listener

//#region Game loop
gameLoop();
//#endregion Game loop
