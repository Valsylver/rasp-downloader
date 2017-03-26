var https = require('https');
var fs = require('fs');
var config = require('../config');

var downloader = {};

var makeHttpsRequest = (url, informations, step, end, fail) => {
	var urlWithoutHttps = url.replace('https://', '');
	var urlWithoutHttpsSplitted = urlWithoutHttps.split('/');
	var host = urlWithoutHttpsSplitted[0];
	var path;
	if (urlWithoutHttpsSplitted.length === 2) {
		path = '/' + urlWithoutHttpsSplitted[1];
	} else {
		path = '/';
	}
	var req = https.get({
		host: host,
		path: path,
		headers: {
			Cookie: config.cookie,
			Connection: 'keep-alive',
			'User-Agent': config.userAgent
		}
	}, function(response) {
		try {
			var headers = response.headers;
			var newLocation = headers['location'];
			if (newLocation) {
				makeHttpsRequest(newLocation, informations, step, end, fail);
			} else {
				var fileName = headers['content-disposition'].split('filename="')[1].split('";')[0];
				var wstream = fs.createWriteStream(fileName);
				var bytesReceived = 0;
				var bytesTotal = parseInt(headers['content-length']);
				informations(fileName, bytesTotal);
				response.on('data', function(data) {
					bytesReceived += data.length;
					wstream.write(data);
					step(bytesReceived);
				});
				response.on('end', function() {
					wstream.end();
					req.end();
					end();
				});
			}
		}
		catch (e) {
			fail(e);
		}
	}
).on('error', function(error) {
		fail(error);
	});
};

downloader.makeHttpsRequest = makeHttpsRequest;

module.exports = downloader;
