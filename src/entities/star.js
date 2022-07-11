

class Star extends WorldEntity {

	diamondDrawSize = 4;

    constructor(loc, faction) {
		super(loc);
		this.faction = faction;
    }

    draw(camera) {
		super.draw();
		this.draw_diamond(this.diamondDrawSize);
    }


	draw_diamond(size) {

		// draw diamond
		push();
		this.faction.fStroke();
		this.faction.fFill();
		var adj = camera.w2s(this.loc);
		translate(adj.x, adj.y);

		//scale(camera.zoom);
		beginShape();
		vertex(0, -size);
		vertex(-size, 0);
		vertex(0, size);
		vertex(size, 0);
		endShape(CLOSE);
		pop();

	}


}