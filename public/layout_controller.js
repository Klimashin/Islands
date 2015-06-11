var GameConsole = React.createClass({

	getInitialState: function() {
		return {data: []};
	},

	componentDidMount: function() {
		$(document).on('game-console-message', function(e, message) {
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
				<h1>Test React Game Console</h1>
				<div className="message-list" data={this.props.data}>
					{messages}
				</div>
			</div>
		);
	}
});

var socket = io();
var gameClient = new ClientEngine(socket);	

$(function() {
	gameClient.initListners();

	React.render(
		<GameConsole data={[]}/>,
		document.body
	);
});