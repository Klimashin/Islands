var stochasm = require('stochasm');
var islandId = 0;
var Resource = require('./resource');
var climateZones = require('./climatezone');

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

function Island(eventEmitter, climateZoneId) {
	this.ee = eventEmitter;

	this['id'] = islandId++;
	this.climateZone = climateZones[climateZoneId];

	this.fallingSpeed = stochasm({kind: "integer", min: 1, max: 3 }).next();
	this.timeToLive = this.fallingSpeed;
	this.resources = [];
	this.ownerId = undefined;

	for (var i = 0; i < stochasm({kind: "integer", min: 2, max: 5}).next(); i++) {
		this.addResource();
	}
}

Island.prototype.fall = function() {
	this.timeToLive--;
	console.log('Island ' + this.id + ' ttl is ' + this.timeToLive);
	if (!this.timeToLive) {
		this._changeClimateZone();
	}
}

Island.prototype.addResource = function(resourceId) {
	this.resources.push(resourceId || resourceGenerator.next());
} 

Island.prototype._changeClimateZone = function() {
	this.timeToLive = this.fallingSpeed;
	var newZoneId = this.climateZone.zoneId - 1;

	console.log('Triggerd climate zone change of island ' + this.id + '. New zone id: ' + newZoneId, climateZones[newZoneId])
	if (!climateZones[newZoneId]) {
		this.ee.emit('islandHaveFallen', this['id']);
	} else {
		this.climateZone = climateZones[newZoneId];
		this.ee.emit('islandClimateZoneChanged', {'id': this['id'], 'name': climateZones[newZoneId].name});
	}
}

module.exports = Island;