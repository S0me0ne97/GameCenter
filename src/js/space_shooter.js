//#region Variables
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var canvas_height = canvas.height;
var canvas_width = canvas.width;

var ship = 
{
    x: (canvas_width - 20) / 2,
    y: canvas_height - 20,
    width: 20,
    height: 20,
    speed: 400,
    dir: 0,
};

var lastTime = performance.now();

var pressedKey = '';

//#endregion Variables

//#region Function definitions
function gameLoop(now = performance.now()) {
    const dt = (now - lastTime) / 1000;
    lastTime = now;
    
    update(dt);
    draw();

    window.requestAnimationFrame(gameLoop);
}

function update(dt) {
    ship.x += ship.dir * ship.speed * dt
    
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'rgb(200, 0, 0)';
    ctx.fillRect(ship.x, ship.y, ship.width, ship.height);
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
