var fs = require('fs');
var path = require('path');

//init static game data
global.climateZonesData = JSON.parse(fs.readFileSync('./data/climate_zones.json', 'utf8'));
global.resourcesData = JSON.parse(fs.readFileSync('./data/resources.json', 'utf8'));

var express = require('express');
var app = express();
var http = require('http').Server(app);

app.use(express.static('public'));

app.get('/', function (req, res) {	
  	res.sendFile(path.join(__dirname, 'public/index.html'));  	
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});

var gameServer = require('./lib/game_server');
gameServer.listen(http);
