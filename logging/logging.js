var statictics = require('../statistics/statistics');

var logger = {};

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
				console.log(message);
			}
		}
	}
};

module.exports = logger;