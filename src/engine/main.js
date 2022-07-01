




function setup() {

    /* GAME PARAMETERS */
    // TODO make this a json?

    GAME_DEBUG = true;

    /* display parameters */
    SCREEN_X = window.innerWidth;
    SCREEN_Y = window.innerHeight;

    /* camera parameters */
    CAMERA_OFFSET = { x: 0, y: 0 };
    CAMERA_ZOOM = 1;
    CAMERA_ZOOM_SPEED = 0.001;
    CAMERA_MOVE_SPEED = 0.1;
    CAMERA_IN_MAX = 4;
    CAMERA_OUT_MAX = 0.05;

    /* world parameters */
    WORLD_SIZE = { x: 5000, y: 5000 };
    GLOBAL_TIME_FACTOR = 1;
    WORLD_GRID_SIZE = 10;




    /* GAME INITIALISATION */

    // birth p5.js
    createCanvas(SCREEN_X, SCREEN_Y);

    // create main classes
    camera = new Camera(CAMERA_OFFSET.x, CAMERA_OFFSET.y, SCREEN_X, SCREEN_Y, CAMERA_ZOOM, CAMERA_ZOOM_SPEED, CAMERA_MOVE_SPEED);
    world = new BasicWorld(WORLD_SIZE, WORLD_GRID_SIZE);
    display = new BasicDisplay(camera, CAMERA_OUT_MAX, CAMERA_IN_MAX);
    game = new Game(world, display);

    // set debug
    game.debug(GAME_DEBUG);

    // set globalTimeFactor
    world.setGlobalTimeFactor(GLOBAL_TIME_FACTOR);
}

function update() {
    game.tick();
}

function draw() {
    update();
    game.inputHandler();
    game.draw();
}