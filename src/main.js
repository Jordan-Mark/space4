

var world;
var display;
var game;


function setup() {
    createCanvas(SCREEN_X, SCREEN_Y);
    world = new World();
    display = new Display();
    game = new Game(world, display);

}


function update() {
    game.tick();
}

function draw() {
    update();
    game.draw();
}