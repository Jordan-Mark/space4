

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
    

    constructor(size, n_grids) {

        super();

        this.size = size;

        // basic simulation classes
        this.ships = [];
        this.stars = [];
        this.factions = [];

        // grid
        let g = new Grid(n_grids);
        let cellSize = Math.min(size.x, size.y) / n_grids;

        this.grid = new WorldGrid(g, cellSize);

        // no faction
        this.NO_FACTION = new Faction('NO FACTION', { r: 100, g: 100, b: 100 });

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

    getEntities() {
        return Object.values(this.ents);
    }

    getFactions() {
        return this.factions;
    }

    addStar(star) {
        this.add(star);
        this.stars.push(star);
    }

    removeStar(id) {
        removeFromArr(this.stars, id);
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