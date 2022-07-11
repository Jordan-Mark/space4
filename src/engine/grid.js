/*
Abstract class that provides functionality for referencing positions.
*/
class Grid {

    constructor(grid_size) {
        this.grid_size = grid_size;
    }

    /* return true if the (grid) coords are within the bounds of the grid. */
    inBounds(gridPosition) {

        if (gridPosition.x < 0 || gridPosition.x >= this.grid_size.x) {
            return false;
        }
        else if (gridPosition.y < 0 || gridPosition.y >= this.grid_size.y) {
            return false;
        }
        else {
            return true;
        }
    }

    /* get neighbouring position to a position, in range. (accounts for grid border) */
    getNeighbours(gridPosition, range = 1) {
        var coordsList = [];

        for (var x = -1 * range; x <= 1 * range; x++) {
            for (var y = -1 * range; y <= 1 * range; y++) {
                if (!(x == 0 && y == 0)) {
                    var testPosition = { x: gridPosition.x + x, y: gridPosition.y + y };
                    coordsList.push(testPosition);
                }
            }
        }

        return coordsList;
    }

    // get neighbours x axis only
    getNx(gridPosition, range) {
        var coordsList = [];
        for (var x = -1 * range; x <= 1 * range; x++) {
            if (!(x == 0)) {
                coordsList.push({ x: gridPosition.x + x, y: gridPosition.y });
            }
        }
        return coordsList
    }

    // get neighbours y axis only
    getNy(gridPosition, range) {
        var coordsList = [];
        for (var y = -1 * range; y <= 1 * range; y++) {
            if (!(y == 0)) {
                coordsList.push({ x: gridPosition.x, y: gridPosition.y + y });
            }
        }
        return coordsList
    }

    /* returns the manhattan distance between two grid locations */
    getDistance(position1, position2) {
        return abs(position1.x - position2.x) + abs(position1.y - position2.y);
    }

    getSize() {
        return this.grid_size;
    }

    /* creates a unique ID for a position so it can be used as a key */
    hash(position) {
        return position.x + '.' + position.y;
    }

    /* creates a position interface {x, y} from a hash key. */
    unhash(position_str) {
        var pos = position_str.split('.')
        return { x: parseInt(pos[0]), y: parseInt(pos[1]) };
    }

    copy() {
        /* returns a deep copy of this grid */
        return JSON.parse(JSON.stringify(this));
    }

}

/* 
Allows only one entity to be present per grid cell.
*/
class TileMap {

    constructor(grid) {
        this.grid = grid;
        this.tiles = {};
    }

    /* set tile at given position */
    setTile(position, tile) {
        this.tiles[this.grid.hash(position)] = tile;
        if (tile == null) {
            delete this.tiles[this.grid.hash(position)];
        }
    }

    /* remove tile at given position */
    removeTile(position) {
        delete this.tiles[this.grid.hash(position)];
    }

    /* return the tile object at position */
    getTile(position) {
        return this.tiles[this.grid.hash(position)];
    }

    /* return a list of all tile objects in the map */
    getTiles() {
        return Object.values(this.tiles)
    }

    /* return the dictionary of tiles */
    getTileDict() {
        return this.tiles;
    }
}

/*
Allows multiple entities to be present per grid cell
*/

class EntityMap {

    constructor(grid) {

        this.grid = grid;

        // thanks to the ambiguity of javascript, this could be EntityID's, or Entities!
        this.entities = {};
    }

    /* add entity (or id) to internal dictionary */
    addEntity(gridPosition, entity) {

        if (this.getEntities(gridPosition) == null) {
            this.entities[this.grid.hash(gridPosition)] = [];
        }
        this.entities[this.grid.hash(gridPosition)].append(entity);
    }

    /* remove all entities from position */
    removeAll(gridPosition) {
        delete this.entities[this.grid.hash(gridPosition)];
    }

    /* remove a specific entity from a position */
    removeEntity(gridPosition, entity) {
        var entities = getEntities(gridPosition);
        for (var i = 0; i < entities.length; i++) {
            if (entity == entities[i]) {
                entities.splice(i, i);
                break;
            }
        }
        if (entities.length == 0) {
            this.removeAll(gridPosition);
        }
    }

    /* return the entity at position */
    getEntities(gridPosition) {
        return this.entities[this.grid.hash(gridPosition)];
    }

    /* return a list of all entities in the map */
    getAllEntities() {
        return Object.values(this.entities)
    }

    /* return the dictionary of entities */
    getEntityDict() {
        return this.entities;
    }
}

/*
Grid Extension Understands Size
*/

class WorldGrid extends EntityMap {

    constructor(grid, cell_size) {

        super(grid);
        this.cell_size = cell_size;
   
    }

    getCell(pos) {

        let x = Math.floor(pos.x / this.cell_size);
        let y = Math.floor(pos.y / this.cell_size);

        return { x: x, y: y };

    }

    getGridsInR(pos, r) {

        // unoptimised for pos position in grid

        var origin = this.getCell(pos);
        var checks = Math.ceil(r / this.cell_size);

        var grids = [];
        grids.push(origin);
        grids = grids.concat(this.grid.getNeighbours(origin, checks));

        return grids;

    }
}