class Connection extends Entity {

    defaultStroke = { r: 70, g: 70, b: 70 };
    highlightStroke = {r: 255, g: 255, b: 255};

    constructor(s1, s2){

        // entity init
        super();

        //objects
        this.s1 = s1; 
        this.s2 = s2; 

        //pathfinding
        if (true) {
            this.baseCost = Math.floor(random(1, 6))
        }
        else {
            this.baseCost = 1;
        }

        // display
        this.highlighted = false;

    }

    draw(display) {

        // note: yes this is somewhat bad pracice, but it makes little sense to store a local reference of the star objects
        const s1wp = game.world.get(this.s1).getPos();
        const s2wp = game.world.get(this.s2).getPos();

        // calculate screen positions of local stars
        var c = display.camera;
        const s1sp = c.w2s(s1wp);
        const s2sp = c.w2s(s2wp);

        // draw states
        if (this.highlighted){
            display.drawLine(s1sp, s2sp, 1, this.highlightStroke, 1);
        }
        else {
            display.drawLine(s1sp, s2sp, 1, this.defaultStroke, 1);
        }

        // draw cost
        /*
        const sCentre = lerpVector(s1sp, s2sp, 0.5);
        push();
        fill(255);
        text(this.getCost().toString(), sCentre.x, sCentre.y);
        pop();*/



    }

    highlight(){
        this.highlighted = true;
    }

    unHighlight(){
        this.highlighted = false;
    }

    getCost(entityID=null){ // cost for entity travelling (might be affected by factions, or ship type idk), if none, give base cost.
        return this.baseCost;
    }
}