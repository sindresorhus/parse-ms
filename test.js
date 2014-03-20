'use strict';
var assert = require('assert');
var parseMs = require('./index');

it('should parse milliseconds into an object', function () {
	assert.deepEqual(parseMs(1000 + 400), {
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 1,
		milliseconds: 400
	});

	assert.deepEqual(parseMs(1000 * 55), {
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 55,
		milliseconds: 0
	});

	assert.deepEqual(parseMs(1000 * 67), {
		days: 0,
		hours: 0,
		minutes: 1,
		seconds: 7,
		milliseconds: 0
	});

	assert.deepEqual(parseMs(1000 * 60 * 5), {
		days: 0,
		hours: 0,
		minutes: 5,
		seconds: 0,
		milliseconds: 0
	});

	assert.deepEqual(parseMs(1000 * 60 * 67), {
		days: 0,
		hours: 1,
		minutes: 7,
		seconds: 0,
		milliseconds: 0
	});

	assert.deepEqual(parseMs(1000 * 60 * 60 * 12), {
		days: 0,
		hours: 12,
		minutes: 0,
		seconds: 0,
		milliseconds: 0
	});

	assert.deepEqual(parseMs(1000 * 60 * 60 * 40), {
		days: 1,
		hours: 16,
		minutes: 0,
		seconds: 0,
		milliseconds: 0
	});

	assert.deepEqual(parseMs(1000 * 60 * 60 * 999), {
		days: 41,
		hours: 15,
		minutes: 0,
		seconds: 0,
		milliseconds: 0
	});
});
