var fs = require('fs');
global.climateZonesData = JSON.parse(fs.readFileSync('./data/climate_zones.json', 'utf8'));
global.resourcesData = JSON.parse(fs.readFileSync('./data/resources.json', 'utf8'));

var Game = require('./game_objects/game');

var game = new Game();

for (var i = 0; i < 100; i++) {
 	game.endTurn();	
}
