var https = require('https');
var fs = require('fs');
var config = require('../config');

var downloader = {};

var makeHttpsRequest = function(url, informations, step, fail) {
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
		var headers = response.headers;
	    var newLocation = headers['location'];
	    if (newLocation) {
	        makeHttpsRequest(newLocation, informations, step, fail);
	    } else {
	    	var fileName = headers['content-disposition'].split('filename="')[1].split('";')[0];
	    	var wstream = fs.createWriteStream(fileName);
	    	var bytesReceived = 0;
	    	var bytesTotal = parseInt(headers['content-length']);
	    	informations(fileName, bytesTotal);
	        response.on('data', function(data) {
	        	bytesReceived += data.length;
	        	step(bytesReceived);
	            wstream.write(data);
	        });
	        response.on('end', function() {
	        	step(bytesReceived);
	        	wstream.end();
	        	req.end();
	        });
	    };
	});    
};

downloader.makeHttpsRequest = makeHttpsRequest;

module.exports = downloader;