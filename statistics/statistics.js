var stats = {};

stats.bytesToMegaBytes = function(bytes) {
	return (bytes / (1024 * 1024));
};

stats.rate = function(megaBytes, seconds) {
	return (megaBytes / seconds);
};

module.exports = stats;

