

class WorldGenerator {

    constructor () {
    }

    create(size, gridSize) {
        this.size = size;
        this.gridSize = gridSize;
        this.world = new World();
    }

    export() {
        return this.world;
    }
}


class BasicWorldGenerator extends WorldGenerator {

    STAR_MAX_DIST = 50;
    WGEN_PS_BUFFER = 0;
    MIN_STARS = 10; // try and create a world with at least this many stars
    MAX_STARS = 20;
    MIN_STARS_TIMEOUT = 3 // if there has been x attempts to create a world with at least MIN_STARS, give up

    /* initiate empty world */
    create(size, gridSize) {
        this.size = size;
        this.gridSize = gridSize;
        this.world = new BasicWorld(size, gridSize);
    }

    /* populate world with stars */
    createStars() {

        var valid_world = false;

        for (var i = 0; i < this.MIN_STARS_TIMEOUT; i++) {
            var pos_vectors = this.genPoints(this.STAR_MAX_DIST, this.size.x, this.size.y, this.WGEN_PS_BUFFER);
            if (pos_vectors.length >= this.MIN_STARS) {
                valid_world = true;
                break;
            }
            console.log("failed to generate world with suffient stars, retrying ...");
        }

        if (!valid_world) {
            console.log("failed to generate world with ", this.MIN_STARS, " n of stars after", this.MIN_STARS_TIMEOUT, "attempts" );
        }

        for (var i=0; i<pos_vectors.length; i++){
            this.world.addStar(new Star({ x: pos_vectors[i].x, y: pos_vectors[i].y }, /*this.world.get(random(this.world.getFactions()))*/ this.world.NO_FACTION, name=this.genStarName()));
        }

        console.log("present world generated w/", this.world.getStars().length, "stars.");
    }

    /* calculate connections for all stars */
    connectStars() {

        var connections_made = []; // list of stars [id] with connections already made for them

        for (var starID of this.world.getStars()) {
            var star = this.world.get(starID);
            var nearbyEnts = this.world.getEntsInR(star.pos, this.STAR_MAX_DIST*2);
            for (var entID of nearbyEnts) { // todo make this and the next line more efficient. seems unnessercary or the wrong order or smthn.
                if (!(connections_made.includes(entID))){
                    if (this.world.getStars().includes(entID) && entID != starID) {
                        var ent = this.world.get(entID);
                        
                        ent.addCon(starID);
                        star.addCon(entID);
                        var connection = new Connection (starID, entID);
                        this.world.addConnection(connection);
                    }
                }
            }
            connections_made.push(starID);
        }
    }



    /* implementation of poisson disc sampling algorithm */
    genPoints(radius, max_x, max_y, buffer = 10){


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

        spawnPoints.push(createVector(max_x / 2, max_y / 2));

        /* identify parent point for spawning */
        while (spawnPoints.length > 0){
            var spawnIndex = int(random(spawnPoints.length));
            var spawnCentre = spawnPoints[spawnIndex]; 
            var candidateAccepted = false;

            /* create a candidate point in a random surrounding grid */
            


            //let numSamplesBeforeRejection = Math.min(Math.max(3000 - (points.length*5), 1), 3);
            let noiseScale = 100;
            let gradient = 1 - Math.min((points.length / 5000), 0.5) // needs to start around 1 and go to 0.5
            let nsbr = noise(spawnCentre.x * noiseScale, spawnCentre.y * noiseScale) * 1.5 + gradient;

            nsbr = Math.round(nsbr);
 

            // nsbr 1 fails quickly
            // nsbr 2 sometimes fails
            // nsbr 3 is patchy but stable


            for (var i=0; i<nsbr; i++){
                var angle = random(TWO_PI);
                var dir = createVector(sin(angle), cos(angle));
                var candidate = p5.Vector.add(spawnCentre, dir.mult(random(radius, 2*radius)));

                /* check for other points in its surrounding grids */
                if (this.isValid(candidate, max_x, max_y, cellSize, points, grid, radius, buffer)){
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

            if (points.length >= this.MAX_STARS){
                break;
            }
        }
        return points;
    }

    /* helper function for generatePoints() */
    isValid(candidate, max_x, max_y, cellSize, points, grid, radius, buffer){
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
    genStarName(){
        /* this function returns a realistic sounding planet name */
        var starNames = ['Andromeda','Antlia','Apus','Aquarius','Aquila','Ara','Aries','Auriga','Boötes',
                    'Caelum','Camelopardalis','Cancer','Canes Venatici','Canis Superior','Canis Inferior',
                    'Capricornus','Carina','Cassiopeia','Centaurus','Cepheus','Cetus','Chamaeleon','Circinus',
                    'Columba','Coma Berenices','Corona Australis','Corona Borealis','Corvus','Crater','Crux',
                    'Cygnus','Delphinus','Dorado','Draco','Equuleus','Eridanus','Fornax','Gemini','Grus','Hercules',
                    'Horologium','Hydra','Hydrus','Indus','Lacerta','Leo ','Lepus','Libra','Lupus','Lynx',
                    'Lyra','Mensa','Microscopium','Monoceros','Musca','Norma','Octans','Ophiuchus','Orion',
                    'Pavo','Pegasus','Perseus','Phoenix','Pictor','Pisces','Piscis','Austrinus','Puppis','Pyxis',
                    'Reticulum','Sagitta','Sagittarius','Scorpius','Sculptor','Scutum','Serpens','Sextans',
                    'Taurus','Telescopium','Triangulum','Triangulum Australe','Tucana','Ursa Major','Ursa Minor',
            'Vela', 'Virgo', 'Volans', 'Vulpecula'];

        var suffixes = ['Prime', 'Alpha', 'Beta', 'Theta', 'Gamma', 'Delta', 'Epsillon',
                    'Zeta', 'Eta', 'Iota', 'Kappa', 'Lambda', 'Omicron', 'Pi', 'Rho',
                    'Sigma', 'Tau', 'Upsillon', 'Phi', 'Chi', 'Psi', 'Omega', 'Major', 'Minor'];

        var numbers = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII',
                    'XIV', 'XV', 'XVI'];
        var name = random(starNames);
        if (random()<0.2){ 
            name += ' ' + random(suffixes);
        }
        
        if (random()<0.2){ 
            name += ' ' + random(numbers);
        }
        
        return name;
    }

    createFactions(n_factions) {

        // no faction
        
        for (var i = 0; i < n_factions; i++) {
            this.world.addFaction(new Faction('Faction' + i.toString(), { r: Math.random() * 255, g: Math.random() * 255, b: Math.random() * 255 }))
        }

    }

}




