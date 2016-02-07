var Client = require('ftp');
var fs = require('fs');
var config = require('../config');
var logging = require('../logging/logging');

var uploader = {};

var removeFile = function(fileName) {
	fs.access(fileName, fs.R_OK | fs.W_OK, function(err) {
		if (!err) {
			logging.logWithDate('Removing file ' + fileName);
			fs.unlinkSync(fileName);
		} else {
			logging.logWithDate('Error while trying to access file ' + fileName);
		}
	});
}	

uploader.upload = function(fileName) {
	var client = new Client();
	client.on('ready', function() {
		client.put(fileName, '/Data/Films/' + fileName, function(err) {
			logging.logWithDate('Successfully copied ' + fileName);
			if (err) throw err;
			removeFile(fileName);
			client.end();
		});
	});
	client.on('error', function(e) {
		logging.logWithDate('Error while uploading ' + fileName + ' : ' + e);
		removeFile(fileName);
	});
	logging.logWithDate('Start copying ' + fileName);
	client.connect({
		'host': config.ftp.host,
		'user': config.ftp.username,
		'password': config.ftp.password
	});
};

module.exports = uploader;