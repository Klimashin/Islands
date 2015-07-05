GeneratorControls = React.createClass({
	handleSubmit: function(e) {
		e.preventDefault();
		e.stopPropagation();
		var turns = parseInt(React.findDOMNode(this.refs['turns-to-skip']).value);

		if (turns) {
			generator.skipTurns(turns);
		}		
	},

	render: function () {
		return (
			<form className="generatorSkipForm" onSubmit={this.handleSubmit}>
				<label>Turns to Skip</label>
				<input type="text" placeholder="Enter your Nick" ref="turns-to-skip" />
				<input type="submit" value="Skip" />
			</form>
		);
	}
});

Island = React.createClass({
	render: function () {
		return (
			<div rel="tooltip" className="isalnd" data-toggle="tooltip" data-placement="top" title={this.props.tooltip} data-html="true">
				<span>{this.props['name']} : {this.props.turnsToFall}</span>
			</div>
		);
	}
});

ClimateZone = React.createClass({
	render: function () {
		var islands = this.props.dataIslands.map(function (islandData) {
			return <Island data={islandData}/>
		});

		return (
			<div className="climateZone">
				{islands}
			</div>
		);
	}
});

ClimateZonesList = React.createClass({
	componentDidMount: function () {
		$('body').tooltip({
		    selector: '[rel=tooltip]'
		});
	},

	render: function () {
		if (this.props.data) {
			var climateZones = this.props.data.map(function (zoneData) {
				return (
					<ClimateZone dataIslands={zoneData.islands} dataName={zoneData.zoneName} dataNumber={zoneData.num}/>
				);
			});
		}

		return (
			<div>
				{climateZones}
			</div>
		);
	}
});

ContentLayout = React.createClass({
	getInitialState: function() {
		return {data: []};
	},

	componentDidMount: function() {
		$(document).on('change-game-data', function(e, data) {
			this.setState({'data': data});
		}.bind(this));
	},

	render: function () {
		return (
			<div className="contentBox">
				<ClimateZonesList data={this.state.data}/>
			</div>
		);
	}
});

var socket = io();
var generator = new GeneratorEngine(socket);

$(function() {
	React.render(
		<div>
			<GeneratorControls data={[]}/>
			<ContentLayout data={[]}/>
		</div>,
		document.body,
		function () {
			generator.startTestGame();
		}
	);


});