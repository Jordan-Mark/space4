
// declaration
var world;
var display;
var game;


function setup() {

    // birth p5.js
    createCanvas(SCREEN_X, SCREEN_Y);

    // create main classes
    camera = new Camera();
    world = new World();
    display = new Display(camera);
    game = new Game(world, display);

    // SIMULATION PARAMETERS
}


function update() {
    game.tick();
}

function draw() {
    update();
    game.draw();
}