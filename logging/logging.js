var statictics = require('../statistics/statistics');
var dateFormat = require('dateformat');

var logger = {};

var logWithDate = function(message) {
	var dateFormatted = dateFormat(new Date(), "isoDateTime");
	console.log(dateFormatted + ' ' + message);
}

logger.logWithDate = logWithDate;

logger.logLinks = function(links) {
	for (var linkUrl in links) {
		if (links.hasOwnProperty(linkUrl)) {
			var link = links[linkUrl];
			if (link.status === 'START_OK') {
				var message = link.fileName + ': ' + ((link.bytesReceived / link.bytesTotal) * 100).toFixed(2) + ' % ';
				var currentDate = new Date();
				var startDate = link.startDate;
				var secondsDiff = Math.round((currentDate - startDate) / 1000);
				var megaBytesReceived = statictics.bytesToMegaBytes(link.bytesReceived);
				var megaBytesTotal = statictics.bytesToMegaBytes(link.bytesTotal);
				var remainingMegaBytes = megaBytesTotal - megaBytesReceived;
				var rate = statictics.rate(megaBytesReceived, secondsDiff);
				var remainingSeconds = remainingMegaBytes / rate;
				message += rate.toFixed(2) + ' Mo/s ';
				message += '(' + megaBytesReceived.toFixed(2) + ' Mo/' + megaBytesTotal.toFixed(2) + ') ';
				message += remainingSeconds.toFixed(2) + ' seconds remaining';
				logWithDate(message);
			}
		}
	}
};

module.exports = logger;