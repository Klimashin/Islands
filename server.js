var fs = require('fs');
var path = require('path');
global.climateZonesData = JSON.parse(fs.readFileSync('./data/climate_zones.json', 'utf8'));
global.resourcesData = JSON.parse(fs.readFileSync('./data/resources.json', 'utf8'));

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {	
  	res.sendFile(path.join(__dirname, 'index.html'));

  	var Game = require('./game_objects/game');

	var game = new Game(io);

	for (var i = 0; i < 100; i++) {
	 	game.endTurn();	
	}
});

io.on('connection', function(socket){
	console.log('a user connected');
	socket.on('disconnect', function(){
	    console.log('user disconnected');
  	});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});
