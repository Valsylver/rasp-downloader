var Client = require('ftp');
var fs = require('fs');
var config = require('../config');

var uploader = {};

uploader.upload = function(fileName) {
	var client = new Client();
	client.on('ready', function() {
		client.put(fileName, '/Volume_1/Upload/' + fileName, function(err) {
  			if (err) throw err;
  			fs.access(fileName, fs.R_OK | fs.W_OK, function(err) {
			    if (!err) {
			        console.log('remove file ' + fileName);
  					fs.unlinkSync(fileName);
			    }
			});
			client.end();
		});
	});
	client.connect({
		'host': config.ftp.host,
		'user': config.ftp.username,
		'password': config.ftp.password
	});
};

module.exports = uploader;