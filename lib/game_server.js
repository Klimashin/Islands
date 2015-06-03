var socketio = require('socket.io');
var Player = require('../game_objects/player');
var Game = require('../game_objects/game');

var io;
var players = {};
var games = {};

exports.listen = function(server) {
	io = socketio(server);

	io.on('connection', function(socket) {
		console.log('a user connected');		

		handlePlayerDisconnect(socket);

		handleRegisterPlayer(socket);

		handleCreatingNewGame(socket);

		handleJoiningNewGame(socket);

		handleStartingNewGame(socket);

		handleChangePlayerReadyState(socket);
	});
}

function handleRegisterPlayer(socket) {
	socket.on('register', function () {
		var player = new Player(socket);
	    players[socket.id] = player;
	    console.log('registered player: ', socket.id)
	});	
}

function handlePlayerDisconnect(socket) {
	socket.on('disconnect', function() {
		console.log('disconnecting ' + socket.id);
		delete this.players[socket.id];
	});
}

function handleCreatingNewGame(socket) {
	socket.on('new-game', function() {
		if (!players[socket.id]) {
			console.log('Attemt to create new game without player created');
			return false;
		}

		var game = new Game(io, players[socket.id]);
		games[game.id] = game;

		socket.emit('assign-game-id', game.id);

		console.log('creating new game ' + game.id);
	});
}

function handleJoiningNewGame(socket) {
	socket.on('join-game', function(gameId) {
		if (!players[socket.id]) {
			console.log('Attemt to join game without player created');
			return false;
		}

		games[gameId].addPlayer(players[socket.id]);
		console.log('Player ' + socket.id + ' joined game ' + gameId);
	});
}

function handleChangePlayerReadyState(socket) {
	socket.on('change-ready-state', function() {
		if (!players[socket.id]) {
			console.log('Attemt to cahnge ready state without player created');
			return false;
		}

		players[socket.id].readyState = !players[socket.id].readyState;
	});
}

function handleStartingNewGame(socket) {
	socket.on('start-game', function(gameId) {
		if (!games[gameId] || !players[socket.id]) {
			console.log('GameId or player not set on game start');
			return false;
		}

		games[gameId].start(players[socket.id]);
	});
}
