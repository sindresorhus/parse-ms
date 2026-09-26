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

test('keep the sub-millisecond parts exact', t => {
	// Scaling to nanoseconds carries up to half a ulp of error, which truncated a whole number of nanoseconds down by one.
	runTest(t, 0.003_97, {
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
		milliseconds: 0,
		microseconds: 3,
		nanoseconds: 970,
	});

	runTest(t, 0.004_01, {
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
		milliseconds: 0,
		microseconds: 4,
		nanoseconds: 10,
	});

	// An exact integer millisecond value has no sub-millisecond part, however large.
	for (const milliseconds of [1, 1000, 1_000_000, 9_007_199_254_740, 1_234_567_890_123, 123_456_789_012_345, 9_007_199_254_740_991, 1e15]) {
		const parsed = parseMilliseconds(milliseconds);
		t.is(parsed.microseconds, 0, `${milliseconds}ms`);
		t.is(parsed.nanoseconds, 0, `${milliseconds}ms`);
	}

	// Every whole number of nanoseconds up to a millisecond lands on its exact value.
	for (let nanoseconds = 1; nanoseconds < 1000; nanoseconds++) {
		const parsed = parseMilliseconds(nanoseconds / 1e6);
		t.is(parsed.milliseconds, 0, `${nanoseconds}ns`);
		t.is(parsed.microseconds, 0, `${nanoseconds}ns`);
		t.is(parsed.nanoseconds, nanoseconds, `${nanoseconds}ns`);
	}
});
