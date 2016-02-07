var should = require('should');
var storage;

describe('storage', function() {
	beforeEach(function(done) {
		storage = require('../storage/storage');
		storage.deleteAllDownloads(done);
	});

	it('should save download', function(done) {
		storage.saveDownload({'a': 'b'}, function() {
			storage.getDownloads(function(docs) {
				docs.should.have.length(1);
				done();
			});
		});
	});

	it('should set the id after save', function(done) {
		var obj = {'a': 'b'};
		storage.saveDownload(obj, function() {
			obj.should.have.property('_id');
			done();
		});
	});

	it('should update the download', function(done) {
		var obj = {'a': 'b'};
		storage.saveDownload(obj, function() {
			obj['c'] = 'd';
			storage.updateDownload(obj, function() {
				storage.getDownloads(function(docs) {
					docs.should.have.length(1);
					(docs[0]['c'] === 'd').should.be.ok();
					done();
				});	
			});
		});
	});
});