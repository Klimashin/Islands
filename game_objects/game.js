var World = require('./world');
var EventEmitter = require("events").EventEmitter;
var gameId = 0;

worldConfig = {
	islandsNum: 10
}

function Game(io, player) {
	this.ee = new EventEmitter();
	this.io = io;
	this.creator = player;
	this['id'] = gameId++;
	this.started = false;

	this.world = new World(worldConfig, this.ee);
	this.players = [this.creator];
	this.turn = 0;
	this.messages = '';

	this.ee.on('islandHaveFallen', this.processIslandHaveFallen.bind(this));

	this.ee.on('gameLose', this.processGameLose.bind(this));

	this.ee.on('islandClimateZoneChanged', this.processClimateZoneChanged.bind(this));
}

Game.prototype.addPlayer = function(player) {
	console.log('joined player ' + player.socket.id)
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

Game.prototype.processClimateZoneChanged = function (data) {
	var message = 'island ' + data.id + ' climate zone changed to ' + data.name;
	this.io.emit('game-message', message);
}

Game.prototype.start = function() {
	this.started = true;
	console.log('game started');
	for (id in this.palyers) {
		this.players[id].socket.emit('game-message', 'GAME STARTED');
	}
}

module.exports = Game;