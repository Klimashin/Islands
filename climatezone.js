function ClimateZone(modifier) {
	this.modifier = modifier;
	this.islands = [];
}

ClimateZone.prototype.addIsland = function(island) {
	this.islands.push(island);
}

ClimateZone.prototype.destroyIsland = function(id) {

}

module.exports = ClimateZone;
