

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

    createStars(n_stars) {
        // create some test stars

        for (var i = 0; i < n_stars; i++) {
            this.world.addStar(new Star({ x: random(this.size.x), y: random(this.size.y) }, random(this.world.getFactions())));
        }

    }

    createFactions(n_factions) {

        // no faction
        
        for (var i = 0; i < n_factions; i++) {
            this.world.addFaction(new Faction('Faction' + i.toString(), { r: Math.random() * 255, g: Math.random() * 255, b: Math.random() * 255 }))
        }
        

    }

}