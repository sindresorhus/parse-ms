// Scaling a value to nanoseconds carries up to half a ulp of error, which would truncate a whole number of nanoseconds down by one.
const SCALING_EPSILON = 0.000_000_1;
const MAX_NANOSECONDS_IN_MILLISECOND = 999_999;

function parseNumber(milliseconds) {
	// The sub-millisecond parts come from scaling the value to nanoseconds, which recovers its intended decimal best. That scaling leaves the exact integer range above ~9e9ms, so it is reduced modulo a second there to avoid yielding phantom values for what is a whole number of milliseconds.
	const scaledNanoseconds = (Number.isSafeInteger(Math.trunc(milliseconds) * 1e6) ? milliseconds : milliseconds % 1000) * 1e6;
	// The nudge absorbs the scaling error, which would otherwise truncate a whole number of nanoseconds down by one. Clamping stops it from carrying into the next millisecond.
	const totalNanoseconds = Math.min(
		MAX_NANOSECONDS_IN_MILLISECOND,
		Math.max(
			Math.trunc((scaledNanoseconds % 1e6) + (Math.sign(scaledNanoseconds) * SCALING_EPSILON)),
			-MAX_NANOSECONDS_IN_MILLISECOND,
		),
	);

	return {
		days: Math.trunc(milliseconds / 86_400_000),
		// The sub-day parts come from a remainder, as a large quotient loses the low digits of the part to float error.
		hours: Math.trunc(milliseconds % 86_400_000 / 3_600_000),
		minutes: Math.trunc(milliseconds % 3_600_000 / 60_000),
		seconds: Math.trunc(milliseconds % 60_000 / 1000),
		milliseconds: Math.trunc(milliseconds % 1000),
		microseconds: Math.trunc(totalNanoseconds / 1000),
		nanoseconds: totalNanoseconds % 1000,
	};
}

function parseBigint(milliseconds) {
	return {
		days: milliseconds / 86_400_000n,
		hours: milliseconds / 3_600_000n % 24n,
		minutes: milliseconds / 60_000n % 60n,
		seconds: milliseconds / 1000n % 60n,
		milliseconds: milliseconds % 1000n,
		microseconds: 0n,
		nanoseconds: 0n,
	};
}

export default function parseMilliseconds(milliseconds) {
	switch (typeof milliseconds) {
		case 'number': {
			if (Number.isFinite(milliseconds)) {
				return parseNumber(milliseconds);
			}

			break;
		}

		case 'bigint': {
			return parseBigint(milliseconds);
		}

		// No default
	}

	throw new TypeError('Expected a finite number or bigint');
}
