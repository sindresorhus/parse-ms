/* eslint-disable node-test/no-conditional-assertion -- Asserting once per value is the point of the exhaustive loops below. */
import {test} from 'node:test';
import assert from 'node:assert/strict';
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
Assert the parsed components, and the same input routed through the bigint path, which always yields whole units.

@template {number | bigint} T
@param {T} milliseconds The input to parse.
@param {import('./index.js').TimeComponents<T>} expected The components it must produce.
*/
function runTest(milliseconds, expected) {
	assert.deepStrictEqual(parseMilliseconds(milliseconds), expected);

	const bigint = toBigInt(milliseconds);
	if (typeof bigint !== 'bigint') {
		return;
	}

	assert.deepStrictEqual(
		parseMilliseconds(bigint),
		Object.fromEntries(
			Object.entries(expected).map(([unit, value]) => [unit, BigInt(value)]),
		),
	);
}

test('parse milliseconds into an object', () => {
	runTest(1000 + 400, {
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 1,
		milliseconds: 400,
		microseconds: 0,
		nanoseconds: 0,
	});

	runTest(1000 * 55, {
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 55,
		milliseconds: 0,
		microseconds: 0,
		nanoseconds: 0,
	});

	runTest(1000 * 67, {
		days: 0,
		hours: 0,
		minutes: 1,
		seconds: 7,
		milliseconds: 0,
		microseconds: 0,
		nanoseconds: 0,
	});

	runTest(1000 * 60 * 5, {
		days: 0,
		hours: 0,
		minutes: 5,
		seconds: 0,
		milliseconds: 0,
		microseconds: 0,
		nanoseconds: 0,
	});

	runTest(1000 * 60 * 67, {
		days: 0,
		hours: 1,
		minutes: 7,
		seconds: 0,
		milliseconds: 0,
		microseconds: 0,
		nanoseconds: 0,
	});

	runTest(1000 * 60 * 60 * 12, {
		days: 0,
		hours: 12,
		minutes: 0,
		seconds: 0,
		milliseconds: 0,
		microseconds: 0,
		nanoseconds: 0,
	});

	runTest(1000 * 60 * 60 * 40, {
		days: 1,
		hours: 16,
		minutes: 0,
		seconds: 0,
		milliseconds: 0,
		microseconds: 0,
		nanoseconds: 0,
	});

	runTest(1000 * 60 * 60 * 999, {
		days: 41,
		hours: 15,
		minutes: 0,
		seconds: 0,
		milliseconds: 0,
		microseconds: 0,
		nanoseconds: 0,
	});

	runTest((1000 * 60) + 500 + 0.345678, {
		days: 0,
		hours: 0,
		minutes: 1,
		seconds: 0,
		milliseconds: 500,
		microseconds: 345,
		nanoseconds: 678,
	});

	runTest(0.000543, {
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
		milliseconds: 0,
		microseconds: 0,
		nanoseconds: 543,
	});

	runTest(
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

	// The sub-day parts are the exact remainder within the day: `BigInt(Number.MAX_VALUE) % 86_400_000n` is `80_058_368n`, so 22h 14m 18.368s.
	assert.deepStrictEqual(parseMilliseconds(Number.MAX_VALUE), {
		days: 2.0806633505350875e+300,
		hours: 22,
		minutes: 14,
		seconds: 18,
		milliseconds: 368,
		microseconds: 0,
		nanoseconds: 0,
	});

	assert.deepStrictEqual(parseMilliseconds(Number.MIN_VALUE), {
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
		milliseconds: 0,
		microseconds: 0,
		nanoseconds: 0,
	});
});

test('handle negative millisecond values', () => {
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
			assert.strictEqual(negative[unit], -positive[unit], `${milliseconds}ms ${unit}`);
		}
	}
});

test('errors', () => {
	assert.throws(() => {
		parseMilliseconds('string');
	}, TypeError);

	assert.throws(() => {
		parseMilliseconds(NaN);
	}, TypeError);

	assert.throws(() => {
		parseMilliseconds(Infinity);
	}, TypeError);
});

test('keep the sub-millisecond parts exact', () => {
	// Scaling to nanoseconds carries up to half a ulp of error, which truncated a whole number of nanoseconds down by one.
	runTest(0.00397, {
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
		milliseconds: 0,
		microseconds: 3,
		nanoseconds: 970,
	});

	runTest(0.00401, {
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
		assert.strictEqual(parsed.microseconds, 0, `${milliseconds}ms`);
		assert.strictEqual(parsed.nanoseconds, 0, `${milliseconds}ms`);
	}

	// An exactly representable fraction keeps its value next to a large whole part, which scaling the whole value would corrupt.
	for (const milliseconds of [1_000_000_000_000.125, 10_000_000_000_000.125]) {
		const parsed = parseMilliseconds(milliseconds);
		assert.strictEqual(parsed.microseconds, 125, `${milliseconds}ms`);
		assert.strictEqual(parsed.nanoseconds, 0, `${milliseconds}ms`);
	}

	// Every whole number of nanoseconds up to a millisecond lands on its exact value.
	for (let nanoseconds = 1; nanoseconds < 1000; nanoseconds++) {
		const parsed = parseMilliseconds(nanoseconds / 1e6);
		assert.strictEqual(parsed.milliseconds, 0, `${nanoseconds}ns`);
		assert.strictEqual(parsed.microseconds, 0, `${nanoseconds}ns`);
		assert.strictEqual(parsed.nanoseconds, nanoseconds, `${nanoseconds}ns`);
	}
});

test('keep the sub-day parts exact at any magnitude', () => {
	// The sub-day parts came from a large quotient, which loses its low digits once the quotient is no longer an exact integer.
	for (const milliseconds of [1e15, 1e18, 1e20, 1e21, 1e22, 1e23, Number.MAX_VALUE]) {
		const parsed = parseMilliseconds(milliseconds);
		const exact = BigInt(milliseconds);

		assert.strictEqual(parsed.seconds, Number((exact % 60_000n) / 1000n), `${milliseconds}ms seconds`);
		assert.strictEqual(parsed.minutes, Number((exact % 3_600_000n) / 60_000n), `${milliseconds}ms minutes`);
		assert.strictEqual(parsed.hours, Number((exact % 86_400_000n) / 3_600_000n), `${milliseconds}ms hours`);

		const bigint = parseMilliseconds(BigInt(milliseconds));
		assert.strictEqual(parsed.seconds, Number(bigint.seconds), `${milliseconds}ms seconds against the bigint path`);
		assert.strictEqual(parsed.minutes, Number(bigint.minutes), `${milliseconds}ms minutes against the bigint path`);
		assert.strictEqual(parsed.hours, Number(bigint.hours), `${milliseconds}ms hours against the bigint path`);
	}
});
