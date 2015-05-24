var ClimateZone = require('./climatezone');
var stochasm = require('stochasm');
var Island = require('./Island');
var fs = require('fs');

function World(globalConfig) {
	this.globalConfig = globalConfig;
	this.climateZones = {};
	this.islands = {};

	this._createClimateZones();
	this._generateIslands();
}

World.prototype._createClimateZones = function () {
	var climateZonesData = JSON.parse(fs.readFileSync('./data/climate_zones.json', 'utf8'));

	for (var id in climateZonesData) {
		this.climateZones[id] = new ClimateZone(climateZonesData[id], id);
	}
}

World.prototype._generateIslands = function() {
	var climateZonesNum = Object.keys(this.climateZones).length;
	var normalGenerator = stochasm({
		kind: "integer",
		mean: Math.floor(climateZonesNum / 2), 
		stdev: 2, 
		min: 1,
		max: climateZonesNum
	});

	for (var i = 0; i < this.globalConfig.islandsNum; i++) {
		this.addIsland(new Island(this.climateZones[normalGenerator.next()]));
	}
}

World.prototype.addIsland = function(island) {
	console.log(island);
	this.islands[island['id']] = island;
}

World.prototype.destroyIsland = function(id) {
	delete this.islands[id];
}

module.exports = World;