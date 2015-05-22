var World = require('./world');

worldConfig = {
	climateZonesNum: 10,
	islandsNum: 10
}

var world = new World(worldConfig);
console.log(world);