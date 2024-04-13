
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
    gameObjects = {};
    

    constructor(size, n_grids) {

        super();

        this.size = size;

        // grid
        let g = new Grid(n_grids);
        let cellSize = Math.min(size.x, size.y) / n_grids;
        this.grid = new WorldGrid(g, cellSize);

        // basic simulation classes
        this.ships = [];
        this.stars = [];
        this.factions = [];
        this.connections = [];

        // to fetch connection objs from star ids reference
        this.connectionsDict = {};

        // assistant classes for game logic
        this.nearbyStarHighlightManager = new NearbyStarHighlightManager();
        this.add(this.nearbyStarHighlightManager);


        // no faction
        this.NO_FACTION = new Faction('NO FACTION', { r: 100, g: 100, b: 100 });
        //this.add(this.NO_FACTION);

    }

    add(ent) {
        this.gameObjects[ent.getID()] = ent;

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
            if (r * r > distSqrd(pos, this.gameObjects[id].getPos())){
                finalEnts.push(id);
            }
        }
        return finalEnts;
    }

    addShip(ship) {
        this.add(ship);
        this.ships.push(ship.getID());
    }


    addFaction(faction) {
        this.add(faction);
        this.factions.push(faction.getID());
    }

    addConnection(connection){
        this.add(connection);
        this.connections.push(connection.getID());
        this.connectionsDict[constKey(connection.s1, connection.s2)] = connection.getID();
    }

    addStar(star) {
        this.add(star);
        this.stars.push(star.getID());
    }

    get(id) {
        return this.gameObjects[id];
    }

    getConnection(star1ID, star2ID){
        return this.connectionsDict[constKey(star1ID, star2ID)];
    }

    /* returns all entity OBJECTS */
    getEntities() {
        return Object.values(this.gameObjects);
    }

    /* return all faction IDs */
    getFactions() {
        return this.factions;
    }

    getConnections() {
        return this.connections;
    }

    /* return all star IDs */
    getStars() {
        return this.stars;
    }

    getStarCount() {
        return this.stars.length;
    }

    getShips() {
        return this.ships;
    }

    /* remove from star list (does not destroy all references, use this.remove) */
    removeStar(id) {
        removeFromArr(this.stars, id);
    }

    /* as above. also removes from connectionsdict */
    removeConnection(id){
        const obj = this.get(id);
        delete this.connectionsDict[constKey(obj.s1, obj.s2)];
        removeFromArr(this.connections, id);
    }

    /* remove from faction list (does not destroy all references, use this.remove) */
    removeFaction(id) {
        removeFromArr(this.factions, id);
    }

    /* returns seconds since last frame (adjusted for this.globalTimeFactor) */
    deltaTime() {
        return this.dt;
    }

    /* destroy all references to an entity in this */
    remove(id) {
        // TODO : should entities hold their own grid position?
        var grid_position = this.grid.getCell(this.gameObjects[id].getPos());
        this.grid.removeEntity(grid_position, id);
        delete this.gameObjects[id];
    }

    setGlobalTimeFactor(timeFactor) {
        this.globalTimeFactor = timeFactor;
    }

    /* executes in the loop before tick */
    preTick() {
        this.dt = (deltaTime / 1000) * this.globalTimeFactor; // this leaves us with "seconds*" since last frame (*adjusted for globalTimeFactor)
    }

    tick() {
        this.preTick();
        super.tick();
        for (var ent of Object.values(this.gameObjects)) {
            ent.tick(this);
        }
    }

    /* star highlight mechanics */
    highlightNearbyStar(){
        this.nearbyStarHighlightManager.start();
    }

    unHighlightNearbyStar(){
        this.nearbyStarHighlightManager.stop();
    }




}