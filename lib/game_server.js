var socketio = require('socket.io');
var Player = require('../game_objects/player');
var Game = require('../game_objects/game');

var io;
var players = [];
var games = [];

exports.listen = function(server) {
	io = socketio(server);

	io.on('connection', function(socket) {
		console.log('a user ' + socket.id + ' connected');

		socket.emit('game-message', 'Socket connected');		

		handlePlayerDisconnect(socket);

		handleRegisterPlayer(socket);

		handleCreatingNewGame(socket);

		handleJoiningNewGame(socket);

		handleStartingNewGame(socket);

		handleChangePlayerReadyState(socket);

		handleTestGeneratorCommands(socket);
	});
}

function handleRegisterPlayer(socket) {
	socket.on('register', function (nick) {
		var player = new Player(socket);
		player.setNick(nick);
	    players[socket.id] = player;

	    socket.join(player.currentRoom);
	    socket.emit('player-state-change', {
	    	'state': 'registered',
	    	'data': {
	    		'nick': nick
	    	}	    	
	    });

	    io.sockets.in(player.currentRoom).emit('update-players-list', 
			{'nicks': Object.keys(players).map(function(socketId) { return players[socketId].nick; })}
		);

	    socket.broadcast.to(player.currentRoom).emit('game-message', {
			'text': 'New player registered with nick ' + nick
		});
	});
}

function handlePlayerDisconnect(socket) {	
	socket.on('disconnect', function() {
		console.log('user ' + socket.id + ' disconnected');
		var player = players[socket.id];

		if (player) {
			socket.broadcast.to(player.currentRoom).emit('game-message', {
				'text': 'Player ' + players[socket.id].nick + ' disconnected'
			});
			delete players[socket.id];

			io.sockets.in(player.currentRoom).emit('update-players-list', 
				{'nicks': Object.keys(players).map(function(socketId) { return players[socketId].nick; })}
			);			
		}		
	});
}

function handleCreatingNewGame(socket) {
	socket.on('new-game', function() {
		if (!players[socket.id]) {
			console.log('Attemt to create new game without player created');
			return false;
		}

		var game = new Game(io);
		game.creator = players[socket.id];
		game.addPlayer(players[socket.id]);

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

function handleTestGeneratorCommands(socket) {
	socket.on('start-test-game', function() {
		var game = new Game(io);
		games[game.id] = game;
		socket.gameId = game.id;

		socket.emit('game-data', games[socket.gameId].world.getRepresentation());

		socket.on('disconnect', function() {
			delete games[game.id];
		});
	});

	socket.on('skip-turns', function(turns) {
		for (var i=0; i < turns; i++) {
			games[socket.gameId].endTurn();
		}
		console.log('here');
		socket.emit('game-data', games[socket.gameId].world.getRepresentation());
	});
}
