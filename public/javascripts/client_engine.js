var ClientEngine = function(socket) {
	self = this;
	this.socket = socket;
	this.currentGameId = null;

	this.renderMsg = function (message) {
		$('#console').append(message + '<br/>');
	}

	this.registerPlayer = function(nick) {
		this.socket.emit('register', nick);
	}

	socket.on('game-message', function(message) {
		$(document).trigger('game-console:message', {text: message});
	});

	socket.on('registration-success', function(data) {
		$(document).trigger('registration-success', data);
	});

	socket.on('update-players-list', function(playersList) {
		console.log(playersList);
		$(document).trigger('update-players-list', playersList);
	});

	socket.on('assign-game-id', function(gameId) {
		console.log('currentGameId became ' + gameId);
		self.currentGameId = gameId;
	});
}