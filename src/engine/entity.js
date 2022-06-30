

class Entity {
    /**
     * 
     * abstract entity class for use in Registry.js
     * 
     */

    id = null;

    constructor() {
        // redundant
    }

    assignId() {
        this.id = id;
    }

    getId() {
        return this.id;
    }

    tick(world) {

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
        this.loc = loc;
    }

    getLoc() {
        return loc;
    }
}