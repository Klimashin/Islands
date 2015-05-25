var World = require('./game_objects/world');
var fs = require('fs');

global.climateZonesData = JSON.parse(fs.readFileSync('./data/climate_zones.json', 'utf8'));
global.resourcesData = JSON.parse(fs.readFileSync('./data/resources.json', 'utf8'));

worldConfig = {
	islandsNum: 10
}

var world = new World(worldConfig);
console.log(world);