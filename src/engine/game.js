


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

        // create a black background
        background(0);

        
        if (this.db) {
            this.drawDebugUnderlay();
        }

        this.display.draw(this.world);

        if (this.db) {
            this.drawDebugOverlay();
        }

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

    drawDebugUnderlay() {

        let c = this.display.camera;

        // draw max world bounds
        push();
        fill(10);
        stroke(100);
        let p1 = c.w2s({ x: 0, y: 0 });
        let p2 = c.w2s({ x: this.world.size.x, y: this.world.size.y });
        rectMode(CORNERS);
        rect(p1.x, p1.y, p2.x, p2.y);
        pop();

    }

    drawDebugOverlay() {

        // write debug spaghetti code here 
        let c = this.display.camera;


        // get current grid
        let world_mouse = c.s2w({ x: mouseX, y: mouseY });
        let grid_pos = this.world.grid.getCell(world_mouse);

        // debug connections
        for (var starID of this.world.getStars()) {
            var star = this.world.get(starID);
            for (var conID of star.getConnections()) {
                var con = this.world.get(conID);
                const s1 = c.w2s({ x: star.pos.x, y: star.pos.y });
                const s2 = c.w2s({ x: con.pos.x, y: con.pos.y });
                this.display.drawLine(s1, s2, 1, { r: 70, g: 70, b: 70 }, 1);
            }
        }


        // draw grid mouse search patters
        var r = 150;
        push();
        fill(0, 0, 0, 0);
        strokeWeight(1);
        var grids = this.world.grid.getGridsInR(world_mouse, r);

        // draw grid
        for (var grid of grids) {
            let worldx = grid.x * this.world.grid.cell_size;
            let worldy = grid.y * this.world.grid.cell_size;
            let screenp = c.w2s({ x: worldx, y: worldy });

            stroke(75);
            rectMode(CORNERS);
            rect(screenp.x, screenp.y, screenp.x + this.world.grid.cell_size*c.zoom, screenp.y + this.world.grid.cell_size*c.zoom);

        }

        // draw mouse radius
        stroke(255);
        let d = r*2
        ellipse(mouseX, mouseY, d * this.display.camera.zoom);


        pop();

        // debug text in top left of screen 
        push();
        stroke(255);
        fill(255);
        noStroke();
        textFont('Georgia');
        text('camera.zoom :  ' + this.display.camera.zoom.toFixed(2), 25, 25);
        text('camera.offset :  ' + this.display.camera.xOffset.toFixed(0) + ' , ' + this.display.camera.yOffset.toFixed(0), 25, 40);
        text('FPS:  ' + frameRate().toFixed(0), 25, 55);
        text('screen mouse : ' + mouseX.toString() + ' , ' + mouseY.toString(), 25, 70);
        text('world mouse : ' + world_mouse.x.toFixed(1) + ' , ' + world_mouse.y.toFixed(1), 25, 85);
        text('mouse grid : ' + grid_pos.x.toString() + ' , ' + grid_pos.y.toString(), 25, 100);
        pop();
        push();



    }
}