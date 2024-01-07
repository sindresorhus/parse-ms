import test from 'ava';
import parseMilliseconds from './index.js';

test('parse milliseconds into an object', t => {
	t.deepEqual(parseMilliseconds(1000 + 400), {
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 1,
		milliseconds: 400,
		microseconds: 0,
		nanoseconds: 0,
	});

	t.deepEqual(parseMilliseconds(1000 * 55), {
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 55,
		milliseconds: 0,
		microseconds: 0,
		nanoseconds: 0,
	});

	t.deepEqual(parseMilliseconds(1000 * 67), {
		days: 0,
		hours: 0,
		minutes: 1,
		seconds: 7,
		milliseconds: 0,
		microseconds: 0,
		nanoseconds: 0,
	});

	t.deepEqual(parseMilliseconds(1000 * 60 * 5), {
		days: 0,
		hours: 0,
		minutes: 5,
		seconds: 0,
		milliseconds: 0,
		microseconds: 0,
		nanoseconds: 0,
	});

	t.deepEqual(parseMilliseconds(1000 * 60 * 67), {
		days: 0,
		hours: 1,
		minutes: 7,
		seconds: 0,
		milliseconds: 0,
		microseconds: 0,
		nanoseconds: 0,
	});

	t.deepEqual(parseMilliseconds(1000 * 60 * 60 * 12), {
		days: 0,
		hours: 12,
		minutes: 0,
		seconds: 0,
		milliseconds: 0,
		microseconds: 0,
		nanoseconds: 0,
	});

	t.deepEqual(parseMilliseconds(1000 * 60 * 60 * 40), {
		days: 1,
		hours: 16,
		minutes: 0,
		seconds: 0,
		milliseconds: 0,
		microseconds: 0,
		nanoseconds: 0,
	});

	t.deepEqual(parseMilliseconds(1000 * 60 * 60 * 999), {
		days: 41,
		hours: 15,
		minutes: 0,
		seconds: 0,
		milliseconds: 0,
		microseconds: 0,
		nanoseconds: 0,
	});

	t.deepEqual(parseMilliseconds((1000 * 60) + 500 + 0.345_678), {
		days: 0,
		hours: 0,
		minutes: 1,
		seconds: 0,
		milliseconds: 500,
		microseconds: 345,
		nanoseconds: 678,
	});

	t.deepEqual(parseMilliseconds(0.000_543), {
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
		milliseconds: 0,
		microseconds: 0,
		nanoseconds: 543,
	});

	t.deepEqual(parseMilliseconds(Number.MAX_VALUE), {
		days: 2.080_663_350_535_087_5e+300,
		hours: 8,
		minutes: 8,
		seconds: 48,
		milliseconds: 368,
		microseconds: 0,
		nanoseconds: 0,
	});

	t.deepEqual(parseMilliseconds(Number.MIN_VALUE), {
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
		milliseconds: 0,
		microseconds: 0,
		nanoseconds: 0,
	});
});

test('handle negative millisecond values', t => {
	const types = [
		'days',
		'hours',
		'minutes',
		'seconds',
		'milliseconds',
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
			t.is(negative[key], -positive[key]);
		}
	}
});

