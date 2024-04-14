


class Game {
    /**
     * 
     * main game manager class. handles all game and player events.
     * "Input" of program
     * 
     * 
     * @param {World} world 
     * @param {Display} display
     * @param {ParagraphManager} paragraphManager
     * 
     * 
     */

    // debug
    db = false;

    // mouse wheel vars
    mouseWheelEvent = null;
    mouseWheelZoomFactor = 3;

    constructor(world, display, paragraphManager) {
        this.world = world;
        this.display = display;
        this.paragraphManager = paragraphManager;
    }

    /*test function to add and draw a ship*/
    addShip(faction = this.getWorld().getFactions()[0], star = this.getWorld().getStars()[0], speed = 20 /*type?*/) {
        var ship = new Ship(faction, star, speed);
        var world = this.getWorld();
        console.log(star);
        console.log(faction);
        console.log(world.get(faction));
        world.addShip(ship);
        world.get(faction).addShip(ship.getID());
        world.get(star).addShip(ship.getID());
    }
 

    getParagraph(){
        return this.paragraphManager;
    }

    getWorld(){
        return this.world;
    }

    getDisplay(){
        return this.display;
    }

    tick() {
        this.world.tick();
    }

    draw() {
        this.display.draw(this.world, this.db);
    }

    mouseWheelHandler(event) {
        this.mouseWheelEvent = event;
    }

    cameraZoomInput() {

        var zoomDelta = 0;

        // zoom out
        if (keyIsDown(189)) {
            zoomDelta += -1;
        }

        // zoom in
        if (keyIsDown(16) && keyIsDown(187)) {
            zoomDelta += +1;
        }

        /* check for mousewheel */
        if (this.mouseWheelEvent) {
            zoomDelta = Math.sign(this.mouseWheelEvent.delta) * this.mouseWheelZoomFactor;
            this.mouseWheelEvent = null;
        }

        return zoomDelta;

    }

    cameraOffsetInput() {

        var offsetDelta = { x: 0, y: 0 };

        if (keyIsDown(87)) {
            offsetDelta.y -= 1;
        }
        if (keyIsDown(65)) {
            offsetDelta.x -= 1;
        }
        if (keyIsDown(83)) {
            offsetDelta.y += 1;
        }
        if (keyIsDown(68)) {
            offsetDelta.x += 1;
        }

        return offsetDelta;

    }

    inputHandler() {

        /* update camera zoom and offset based on key input */
        this.display.updateCameraZoom(this.cameraZoomInput());
        this.display.updateCameraOffset(this.cameraOffsetInput());
        // this.display.camera.report();

        /* set game attribute for "highlight" */



    }

    keyPressedHandler(kc /*key code*/){

        if (kc==72) { // 72 = 'h'
            this.world.highlightNearbyStar();
        }
    }

    keyReleasedHandler(kc /*key code*/){

        if (kc==72) { // 72 = 'h'
            this.world.unHighlightNearbyStar();
        }
    }


    debug(b) {
        this.db = b;
    }

}
