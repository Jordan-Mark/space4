

class Star extends WorldEntity {

	diamondDrawSize = 4;
	starHighlightWeight = 1;
	defaultStarHighlightColour = {r:255, g:255, b:255, a:255}
	defaultStrokeWeight = 0;

    constructor(loc, faction, name) {
		super(loc);
		this.faction = faction; //id
		this.name = name;
		this.population = 0;
		this.nearby = []; // should be a list of starIDs
		this.highlighted = false;
		this.highlightColour = this.defaultStarHighlightColour;
		this.displayNumber = null;

		// ship handling
		this.ships = []; // list of ids

	}



	/* should fire when a ship enters the system */
	onEntry(shipID) {
		this.updateFactions();
	}

	/* this function checks if there are only ships of one faction. if so, it changes to that faction */h
	updateFactions() {

		var factions = [];
		if (this.ships.length > 0) {
			for (var shipID of this.ships) {
				var ship = game.getWorld().get(shipID);
				if (!(factions.includes(ship.getFaction()))) {
					factions.push(ship.getFaction());
				}
			}
		}
		if (factions.length == 1) {
			this.faction = factions[0];
		}
	}

	write(world) {

		var shipsParagraph = '';
		for (var shipID of this.ships) {
			var ship = world.get(shipID);
			var faction = world.get(ship.getFaction());
			var factionColour = faction.getColour();
			shipsParagraph += 'ship of faction ' + '<span style="color:rgb(' + factionColour.r + ',' + factionColour.g + ',' + factionColour.b + ') ">' + faction.getName() + '</span><br>';
		}

		var faction = world.get(this.faction);
		var factionColour = faction.getColour();
		var paragraph = this.name + '<br>' +
			'connections: ' + this.nearby.length.toString() + '<br>' +
			'population: ' + this.population.toString() + '<br>' +
			'<span style="color:rgb(' + factionColour.r + ',' + factionColour.g + ',' + factionColour.b + ') ">' + faction.getName() + '</span><br>' +
			shipsParagraph;


		
		game.getParagraph().display(paragraph);
	}

	setPopulation(population){
		this.population=population;
	}

	getPopulation(){
		return this.population;
	}

	highlight(colour = this.defaultStarHighlightColour){
		this.highlighted = true;
		this.highlightColour = colour;
	}

	unHighlight(){
		this.highlighted=false;
	}

    draw(display) {
		super.draw(display);

		/* display a number to the right of the star */
		/*
		if (this.displayNumber){
			var scpos = display.camera.w2s(this.getPos());
			push();
			stroke (255);
			fill (255);
			text(this.displayNumber.toString(), scpos.x+5, scpos.y+5);
			pop();
		}
		*/


		// draw star

		var faction = game.getWorld().get(this.faction);
		
		if (this.highlighted){
			var screenpos = display.camera.w2s(this.getPos());

			display.drawDiamond(screenpos, this.diamondDrawSize, faction.getColour(), 2, this.starHighlightWeight, this.highlightColour);
			//display.drawText({x:screenpos.x, y:screenpos.y-8}, this.name, this.highlightColour, 10, 3, CENTER);
			/*
			display.drawText({x:screenpos.x, y:screenpos.y+16}, this.faction.getName(), this.highlightColour, 10, 3, CENTER);
			display.drawText({x:screenpos.x, y:screenpos.y+28}, this.getPopulation().toString() + 'K', this.highlightColour, 10, 3, CENTER);
			*/
		}
		else {
			display.drawDiamond(display.camera.w2s(this.getPos()), this.diamondDrawSize, faction.getColour(), 2, this.defaultStrokeWeight);
		}	


		// draw ships

		for (var i = 0; i < this.ships.length; i++) {
			var ship = game.getWorld().get(this.ships[i]);
			var camera = display.getCamera();

			// stack ships
			var offset = {
				x: int(i / 3) * 8,
				y: (i % 3) * 7
			}

			ship.drawShipTriangle(display, offset);
		}
	}

	addShip(shipID) {
		this.ships.push(shipID);
	}

	removeShip(shipID) {
		removeFromArr(this.ships, shipID);
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

		while (!(frontier.isEmpty())) {

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

		while (!frontier.isEmpty()){
			current = frontier.get()[0];

			// early exit
			if (current == targetID){
				break;
			}


			//debugger;
			for (var next of world.get(current).getNearby()){
				new_cost = cost_so_far[current] + world.get(world.getConnection(current, next)).getCost();
				if (!(next in cost_so_far) || new_cost < cost_so_far[next]){
					cost_so_far[next] = new_cost;
					var priority = new_cost;
					frontier.put(next, priority);
					came_from[next] = current;
				}

			}
		}

		// build path
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

	greedy_best_first(targetID) {

		var priority;
		var world = game.world;
		var frontier = new PathPriorityQueue();
		frontier.put(this.getID(), 0);
		var came_from = {};
		came_from[this.getID()] = null;


		while (!frontier.isEmpty()) {
			current = frontier.get()[0];

			if (current == targetID) {
				break;
			}

			for (var next of world.get(current).getNearby()) {
				if (!(next in came_from)) {
					priority = distance(world.get(this.getID()).getPos(), world.get(next).getPos());
					console.log(priority);
					frontier.put(next, priority);
					came_from[next] = current;
				}
			}
		}

		// build path
		var current = targetID;
		var path = [];
		var s = 0;
		while (current != this.getID()) {
			s++;

			path.push(current);
			current = came_from[current];

			if (s > 1000) {
				debugger;
				throw new Error('over ' + s.toString() + ' steps forming path. path issue?');
			}
		}
		path.push(this.getID()); // optional
		path.reverse(); // optional

		return new Path(path);
	}

	/*
	a_star(targetID){

		throw new Error('a* not implemented');

	}*/


    a_star_search(targetID) {
        const world = game.world;
        const startID = this.getID();

        const frontier = new PathPriorityQueue();
        frontier.put(startID, 0);

        const cameFrom = {};
        const costSoFar = {};
        cameFrom[startID] = null;
        costSoFar[startID] = 0;

        while (!frontier.isEmpty()) {
            const current = frontier.get()[0];

            if (current === targetID) {
                break;
            }

            for (const next of world.get(current).getNearby()) {
                const newCost = costSoFar[current] + world.get(world.getConnection(current, next)).getCost();
                if (!(next in costSoFar) || newCost < costSoFar[next]) {
                    costSoFar[next] = newCost;
                    const priority = newCost + this.heuristic(next, targetID); // A* heuristic
                    frontier.put(next, priority);
                    cameFrom[next] = current;
                }
            }
        }

        // Build path
        const path = this.reconstructPath(cameFrom, targetID);
        return new Path(path);
    }

    heuristic(nodeA, nodeB) {
        // Basic Manhattan distance as the heuristic
        const posA = game.world.get(nodeA).getPos();
        const posB = game.world.get(nodeB).getPos();
        return Math.abs(posA.x - posB.x) + Math.abs(posA.y - posB.y);
    }

    reconstructPath(cameFrom, current) {
        const path = [];
        while (current !== null) {
            path.push(current);
            current = cameFrom[current];
        }
        path.reverse();
        return path;
    }
}