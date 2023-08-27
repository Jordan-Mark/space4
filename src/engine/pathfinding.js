class Path {

    constructor(nodes){
        this.nodes = nodes;
        this.length = this.nodes.length;
    }

    highlight(color={r:255, g:255, b:255}){

        for (var i=0; i<this.nodes.length; i++){

            // highlight stars
            game.world.get(this.nodes[i]).highlight(color);

            // highlight connections
            if (i+1 in this.nodes){
                game.world.get(game.world.getConnection(this.nodes[i], this.nodes[i+1])).highlight();
            }
        }
    }
}


class PathQueue {
    
    constructor (){
        this._q = [];
    }

    put (starID) {  
        this._q.push(starID);
    }

    get(){
        const r = this._q[0];
        this._q.splice(0, 1);
        return r;
    }
    
    isEmpty(){
        return (this._q.length == 0);
    }

}


class PathPriorityQueue extends PathQueue {

    put (starID, cost){


        // if the array is empty, add the first item
        if (this.isEmpty()){
            this._q.push([starID, cost]);
        }


        else {
            // iterate over array
            for (var i = 0; i < this._q.length; i++){

                // if the cost is greater than the iterated item
                if (cost > this._q[i][1]) {

                    // place the new starID there
                    this._q.splice(i, 0, [starID, cost]);
                    return;
                }
            }
            this._q.push([starID, cost]);
        }

    }

    get(){
        return this._q.pop(); 
    }
}



class PathSet {
    constructor (){
        this.l = [];
    }

    add (starID){
        if (!(this.l.includes(starID))){
            this.l.push(starID);
        }
    }

    includes(starID){
        return this.l.includes(starID);
    }

}
