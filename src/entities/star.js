

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
	
    }

	addCon(starID) {
		this.connections.push(starID);
	}

	getConnections() {
		return this.connections;
    }
	
	getName(){
		return this.name;
	}


}