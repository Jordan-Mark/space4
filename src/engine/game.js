


class Game {
    /**
     * 
     * main game manager class. handles all game and player events.
     * 
     * 
     * @param {World} world 
     * @param {Display} display
     */

    db = false;

    constructor(world, display) {
        this.world = world;
        this.display = display;
    }

    tick() {
        this.world.tick();
    }

    draw() {

        // create a black background
        background(0);

        this.display.draw(this.world);

        if (this.db) {
            this.drawDebug();
        }

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

    drawDebug() {

        // write debug spaghetti code here 

        push();
        stroke(255);
        fill(255);
        noStroke();
        textFont('Georgia');
        text('camera.zoom :  ' + this.display.camera.zoom.toFixed(2), 25, 25);
        text('camera.offset :  ' + this.display.camera.xOffset.toFixed(0) + ' , ' + this.display.camera.yOffset.toFixed(0), 25, 40);
        text('FPS:  ' + frameRate().toFixed(0), 25, 55);
        pop();
        push();



    }
}