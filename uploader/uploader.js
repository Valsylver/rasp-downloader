var Client = require('ftp');
var fs = require('fs');
var config = require('../config');

var uploader = {};

uploader.upload = function(fileName) {
	var client = new Client();
	client.on('ready', function() {
		client.put(fileName, '/Volume_1/Upload/' + fileName, function(err) {
  			if (err) throw err;
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