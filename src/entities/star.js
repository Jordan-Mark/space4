

class Star extends WorldEntity {

	diamondDrawSize = 4;
	starHighlightWeight = 1;
	defaultStrokeWeight = 0;

    constructor(loc, faction, name) {
		super(loc);
		this.faction = faction;
		this.name = name;
		this.connections = []; // should be a list of starIDs
		this.highlight = false;
    }

    draw(display) {
		super.draw(display);

		if (this.highlight){
			display.drawDiamond(display.camera.w2s(this.getPos()), this.diamondDrawSize, this.faction.getColour(), 2, this.starHighlightWeight, {r:255, g:255, b:255});
		}
		else {
			display.drawDiamond(display.camera.w2s(this.getPos()), this.diamondDrawSize, this.faction.getColour(), 2, this.defaultStrokeWeight);
		}	
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

	/* a* search algorithm */
	pathTo(starlist, targetID){

	}

}