class Connection extends Entity {

    defaultStroke = { r: 70, g: 70, b: 70 };
    highlightStroke = {r: 255, g: 255, b: 255};

    constructor(s1, s2){
        super();

        //objects
        this.s1 = s1; 
        this.s2 = s2; 

        this.highlight = false;
    }

    draw(display) {

        // note: yes this is somewhat bad pracice, but it makes little sense to store a local reference of the star objects
        const s1wp = game.world.get(this.s1).getPos();
        const s2wp = game.world.get(this.s2).getPos();

        // calculate screen positions of local stars
        var c = display.camera;
        const s1sp = c.w2s(s1wp);
        const s2sp = c.w2s(s2wp);

        if (this.highlight){
            display.drawLine(s1sp, s2sp, 1, this.highlightStroke, 1);
        }
        else {
            display.drawLine(s1sp, s2sp, 1, this.defaultStroke, 1);
        }
    }
}