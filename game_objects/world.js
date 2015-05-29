var climateZones = require('./climatezone');
var stochasm = require('stochasm');
var Island = require('./Island');
var fs = require('fs');

function World(globalConfig, eventEmitter) {
	this.globalConfig = globalConfig;
	this.climateZones = {};
	this.islands = {};
	this.ee = eventEmitter;

	this.ee.on('turnPassed', this._turnPassed.bind(this));

	this._generateIslands();
}

World.prototype._generateIslands = function() {
	var climateZonesNum = Object.keys(climateZones).length;

	var normalGenerator = stochasm({
		kind: "integer",
		mean: Math.floor(climateZonesNum / 2), 
		stdev: 2, 
		min: 1,
		max: climateZonesNum
	});

	for (var i = 0; i < this.globalConfig.islandsNum; i++) {
		this.addIsland(new Island(this.ee, normalGenerator.next()));
	}
}

World.prototype.addIsland = function(island) {
	this.islands[island['id']] = island;
}

World.prototype.destroyIsland = function(id) {
	if (this.islands[id].ownerId) {
		this.ee.emit('gameLose', {
			'playerId': this.islands[id].ownerId,
			'reason': 'islandHaveFallen'
		})
	}
	console.log('destroying island ' + id);
	delete this.islands[id];
}

World.prototype._turnPassed = function(turn) {
	console.log('passed turn ' + turn);
	for (var id in this.islands) {
		this.islands[id].fall();
	}
}

module.exports = World;
