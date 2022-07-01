

class Faction extends Entity {

	constructor(name, colour, ships = [], systems = []) {
		super();
		this.name = name;
		this.colour = colour;
		this.ships = ships;
		this.systems = systems;
	}

	fStroke() {
		stroke(this.colour.r, this.colour.g, this.colour.b);
	}

	fFill() {
		fill(this.colour.r, this.colour.g, this.colour.b);
	}

	destroy(world) {
		super.destroy(world);
		world.removeFaction(this.id);
    }

}