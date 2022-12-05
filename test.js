import test from 'ava';
import parseMilliseconds from './index.js';

test('parse milliseconds into an object', t => {
	const zeroReference = {
		millennia: 0,
		centuries: 0,
		years: 0,
		months: 0,
		weeks: 0,
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
		milliseconds: 0,
		microseconds: 0,
		nanoseconds: 0,
	};
	t.deepEqual(parseMilliseconds(1000 + 400), {...zeroReference, seconds: 1, milliseconds: 400});
	t.deepEqual(parseMilliseconds(1000 * 55), {...zeroReference, seconds: 55});
	t.deepEqual(parseMilliseconds(1000 * 67), {...zeroReference, minutes: 1, seconds: 7});
	t.deepEqual(parseMilliseconds(1000 * 60 * 5), {...zeroReference, minutes: 5});
	t.deepEqual(parseMilliseconds(1000 * 60 * 67), {...zeroReference, hours: 1, minutes: 7});
	t.deepEqual(parseMilliseconds(1000 * 60 * 60 * 12), {...zeroReference, hours: 12});
	t.deepEqual(parseMilliseconds(1000 * 60 * 60 * 40), {...zeroReference, days: 1, hours: 16});
	t.deepEqual(parseMilliseconds(0.000_543), {...zeroReference, nanoseconds: 543});
	t.deepEqual(parseMilliseconds(1000 * 60 * 60 * 999), {...zeroReference,
		months: 1,
		weeks: 1,
		days: 4,
		hours: 4,
		minutes: 30,
	});
	t.deepEqual(parseMilliseconds(500 + 0.345_678), {...zeroReference,
		milliseconds: 500,
		microseconds: 345,
		nanoseconds: 678,
	});
	t.deepEqual(parseMilliseconds((1000 * 60) + 500 + 0.345_678), {...zeroReference,
		minutes: 1,
		seconds: 0,
		milliseconds: 500,
		microseconds: 345,
		nanoseconds: 678,
	});
});

test('handle negative millisecond values', t => {
	const types = [
		'millennia',
		'centuries',
		'years',
		'months',
		'weeks',
		'days',
		'hours',
		'minutes',
		'seconds',
		'milliseconds',
		'microseconds',
		'nanoseconds',
	];

	const times = [
		0.0005,
		0.3,
		100 + 400,
		1000 * 55,
		1000 * 67,
		1000 * 60 * 5,
		1000 * 60 * 67,
		1000 * 60 * 60 * 12,
		1000 * 60 * 60 * 40,
		1000 * 60 * 60 * 999,
	];

	for (const milliseconds of times) {
		const positive = parseMilliseconds(milliseconds);
		const negative = parseMilliseconds(-milliseconds);

		for (const key of types) {
			if (positive[key]) {
				t.is(negative[key], -positive[key]);
			}
		}
	}
});
