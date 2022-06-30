




function setup() {

    /* GAME PARAMETERS */

    GAME_DEBUG = true;

    /* display parameters */
    SCREEN_X = window.innerWidth;
    SCREEN_Y = window.innerHeight;

    /* camera parameters */
    CAMERA_OFFSET = { x: 0, y: 0 };
    CAMERA_ZOOM = 1;
    CAMERA_ZOOM_SPEED = 0.001;
    CAMERA_MOVE_SPEED = 0.1;

    /* world parameters */
    GLOBAL_TIME_FACTOR = 1;
    WORLD_GRID_SIZE = 10;




    /* GAME INITIALISATION */

    // birth p5.js
    createCanvas(SCREEN_X, SCREEN_Y);

    // create main classes
    camera = new Camera(CAMERA_OFFSET.x, CAMERA_OFFSET.y, SCREEN_X, SCREEN_Y, CAMERA_ZOOM, CAMERA_ZOOM_SPEED, CAMERA_MOVE_SPEED);
    world = new BasicWorld(WORLD_GRID_SIZE);
    display = new Display(camera);
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
    game.draw();
}