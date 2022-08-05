

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

    drawQueue(requests){


        for (var z of Object.keys(this.requestQueue)){
            var z_requests = this.requestQueue[z];
            var structured_requests = {};

            // create structured list of requests per z level
            for (var request of z_requests){
                var name = request.constructor.name;
                structured_requests[name] === undefined ? structured_requests[name] = [request] : structured_requests[name].push(request);
            }

            // render requests
            for (var request_type of Object.keys(structured_requests)){
                if (request_type == "DiamondDrawRequest"){
                    this.drawDiamonds(structured_requests[request_type]);
                }
                else {
                    throw "unknown draw request";
                }
            }
        }
    }

    queue(request){

        let z = request.z;
        let key = z;

        if (this.requestQueue[key] === undefined){
            this.requestQueue[key] = [];
        }
        this.requestQueue[key].push(request);

    }

    drawDiamond(pos /*screen*/, size, colour, z=0){
        this.queue(new DiamondDrawRequest(pos, size, colour, z));
    }


    drawDiamonds (requests) {
        // draw a batch of unscaled diamonds

        push();
        noStroke();

        if (requests.length > 0){
            beginShape(QUADS);
        }

            for (var i = 0; i < requests.length; i++){

                var req = requests[i];
                fill(req.colour.r, req.colour.g, req.colour.b);

                vertex(req.pos.x, req.pos.y-req.size);
                vertex(req.pos.x-req.size, req.pos.y);
                vertex(req.pos.x, req.pos.y+req.size);
                vertex(req.pos.x+req.size, req.pos.y);

            }

        if (requests.length > 0){
            endShape(CLOSE);
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

}