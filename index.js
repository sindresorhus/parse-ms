'use strict';
module.exports = ms => {
	if (typeof ms !== 'number') {
		throw new TypeError('Expected a number');
	}

	const roundTowardsZero = ms > 0 ? Math.floor : Math.ceil;

	return {
		days: roundTowardsZero(ms / 86400000),
		hours: roundTowardsZero(ms / 3600000) % 24,
		minutes: roundTowardsZero(ms / 60000) % 60,
		seconds: roundTowardsZero(ms / 1000) % 60,
		milliseconds: roundTowardsZero(ms) % 1000,
		microseconds: roundTowardsZero(ms * 1000) % 1000,
		nanoseconds: roundTowardsZero(ms * 1e6) % 1000
	};
};
