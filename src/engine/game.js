


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

        if (this.debug) {
            this.drawDebug();
        }

    }

    debug(b = true) {
        this.db = b;
    }

    drawDebug() {

        // write debug spaghetti code here 

    }
}