

class Star extends WorldEntity {

	diamondDrawSize = 4;
	starHighlightWeight = 1;
	defaultStarHighlightColour = {r:255, g:255, b:255}
	defaultStrokeWeight = 0;

    constructor(loc, faction, name) {
		super(loc);
		this.faction = faction;
		this.name = name;
		this.nearby = []; // should be a list of starIDs
		this.connections = [];
		this.highlighted = false;
		this.highlightColour = this.defaultStarHighlightColour;
		this.displayNumber = null;
    }

	highlight(colour = this.starHighlightColour){
		this.highlighted = true;
		this.highlightColour = colour;
	}

    draw(display) {
		super.draw(display);

		if (this.displayNumber){
			var scpos = display.camera.w2s(this.getPos());
			push();
			stroke (255);
			fill (255);
			text(this.displayNumber.toString(), scpos.x+5, scpos.y+5);
			pop();
		}


		if (this.highlighted){
			display.drawDiamond(display.camera.w2s(this.getPos()), this.diamondDrawSize, this.faction.getColour(), 2, this.starHighlightWeight, this.highlightColour);
		}
		else {
			display.drawDiamond(display.camera.w2s(this.getPos()), this.diamondDrawSize, this.faction.getColour(), 2, this.defaultStrokeWeight);
		}	
    }

	displayN(number){
		this.displayNumber = number;
	}

	// TODO fix this
	addCon(starID) {
		this.nearby.push(starID);
	}

	// returns other star ids
	getNearby() {
		return this.nearby;
    }
	
	getName(){
		return this.name;
	}

	/* a* search algorithm, basic, length=value */
	bfs(targetID){

		var world = game.world;

		this.highlight({r:255, g:0, b:0});
		world.get(targetID).highlight({r:0, g:255, b:0});

		var activeStars = [this.getID()];
		var checked = [];
		var steps = 0;
		var pathmap = {}; // keys: starids, entries: root ids
		pathmap[this.getID()]= false; // set origin  

		while (true) {

			steps++;

			console.log ("step:", steps);

			if (steps>400){
				break;
			}

			var testStar = activeStars[0];

			console.log ('star:', world.get(testStar).getName());

			// check
			if (testStar==targetID){
				console.log('PATH FOUND');
				
				var path = [];
				// build path object
				var x = testStar

				while(pathmap[x]){
					path.push(x);
					console.log('x:', x, "pathmap[x]", pathmap[x]);
					world.get(world.getConnection(x, pathmap[x])).highlight();
					x = pathmap[x];
				}

				return new Path(path);

			}
			else {
				// highlight checked star
				if (testStar != this._id){
					world.get(testStar).highlight();
					world.get(testStar).displayN(steps);
				}

				// add neighbours to active list
				var nearby = world.get(testStar).getNearby();
				console.log('nearby:', nearby.length);
				for (var near of nearby){
					if (!(activeStars.includes(near))){
						if (!(checked.includes(near))){
							activeStars.push(near);
							pathmap[near]=testStar;
						}
					}
				}

				// remove tested star from active list, add to checked list
				checked.push(testStar);
				activeStars.splice(0, 1);

			}
			console.log('active list:', activeStars.length);
			console.log('checked: ', checked.length);
		}
	}
}
