function Resource(id, data) {
	this.resourceId = id;
	this.name = data.name;
	this.chance = data.chance;
}

module.exports = Resource;
