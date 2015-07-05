var stochasm = require('stochasm');
var islandId = 0;
var Resource = require('./resource');
var climateZones = require('./climatezone');
var randomizer = require('../lib/random_generator');

var resources =[],
	weights = [];

for (var resourceId in global.resourcesData) {
	resources.push(resourceId);
	weights.push(parseFloat(global.resourcesData[resourceId].weight));
}

var resourceGenerator = new stochasm({
	kind: "set",
	values: resources,
	'weights': weights
});

function Island(eventEmitter) {
	this.ee = eventEmitter;

	this['id'] = islandId++;
	this.climateZone = climateZones[climateZones.length - 1];

	this._generateResources();
	this._generateFallingSpeed();			
}

Island.prototype._generateResources = function () {
	this._plains = Math.max(randomizer.rollD6(2) - 6, 0);
	this._mountains = Math.max(randomizer.rollD6(2) - 6, 0);
	this._snow = Math.max(randomizer.rollD6(3));
	this._specialRes = 0;

	var specialResourcesKinds = randomizer.rollD6(2) - 8;

	for (var i=0; i < specialResourcesKinds; i++) {
		this._specialRes += parseInt(Math.abs(randomizer.rollD6(3) - 10.5)/2);
	}

	this.size = this._plains + this._mountains + this._snow + this._specialRes;
}

Island.prototype._generateFallingSpeed = function () {
	this.fallingSpeed = Math.floor(randomizer.rollD6(3)/2);
	this.timeToLive = this.fallingSpeed;
}

Island.prototype.processEndOfTurn = function() {
	this.timeToLive--;
	if (!this.timeToLive) {
		this._changeClimateZone();
	}
}

Island.prototype._changeClimateZone = function() {
	this.timeToLive = this.fallingSpeed;
	var newZoneId = this.climateZone.zoneId - 1;

	if (!climateZones[newZoneId]) {
		this.ee.emit('island:destroy', this['id']);
	} else {
		this.climateZone = climateZones[newZoneId];
		this.ee.emit('island:climate-zone-changed', {'id': this['id'], 'name': climateZones[newZoneId].name});
	}
}

module.exports = Island;