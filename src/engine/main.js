
var game;



function setup() {

    /* GAME PARAMETERS */
    // TODO make this a json?

    GAME_DEBUG = true;

    /* display parameters */
    SCREEN_X = window.innerWidth;
    SCREEN_Y = window.innerHeight;

    /* world parameters */
    WORLD_SIZE = { x: 5000, y: 5000 };
    WORLD_GRID_DIV = 100;

    /* factions */
    N_FACTIONS = 5;

    /* simulation speed */
    GLOBAL_TIME_FACTOR = 1;

    /* camera parameters */
    CAMERA_OFFSET = { x: WORLD_SIZE.x/2, y: WORLD_SIZE.y/2 };
    CAMERA_ZOOM = 0.2;
    CAMERA_ZOOM_SPEED = 0.001;
    CAMERA_MOVE_SPEED = 0.1;
    CAMERA_IN_MAX = 4;
    CAMERA_OUT_MAX = 0.05;




    /* GAME INITIALISATION */

    // birth p5.js
    createCanvas(SCREEN_X, SCREEN_Y);

    // create world
    let worldGenerator = new BasicWorldGenerator();
    worldGenerator.create(WORLD_SIZE, WORLD_GRID_DIV);
    worldGenerator.createFactions(N_FACTIONS);
    worldGenerator.createStars();
    world = worldGenerator.export();

    // create display
    camera = new Camera(CAMERA_OFFSET.x, CAMERA_OFFSET.y, SCREEN_X, SCREEN_Y, CAMERA_ZOOM, CAMERA_ZOOM_SPEED, CAMERA_MOVE_SPEED);
    display = new BasicDisplay(camera, CAMERA_OUT_MAX, CAMERA_IN_MAX);

    // init game
    game = new Game(world, display);

    // set debug
    game.debug(GAME_DEBUG);

    // set globalTimeFactor
    world.setGlobalTimeFactor(GLOBAL_TIME_FACTOR);
}

function mouseWheel(event) {
    game.mouseWheelHandler(event);
}


function update() {
    game.tick();
}

function draw() {
    update();
    game.inputHandler();
    game.draw();
}