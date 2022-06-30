


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
        this.display.draw(this.world);
        // create a black background
        background(0);

    }
}