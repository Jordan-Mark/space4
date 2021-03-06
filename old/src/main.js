


function generateWorld(star_max_dist) {

	var sys = [];
	// use poisson sampling to get an array of position vectors
	var pos_vectors = genPoints(star_max_dist, WORLD_BOUNDS.x, WORLD_BOUNDS.y, WGEN_PS_BUFFER, WGEN_PS_N_SAMPLES_BEFORE_REJECTION);

	// create system objects
	for (var i=0; i<pos_vectors.length; i++){
		sys.push(new System(pos_vectors[i].x, pos_vectors[i].y, NO_FACTION, name=genStarName()));
	}

	// assign the nearby stars to each system
	for (var i=0 ; i<sys.length; i++){
		sys[i].near = getNear(i, sys, star_max_dist*2);
	}
	return sys;
}


class Registry (){
	constructor(){
		dict = {};
	};

	add(obj){
		dict[id] = obj;
	};

	remove(){
		dict[id] = null;
	};

	get(id){
		return dict[id];
	};
}

function setup() {


	createCanvas(SCREEN_X, SCREEN_Y);
	systems = generateWorld(WGEN_PS_MAX_DIST);

	camera = new Camera(MAINCAMERA_START_POS.x, MAINCAMERA_START_POS.y, width, height, zoom=MAINCAMERA_START_ZOOM, zoomSpeed=MAINCAMERA_ZOOM_SPEED, moveSpeed=MAINCAMERA_MOVE_SPEED);
	cameraInMax = MAINCAMERA_IN_MAX;//4;
	cameraOutMax = MAINCAMERA_OUT_MAX;// 0.05;

	/* spawn ship */
	for (var i=0; i<N_SHIPS; i++){
		var test_system = int(random(systems.length));
		ships.push(new Ship(random(factions), test_system, i));
		systems[test_system].ships.push(i);
	}

}

function mousePressed() {
	/*
	// Set the value of fullscreen
	// into the variable
	let fs = fullscreen();

	// Call to fullscreen function
	fullscreen(!fs);
	*/
}

function inputHandler(){

	/*update camera zoom*/
	var cameraDelta = 0;
	if (keyIsDown(189)){
		cameraDelta += -1;
	}
	if (keyIsDown(16) && keyIsDown(187)){
		cameraDelta += +1;
	}

	camera.zoom += camera.zoomSpeed * deltaTime * cameraDelta * camera.zoom;

	/*update camera position*/
	var offsetDelta = {x:0,y:0};
	if (keyIsDown(87)){
		offsetDelta.y -= 1;
	}
	if (keyIsDown(65)){
		offsetDelta.x -= 1;
	}
	if (keyIsDown(83)){
		offsetDelta.y += 1;
	}
	if (keyIsDown(68)){
		offsetDelta.x += 1;
	}

	/* update camera*/
	var moveSpeed = camera.moveSpeed * (1/camera.zoom);
	camera.xOffset += moveSpeed * deltaTime * offsetDelta.x;
	camera.yOffset += moveSpeed * deltaTime * offsetDelta.y;
	camera.zoom = constrain(camera.zoom, cameraOutMax, cameraInMax);
}

function iterateSystemConnections(){

	for (var i=0 ; i<systems.length; i++){

		push();
		stroke(50);

		for (var j = 0; j < systems[i].near.length; j++){

			// check to not double-draw lines
			if (systems[i].near[j] > i) {

				// frustrum cull lines
				if (camera.inBounds(systems[i].loc) || camera.inBounds(systems[systems[i].near[j]].loc)) {
					// draw line
					var adj1 = camera.w2s(systems[i].loc);
					var adj2 = camera.w2s(systems[systems[i].near[j]].loc);
					line(adj1.x, adj1.y, adj2.x, adj2.y);
                }

			}
		}
		pop();
	}
}

function iterateSystems(){

	// draw systems themselves
	for (var i = 0; i < systems.length; i++){


		// check if system in camera bounds
		if (camera.inBounds(systems[i].loc)) {
			systems[i].draw();
		}


		if (!(systems[i].faction == NO_FACTION)) {

			if (systems[i].ships.length < BIRTH_CONTROL) {
				if (random() < (SYSTEM_SPAWN_SHIP_CHANCE * (deltaTime / 1000) * GLOBAL_TIME_FACTOR)) {
					shipIndex = ships.length;
					ships.push(new Ship(systems[i].faction, i, shipIndex));
					systems[i].ships.push(shipIndex);
				}
			}
		}


		if (systems[i].localFactions.length > 1) {

			var deadShips = [];
			for (var ship of shuffle(systems[i].ships)) {

				// get list of enemy ships
				var enemyShips = [];
				for (var qShip of systems[i].ships) {
					if (ships[qShip].faction != ships[ship].faction) {
						enemyShips.push(qShip);
					}
				}

				// check to see if a ship has scored a kill
				if (random() < SHIP_CHANCE_TO_KILL * (deltaTime / 1000) * GLOBAL_TIME_FACTOR) {
					deadShip = random(enemyShips);
					deadShips.push(deadShip);
				}
			}

			// kill dead ships in system
			for (var deadShip of deadShips) {

				ships.splice(deadShip, 1);
				systems[i].removeShip(deadShip);
			}
		}

	}

	
	
}

function iterateShips(){

	for (var i = 0; i < ships.length; i++){

		ships[i].update();

		// random walk the ships
		if (!(ships[i].inWarp)) {
			let r = random();
			if (r < SHIP_RANDOM_WALK_CHANCE * (deltaTime/1000) * GLOBAL_TIME_FACTOR) {
				//console.log(SHIP_RANDOM_WALK_CHANCE, r, (deltaTime/1000), GLOBAL_TIME_FACTOR);

				// flocking
				let found = false;





				let nearSystems = shuffle(systems[ships[i].system].near);

				for (s = 0; s < nearSystems.length; s++) {

					// NO FACTION
					if (systems[nearSystems[s]].getFaction() == NO_FACTION) {
						if (random() < SHIP_UNEXPLORED_ATTRACTIVENESS) {
							ships[i].travel(nearSystems[s]);
							found = true;
						}
					}


					// SAME FACTION
					else if (systems[nearSystems[s]].getFaction() == ships[i].getFaction()) {
						if (random() < SHIP_SAME_FACTION_ATTRACTIVENESS){
							ships[i].travel(nearSystems[s]);
							found = true;
                        }
					}

					// OTHER FACTION
					else if (systems[nearSystems[s]].getFaction() != ships[i].getFaction()) {
						if (random() < SHIP_OTHER_FACTION_ATTRACTIVENESS) {
							ships[i].travel(nearSystems[s]);
							found = true;
						}
					}

					if (found) {
						break;
                    }

				}
				if (!(found)) {
					ships[i].travel(random(systems[ships[i].system].near));
                }
			}
		}

		// frustrum cull the ships
		else if (camera.inBounds(ships[i].loc)) {
			ships[i].draw();
        }
	}
}

function debugInfo(){

	push();
	stroke(255);
	fill(255);
	noStroke();
	textFont('Georgia');
	text('camera.zoom :  ' + camera.zoom.toFixed(2), 25, 25);
	text('camera.offset :  ' + camera.xOffset.toFixed(0) + ' , ' + camera.yOffset.toFixed(0), 25, 40);
	text('FPS:  ' + frameRate().toFixed(0), 25, 55);
	pop();
	push();




}


function draw() {

	background(0);
	inputHandler();
	if (camera.zoom>0.2){
		iterateSystemConnections();
	}
	iterateSystems();
	iterateShips();
	debugInfo();
}