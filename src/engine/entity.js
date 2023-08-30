

// all gameobjects methods are called by game -> world -> update();
class GameObject {
    /**
     * 
     * abstract entity class 
     * 
     */

    constructor() {

        // create unique hash
        this._id = uuidv4();
    }

    getID() {
        return this._id;
    }

    begin(world) {
        
    }

    tick(world) {

    }

    draw(display) {

    }

    destroy(world) {
        // destroy this object as a functioning entity (but not all references, necessarially);
        world.remove(this.getID());
    }
}

// gamescripts provide functionality without being part of the simulation.
class GameScript extends GameObject {
}

// entities are simulation objects without a transform
class Entity extends GameObject {

    feature (world) {

        // check if already featured
        if (!(game.getParagraph().getFeatured() == this.getID())){
            game.getParagraph().feature(this.getID());

            this.write(world);
        }
    }

    write (world){
        game.getParagraph().display('entity id: ' + this.getID());
    }

}

// worldentities are simulation objects with a transform
class WorldEntity extends Entity {
    /**
     * 
     * entity with world location
     * 
     * @param {any} pos
     */

    constructor(pos) {
        super();
        this.pos = pos;
    }

    getPos() {
        return this.pos;
    }
}