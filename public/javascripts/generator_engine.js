var GeneratorEngine = function(socket) {
	this.socket = socket;

	this.skipTurns = function(turns) {
		this.socket.emit('skip-turns', turns);
	}

	this.startTestGame = function() {
		this.socket.emit('start-test-game');
	}

	socket.on('game-data', function (data) {
		console.log(data);
		$(document).trigger('change-game-data', data);
	});
}