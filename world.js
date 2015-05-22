var ClimateZone = require('./climatezone');
var stochasm = require('stochasm');
var Island = require('./Island');

function World(globalConfig) {
	this.globalConfig = globalConfig;

	this.topMostZone = Math.floor(this.globalConfig.climateZonesNum/2);
	this.bottomMostZone = this.topMostZone - this.globalConfig.climateZonesNum;

	this._createClimateZones();
	this._generateIslands();
}

World.prototype._createClimateZones = function () {	
	this.climateZones = [];
	
	for (var i = this.bottomMostZone; i < this.topMostZone; i++) {
		this.climateZones.unshift(new ClimateZone(i));
	}
}

World.prototype._generateIslands = function() {
	var normalGenerator = stochasm({mean: this.topMostZone, stdev: 5, min: 0, max: this.globalConfig.climateZonesNum - 1});

	for (var i = 0; i < this.globalConfig.islandsNum; i++) {
		zoneNumber = Math.round(normalGenerator.next());
		console.log(zoneNumber);
		this.climateZones[zoneNumber].addIsland(new Island());
	}
}

module.exports = World;