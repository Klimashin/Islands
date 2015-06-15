function Player(socket) {
	this.socket = socket;
	this.readyState = false;
	this.currentRoom = 'guestRoom';
	this.nick = '';
	this.gameId = '';
}

Player.prototype.setNick = function(nick) {
	this.nick = nick;
};

module.exports = Player;