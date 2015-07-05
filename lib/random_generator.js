var stochasm = require('stochasm');
var uuid = require('node-uuid');

var generator = stochasm({
	kind: "integer",
	min: 1,
	max: 6
});

var probabilityGenerator = stochasm();

module.exports.generateRandomString = function() {
	return uuid.v1();
}

module.exports.rollD6 = function(times) {
	times = times || 1;
	var result = 0;	

	for (var i = 0; i < times; i++) {
		result = result + generator.next();
	}

	return result;
}

module.exports.checkProbability = function(prob) {
	return (probabilityGenerator.next() <= prob);
}
