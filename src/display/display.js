

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

    // abstract class

    constructor (z = 0){
        this.z = z;
    }

}

class DiamondDrawRequest extends DrawRequest {

    constructor(screenPos, size, colour, z){
        super(z);
        this.screenPos = screenPos;
        this.size = size;
        this.colour = colour;
    }
}



class BasicDisplay extends Display {


    requestQueue = [];

    constructor(camera, outMax, inMax) {

        super(camera);
        this.cameraOutMax = outMax;
        this.cameraInMax = inMax;

    }

    draw(world) {

        this.requestQueue = [];

        super.draw(world);

        for (var ent of world.getEntities()) {
            ent.draw(this);
        }

        this.drawQueue(this.requestQueue);

    }

    drawQueue(requests){

        // arrange queue

        for (var i = 0; i < requests.length; i++){
            // draw item
        }

    }

    queueDiamond(screenPos, size, colour){

    }

    drawDiamonds () {
        // actual drawing will occour in this function
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