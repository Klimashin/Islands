var ClientEngine = function(socket) {
	self = this;
	this.socket = socket;
	this.currentGameId = null;

	this.renderMsg = function (message) {
		$('#console').append(message + '<br/>');
	}

	this.initListners = function() {
		$('#register').click(function() {
			socket.emit('register');
		});

		$('#create').click(function() {
			socket.emit('new-game');
		});

		$('#join').click(function() {
			socket.emit('join-game', 0);
		});

		$('#change-state').click(function() {
			socket.emit('change-ready-state');
		});

		$('#start').click(function() {
			socket.emit('start-game', self.currentGameId);
		});
	}

	socket.on('game-message', function(message) {
		self.renderMsg(message);
	});

	socket.on('assign-game-id', function(gameId) {
		console.log('currentGameId became ' + gameId);
		self.currentGameId = gameId;
	});
}