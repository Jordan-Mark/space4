

class Ship extends WorldEntity {

    constructor(faction, star, speed=0.25 /*probably best to have ship types? -- json*/) {
		super(game.getWorld().get(star).getPos());
		this.star = star;
		this.faction = faction;
		this.speed = speed;
    }

	draw(display) {
		super.draw(display);

		/* the ship should be drawn in this method only if not based at a star */
		/* may be subsumed by fleet and battle at a later date) */
		if (this.star == null) {
			this.drawShipTriangle(display, { x: 0, y: 0 })
		}
	}

	drawShipTriangle(display, offset) {
		var faction = game.getWorld().get(this.faction);
		var screen_pos = display.getCamera().w2s(this.getPos());

		// triangle(5, 3, 5, 7, 10, 5);
		//var offset = { x: 5, y: 5 };

		var camera = game.getDisplay().getCamera();


		var c1 = addvs(screen_pos, { x: 5, y: 3 }, offset);
		var c2 = addvs(screen_pos, { x: 5, y: 7 }, offset);
		var c3 = addvs(screen_pos, { x: 10, y: 5 }, offset);

		//console.log(c1, c2, c3);

		display.drawTriangle(c1, c2, c3, faction.getColour(), 1, faction.getColour(), 5);
	}
}