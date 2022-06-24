

/* squared distance function */
function distSqrd (c1, c2) {
	return abs(pow(c2.x-c1.x, 2) + pow(c2.y-c1.y, 2));
}

/* return shuffled array */
function shuffle(a) {
    var j, x, i;
    var a2 = a;
    for (i = a2.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a2[i];
        a2[i] = a2[j];
        a2[j] = x;
    }
    return a2;
}

/* get nearest neighbours */
function getNear(targeti, group, distance){
	var near = []
	for (var i=0; i<group.length; i++){
		if (i==targeti){
			continue;
		}
		if (distSqrd(group[targeti].loc, group[i].loc) <= sq(distance)){
			near.push(i);
		}
	}
	return near;
}

/* returns index of object from list closest to target vector */
function getClosestObject (targetVector, arrayOfObjects) {
	if (arrayOfObjects.length > 0) {
		var minDist = distSqrd(targetVector, arrayOfObjects[0].loc);
		var minIndex = 0;
		for (var i = 1; i < arrayOfObjects.length; i++) {
			var dist = distSqrd(targetVector, arrayOfObjects[i].loc);
			if (dist <= minDist) {
				minDist = dist;
				minIndex = i;
			}
		}
		return minIndex;
	} else {
		return -1;
	}
}

/* remove unique member of array by value */
function remove_from_array(arr, value){
	for (var i=0; i<arr.length;i++){
		if (arr[i]==value){
			arr.splice(i, 1);
			break;
		}
	}
}

/* lerp vector function */
function lerpVector (c1, c2, t) {
	return {x:c1.x * (1-t) + c2.x * t, y:c1.y * (1-t) + c2.y * t};
}

/* poisson disc sampling algorithm */
function generatePoints(radius, max_x, max_y, buffer = 10, numSamplesBeforeRejection = 30){

	/* create a grid */
	var cellSize = radius/sqrt(2);
	var grid = []
	for (var x=0; x<max_x/cellSize; x++){
		grid.push([])
		for (var y=0; y<max_y/cellSize;y++){
			grid[x].push(0);
		}
	}

	var points = [];
	var spawnPoints = [];
	spawnPoints.push(createVector(max_x/2, max_y/2));

	/* identify parent point for spawning */
	while (spawnPoints.length > 0){
		var spawnIndex = int(random(spawnPoints.length));
		var spawnCentre = spawnPoints[spawnIndex]; 
		var candidateAccepted = false;

		/* create a candidate point in a random surrounding grid */
		for (var i=0; i<numSamplesBeforeRejection; i++){
			var angle = random(TWO_PI);
			var dir = createVector(sin(angle), cos(angle));
			var candidate = p5.Vector.add(spawnCentre, dir.mult(random(radius, 2*radius)));

			/* check for other points in its surrounding grids */
			if (isValid(candidate, max_x, max_y, cellSize, points, grid, radius, buffer)){
				/* accept a new point */
				points.push(createVector(candidate.x, candidate.y));
				spawnPoints.push(createVector(candidate.x, candidate.y));
				grid[int(candidate.x/cellSize)][int(candidate.y/cellSize)] = points.length;
				candidateAccepted = true;
				break;
			}
		}

		/* remove exhausted spawnpoints */
		if (!candidateAccepted){
			spawnPoints.splice(spawnIndex, 1);
		}
	}
	return points;
}

/* helper function for generatePoints() */
function isValid(candidate, max_x, max_y, cellSize, points, grid, radius, buffer){
	if (candidate.x >=buffer && candidate.x < max_x - buffer && candidate.y >= buffer && candidate.y<max_y-buffer){
		var cellX = int(candidate.x/cellSize);
		var cellY = int(candidate.y/cellSize);

		var searchStartX = max(0, cellX-2);
		var searchEndX = min(cellX+2, grid.length-1)
		var searchStartY = max(0, cellY-2);
		var searchEndY = min(cellY+2, grid[0].length-1)

		for (var x=searchStartX; x<=searchEndX; x++){
			for (var y=searchStartY; y<=searchEndY; y++){
				var pointIndex = grid[x][y]-1;   
				if (pointIndex != -1){
					var dst = p5.Vector.add(candidate, p5.Vector.mult(points[pointIndex], -1)).mag();
					if (dst < radius){
						return false;
					}
				}
			}
		}

		return true;
	}
	return false;
}

/* generates names for stars */
function genStarName(){
    /* this function returns a realistic sounding planet name */
    starNames = ['Andromeda','Antlia','Apus','Aquarius','Aquila','Ara','Aries','Auriga','Boötes',
			    'Caelum','Camelopardalis','Cancer','Canes Venatici','Canis Superior','Canis Inferior',
			    'Capricornus','Carina','Cassiopeia','Centaurus','Cepheus','Cetus','Chamaeleon','Circinus',
			    'Columba','Coma Berenices','Corona Australis','Corona Borealis','Corvus','Crater','Crux',
			    'Cygnus','Delphinus','Dorado','Draco','Equuleus','Eridanus','Fornax','Gemini','Grus','Hercules',
			    'Horologium','Hydra','Hydrus','Indus','Lacerta','Leo ','Lepus','Libra','Lupus','Lynx',
			    'Lyra','Mensa','Microscopium','Monoceros','Musca','Norma','Octans','Ophiuchus','Orion',
			    'Pavo','Pegasus','Perseus','Phoenix','Pictor','Pisces','Piscis','Austrinus','Puppis','Pyxis',
			    'Reticulum','Sagitta','Sagittarius','Scorpius','Sculptor','Scutum','Serpens','Sextans',
			    'Taurus','Telescopium','Triangulum','Triangulum Australe','Tucana','Ursa Major','Ursa Minor',
			    'Vela','Virgo','Volans','Vulpecula'];

    suffixes = ['Prime', 'Alpha', 'Beta', 'Theta', 'Gamma', 'Delta', 'Epsillon',
    			'Zeta', 'Eta', 'Iota', 'Kappa', 'Lambda', 'Omicron', 'Pi', 'Rho',
    			'Sigma', 'Tau', 'Upsillon', 'Phi', 'Chi', 'Psi', 'Omega', 'Major', 'Minor'];

    numbers = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII',
    			'XIV', 'XV', 'XVI'];
    name = random(starNames);
    if (random()<0.2){ 
        name += ' ' + random(suffixes);
    }
    /*
    if (random()<0.3){ 
        name += ' ' + random(numbers);
    }
    */
    return name;
}
