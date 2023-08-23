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