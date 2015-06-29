var PlayerControls = React.createClass({
	getInitialState: function() {
		return {'condition': 'not-registered'};
	},

	componentDidMount: function() {
		$(document).on('player-state-change', function(e, m) {
			switch (m.playerState) {
				case 'registered':
					this.setState({
						'condition': 'registered',
						'data': m.data
					});
					break;
			}
			
		}.bind(this));
	},

	render: function() {
		switch (this.state.condition) {			
			case 'registered':
				return (
					<div>
						<span>You are registered now, your Nick is {this.state.data.nick}</span>
						<div className="game-client-controls">
						</div>
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
		e.stopPropagation();
		var nick = React.findDOMNode(this.refs.nick).value;

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