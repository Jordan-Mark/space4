class NearbyStarHighlightManager extends GameScript {

    WORLD_SEARCH_RADIUS = 50;

    constructor() {
        super();
        this.active = false;
        this.star = null;
    }

    start(){
        this.active = true;
    }

    stop(){
        this.active = false;
    }

    getStar(){
        return this.star; // id
    }

    tick(world) {
        super.tick()

        if (this.active){


            let world_mouse = game.display.camera.s2w({ x: mouseX, y: mouseY });
            var nearbyStars = []; 

            // query grid for nearby entities in radius
            var nearbyEnts = world.getEntsInR(world_mouse, this.WORLD_SEARCH_RADIUS)
            // filter out for star entities (seems innefficient -- but actually, i think it might be just as fast)
            for (var i=0; i<nearbyEnts.length; i++){
                var entID = nearbyEnts[i];
                if (world.getStars().includes(entID)){
                    nearbyStars.push(entID);
                }
            }
            
            var closestStar = null;
            var shortestDistance = Infinity;

            if (!nearbyStars.length==0){
                closestStar=nearbyStars[0];

            }
            for (var starID of nearbyStars){
                var d = distance(world.get(starID).getPos(), world_mouse);
                if (d<shortestDistance){
                    starID = closestStar;
                    shortestDistance=d;
                }

            }

            // unhighlight old star, rehiglight star (if they exist)
            this.star && world.get(this.star).unHighlight();
            this.star = closestStar;
            this.star && world.get(this.star).highlight();

        }
    }

 
}