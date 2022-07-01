

class WorldGenerator {

    constructor () {
    }

    create() {
        this.size = size;
        this.gridSize = gridSize;
        this.world = new World();
    }

    export() {
        return this.world;
    }
}


class BasicWorldGenerator extends WorldGenerator {

    create(size, gridSize) {
        this.size = size;
        this.gridSize = gridSize;
        this.world = new BasicWorld(size, gridSize);
    }

}