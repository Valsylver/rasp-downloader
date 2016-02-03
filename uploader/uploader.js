var Client = require('ftp');
var fs = require('fs');
var config = require('../config');
var logging = require('../logging/logging');

var uploader = {};

var removeFile = function(fileName) {
	logging.logWithDate('Removing ' + fileName);
	fs.access(fileName, fs.R_OK | fs.W_OK, function(err) {
	    if (!err) {
	        console.log('remove file ' + fileName);
			fs.unlinkSync(fileName);
	    }
	});
}	

uploader.upload = function(fileName) {
	var client = new Client();
	client.on('ready', function() {
		client.put(fileName, '/Data/Films/' + fileName, function(err) {
  			if (err) throw err;
  			removeFile(fileName);
			client.end();
		});
	});
	client.on('error', function(e)) {
		logging.logWithDate('Error while uploading ' + fileName + ' : ' + e);
		removeFile(fileName);
	};
	client.connect({
		'host': config.ftp.host,
		'user': config.ftp.username,
		'password': config.ftp.password
	});
};

module.exports = uploader;