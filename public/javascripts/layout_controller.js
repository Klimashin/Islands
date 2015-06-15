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
		var messages = this.state.data.map(function (message) {
			return (
				<span className="console-message">
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
		$(document).on('update-players-list', function(e, players) {
			this.setState({data: players});
		}.bind(this));
	},

	render: function() {
		var players = this.state.data.map(function(player) {
			return (
				<span className="player">
					{player.nick}
				</span>
			);
		});

		return (
			<div>
				<h2>Players List</h2>
				<div className="players-list" data={this.props.data}>
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

var PlayerControls = React.createClass({
	getInitialState: function() {
		return {'condition': 'not-registered'};
	},

	componentDidMount: function() {
		$(document).on('registration-success', function(e, data) {
			this.setState({
				condition: 'registered',
				'data': {
					nick: data.nick
				}
			})
		}.bind(this));
	},

	render: function() {
		switch (this.state.condition) {
			case 'registered':
				return (
					<div>
						<span>You are registered now, your Nick is {this.state.data.nick}</span>
					</div>
				);

			default:
				return (
					<RegisterForm/>
				);
		}
		
	}
});

var RegisterForm = React.createClass({
	handleSubmit: function(e) {
		e.preventDefault();
		var nick = React.findDOMNode(this.refs.nick).value.trim();

		if (nick) {
			gameClient.registerPlayer(nick);
		}		
	},

	render: function() {
		return (
			<form className="playerRegisterForm" onSubmit={this.handleSubmit}>
				<input type="text" placeholder="Enter your Nick" ref="nick" />
				<input type="submit" value="Register" />
			</form>
		); 
	}
});

var socket = io();
var gameClient = new ClientEngine(socket);	

$(function() {
	gameClient.initListners();

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