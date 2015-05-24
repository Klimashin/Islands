var stochasm = require('stochasm');
var islandId = 0;

function Island(climateZone) {
	var randomGenerator = stochasm({
		kind: "integer",
		min: 1,
		max: 3
	});

	this['id'] = islandId++;
	this.climatezone = climateZone;
	this.fallingSpeed = randomGenerator.next();
	this.timeToLive = this.fallingSpeed;
	//generate resources
	//generate falling speed
}

Island.prototype.fall = function() {
	this.timeToLive--;
	if (!this.timeToLive) {
		this._changeClimateZone();
	}
}

Island.prototype._changeClimateZone = function() {
	//implement me
}

module.exports = Island;