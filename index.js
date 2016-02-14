'use strict';
module.exports = function (ms) {
	if (typeof ms !== 'number') {
		throw new TypeError('Expected a number');
	}

	return {
		days: (ms / 86400000) | 0,
		hours: (ms / 3600000 % 24) | 0,
		minutes: (ms / 60000 % 60) | 0,
		seconds: (ms / 1000 % 60) | 0,
		milliseconds: (ms % 1000) | 0
	};
};
