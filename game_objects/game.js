var World = require('./world');
var EventEmitter = require("events").EventEmitter;

worldConfig = {
	islandsNum: 10
}

function Game() {
	this.ee = new EventEmitter();
	this.world = new World(worldConfig, this.ee);
	this.players = [];
	this.turn = 0;

	this.ee.on('islandHaveFallen', this.processIslandHaveFallen.bind(this));

	this.ee.on('gameLose', this.processGameLose.bind(this));

	this.ee.on('islandClimateZoneChanged', function (data) {console.log('island ' + data.id + ' climate zone changed to ' + data.name)});
}

Game.prototype.addPlayer = function(player) {
	this.players.push(player);
}

Game.prototype.endTurn = function() {
	//end turn related logic
	this.turn++;
	this.ee.emit('turnPassed', this.turn);
}

Game.prototype.processIslandHaveFallen = function(islandId) {
	this.world.destroyIsland(islandId);
}

Game.prototype.processGameLose = function(eventData) {
	//implement me
}

module.exports = Game;