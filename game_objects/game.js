var World = require('./world');

worldConfig = {
	islandsNum: 10
}

function Game() {
	this.world = new World(worldConfig);
	this.players = [];
	this.turn = 0;
}

Game.prototype.addPlayer = function(player) {
	this.players.push(player);
}

module.exports = Game;