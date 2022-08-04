

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


        for (var i=0; i<requests.length; i++){
            let ar = Object.keys(this.requestQueue)[i].split('-')
            let name = ar[0];
            let z = ar[1];
            // i stopped coding here because im sleepy
        }


        var diamondDrawRequests = [];

        // order lists
        for (var i = 0; i < requests.length; i++){

            if (requests[i] instanceof DiamondDrawRequest){
                diamondDrawRequests.push(requests[i]);
            }
        }

        // execute lists
        this.drawDiamonds(diamondDrawRequests);

    }

    queue(request){

        let z = request.z;
        let name = request.constructor.name;

        let key = name + '-' + z.toString();

        if (this.requestQueue[key] === undefined){
            this.requestQueue[key] = [];
        }
        this.requestQueue.push(request);

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