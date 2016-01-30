var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var config = require('./config');
var downloader = require('./downloader/downloader');
var logging = require('./logging/logging');

var app = express();
app.use(bodyParser.json())

var links = {};

app.post('/api/v1/link', function(req, res) {
	var url = req.body.url;
	if (url) {
		var link = {
			'status': 'INITIALIZED'
		};
		links[url] = link;
	    downloader.makeHttpsRequest(url, 
	    	function(fileName, bytesTotal) {
	    		link['status'] = 'START_OK';
	    		link['fileName'] = fileName;
	    		link['bytesTotal'] = bytesTotal;
	    		link['startDate'] = new Date();
	    	},
	    	function(bytesReceived) {
	    		link['bytesReceived'] = bytesReceived;
	    		if (bytesReceived === link.bytesTotal) {
	    			link['status'] = 'END_OK';
	    			link['endDate'] = new Date();
	    		}
	    	}
	    );
	    res.send('OK');
	} else {
	    res.status(500).send('Fail');
	}
});

app.get('/api/v1/links', function(req, res) {
    res.send(links);
});

// TODO
app.get('/api/v1/activation', function(req, res) {
	var active = req.body.active;
    res.send('OK');
});

app.listen(config.port, function () {
    console.log('Start application on port ' + config.port);
});

setInterval(function() {
	logging.logLinks(links);
}, 2000);


