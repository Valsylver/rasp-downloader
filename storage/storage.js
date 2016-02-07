var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/vma';
var _ = require('underscore');

var connectAndExecute = function(callback) {
	MongoClient.connect(url, function(err, db) {
		callback(db);
  	});
};

var saveDownload = function(download, callback) {
	connectAndExecute(function(db) {
		db.collection('downloads').insertOne(download, function(err, result) {
			download._id = result.ops[0]['_id'];
			db.close();
			callback();
		});
	});
};

var updateDownload = function(download, callback) {
	connectAndExecute(function(db) {
		db.collection('downloads').updateOne(
			{ "_id" : download._id },
			{	
				$set: download
      		}, function(err, results) {
				callback();
			}
		);
	});
}

var getDownloads = function(callback) {
	connectAndExecute(function(db) {
		var cursor = db.collection('downloads').find({});
		var docs = [];
		cursor.each(function(err, doc) {
	    	if (doc != null) {
	        	docs.push(doc);
	      	} else {
	      		db.close();
	         	callback(docs);
	    	}
	   });
	});
};

var deleteAllDownloads = function(callback) {
	connectAndExecute(function(db) {
		db.collection('downloads').deleteMany({}, function(err, results) {
			db.close();
			callback();
		});
	});
};

module.exports = {
	getDownloads: getDownloads,
	deleteAllDownloads: deleteAllDownloads,
	saveDownload: saveDownload,
	updateDownload: updateDownload
};