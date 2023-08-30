var game;


function setup() {

    /* GLOBALS DECLARATION */
    // TODO make this a json?

    var GAME_DEBUG = true;

    /* display parameters */
    var SCREEN_X = document.getElementById('sketchContainer').clientWidth; //window.innerWidth;
    var SCREEN_Y = document.getElementById('sketchContainer').clientHeight; //window.innerHeight;

    /* world parameters */
    var WORLD_SIZE = { x: 5000, y: 5000 };
    var WORLD_GRID_DIV = 100;

    /* factions */
    var N_FACTIONS = 5;

    /* simulation speed */
    var GLOBAL_TIME_FACTOR = 1;

    /* camera parameters */
    var CAMERA_OFFSET = { x: WORLD_SIZE.x/2, y: WORLD_SIZE.y/2 };
    var CAMERA_ZOOM = 0.2;
    var CAMERA_ZOOM_SPEED = 0.001;
    var CAMERA_MOVE_SPEED = 0.1;
    var CAMERA_IN_MAX = 4;
    var CAMERA_OUT_MAX = 0.05;




    /* GAME INITIALISATION */

    // birth p5.js
    var canvas = createCanvas(SCREEN_X, SCREEN_Y);
    canvas.parent('sketchContainer'); // assign sketch to html div #sketchContainer


    // create world
    let worldGenerator = new BasicWorldGenerator();
    worldGenerator.create(WORLD_SIZE, WORLD_GRID_DIV);
    worldGenerator.createFactions(N_FACTIONS);
    worldGenerator.createStars();
    worldGenerator.connectStars();
    var world = worldGenerator.export();

    // create display
    var camera = new Camera(CAMERA_OFFSET.x, CAMERA_OFFSET.y, SCREEN_X, SCREEN_Y, CAMERA_ZOOM, CAMERA_ZOOM_SPEED, CAMERA_MOVE_SPEED);
    var display = new IntermediateDisplay(camera, CAMERA_OUT_MAX, CAMERA_IN_MAX, document.getElementById('paragraphDisplay'));

    // init game
    game = new Game(world, display);

    // set debug
    game.debug(GAME_DEBUG);

    // set globalTimeFactor
    world.setGlobalTimeFactor(GLOBAL_TIME_FACTOR);

}

/* debug function */
function testPathing() {
    var world = game.world;

    // unhighlight all stars
    for (var starID of world.getStars()){
        world.get(starID).unHighlight()
    }

    // unhighlight all stars
    for (var connectionID of world.getConnections()){
        world.get(connectionID).unHighlight()
    }


    var s1 = world.stars[Math.floor(random(world.getStarCount()))];
    var s2 = world.stars[Math.floor(random(world.getStarCount()))];
    var p = game.world.get(s1).djikstra(s2);
    p.highlight();

}

function mouseWheel(event) {
    game.mouseWheelHandler(event);
}

function update() {
    game.tick();
}
function keyPressed(){
    game.keyPressedHandler(keyCode);
    return false // prevent any default browser behaviour
}

function keyReleased(){
    game.keyReleasedHandler(keyCode);
    return false // prevent any default broswer behaviour
}


function draw() {
    update();
    game.inputHandler();
    game.draw();
}