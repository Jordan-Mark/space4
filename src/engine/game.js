


class Game {
    /**
     * 
     * main game manager class. handles all game and player events.
     * 
     * 
     * @param {World} world 
     * @param {Display} display
     */

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

    }
}