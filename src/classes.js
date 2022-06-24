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
	}

	update(){
		this.update_factions();
		this.update_colonization();
	}

	update_factions(){
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

	update_colonization(){
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
			var offset = {	
				x:int(i / 3) * 8 * (1/camera.zoom),
				y:(i % 3) * 7 * (1/camera.zoom)
			}
			ships[this.ships[i]].draw(offset);
		}

		/*draw self*/
		this.draw_diamond(4);
		if (camera.zoom>0.9){
			this.draw_desc();
		}

	}

	draw_desc(){
		push();
		strokeWeight(1);
		fill(150);
		stroke(150);
		var adj = camera.w2s(this.loc);
		text(this.name, adj.x + 10, adj.y -10)
		strokeWeight(0);
		this.faction.fFill();
		this.faction.fStroke();
		text(this.faction.name, adj.x+10, adj.y + 5);
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
		this.loc = systems[this.system].loc
		this.speed = speed;


	}
	travel(new_system){
		this.warpFrom = this.system;
		this.warpTo = new_system;
		remove_from_array(systems[this.system].ships, this.index);
		this.inWarp = true;
		this.warpDistance = sqrt(distSqrd(systems[this.warpFrom].loc,
										systems[this.warpTo].loc));
		this.system = null;
		this.warpProgress=0;
	}
	finish_travel(){
		this.system = this.warpTo;
		this.warpTo = null;
		this.warpFrom = null;
		systems[this.system].ships.push(this.index);
		systems[this.system].update();
		this.inWarp=false;

		// set ship coordinates to system coordinates
		this.loc=systems[this.system].loc;
	}
	update() {
		if (this.inWarp) {
			this.warpProgress += this.speed * deltaTime;
			this.loc = lerpVector(systems[this.warpFrom].loc,
				systems[this.warpTo].loc, this.warpProgress/this.warpDistance);


			/* end warp if completed */
			if (this.warpProgress >= this.warpDistance) {
				this.finish_travel();
			}
			this.draw();
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


	draw(offset={x:0,y:0}, outbound=true){
		if (camera.zoom > 0.2){
			push();
			this.faction.fStroke();
			this.faction.fFill();
			var adj = camera.w2s({x:this.loc.x + offset.x, y: this.loc.y + offset.y})
			translate(adj.x, adj.y);
			//scale(camera.zoom);
			if (outbound){
				triangle(5, 3, 5, 7, 10, 5);
			}
			else{
				triangle(5, 5, 10, 3, 10, 7);
			}
			pop();
		}
	}
}

class Camera {
	constructor(xOffset, yOffset, screenW, screenH, zoomSpeed = 0.001, moveSpeed = 0.1, zoom=1){
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
}



