var stochasm = require('stochasm');
var islandId = 0;
var Resource = require('./resource');

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

function Island(climateZone) {
	this['id'] = islandId++;
	this.climatezone = climateZone;
	this.fallingSpeed = stochasm({kind: "integer", min: 1, max: 3 }).next();
	this.timeToLive = this.fallingSpeed;
	this.resources = [];

	for (var i = 0; i < stochasm({kind: "integer", min: 2, max: 5}).next(); i++) {
		this.addResource();
	}
}

Island.prototype.fall = function() {
	this.timeToLive--;
	if (!this.timeToLive) {
		this._changeClimateZone();
	}
}

Island.prototype.addResource = function(resourceId) {
	this.resources.push(resourceId || resourceGenerator.next());
} 

Island.prototype._changeClimateZone = function() {
	//implement me
}

module.exports = Island;