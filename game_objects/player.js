function Player(socket) {
	this.socket = socket;
	this.readyState = false;
}

module.exports = Player;