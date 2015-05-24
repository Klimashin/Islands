var World = require('./game_objects/world');

worldConfig = {
	islandsNum: 10
}

var world = new World(worldConfig);
console.log(world);