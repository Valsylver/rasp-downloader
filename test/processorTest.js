var should = require('should');
var processor;

var waitAndDo = function(proc, timeout) {
	return function(callback) {
		setTimeout(function() {
			proc();
			callback();
		}, timeout);
	};
}

describe('processor', function() {
	beforeEach(function() {
		processor = require('../processor/processor');
	});

	it('should process the first one', function(done) {
		var passed = false;
		var process = waitAndDo(function() {
			passed = true
		}, 200);

		processor.addToQueue(process);

		setTimeout(function() {
			passed.should.be.ok();
			done();
		}, 300);
	});

	it('should start 2 in the same time', function(done) {
		var passed1 = false;
		var passed2 = false;

		var process1 = waitAndDo(function() {
			passed1 = true
		}, 200);

		var process2 = waitAndDo(function() {
			passed2 = true
		}, 200);

		processor.addToQueue(process1);
		processor.addToQueue(process2);

		setTimeout(function() {
			passed1.should.be.ok();
			passed2.should.be.ok();
			done();
		}, 300);
	});

	it('should wait before starting when the limit is reached', function(done) {
		var passed1 = false;
		var passed2 = false;
		var passed3 = false;

		var process1 = waitAndDo(function() {
			passed1 = true
		}, 200);

		var process2 = waitAndDo(function() {
			passed2 = true
		}, 200);

		var process3 = waitAndDo(function() {
			passed3 = true
		}, 200);

		processor.addToQueue(process1);
		processor.addToQueue(process2);
		processor.addToQueue(process3);

		setTimeout(function() {
			passed1.should.be.ok();
			passed2.should.be.ok();
			passed3.should.not.be.ok();

			setTimeout(function() {
				passed3.should.be.ok();
				done();
			}, 200);
		}, 300);
	});
});