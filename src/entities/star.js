

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
	pathTo(starlist, targetID){

		var world = game.world;

		this.highlight({r:255, g:0, b:0});
		world.get(targetID).highlight({r:0, g:255, b:0});

		var activeStars = [this.getID()];
		var checked = [];
		var steps = 0;
		var smallsteps = 0;

		while (steps<200){
			steps++;

			for (var i=0; i<activeStars.length; i++){
				console.log(world.get(activeStars[i]));

				// check
				if (activeStars[i]==targetID){
					return;
				}
				else {

					// highlight checked star
					if (activeStars[i] != this._id){
						world.get(activeStars[i]).highlight();
						world.get(activeStars[i]).displayN(steps);
					}

					// add neighbours to active list
					if (!(checked.includes(activeStars[i]))){
						activeStars = activeStars.concat(world.get(activeStars[i]).getNearby());				
					}

					// remove from active list
					checked.push(activeStars[i]);
					activeStars.splice(i, 1);
					i--;
				}

				smallsteps++;
				if (smallsteps > 100){
					break;
				}
			}
		}
	}
}

		/*
		for (var steps=0; steps<100; steps++){

			steps ++;




			var nearby = this.getNearby();
			for (var j=0; j<nearby.length; j++){
				var starID = nearby[j];
				const path = [starID];
				const heuristic = manhattan(world.get(starID).getPos(), world.get(targetID).getPos());
				activePaths.push([path, heuristic]);
	
				if (starID==targetID){
					return new Path(path);
				}

				checked.push(starID);
				world.get(starID).highlight();
				var c = world.getConnection(this.getID(), starID);
				console.log(world.get(c));
				world.get(c).highlight();
				
			}

		}
		*/

		/*

		var old_frontier = [this.id];
		var new_frontier;
		var activePaths = [];
		
		for (var i=0; i<10000; i++) {

			for (var pair of oldActivePaths){

				activePaths = [];
				new_frontier = [];
				const oldPath = pair[0];
				const oldValue = pair[1];
				for (var near of world.get(oldPath[oldPath.length-1]).getNearby()){
					if (i==0){
						console.log(world.get(oldPath[oldPath.length-1]).getNearby());
					}
					if (!(old_frontier.includes(near))){
						
						var st = world.get(near);
						st.highlight();

						var path = structuredClone(oldPath);
						path.push(near);

						const heuristic = manhattan(world.get(near).getPos(), world.get(targetID).getPos());
	
						if (near == targetID){
							return new Path(path);
						}
	
						new_frontier.push(near);
						activePaths.push([path, heuristic]);
					}
				}
				old_frontier = new_frontier;
			}
			oldActivePaths = activePaths;
		}
	}
	*/