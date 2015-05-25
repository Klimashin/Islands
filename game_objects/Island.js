var stochasm = require('stochasm');
var islandId = 0;

function Island(climateZone) {
	this['id'] = islandId++;
	this.climatezone = climateZone;
	this.fallingSpeed = stochasm({kind: "integer", min: 1, max: 3 }).next();
	this.timeToLive = this.fallingSpeed;

	for (var i = 0; i < stochasm({kind: "integer", min: 2, max: 5}).next(); i++) {
		//generate resource
	}
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