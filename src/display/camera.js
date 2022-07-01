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

	report() {
		console.log(this.xOffset);
		console.log(this.yOffset);
		console.log(this.zoom);
    }

	s2w(screenC) {
		return {
			x: (screenC.x - (this.screenW / 2)) / this.zoom + this.xOffset,
			y: (screenC.y - (this.screenH / 2)) / this.zoom + this.yOffset
		}
	}

	w2s(worldC) {
		return {
			x: (this.screenW / 2) + (-this.xOffset + worldC.x) * this.zoom,
			y: (this.screenH / 2) + (-this.yOffset + worldC.y) * this.zoom
		};
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

