

/* WORLD PARAMETERS */
// TODO Implement in "World" class

factions = [];
systems = [];
ships = [];

/* world generation parameters */
N_SHIPS = 750;

/* poisson sampling parameters for constellation generation */
WGEN_PS_MAX_DIST = 75; // maximum world distance between stars
WGEN_PS_BUFFER = 20;
WGEN_PS_N_SAMPLES_BEFORE_REJECTION = 3; // higher numbers result in more uniform distribution


NO_FACTION = new Faction('No Faction', { r: 100, g: 100, b: 100 }); 

factions.push(new Faction('Red Faction', { r: 255, g: 0, b: 0 }));
factions.push(new Faction('Green Faction', { r: 0, g: 255, b: 0 }));
factions.push(new Faction('Cyan Faction', { r: 0, g: 255, b: 255 }));
factions.push(new Faction('Purple Faction', { r: 255, g: 0, b: 255 }));
factions.push(new Faction('Yellow Faction', { r: 255, g: 255, b: 0 }));

// SHIP AI
SHIP_RANDOM_WALK_CHANCE = 0.1 // per second (adjusted for GLOBAL_TIME_FACTOR)


// global time factor
GLOBAL_TIME_FACTOR = 3;



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
MAINCAMERA_START_ZOOM = 0.8;
MAINCAMERA_ZOOM_SPEED = 0.001;

// offset
MAINCAMERA_START_POS = {x:SCREEN_X/2, y:SCREEN_Y/2};
MAINCAMERA_MOVE_SPEED = 0.1;

