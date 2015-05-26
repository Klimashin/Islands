function Resource(id) {
	var data = global.resourcesData[id];

	this.resourceId = id;
	this.name = data.name;
	this.chance = data.chance;
}

module.exports = Resource;
