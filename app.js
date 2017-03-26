var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config');
var downloader = require('./downloader/downloader');
var uploader = require('./uploader/uploader');
var processor = require('./processor/processor');
var logging = require('./logging/logging');

var app = express();
app.use('/', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });
app.use(bodyParser.json());

var links = {};

app.post('/api/v1/link', (req, res) => {
	var url = req.body.url;
	if (url) {
		var link = {
			'status': 'INITIALIZED'
		};
		links[url] = link;

		var process = callback => {
			downloader.makeHttpsRequest(url,
				(fileName, bytesTotal) => {
					link['status'] = 'START_OK';
					link['fileName'] = fileName;
					link['bytesTotal'] = bytesTotal;
					link['startDate'] = new Date();
				},
				bytesReceived => {
					link['bytesReceived'] = bytesReceived;
				},
				() => {
					link['status'] = 'END_OK';
					link['bytesReceived'] = link['bytesTotal'];
					link['endDate'] = new Date();
					uploader.upload(link['fileName']);
					callback();
				},
				error => {
					link['status'] = 'FAILED';
					link['endDate'] = new Date();
					res.status(500).json({'status': `Fail : ${error}`});
					logging.logWithDate('Error while downloading ' + url + ' : ' + error);
					callback();
				}
			);
		}
		processor.addToQueue(process);
	} else {
		res.status(500).send('Fail');
	}
});

app.get('/api/v1/links', (req, res) => {
	res.json(links);
});

app.listen(config.port, () => {
	logging.logWithDate('Start application on port ' + config.port);
});

setInterval(function() {
	logging.logLinks(links);
}, 2000);
