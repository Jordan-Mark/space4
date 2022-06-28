


function generateWorld(star_max_dist) {

	var sys = [];
	// use poisson sampling to get an array of position vectors
	var pos_vectors = genPoints(star_max_dist, width, height, WGEN_PS_BUFFER, WGEN_PS_N_SAMPLES_BEFORE_REJECTION);

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
	}
}

function iterateShips(){

	for (var i = 0; i < ships.length; i++){

		ships[i].update();

		// random walk the ships
		if (!(ships[i].inWarp)) {
			if (random(500) < 1) {
				ships[i].travel(random(systems[ships[i].system].near));
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


	//system world coordinates
	/*
	for (var i = 0; i < systems.length; i++) {
		var sysLoc = systems[i].loc;
		var screenLoc = camera.w2s(sysLoc);
		fill(255);
		text('x:' + sysLoc.x.toFixed(0) + '\ny:' + sysLoc.y.toFixed(0), screenLoc.x, screenLoc.y);
	}
	*/
	/*
	// find closest star (index: mainSys)
	var selectionRadius = 40**2;
	var mouseVector = {x:mouseX,y:mouseY};
	var worldMouseCoords = camera.s2w(mouseVector);
	mainSys = getClosestObject(worldMouseCoords, systems);


	// check if not too far away. -- highlight closest star
	if (camera.zoom < 0.9){
		var sqdist2ToClosestStar = distSqrd(mouseVector, camera.w2s(systems[mainSys].loc));
		if (sqdist2ToClosestStar<selectionRadius){
			systems[mainSys].draw_desc();
		}
	}


	// else find closest ship and hightlight 
	else {
		mainShip = getClosestObject(worldMouseCoords, ships);
		var sqdist2ToClosestShip = distSqrd(mouseVector, camera.w2s(ships[mainShip].loc));
		if (sqdist2ToClosestShip<(selectionRadius*2)){
			if (ships[mainShip].inWarp){
				ships[mainShip].draw_desc();	
			}

		}
	}
	*/

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