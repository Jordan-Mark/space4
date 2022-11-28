

class Display {
    /**
     * class handles all drawing, interprets "world" object
     * 
     */

    constructor(camera){
        this.camera = camera;
    }

    draw(world){

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


    requestQueue = {};

    constructor(camera, outMax, inMax) {

        super(camera);
        this.cameraOutMax = outMax;
        this.cameraInMax = inMax;

    }

    draw(world) {

        this.resetQueue();
        super.draw(world);

        for (var ent of world.getEntities()) {
            ent.draw(this);
        }

        this.drawQueue(this.requestQueue);

    }

    resetQueue () {
        this.requestQueue = {};
    }

    drawQueue(requests) {

        console.log(requests);
        console.log(Object.keys(requests));
        console.log(requests[1]);

        for (var z of Object.keys(requests)) {

            var z_requests = requests[z];
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

        if (this.requestQueue[z] === undefined){
            this.requestQueue[z] = [];
        }
        this.requestQueue[z].push(request);

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

}