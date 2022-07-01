

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
    ents = {};

    constructor(gridSize) {

        super();

        // basic simulation classes
        this.ships = [];
        this.systems = [];
        this.factions = [];

        // helpful grid
        this.grid = new Grid(gridSize);
        this.map = new EntityMap(this.grid);

    }

    add(ent) {
        this.ents[ent.getID()] = ent;
    }

    get(id) {
        return this.ents[id];
    }

    remove(id) {
        delete this.ents[id];
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
        for (ent of Object.values(this.ents)) {
            ent.tick(this);
        }
    }


}