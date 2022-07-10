

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

    constructor(size, gridSize) {

        super();

        this.size = size;

        // basic simulation classes
        this.ships = [];
        this.systems = [];
        this.factions = [];

        // grid
        let g = new Grid(gridSize);
        let cell_w = size.x / gridSize;
        let cell_h = size.y / gridSize;
        this.grid = new WorldGrid(g, cell_w, cell_h);

    }

    add(ent) {
        this.ents[ent.getID()] = ent;
    }

    addFaction(faction) {
        this.add(faction);
        this.factions.push(faction);
    }

    get(id) {
        return this.ents[id];
    }

    removeFaction(id) {
        removeFromArr(this.factions, id);
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
        for (var ent of Object.values(this.ents)) {
            ent.tick(this);
        }
    }


}