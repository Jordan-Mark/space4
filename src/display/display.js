

class Display {
    /**
     * class handles all drawing, interprets "world" object
     * also interfaces between the game and camera
     * 
     */

    constructor(camera){
        this.camera = camera;
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

    constructor(pos, size, colour, z){
        super(z);
        this.pos = pos; // screen position only
        this.size = size;
        this.colour = colour;
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



class BasicDisplay extends Display {

    logTimeout = 0; // attribute used for debugging

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
        this.drawDebugUnderlay(world);

        // main entity draw loop
        super.draw(world);
        for (var ent of world.getEntities()) {
            ent.draw(this);
        }

        // draw star connections 
        this.drawConnections(world);

        this.drawQueue();
        this.resetQueue();

        // debug (2/2)
        this.drawDebugOverlay(world);

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

    
        // DEBUG check if z=1 requests are successfully being added (they are, here at least)
        /*
        if (this.logTimeout < 30 && z===1){
            console.log('z submitted:', z);
            console.log('queue()', JSON.parse(JSON.stringify(this.requestQueue)));
            this.logTimeout++;      
        }
        */

        
    }

    drawDiamond(pos /*screen*/, size, colour, z=0){
        this.queue(new DiamondDrawRequest(pos, size, colour, z));
    }

    drawLine(pos1, pos2, weight, colour, z = 0) {
        this.queue(new LineDrawRequest(pos1, pos2, weight, colour, z));
    }

    /*draw a batch of unscaled diamonds*/
    drawDiamonds (requests) {

        push();
        noStroke();

        if (requests.length > 0){
            beginShape(QUADS);

            for (var i = 0; i < requests.length; i++){

                var req = requests[i];
                fill(req.colour.r, req.colour.g, req.colour.b);

                vertex(req.pos.x, req.pos.y-req.size);
                vertex(req.pos.x-req.size, req.pos.y);
                vertex(req.pos.x, req.pos.y+req.size);
                vertex(req.pos.x+req.size, req.pos.y);

            }

            endShape(CLOSE);
        }

        pop();
    }

    /*draw a batch of lines*/
    drawLines(requests) {

        push()



        if (requests.length > 0) {

            beginShape(LINES);

            for (var i = 0; i < requests.length; i++) {

                var req = requests[i];
                stroke(req.colour.r, req.colour.g, req.colour.b);
                strokeWeight(req.weight);


                vertex(req.pos1.x, req.pos1.y);
                vertex(req.pos2.x, req.pos2.y);

            }

            endShape();
        }

        pop();
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

    drawConnections(world) {

        var fin = []; // drawn stars

        let c = this.camera;
        for (var starID of world.getStars()) {

            var star = world.get(starID);
            fin.push(starID);

            for (var conID of star.getConnections()) {

                // check for doubles
                if (!(fin.includes(conID))) {
                    var con = world.get(conID);

                    // frustrum cull stars
                    if (c.inBounds(star.getPos()) || c.inBounds(con.getPos())) {

                        const s1 = c.w2s({ x: star.pos.x, y: star.pos.y });
                        const s2 = c.w2s({ x: con.pos.x, y: con.pos.y });

                        this.drawLine(s1, s2, 1, { r: 70, g: 70, b: 70 }, 1);

                    }
                }
            }
        }
    }




        /*
        // debug connections
        for (var starID of world.getStars()) {
            var star = world.get(starID);
            for (var conID of star.getConnections()) {
                //if (!(drawn.includes(conID))) {
                    var con = world.get(conID);
                    const s1 = c.w2s({ x: star.pos.x, y: star.pos.y });
                    const s2 = c.w2s({ x: con.pos.x, y: con.pos.y });
                    this.drawLine(s1, s2, 1, { r: 70, g: 70, b: 70 }, 1);
                 //   drawn.push(starID);
                //}
                //else {
                //    excluded++;
                //}
            }
        }
        //console.log('stars drawn', drawn.length);
        //console.log('potential connections excluded', excluded);
        */


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


        // draw grid mouse search patters
        var r = 150;
        push();
        fill(0, 0, 0, 0);
        strokeWeight(1);
        var grids = world.grid.getGridsInR(world_mouse, r);

        // draw grid
        for (var grid of grids) {
            let worldx = grid.x * world.grid.cell_size;
            let worldy = grid.y * world.grid.cell_size;
            let screenp = c.w2s({ x: worldx, y: worldy });

            stroke(75);
            rectMode(CORNERS);
            rect(screenp.x, screenp.y, screenp.x + world.grid.cell_size * c.zoom, screenp.y + world.grid.cell_size * c.zoom);

        }

        // draw mouse radius
        stroke(255);
        let d = r * 2
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