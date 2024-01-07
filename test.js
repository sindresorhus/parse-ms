import test from 'ava';
import parseMilliseconds from './index.js';

const toBigInt = milliseconds => {
	if (typeof milliseconds !== 'number') {
		return;
	}

	try {
		return BigInt(milliseconds);
	} catch {}
};

/**
@template {T extend number | bigint}
@param {import('ava').Assertions} t
@param {T} milliseconds
@param {import('./index.js').TimeComponents<T>} expected
*/
function runTest(t, milliseconds, expected) {
	t.deepEqual(parseMilliseconds(milliseconds), expected);

	const bigint = toBigInt(milliseconds);
	if (typeof bigint !== 'bigint') {
		return;
	}

	t.deepEqual(
		parseMilliseconds(bigint),
		Object.fromEntries(
			Object.entries(expected).map(([unit, value]) => [unit, BigInt(value)]),
		),
	);
}

test('parse milliseconds into an object', t => {
	runTest(t, 1000 + 400, {
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 1,
		milliseconds: 400,
		microseconds: 0,
		nanoseconds: 0,
	});

	runTest(t, 1000 * 55, {
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 55,
		milliseconds: 0,
		microseconds: 0,
		nanoseconds: 0,
	});

	runTest(t, 1000 * 67, {
		days: 0,
		hours: 0,
		minutes: 1,
		seconds: 7,
		milliseconds: 0,
		microseconds: 0,
		nanoseconds: 0,
	});

	runTest(t, 1000 * 60 * 5, {
		days: 0,
		hours: 0,
		minutes: 5,
		seconds: 0,
		milliseconds: 0,
		microseconds: 0,
		nanoseconds: 0,
	});

	runTest(t, 1000 * 60 * 67, {
		days: 0,
		hours: 1,
		minutes: 7,
		seconds: 0,
		milliseconds: 0,
		microseconds: 0,
		nanoseconds: 0,
	});

	runTest(t, 1000 * 60 * 60 * 12, {
		days: 0,
		hours: 12,
		minutes: 0,
		seconds: 0,
		milliseconds: 0,
		microseconds: 0,
		nanoseconds: 0,
	});

	runTest(t, 1000 * 60 * 60 * 40, {
		days: 1,
		hours: 16,
		minutes: 0,
		seconds: 0,
		milliseconds: 0,
		microseconds: 0,
		nanoseconds: 0,
	});

	runTest(t, 1000 * 60 * 60 * 999, {
		days: 41,
		hours: 15,
		minutes: 0,
		seconds: 0,
		milliseconds: 0,
		microseconds: 0,
		nanoseconds: 0,
	});

	runTest(t, (1000 * 60) + 500 + 0.345_678, {
		days: 0,
		hours: 0,
		minutes: 1,
		seconds: 0,
		milliseconds: 500,
		microseconds: 345,
		nanoseconds: 678,
	});

	runTest(t, 0.000_543, {
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
		milliseconds: 0,
		microseconds: 0,
		nanoseconds: 543,
	});

	runTest(
		t,
		0n
			// 1ms
			+ 1n
			// 2s
			+ (2n * 1000n)
			// 3m
			+ (3n * 1000n * 60n)
			// 4h
			+ (4n * 1000n * 60n * 60n)
			// Days
			+ (BigInt(Number.MAX_VALUE) * 1000n * 60n * 60n * 24n),
		{
			days: BigInt(Number.MAX_VALUE),
			hours: 4n,
			minutes: 3n,
			seconds: 2n,
			milliseconds: 1n,
			microseconds: 0n,
			nanoseconds: 0n,
		},
	);

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
	const units = [
		'days',
		'hours',
		'minutes',
		'seconds',
		'milliseconds',
	];

	const times = [
		0.0005,
		0.3,
		...[
			100 + 400,
			1000 * 55,
			1000 * 67,
			1000 * 60 * 5,
			1000 * 60 * 67,
			1000 * 60 * 60 * 12,
			1000 * 60 * 60 * 40,
			1000 * 60 * 60 * 999,
		].flatMap(number => [number, toBigInt(number)]),
		BigInt('0x' + 'F'.repeat(1e6)),
	];

	for (const milliseconds of times) {
		const positive = parseMilliseconds(milliseconds);
		const negative = parseMilliseconds(-milliseconds);

		for (const unit of units) {
			t.is(negative[unit], -positive[unit]);
		}
	}
});

test('errors', t => {
	t.throws(() => {
		parseMilliseconds('string');
	});

	t.throws(() => {
		parseMilliseconds(Number.NaN);
	});

	t.throws(() => {
		parseMilliseconds(Number.POSITIVE_INFINITY);
	});
});
