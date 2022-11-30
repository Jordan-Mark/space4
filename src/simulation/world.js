

class World {
    /**
     * 
     * class contains all internal simulation
     * "model" part of this code
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

        // if WorldEntity (aka has transform), add to grid
        if (ent instanceof WorldEntity){
            this.grid.addEntity(this.grid.getCell(ent.pos), ent.getID());
        }

    }

    // get entity ids in radius
    getEntsInR(pos, r){

        var entsInGrids = this.grid.getEntsInGrids(this.grid.getGridsInR(pos, r));
        var finalEnts = [];

        for (var id of entsInGrids){
            if (r * r > distSqrd(pos, this.ents[id].getPos())){
                finalEnts.push(id);
            }
        }
        return finalEnts;
    }


    addFaction(faction) {
        this.add(faction);
        this.factions.push(faction.getID());
    }

    get(id) {
        return this.ents[id];
    }

    /* returns all entity OBJECTS */
    getEntities() {
        return Object.values(this.ents);
    }

    /* return all faction IDs */
    getFactions() {
        return this.factions;
    }

    /* return all star IDs */
    getStars() {
        return this.stars;
    }

    addStar(star) {
        this.add(star);
        this.stars.push(star.getID());
    }

    removeStar(id) {
        removeFromArr(this.stars, id);
    }

    removeFaction(id) {
        removeFromArr(this.factions, id);
    }

    remove(id) {
        // TODO : should entities hold their own grid position?
        var grid_position = this.grid.getCell(this.ents[id].getPos());
        this.grid.removeEntity(grid_position, id);
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