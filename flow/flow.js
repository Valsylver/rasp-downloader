var flow = require('nimble');

var download = function(url) {
	return function(callback) {

	}
};

var start = function(url) {
	flow.series([
		download(url),
	]);
}

var step = function(process, successCallback, errorCallback) {
	
};