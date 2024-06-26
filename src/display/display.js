

class Display {
    /**
     * class handles all drawing, interprets "world" object
     * also interfaces between the game and camera
     * 
     */

    constructor(camera){
        this.camera = camera;
    }

    getCamera() {
        return this.camera;
    }

    draw(world, debug=false){

    }
}


class DrawRequest {

    constructor (z = 0){
        this.z = z;
    }

}

class DiamondDrawRequest extends DrawRequest {

    constructor(pos, size, colour, z, weight, strokeColour){
        super(z);
        this.pos = pos; // screen position only
        this.size = size;
        this.colour = colour;
        this.weight = weight;
        this.strokeColour = strokeColour;
    }
}

class TriangleDrawRequest extends DrawRequest {

    constructor(c1, c2, c3, colour, weight, strokeColour, z) {
        super(z);
        this.c1 = c1;
        this.c2 = c2;
        this.c3 = c3;
        this.colour = colour;
        this.weight = weight;
        this.strokeColour = strokeColour;
        this.z = z;
    }

}

class LineDrawRequest extends DrawRequest {

    constructor(pos1, pos2, weight, colour, z) {
        super(z);
        this.pos1 = pos1;
        this.pos2 = pos2;
        this.weight = weight;
        this.colour = colour;
    }
}

class TextDrawRequest extends DrawRequest {

    constructor(pos, text, colour, size, z, align=CENTER) {
        super(z);
        this.pos=pos;
        this.text=text;
        this.size=size;
        this.colour=colour;
        this.align=align;
    }
}


class BasicDisplay extends Display {

    logTimeout = 0; // attr used for db

    requestQueue = {}; // should contain a list of all requests categorised by Z level

    constructor(camera, outMax, inMax) {

        super(camera);
        this.cameraOutMax = outMax;
        this.cameraInMax = inMax;


    }

    draw(world, debug = false) {

        // create a black background
        background(0);

        // debug (1/2)
        if (debug){
            this.drawDebugUnderlay(world);
        }


        // main entity draw loop
        super.draw(world);
        for (var ent of world.getEntities()) {
            // ideally these entities are adding requests to the drawQueue
            ent.draw(this);
        }

        // draw queue
        this.drawQueue();
        this.resetQueue();

        // debug (2/2)
        if (debug){
            this.drawDebugOverlay(world);
        }
    }

    resetQueue () {
        this.requestQueue = {};
    }

    /* TODO: currently does Z order by alphanumeric sort, need to make numeric sort */
    drawQueue() {

        for (var z in this.requestQueue) {

            var z_requests = this.requestQueue[z];
            var structured_requests = {};

            // create structured list of requests per z level
            for (var request of z_requests){
                var name = request.constructor.name;

                structured_requests[name] === undefined ? structured_requests[name] = [request] : structured_requests[name].push(request); // add to that type-list if exists, else create new category.
            }

            // render requests
            for (var request_type of Object.keys(structured_requests)){
                if (request_type == "DiamondDrawRequest") {
                    this.drawDiamonds(structured_requests[request_type]);
                }
                else if (request_type == "LineDrawRequest") {
                    this.drawLines(structured_requests[request_type]);
                }
                else if (request_type == "TextDrawRequest"){
                    this.drawTexts(structured_requests[request_type])
                }

                else if (request_type == "TriangleDrawRequest") {
                    this.drawTriangles(structured_requests[request_type])
                }
                else {
                    throw "unknown draw request";
                }
            }
        }
    }

    queue(request) {
        let z = request.z;

        // create a new z list if not already present
        if (this.requestQueue[z] === undefined){
            this.requestQueue[z] = [];
        }
        this.requestQueue[z].push(request);

    
        // DEBUG check if z=3 requests are successfully being added (they are, here at least)

        if (this.logTimeout < 30 && z === 4) {
            console.log('z submitted:', z);
            console.log('queue()', JSON.parse(JSON.stringify(this.requestQueue)));
            this.logTimeout++;
        }
        

        
    }

    drawDiamond(pos /*screen*/, size, colour, z=0, weight=0, strokeColour={r:255, g:255, b:255}){
        this.queue(new DiamondDrawRequest(pos, size, colour, z, weight, strokeColour));
    }

    drawLine(pos1, pos2, weight, colour, z=0) {
        this.queue(new LineDrawRequest(pos1, pos2, weight, colour, z));
    }

    drawText(pos, text, colour, size, z=0, align=CENTER){
        this.queue(new TextDrawRequest(pos, text, colour, size, z, align));
    }

    drawTriangle(c1, c2, c3, colour, weight, strokeColour, z=0) {
        this.queue(new TriangleDrawRequest(c1, c2, c3, colour, weight, strokeColour, z));
    }

    /*draw a batch of unscaled diamonds*/
    drawDiamonds (requests) {

        push();
        

        if (requests.length > 0){

            beginShape(QUADS);
            var previous_weight = null;

            for (var i = 0; i < requests.length; i++){

                var req = requests[i];
                
                // p5 cannot handle strokeweight changes mid shape
                if (previous_weight != req.weight || previous_weight != null){
                    endShape();
                    strokeWeight(req.weight);
                    beginShape(QUADS);
                }

                fill(req.colour.r, req.colour.g, req.colour.b);
                stroke(req.strokeColour.r, req.strokeColour.g, req.strokeColour.b);

                vertex(req.pos.x, req.pos.y-req.size);
                vertex(req.pos.x-req.size, req.pos.y);
                vertex(req.pos.x, req.pos.y+req.size);
                vertex(req.pos.x+req.size, req.pos.y);

                previous_weight = req.weight;

            }

            endShape();
        }

        pop();
    }

    /*draw a batch of unscaled triangles*/
    drawTriangles(requests) { 

        push();
        if (requests.length > 0) {

            beginShape(TRIANGLES);
            var previous_weight = null;

            for (var i = 0; i < requests.length; i++) {

                var req = requests[i];

                // p5 cannot handle strokeweight changes mid shape
                if (previous_weight != req.weight || previous_weight != null) {
                    endShape();
                    strokeWeight(req.weight);
                    beginShape(TRIANGLES);
                }

                fill(req.colour.r, req.colour.g, req.colour.b);
                stroke(req.strokeColour.r, req.strokeColour.g, req.strokeColour.b);

                vertex(req.c1.x, req.c1.y);
                vertex(req.c2.x, req.c2.y);
                vertex(req.c3.x, req.c3.y);

                previous_weight = req.weight;
            } 
            endShape();
        }
        pop();
    }


    /*draw a batch of lines*/
    drawLines(requests) {

        push()

        if (requests.length > 0) {

            beginShape(LINES);
            var previous_weight = null;

            for (var i = 0; i < requests.length; i++) {

                var req = requests[i];

                // p5 cannot handle strokeweight changes mid shape
                if (previous_weight != req.weight){
                    endShape();
                    stroke(req.weight);
                    beginShape(LINES)
                }

                stroke(req.colour.r, req.colour.g, req.colour.b);

                vertex(req.pos1.x, req.pos1.y);
                vertex(req.pos2.x, req.pos2.y);

                previous_weight = req.weight;

            }

            endShape();
        }

        pop();
    }

    /* draw texts */
    drawTexts(requests){

        if (requests.length > 0) {
            push();
            for (var i = 0; i < requests.length; i++) {
                var req = requests[i];
                textAlign(req.align);
                textSize(req.size);
                strokeWeight(req.weight);
                fill(req.colour.r, req.colour.g, req.colour.b, req.colour.a);
                text(req.text, req.pos.x, req.pos.y);
            }
            pop();
        }
    }



    updateCameraZoom(zoomDelta) {

        //console.log(this.camera.zoom, 1);
        this.camera.zoom += this.camera.zoomSpeed * deltaTime * zoomDelta * this.camera.zoom;
        //console.log(this.camera.zoom, 2);
        this.camera.zoom = constrain(this.camera.zoom, this.cameraOutMax, this.cameraInMax);
        //console.log(this.camera.zoom, 3);

    }

    updateCameraOffset(offsetDelta) {

        var moveSpeed = this.camera.moveSpeed * (1 / this.camera.zoom);
        this.camera.xOffset += moveSpeed * deltaTime * offsetDelta.x;
        this.camera.yOffset += moveSpeed * deltaTime * offsetDelta.y;
    }

    drawDebugUnderlay(world) {

        let c = this.camera;

        // draw max world bounds
        push();
        fill(10);
        stroke(100);
        let p1 = c.w2s({ x: 0, y: 0 });
        let p2 = c.w2s({ x: world.size.x, y: world.size.y });
        rectMode(CORNERS);
        rect(p1.x, p1.y, p2.x, p2.y);
        pop();

        
    }

    drawDebugOverlay(world) {


        // write debug spaghetti code here 
        let c = this.camera;


        // get current grid
        let world_mouse = c.s2w({ x: mouseX, y: mouseY });
        let grid_pos = world.grid.getCell(world_mouse);


        /*
        // draw mouse radius
        stroke(255);
        let d = r * 2
        ellipse(mouseX, mouseY, d * this.camera.zoom);
        pop();
        */



        // draw grid mouse search patters
        var r = game.world.nearbyStarHighlightManager.WORLD_SEARCH_RADIUS;
        push();
        fill(0, 0, 0, 0);
        strokeWeight(1);
        var grids = world.grid.getGridsInR(world_mouse, r);
        
        
        // draw grid
        for (var grid of grids) {
            let worldx = grid.x * world.grid.cell_size;
            let worldy = grid.y * world.grid.cell_size;
            let screenp = c.w2s({ x: worldx, y: worldy });

            stroke(0, 100, 0, 100);
            rectMode(CORNERS);
            rect(screenp.x, screenp.y, screenp.x + world.grid.cell_size * c.zoom, screenp.y + world.grid.cell_size * c.zoom);

        }

        // draw a debug radius for star searching

        push();
        stroke(255);
        fill(0,0,0,0)
        var d = game.world.nearbyStarHighlightManager.WORLD_SEARCH_RADIUS*2;
        ellipse(mouseX, mouseY, d * this.camera.zoom);
        pop();

        



        // debug text in top left of screen 
        push();
        stroke(255);
        fill(255);
        noStroke();
        textFont('Georgia');
        text('camera.zoom :  ' + this.camera.zoom.toFixed(2), 25, 25);
        text('camera.offset :  ' + this.camera.xOffset.toFixed(0) + ' , ' + this.camera.yOffset.toFixed(0), 25, 40);
        text('FPS:  ' + frameRate().toFixed(0), 25, 55);
        text('screen mouse : ' + mouseX.toString() + ' , ' + mouseY.toString(), 25, 70);
        text('world mouse : ' + world_mouse.x.toFixed(1) + ' , ' + world_mouse.y.toFixed(1), 25, 85);
        text('mouse grid : ' + grid_pos.x.toString() + ' , ' + grid_pos.y.toString(), 25, 100);
        pop();
        push();



    }

}
