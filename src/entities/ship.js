

class Ship extends WorldEntity {

	constructor(faction, star, speed /*probably best to have ship types? -- json*/) {
		super(game.getWorld().get(star).getPos());

		this.faction = faction;
		this.speed = speed;

		// location information
		this.warpFrom = null; // index
		this.warpTo = null; // index
		this.star = star;
		this.isAtWarp = false;

		// pathfinding
		this.path = null;

		//behaviour
		this.state = 'pathing';
		this.metaState = 'randomPaths';

		// highlight
		this.highlighted = false;

	}

	highlight(){
		this.highlighted=true;
	}

	unHighLight(){
		this.highlighted=false;
	}

	tick(world) {

		if (this.isAtWarp) {
			this.warpTick(world);

		}

		// randomly travel
		else {
			this.metaState_randomPaths(world);
			this.state_path(world);
		}
	}

	state_path(world) {
		if (this.path) {
			if (this.path.next(this.star)){
				this.travel(this.path.next(this.star));
			}
			else {
				this.path.unHighlight(); // not higlighting because its 0
				this.path=null;
			}
		}
	}

	metaState_randomPaths(world) {
		if (this.path == null && this.star) {
			var star = world.get(this.star);
			var randomStar = random(world.getStars());
			var path = star.djikstra(randomStar);
			this.path = path;
			path.highlight();
		}
	}

	/* run per tick if at warp */
	warpTick(world) {

		this.warpProgress += this.speed * world.deltaTime() * world.getGlobalTimeFactor();
		this.pos = lerpVector(world.get(this.warpFrom).getPos(),
			world.get(this.warpTo).getPos(), this.warpProgress / this.warpDistance);

		/* end warp if completed */
		if (this.warpProgress >= this.warpDistance) {
			this.finish_travel();
		}

	}

	getFaction() {
		return this.faction;
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

		if (this.highlighted){
			display.drawTriangle(c1, c2, c3, faction.getColour(), 1, {r:255, g:255, b:255}, 5);
		}
		else {
			display.drawTriangle(c1, c2, c3, faction.getColour(), 1, faction.getColour(), 5);
		}
	}


	travel(new_star) {

		this.warpFrom = this.star;
		this.warpTo = new_star;

		var world = game.getWorld();
		var star = world.get(this.star);

		star.removeShip(this.getID());

		this.isAtWarp = true;
		this.warpDistance = distance(world.get(this.warpFrom).getPos(), world.get(this.warpTo).getPos());

		this.star = null;
		this.warpProgress = 0;
	}

	finish_travel() {

		var world = game.getWorld();

		this.star = this.warpTo;
		this.warpTo = null;
		this.warpFrom = null;

		var newStar = world.get(this.star)
		newStar.addShip(this.getID());
		newStar.onEntry(this.getID());

		this.isAtWarp = false;

		// set ship coordinates to system coordinates
		this.pos = game.getWorld().get(this.star).getPos();

	}



}