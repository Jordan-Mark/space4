

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


	bfs(targetID){

		// seed lists
		var world = game.world;
		var frontier = new PathQueue();
		frontier.put(this.getID());
		var came_from = {};
		came_from[this._id] = null;
		var current;

		while (!(frontier.empty())) {

			current = frontier.get();

			// early exit
			if (current==targetID){
				break;
			}
			
			// mark node as checked, build new frontier.
			for (var next of world.get(current).getNearby()){
				if (!(next in came_from)){
					frontier.put(next);
					came_from[next] = current;
				}
			}

		}


		// build path
		var current = targetID;
		var path = [];
		var s = 0;
		while (current != this.getID()){
			console.log(s);
			s++;

			path.push(current);
			current = came_from[current];
	
			if (s>1000){
				throw ('over ' + s.toString(), + ' steps forming path. path issue?')
				debugger;
			}
		}
		path.push(this.getID()); // optional
		path.reverse(); // optional

		return new Path(path);


	}

	djikstra(targetID){

		// seed lists
		var world = game.world;
		var frontier = new PathPriorityQueue();
		frontier.put(this.getID(), 0);
		var came_from = {};
		var cost_so_far = {};
		came_from[this.getID()] = null;
		cost_so_far[this.getID()] = 0;
		var current;
		var new_cost;

		while (!frontier.empty()){
			current = frontier.get()[0];

			// early exit
			if (current == targetID){
				break;
			}


			debugger;
			for (var next of world.get(current).getNearby()){
				new_cost = cost_so_far[current] + world.get(world.getConnection(current, next)).getCost();
				if (!(next in cost_so_far) || new_cost < cost_so_far[next]){
					cost_so_far[next] = new_cost;
					var priority = new_cost;
					frontier.put(next, priority);
					came_from[next] = current;
					 console.log('?');
				}

			}
		}

		// build pathn
		var current = targetID;
		var path = [];
		var s = 0;
		while (current != this.getID()){
			s++;

			path.push(current);
			current = came_from[current];
	
			if (s>1000){
				debugger;
				throw new Error('over ' + s.toString() + ' steps forming path. path issue?');
			}
		}
		path.push(this.getID()); // optional
		path.reverse(); // optional

		return new Path(path);

	}

	a_star(targetID){
		throw ('not implemented');
	}


}
