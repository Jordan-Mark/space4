

class World {
    /**
     * 
     * class contains all internal simulation
     * 
     * 
     * */

    constructor() {

    }

    tick() {

    }
}


class BasicWorld extends World {

    globalTimeFactor = 1; // coefficient to all time dependent simulation elements
    dt = null; // adjusted deltaTime (seconds)


    constructor(gridSize) {

        super();

        // basic simulation classes
        this.ships = new Registry();
        this.systems = new Registry();
        this.factions = new Registry();

        // helpful grid
        this.grid = new Grid(gridSize);
        this.map = new EntityMap(this.grid);

    }

    setGlobalTimeFactor(timeFactor) {
        this.globalTimeFactor = timeFactor;
    }

    preTick() {
        this.dt = (deltaTime / 1000) * this.globalTimeFactor; // this leaves us with "seconds*" since last frame (*adjusted for globalTimeFactor)
    }

    tick() {
        this.preTick();
        super.tick();
    }


}