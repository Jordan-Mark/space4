

class WorldGenerator {

    constructor () {
    }

    create() {
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
    WGEN_PS_N_SAMPLES_BEFORE_REJECTION = 2; // redundant????

    create(size, gridSize) {
        this.size = size;
        this.gridSize = gridSize;
        this.world = new BasicWorld(size, gridSize);
    }
    
    createStars(n_stars) {
        // create some test stars
        /*
        for (var i = 0; i < n_stars; i++) {
            this.world.addStar(new Star({ x: random(this.size.x), y: random(this.size.y) }, random(this.world.getFactions())));
        }
        */

        // create system objects

        var pos_vectors = this.genPoints(this.STAR_MAX_DIST, this.size.x, this.size.y, this.WGEN_PS_BUFFER, this.WGEN_PS_N_SAMPLES_BEFORE_REJECTION);

        for (var i=0; i<pos_vectors.length; i++){
            this.world.addStar(new Star({ x: pos_vectors[i].x, y: pos_vectors[i].y }, random(this.world.getFactions()), name=this.genStarName()));
        }

    }

    /* poisson disc sampling algorithm */
    genPoints(radius, max_x, max_y, buffer = 10, nsbr = 30){


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
        var starNames = ['Andromeda','Antlia','Apus','Aquarius','Aquila','Ara','Aries','Auriga','Bo??tes',
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