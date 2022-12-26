class Connection extends Entity {

    constructor(s1, s2){
        super();

        //objects
        this.s1 = s1; 
        this.s2 = s2 
    }

    draw(display) {

        var c = display.camera;

        const s1p = c.w2s({ x: this.s1.pos.x, y: this.s1.pos.y });
        const s2p = c.w2s({ x: this.s2.pos.x, y: this.s2.pos.y });

        display.drawLine(s1p, s2p, 1, { r: 70, g: 70, b: 70 }, 1);

    }
}