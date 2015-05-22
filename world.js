var ClimateZone = require('./climatezone');

function World(globalConfig) {
	this.globalConfig = globalConfig;
	this._createClimateZones();
}

World.prototype._createClimateZones = function () {
	var topMostZone = Math.floor(this.globalConfig.climateZonesNum/2);
	var bottomMostZone = topMostZone - this.globalConfig.climateZonesNum;
	this.climateZones = [];

	for (var i = bottomMostZone; i < topMostZone; i++) {
		this.climateZones.unshift(new ClimateZone(i));
	}
}

World.prototype._generateIslands = function() {

}

module.exports = World;