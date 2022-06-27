

/* WORLD PARAMETERS */
// TODO Implement in "World" class

factions = [];
systems = [];
ships = [];


NO_FACTION = new Faction('No Faction', { r: 100, g: 100, b: 100 }); 



/* world generation parameters */
N_SHIPS = 10;

factions.push(new Faction('Red Faction', { r: 255, g: 0, b: 0 }));
factions.push(new Faction('Green Faction', { r: 0, g: 255, b: 0 }));
factions.push(new Faction('Cyan Faction', { r: 0, g: 255, b: 255 }));
//  factions.push(new Faction('Purple Faction', { r: 255, g: 0, b: 255 }));
//  factions.push(new Faction('Yellow Faction', { r: 255, g: 255, b: 0 }));


/* GLOBAL DRAW PARAMETERS */

// screen globals
SCREEN_X = window.innerWidth;
SCREEN_Y = window.innerHeight;

// zoom complexity culling
SYSTEM_DRAW_DESC_ZOOM_THRESHOLD = 0.9;
SHIP_DRAW_ZOOM_THRESHOLD = 0.2;

// system description draw vars
SYSTEM_DRAW_DESC_NAME_OFFSET = {x:10, y:-10};
SYSTEM_DRAW_DESC_FACTION_OFFSET = {x:10, y:5};
