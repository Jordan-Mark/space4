

/* squared distance function */
function distSqrd(c1, c2) {
	return abs(pow(c2.x - c1.x, 2) + pow(c2.y - c1.y, 2));
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
function getNear(targeti, group, distance) {
	var near = []
	for (var i = 0; i < group.length; i++) {
		if (i == targeti) {
			continue;
		}
		if (distSqrd(group[targeti].loc, group[i].loc) <= sq(distance)) {
			near.push(i);
		}
	}
	return near;
}

/* returns index of object from list closest to target vector */
function getClosestObject(targetVector, arrayOfObjects) {

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
function removeFromArr(arr, value) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] == value) {
			arr.splice(i, 1);
			break;
		}
	}
}

/* lerp vector function */
function lerpVector(c1, c2, t) {
	return { x: c1.x * (1 - t) + c2.x * t, y: c1.y * (1 - t) + c2.y * t };
}
