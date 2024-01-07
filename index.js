const toZeroIfInfinity = value => Number.isFinite(value) ? value : 0;

export default function parseMilliseconds(milliseconds) {
	if (typeof milliseconds !== 'number') {
		throw new TypeError('Expected a number');
	}

	return {
		days: Math.trunc(milliseconds / 86_400_000),
		hours: Math.trunc(milliseconds / 3_600_000 % 24),
		minutes: Math.trunc(milliseconds / 60_000 % 60),
		seconds: Math.trunc(milliseconds / 1000 % 60),
		milliseconds: Math.trunc(milliseconds % 1000),
		microseconds: Math.trunc(toZeroIfInfinity(milliseconds * 1000) % 1000),
		nanoseconds: Math.trunc(toZeroIfInfinity(milliseconds * 1e6) % 1000),
	};
}
