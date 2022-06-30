
class Grid {

  constructor (x, y){
    this.size = {x:x, y:y};
    this.dict = {};

    // initialise grid with empty space.
    for (var i_x=0; i_x<x; i_x++){
      for (var i_y=0; i_y<y; i_y++){
        const key = this.hash(i_x, i_y);
        this.dict[key] = [];
      }
    }
  }

  hash(x, y) {
    /* converts a grid position vector into a string key for the internal dict */
    const key = x.toString() + '.' + y.toString();
    return key;
  }

  copy () {
    /* returns a deep copy of this grid */
    return JSON.parse(JSON.stringify(this));
  }

  get(x, y) {
    /* gets the gridEntityList assigned to a position*/
    const key = this.hash(x, y)
    return this.dict[key];

  }

  set(x, y, gridEntityList) {
    /* set gridEntityList at position */
    const key = this.hash(x, y);
    this.dict[key] = gridEntityList;
  }

  getSize(){
    return this.size;
  }

}

class GridEntity {
  constructor () {

  }
}


class GridDisplay {
  constructor (x1, y1, x2, y2, grid){
    /*
    x1, y1, x2, y2 are screen coordinates for the draw box
    grid is a Grid object
    */

    this.point1 = {x:x1, y:y1};
    this.point2 = {x:x2, y:y2};
    this.grid = grid;

  }

  draw (){
    var size = this.grid.getSize();
    var gridDisplayWidth = this.point2.x - this.point1.x;
    var gridDisplayHeight = this.point2.y - this.point1.y;
    var cellWidth = gridDisplayWidth / size.x;
    var cellHeight = gridDisplayHeight / size.y;
  }
}
