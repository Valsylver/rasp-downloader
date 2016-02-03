var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config');
var downloader = require('./downloader/downloader');
var uploader = require('./uploader/uploader');
var processor = require('./processor/processor');
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

		var process = function(callback) {
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
		    			uploader.upload(link['fileName']);
		    			callback();
		    		}
		    	}
		    );
		}
		processor.addToQueue(process);
	    res.send('OK');
	} else {
	    res.status(500).send('Fail');
	}
});

app.get('/api/v1/links', function(req, res) {
    res.send(links);
});

app.listen(config.port, function () {
    logging.logWithDate('Start application on port ' + config.port);
});

setInterval(function() {
	logging.logLinks(links);
}, 2000);


