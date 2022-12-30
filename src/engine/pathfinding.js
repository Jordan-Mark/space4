class Path {

    constructor(nodes){
        this.nodes = nodes;
        this.length = this.nodes.length;
    }

    highlight(){

        for (var i=0; i<this.nodes.length; i++){

            // highlight stars
            game.world.get(this.nodes[i]).highlight();

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
    
    empty(){
        return (this._q.length == 0);
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