function ClimateZone(zoneData, zoneId) {
	this.zoneId = zoneId;
	this.modifier = zoneData.modifier;
	this.name = zoneData.name;
}

module.exports = ClimateZone;
