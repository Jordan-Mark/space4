

class Ship extends WorldEntity {

    constructor(faction, star, speed=0.25 /*probably best to have ship types? -- json*/) {
		super(game.getWorld().get(star).getPos());
		this.star = star;
		this.faction = faction;
		this.speed = speed;
    }

	draw(display) {
		/*probably should be subsumed under star?*/
		super.draw(display);



		var faction = game.getWorld().get(this.faction);
		var screen_pos = display.getCamera().w2s(this.getPos());

		// triangle(5, 3, 5, 7, 10, 5);
		//var offset = { x: 5, y: 5 };
		
		var c1 = addvs(screen_pos, { x: 5, y: 3 });
		var c2 = addvs(screen_pos, { x: 5, y: 7 });
		var c3 = addvs(screen_pos, { x: 10, y: 5 });

		//console.log(c1, c2, c3);

		display.drawTriangle(c1, c2, c3, faction.getColour(), 0, faction.getColour(), 5);

	}
}