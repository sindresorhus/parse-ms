function parseNumber(milliseconds) {
	return {
		days: Math.trunc(milliseconds / 86400000),
		hours: Math.trunc(milliseconds / 3600000) % 24,
		minutes: Math.trunc(milliseconds / 60000) % 60,
		seconds: Math.trunc(milliseconds / 1000) % 60,
		milliseconds: Math.trunc(milliseconds) % 1000,
		microseconds: Math.trunc(milliseconds * 1000) % 1000,
		nanoseconds: Math.trunc(milliseconds * 1e6) % 1000
	};
}

function parseBigint(milliseconds) {
	return {
		days: milliseconds / 86400000n,
		hours: milliseconds / 3600000n % 24n,
		minutes: milliseconds / 60000n % 60n,
		seconds: milliseconds / 1000n % 60n,
		milliseconds: milliseconds % 1000n,
		microseconds: 0n,
		nanoseconds: 0n
	};
}

export default function parseMilliseconds(milliseconds) {
	switch (typeof milliseconds) {
		case 'number':
			if (Number.isFinite(milliseconds)) {
				return parseNumber(milliseconds);
			}

			break;
		case 'bigint':
			return parseBigint(milliseconds);

		// No default
	}

	throw new TypeError('Expected a finite number or bigint');
}

parseMilliseconds(1n);
