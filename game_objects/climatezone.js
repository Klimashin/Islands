function ClimateZone(zoneData, zoneId) {
	this.zoneId = zoneId;
	this.modifier = zoneData.modifier;
	this.name = zoneData.name;
}

var climateZones = [];
for (var id in global.climateZonesData) {
	climateZones[id] = new ClimateZone(climateZonesData[id], id);
}

module.exports = climateZones;
