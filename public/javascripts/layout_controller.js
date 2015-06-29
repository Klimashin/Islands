var GameConsole = React.createClass({

	getInitialState: function() {
		return {data: []};
	},

	componentDidMount: function() {
		$(document).on('game-console:message', function(e, message) {
			var newState = this.state.data.concat(message);
			this.setState({data: newState});
		}.bind(this));
	},

	render: function() {
		var messages = this.state.data.map(function ( message, i) {
			return (
				<span className="console-message" key={i}>
					{message.text}
				</span>
			);
		});

		return (
			<div>
				<h2>Test React Game Console</h2>
				<div className="message-list">
					{messages}
				</div>
			</div>
		);
	}
});

var PlayersList = React.createClass({
	getInitialState: function() {
		return {data: []};
	},

	componentDidMount: function() {
		$(document).on('update-players-list', function(e, data) {
			this.setState({'data': data.nicks});
		}.bind(this));
	},

	render: function() {
		var players = this.state.data.map(function(playerNick, i) {
			return (
				<span className="player" key={i}>
					{playerNick}
				</span>
			);
		});		

		return (
			<div>
				<h2>Players List</h2>
				<div className="players-list">
					{players}
				</div>
			</div>
		);
	}
});

var GamesList = React.createClass({
	getInitialState: function() {
		return {data: []};
	},

	componentDidMount: function() {
		$(document).on('update-games-list', function(e, games) {
			this.setState({data: games});
		}.bind(this));
	},

	render: function() {
		var games = this.state.data.map(function(game) {
			return (
				<Game data={game}/>
			);
		});

		return (
			<div>
				<h2>Games List</h2>
				<div className="games-list" data={this.props.data}>
					{games}
				</div>
			</div>
		);
	}
});

var Game = React.createClass({
	render: function() {
		return (
			<div className="game" data-gameId={this.data.gameId}>
				<span>{this.data.gamaeId}</span>
			</div>
		)
	}
});

var socket = io();
var gameClient = new ClientEngine(socket);	

$(function() {
	React.render(
		<div>
			<PlayerControls data={[]}/>
			<GameConsole data={[]}/>
			<PlayersList data={[]}/>
			<GamesList data={[]}/>
		</div>,
		document.body
	);
});