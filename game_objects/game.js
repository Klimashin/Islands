var randomizer = require('../lib/random_generator');

var World = require('./world');
var EventEmitter = require("events").EventEmitter;
var gameId = 0;

worldConfig = {
	islandCreationChance: 1
}

function Game(io) {
	this.ee = new EventEmitter();
	this.io = io;
	this['id'] = randomizer.generateRandomString();
	this.started = false;
	this.players = [];

	this.world = new World(worldConfig, this.ee);
	this.turn = 0;
	this.messages = '';

	this.ee.on('island:destroy', this.processIslandHaveFallen.bind(this));
	this.ee.on('island:climate-zone-changed', this.processClimateZoneChanged.bind(this));
}

Game.prototype.addPlayer = function(player) {
	console.log('joined player ' + player.socket.id);
	this.players.push(player);
	player.gameId = this.id;
}

Game.prototype.endTurn = function() {
	//end turn related logic
	this.turn++;
	this.world.processEndOfTurn();
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

	for (id in this.players) {
		this.players[id].socket.emit('game-message', 'GAME STARTED');
	}
}

module.exports = Game;