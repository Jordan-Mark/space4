
/* define globals */
factions = [];
systems = [];
ships = [];
NO_FACTION = new Faction('No Faction', {r:100,g:100,b:100});
TEST_FACTION1 = new Faction('Test1 Faction', {r:255,g:0,b:0});
TEST_FACTION2 = new Faction('Test2 Faction', { r: 0, g: 255, b: 0 });

// screen globals
SCREEN_X = window.innerWidth;
SCREEN_Y = window.innerHeight;

function generateWorld(star_max_dist){
	var sys = [];
	// use poisson sampling to get an array of position vectors
	var pos_vectors = generatePoints(star_max_dist, width, height, 40, 2);

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

function setup(){
	createCanvas(SCREEN_X, SCREEN_Y);
	systems = generateWorld(150);

	camera = new Camera(width/2, height/2, width, height);
	cameraInMax = 4;
	cameraOutMax = 0.05;

	/* spawn ship */
	for (var i=0; i<250; i++){
		var test_system = int(random(systems.length));
		ships.push(new Ship(random([TEST_FACTION1, TEST_FACTION2]), test_system, i));
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

function input_handler(){
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

function iterate_system_connections(){
	for (var i=0 ; i<systems.length; i++){
		push();
		stroke(50);
		for (var j=0; j<systems[i].near.length; j++){
			if (systems[i].near[j] < i){
				var adj1 = camera.w2s(systems[i].loc);
				var adj2 = camera.w2s(systems[systems[i].near[j]].loc);
				line(adj1.x, adj1.y, adj2.x, adj2.y);
			}
		}
		pop();
	}
}

function iterate_systems(){
	// draw systems themselves
	for (var i=0 ; i<systems.length; i++){
		systems[i].draw();
		var sysLoc = systems[i].loc;
		var screenLoc = camera.w2s(sysLoc);

		/* system world coordinates
		fill(255);
		text('x:'+str(sysLoc.x).slice(0, 3) + 'y:' + str(sysLoc.y).slice(0, 3), screenLoc.x, screenLoc.y);
		*/
	}
}

function iterate_ships(){
	for (var i=0; i<ships.length;i++){
		ships[i].update();
		if (!(ships[i].inWarp)){
			if (random(500) < 1){
				ships[i].travel(random(systems[ships[i].system].near));
			}
		}
	}
}

function debug_info(){

	push();
	stroke(255);
	fill(255);
	textFont('Georgia');
	var digits = 3;
	text('camera.zoom :  ' + (''+camera.zoom).slice(0, digits), 25, 25);
	text('offset :  ' + str((''+camera.xOffset).slice(0, digits)) + ' , ' + str((''+camera.yOffset).slice(0, digits)), 25, 40);
	text('FPS:  ' + str(frameRate()).slice(0,5), 25, 55);
	pop();
	push();



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


}


function draw() {



	background(0);
	input_handler();
	if (camera.zoom>0.2){
		iterate_system_connections();
	}
	iterate_systems();
	iterate_ships();
	debug_info();
}