

class Star extends WorldEntity {

	diamondDrawSize = 4;

    constructor(loc, faction, name) {
		super(loc);
		this.faction = faction;
		this.name = name;
		this.connections = []; // should be a list of starIDs
    }

    draw(display) {
		super.draw(display);
		display.drawDiamond(display.camera.w2s(this.getPos()), this.diamondDrawSize, this.faction.getColour(), 2);
		
		//this.draw_diamond(this.diamondDrawSize);
    }

	addCon(starID) {
		this.connections.push(starID);
	}

	getConnections() {
		return this.connections;
    }

	draw_diamond(size) {

		// draw diamond
		push();
		this.faction.fStroke();
		this.faction.fFill();
		var adj = display.camera.w2s(this.getPos());
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
	
	getName(){
		return this.name;
	}


}