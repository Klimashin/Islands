var ClientEngine = function(socket) {
	self = this;
	this.socket = socket;
	this.currentGameId = null;
	this.playerState = 'not-registered'

	this.renderMsg = function (message) {
		$('#console').append(message + '<br/>');
	}

	this.registerPlayer = function(nick) {
		this.socket.emit('register', nick);
	}

	socket.on('game-message', function(message) {
		$(document).trigger('game-console:message', {text: message});
	});

	socket.on('player-state-change', function(m) {
		this.playerState = m.state;
		$(document).trigger('player-state-change', {playerState: m.state, data: m.data});
	});

	socket.on('update-players-list', function(playersList) {
		$(document).trigger('update-players-list', playersList);
	});

	socket.on('assign-game-id', function(gameId) {
		self.currentGameId = gameId;
	});
}