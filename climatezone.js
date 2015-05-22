function ClimateZone(modifier) {
	this.modifier = modifier;
	this.islands = [];
}

ClimateZone.prototype.addIsland = function(island) {
	this.islands.push(island);
}

module.exports = ClimateZone;
