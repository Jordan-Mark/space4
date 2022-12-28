

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
    }

	highlight(colour = this.starHighlightColour){
		this.highlighted = true;
		this.highlightColour = colour;
	}

    draw(display) {
		super.draw(display);

		if (this.highlighted){
			display.drawDiamond(display.camera.w2s(this.getPos()), this.diamondDrawSize, this.faction.getColour(), 2, this.starHighlightWeight, this.highlightColour);
		}
		else {
			display.drawDiamond(display.camera.w2s(this.getPos()), this.diamondDrawSize, this.faction.getColour(), 2, this.defaultStrokeWeight);
		}	
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

		var activePaths = [];
		var checked = [];

		for (var i=0; i<100; i++){

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
	}





}
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