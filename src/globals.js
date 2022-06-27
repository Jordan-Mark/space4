

/* WORLD PARAMETERS */
// TODO Implement in "World" class

factions = [];
systems = [];
ships = [];


NO_FACTION = new Faction('No Faction', { r: 100, g: 100, b: 100 }); 

factions.push(new Faction('Red Faction', { r: 255, g: 0, b: 0 }));
factions.push(new Faction('Green Faction', { r: 0, g: 255, b: 0 }));
factions.push(new Faction('Cyan Faction', { r: 0, g: 255, b: 255 }));
//factions.push(new Faction('Purple Faction', { r: 255, g: 0, b: 255 }));
//factions.push(new Faction('Yellow Faction', { r: 255, g: 255, b: 0 }));

// world gen params
N_SHIPS = 100;




/* GLOBAL DRAW PARAMETERS */

// screen globals
SCREEN_X = window.innerWidth;
SCREEN_Y = window.innerHeight;



