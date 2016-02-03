var config = require('../config');
var logging = require('../logging/logging');

var processor = {};

var requestsQueue = [];
var pendingRequestsCount = 0;
var maxConcurrentRequests = config.maxConcurrentRequests;

var process = function() {};

var checkAndStartNext = function() {
	if ((pendingRequestsCount < maxConcurrentRequests) && requestsQueue.length > 0) {
		var nextRequest = requestsQueue.shift();
		pendingRequestsCount += 1;
		logging.logWithDate('Process start');
		nextRequest(function() {
			pendingRequestsCount -= 1;
			checkAndStartNext();
			logging.logWithDate('Process end');
		});
	};
};

var addToQueue = function(process) {
	logging.logWithDate('New process added to queue');
	requestsQueue.push(process);
	checkAndStartNext();
};

processor.addToQueue = addToQueue;
module.exports = processor;