

class Registry {
    /**
     *   
     * Entity Manager
     * 
     */

    dict = {};
    idCounter = 0;

    constructor() {
        // do I need this?
    }

    get(id) {
        return this.dict[id];
    }

    add(entity) {
        var id = this.idCounter;;
        idCounter++;
        this.dict[id] = entity;
        return id;
    }

    remove(id) {
        delete this.dict[id];
    }

    tick(world) {
        for (entity of dict.values()) {
            entity.tick(world);
        }
    }
}