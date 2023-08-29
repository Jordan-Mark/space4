

class Faction extends GameObject {

	constructor(name, colour, ships = [], systems = [], clients =[], patron=null) {
		super();
		this.name = name;
		this.colour = colour;
		this.ships = ships;
		this.systems = systems;
		this.patron=patron;
		this.clients=clients;
	}

	addClient(factionID){
		this.clients.push(factionID)
	}

	getClients(){
		return this.clients;
	}

	removeClient(clientID){
		removeFromArr(this.clients, clientID);
	}

	setPatron(factionID){
		this.patron=factionID;
	}

	getPatron(){
		return this.patron;
	}


	getName(){
		return this.name;
	}

	/* "faction stroke" (for draw functions) */
	fStroke() {
		stroke(this.colour.r, this.colour.g, this.colour.b);
	}

	/* "faction fill" (for draw functions) */
	fFill() {
		fill(this.colour.r, this.colour.g, this.colour.b);
	}

	getColour(){
		return this.colour;
	}


	destroy(world) {
		super.destroy(world);
		world.removeFaction(this.id);
    }

}