


class Game {
    /**
     * 
     * main game manager class. handles all game and player events.
     * "Input" of program
     * 
     * 
     * @param {World} world 
     * @param {Display} display
     */

    db = false;
    mouseWheelEvent = null;
    mouseWheelZoomFactor = 3;

    constructor(world, display) {
        this.world = world;
        this.display = display;
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

        // this.display.camera.report();

        this.display.updateCameraZoom(this.cameraZoomInput());
        this.display.updateCameraOffset(this.cameraOffsetInput());


    }


    debug(b = true) {
        this.db = b;
    }

}