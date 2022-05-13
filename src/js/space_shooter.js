//variables
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var canvas_height = canvas.height;
var canvas_width = canvas.width;

var ship = 
{
    x: (canvas_width - 20) / 2,
    y: canvas_height - 20,
    width: 20,
    height: 20
};

//function definitions
function gameLoop() {
    draw();
    window.requestAnimationFrame(gameLoop);
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'rgb(200, 0, 0)';
    ctx.fillRect(ship.x, ship.y, ship.width, ship.height);
}

//Event listener

//Game loop
gameLoop();
