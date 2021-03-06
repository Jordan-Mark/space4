class Faction {
	constructor(name, colour, ships = [], systems = []) {
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
}

class System {
	constructor(x, y, faction, name='STAR UNCHARTED') {
		this.loc = {x: x, y: y};
		this.faction = faction;
		this.ships = [];
		this.near = [];
		this.name = name;
		this.localFactions = [];
	}

	getFaction() {
		return this.faction;
	}

	removeShip(shipID) {
		removeFromArr(this.ships, shipID);
		this.shipsChangedEvent();
	}

	addShip(shipID) {
		this.ships.push(shipID);
		this.shipsChangedEvent();
    }

	shipsChangedEvent() {
		this.updateFactions();
		this.updateColonization();
    }

	updateFactions(){
		/* fetch list of local factions */
		this.localFactions = [];
		for (var i=0; i<this.ships.length; i++){
			var factionPresent = false;
			for (var j=0; j<this.localFactions.length; j++){
				if (ships[this.ships[i]].faction == this.localFactions[j]){
					factionPresent = true;
					break;
				}
			}
			if (factionPresent){
				continue;
			}
			else {
				this.localFactions.push(ships[this.ships[i]].faction);
			}
		}
	}

	updateColonization(){
		/* conquer system if only one faction's ships are present */
		if (this.localFactions.length == 1){
			if (this.localFactions[0] != this.faction){
				for (var i=0; i<this.faction.systems.length; i++){
					if (this.faction.systems[i] == this){
						this.faction.systems.splice(i, 1);
						break;
					}
				}
				this.faction = this.localFactions[0];
				this.localFactions[0].systems.push(this);
			}
		}
	}


	draw_diamond(size) {

		// draw diamond
		push();
		this.faction.fStroke();
		this.faction.fFill();
		var adj = camera.w2s(this.loc);
		translate(adj.x, adj.y);

		//scale(camera.zoom);
		beginShape();
		vertex(0, -size);
		vertex(-size, 0);
		vertex(0, size);
		vertex(size, 0);
		endShape(CLOSE);
		pop();

	}

	draw() {


		/* draw ships*/
		for (var i = 0; i < this.ships.length; i++) {
			
			// stack ships
			var offset = {	
				x:int(i / 3) * 8 * (1/camera.zoom),
				y:(i % 3) * 7 * (1/camera.zoom)
			}
			
			ships[this.ships[i]].draw(offset);
		}
		
		/*draw self*/
		this.draw_diamond(4);
		if (camera.zoom>SYSTEM_DRAW_DESC_ZOOM_THRESHOLD){
			this.draw_desc();
		}
		
	}

	draw_desc(){

		push();

		var adj = camera.w2s(this.loc);
		let nameOffset = SYSTEM_DRAW_DESC_NAME_OFFSET;
		let factionOffset = SYSTEM_DRAW_DESC_FACTION_OFFSET;

		// draw system name
		strokeWeight(1);
		fill(150);
		stroke(150);
		text(this.name, adj.x + nameOffset.x, adj.y + nameOffset.y)


		// draw faction name
		strokeWeight(0);
		this.faction.fFill();
		this.faction.fStroke();
		text(this.faction.name, adj.x + factionOffset.x, adj.y + factionOffset.y);

		//text(this.type, adj.x+10, adj.y + 20);

		pop();
	}
}

class Ship {
	constructor(faction, system, index, speed=0.025) {
		this.index = index
		this.faction = faction;

		// location information
		this.warpFrom = null; // index
		this.warpTo = null; // index
		this.system = system; // index
		this.inWarp = false;

		// map draw info
		this.loc = systems[this.system].loc;
		this.speed = speed;


	}

	getFaction() {
		return this.faction;
    }

	travel(new_system) {

		this.warpFrom = this.system;
		this.warpTo = new_system;


		systems[this.system].removeShip(this.index);


		this.inWarp = true;
		this.warpDistance = sqrt(distSqrd(systems[this.warpFrom].loc,
										systems[this.warpTo].loc));
		this.system = null;
		this.warpProgress=0;
	}

	finish_travel() {

		this.system = this.warpTo;
		this.warpTo = null;
		this.warpFrom = null;
		systems[this.system].addShip(this.index);
		this.inWarp=false;

		// set ship coordinates to system coordinates
		this.loc=systems[this.system].loc;
	}
	update() {
		if (this.inWarp) {
			this.warpProgress += this.speed * deltaTime * GLOBAL_TIME_FACTOR;
			this.loc = lerpVector(systems[this.warpFrom].loc,
				systems[this.warpTo].loc, this.warpProgress/this.warpDistance);


			/* end warp if completed */
			if (this.warpProgress >= this.warpDistance) {
				this.finish_travel();
			}
		}
	}
	draw_desc(){
		push();
		this.faction.fFill();
		this.faction.fStroke();
		strokeWeight(1);
		var adj = camera.w2s(this.loc);
		text(str(this.index), adj.x -80, adj.y -10);
		strokeWeight(0);
		text(this.faction.name, adj.x-80, adj.y + 5);
		if (this.inWarp){
			text('travelling to ' + systems[this.warpTo].name, adj.x-80, adj.y + 20);
		}
		pop();
	}


	draw(offset={x:0,y:0}){

		if (camera.zoom > SHIP_DRAW_ZOOM_THRESHOLD){

			push();
			this.faction.fStroke();
			this.faction.fFill();
			var adj = camera.w2s({x:this.loc.x + offset.x, y: this.loc.y + offset.y})
			translate(adj.x, adj.y);
			//scale(camera.zoom);
			triangle(5, 3, 5, 7, 10, 5);
			pop();
		}
	}
}

class Camera {
	constructor(xOffset, yOffset, screenW, screenH, zoom = 1, zoomSpeed = 0.001, moveSpeed = 0.1) {

		this.xOffset = xOffset;
		this.yOffset = yOffset;

		this.screenW = screenW;
		this.screenH = screenH;

		this.zoom = zoom;

		this.moveSpeed = moveSpeed;
		this.zoomSpeed = zoomSpeed;
	}
	s2w(screenC){
		return {x:(screenC.x-(this.screenW/2))/this.zoom + this.xOffset,
			    y:(screenC.y-(this.screenH/2))/this.zoom + this.yOffset}
	}
	w2s(worldC){
		return {x:(this.screenW/2) + (-this.xOffset + worldC.x) * this.zoom,
				y:(this.screenH/2) + (-this.yOffset + worldC.y) * this.zoom};
	}

	/* check if worldC in camera bounds */
	inBounds(worldC) {

		let halfWidth = this.screenW / 2;
		let halfHeight = this.screenH / 2;

		// get world camera bounds
		let minX = this.xOffset - halfWidth / this.zoom;
		let maxX = this.xOffset + halfWidth / this.zoom;

		let minY = this.yOffset - halfHeight / this.zoom;
		let maxY = this.yOffset + halfHeight / this.zoom;

		// check bounds

		if (worldC.x >= minX && worldC.x <= maxX) {
			if (worldC.y >= minY && worldC.y <= maxY) {
				return true;
            }
		}
		return false;
    }
}



