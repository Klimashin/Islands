var climateZones = require('./climatezone');
var stochasm = require('stochasm');
var Island = require('./Island');
var fs = require('fs');
var randomizer = require('../lib/random_generator');

function World(globalConfig, eventEmitter) {
	this.globalConfig = globalConfig;
	this.climateZones = climateZones;
	this.islands = [];
	this.ee = eventEmitter;
}

World.prototype.addIsland = function() {
	var island = new Island(this.ee);
	this.islands[island['id']] = island;
}

World.prototype.destroyIsland = function(id) {
	if (this.islands[id].ownerId) {
		this.ee.emit('gameLose', {
			'playerId': this.islands[id].ownerId,
			'reason': 'islandHaveFallen'
		})
	}

	delete this.islands[id];
}

World.prototype.processEndOfTurn = function() {
	for (var id in this.islands) {
		this.islands[id].processEndOfTurn();
	}

	if (randomizer.checkProbability(this.globalConfig.islandCreationChance)) {
		this.addIsland();
	}	
}

World.prototype.getRepresentation = function() {
	var representation = {};

	for (id in this.climateZones) {
		var islands = this.islands.filter(function(island) {
			return island.climateZone.zoneId == id;
		});

		islandsRepresantion = islands.map(function (island) {
			return {
				'turnsToFall': island.timeToLive,
				'island-name': 'Island ' + island.id,
				'tooltip': {
					'plains' : island._plains,
					'mountains': island._mountains,
					'snow': island._snow,
					'special': island._specialRes,
					'size': island.size,
					'fallingSpeed': island.fallingSpeed
				}
			}
		});

		this.climateZones[id].islands = islandsRepresantion;
		representation[id] = this.climateZones[id];
	}

	return representation;
}

module.exports = World;
