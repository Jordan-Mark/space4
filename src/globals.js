

/* WORLD PARAMETERS */
// TODO Implement in "World" class

factions = [];
systems = [];
ships = [];

/* world generation parameters */
N_SHIPS = 4;

/* poisson sampling parameters for constellation generation */
WGEN_PS_MAX_DIST = 50; // maximum world distance between stars
WGEN_PS_BUFFER = 0;

// this is redundant right now
WGEN_PS_N_SAMPLES_BEFORE_REJECTION = 2; // higher numbers result in more uniform distribution


WORLD_BOUNDS = { x: 5000, y: 5000 };




NO_FACTION = new Faction('No Faction', { r: 100, g: 100, b: 100 }); 

factions.push(new Faction('Red Faction', { r: 255, g: 0, b: 0 }));
factions.push(new Faction('Green Faction', { r: 0, g: 255, b: 0 }));
factions.push(new Faction('Cyan Faction', { r: 0, g: 255, b: 255 }));
factions.push(new Faction('Purple Faction', { r: 255, g: 0, b: 255 }));
factions.push(new Faction('Yellow Faction', { r: 255, g: 255, b: 0 }));

// SHIP AI



SHIP_RANDOM_WALK_CHANCE = 0.5; // per second (adjusted for GLOBAL_TIME_FACTOR)
SHIP_UNEXPLORED_ATTRACTIVENESS = 1;
SHIP_SAME_FACTION_ATTRACTIVENESS = 0;
SHIP_OTHER_FACTION_ATTRACTIVENESS = 0;



// SYSTEM AI
SYSTEM_SPAWN_SHIP_CHANCE = 1/30;
BIRTH_CONTROL = 1;



// global time factor
GLOBAL_TIME_FACTOR = 1;



/* GLOBAL DRAW PARAMETERS */

// screen globals
SCREEN_X = window.innerWidth;
SCREEN_Y = window.innerHeight;

// zoom complexity culling
SYSTEM_DRAW_DESC_ZOOM_THRESHOLD = 0.9;
SHIP_DRAW_ZOOM_THRESHOLD = 0.2;

// system description draw vars
SYSTEM_DRAW_DESC_NAME_OFFSET = {x:10, y:-15};
SYSTEM_DRAW_DESC_FACTION_OFFSET = {x:10, y:0};


/* MAIN CAMERA PARAMETERS */

// zoom
MAINCAMERA_IN_MAX = 4;
MAINCAMERA_OUT_MAX = 0.05;
MAINCAMERA_START_ZOOM = 0.5;
MAINCAMERA_ZOOM_SPEED = 0.001;

// offset
MAINCAMERA_START_POS = { x: WORLD_BOUNDS.x / 2, y: WORLD_BOUNDS.y / 2 };
MAINCAMERA_MOVE_SPEED = 0.1;

