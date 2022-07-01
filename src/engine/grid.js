/*
2-Dimensional Grid

Abstract class that provides functionality for referencing positions.
*/
class Grid {

    constructor(grid_size) {
        this.grid_size = grid_size;
    }

    /* return true if the (grid) coords are within the bounds of the grid. */
    inBounds(coords) {

        if (coords.x < 0 || coords.x >= this.grid_size.x) {
            return false;
        }
        else if (coords.y < 0 || coords.y >= this.grid_size.y) {
            return false;
        }
        else {
            return true;
        }
    }

    /* get neighbouring position to a position, in range. (accounts for grid border) */
    getNeighbours(coords, range = 1) {
        var coordsList = [];

        for (var x = -1 * range; x <= 1 * range; x++) {
            for (var y = -1 * range; y <= 1 * range; y++) {
                if (!(x == 0 && y == 0)) {
                    var testPosition = { x: coords.x + x, y: coords.y + y };
                    if (this.inBounds(testPosition)) {
                        coordsList.push(testPosition);
                    }
                }
            }
        }

        return coordsList;
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
Tilemap
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
2-Dimensional EntityMap
Allows multiple entities to be present per grid cell
*/

class EntityMap {

    constructor(grid) {

        this.grid = grid;

        // thanks to the ambiguity of javascript, this could be EntityID's, or Entities!
        this.entities = {};
    }

    /* add entity (or id) to internal dictionary */
    addEntity(position, entity) {

        if (this.getEntities(position) == null) {
            this.entities[this.grid.hash(position)] = [];
        }
        this.entities[this.grid.hash(position)].append(entity);
    }

    /* remove all entities from position */
    removeAll(position) {
        delete this.entities[this.grid.hash(position)];
    }

    /* remove a specific entity from a position */
    removeEntity(position, entity) {
        var entities = getEntities(position);
        for (var i = 0; i < entities.length; i++) {
            if (entity == entities[i]) {
                entities.splice(i, i);
                break;
            }
        }
        if (entities.length == 0) {
            this.removeAll(position);
        }
    }

    /* return the entity at position */
    getEntities(position) {
        return this.entities[this.grid.hash(position)];
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
