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

		socket.emit('game-message', 'Socket connected');		

		handlePlayerDisconnect(socket);

		handleRegisterPlayer(socket);

		handleCreatingNewGame(socket);

		handleJoiningNewGame(socket);

		handleStartingNewGame(socket);

		handleChangePlayerReadyState(socket);
	});
}

function handleRegisterPlayer(socket) {
	socket.on('register', function (nick) {
		var player = new Player(socket);
	    players[socket.id] = player;
	    socket.join('guestRoom');
	    console.log('registered player: ', socket.id);
	    socket.emit('game-message', 'Registred with nick ' + nick);

	    io.to('guestRoom').emit('guestRoom:player-registered', {
			'nick': player.nick
		});
	});
}

function handlePlayerDisconnect(socket) {
	socket.on('disconnect', function() {
		console.log('disconnecting ' + socket.id);
		delete players[socket.id];
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

		socket.join(game.id);
		socket.emit('assign-game-id', game.id);		

		console.log('creating new game ' + game.id);

		io.to('guestRoom').emit('guestRoom:game-created', {
			'gameId': game.id,
			'creatorNick': players[socket.id].nick 
		});
	});
}

function handleJoiningNewGame(socket) {
	socket.on('join-game', function(gameId) {
		if (!players[socket.id]) {
			console.log('Attemt to join game without player created');
			return false;
		}

		if (!games[gameId]) {
			console.log('Attemt to join unexisting game');
			return false;
		}

		games[gameId].addPlayer(players[socket.id]);
		socket.join(gameId);

		socket.emit('assign-game-id', gameId);
		console.log('Player ' + socket.id + ' joined game ' + gameId);

		io.to(gameId).emit('game-preparation:player-joined', {
			'player': socket.id,
			'playerNick': players[socket.id].nick
		});
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

		if (socket.id != games[gameId].creator.socket.id) {
			console.log('attemting to start game by non-creator');
			return false;
		}

		for (id in games[gameId].players) {
			if (!games[gameId].players[id].readyState) {
				console.log('some of the players are not ready');
				return false;
			}
		}

		games[gameId].start();
	});
}
