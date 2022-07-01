

class Entity {
    /**
     * 
     * abstract entity class 
     * 
     */

    constructor() {

        // create unique hash
        this.id = uuidv4();
    }

    getID() {
        return this.id;
    }

    begin(world) {
        
    }

    tick(world) {

    }

    draw(camera) {

    }

    destroy(world) {
        // destroy this object as a functioning entity (but not all references, necessarially);
        world.remove(this.getID());
    }
 
}

class WorldEntity extends Entity {
    /**
     * 
     * entity with world location
     * 
     * @param {any} loc
     */

    constructor(loc) {
        super();
        this.loc = loc;
    }

    getLoc() {
        return loc;
    }

}