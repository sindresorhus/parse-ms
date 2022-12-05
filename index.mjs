const weekByMonth = 365.25 / 7 / 12;

const factors = [
	{shortUnit: 'ps', unit: 'picoseconds', modulo: 1000, factor: 1e-9},
	{shortUnit: 'ns', unit: 'nanoseconds', modulo: 1000, factor: 1e-6},
	{shortUnit: 'µs', unit: 'microseconds', modulo: 1000},
	{shortUnit: 'ms', unit: 'milliseconds', modulo: 1000},
	{shortUnit: 's', unit: 'seconds', modulo: 60},
	{shortUnit: 'm', unit: 'minutes', modulo: 60},
	{shortUnit: 'h', unit: 'hours', modulo: 24},
	{shortUnit: 'D', unit: 'days', modulo: 7},
	{shortUnit: 'W', unit: 'weeks', modulo: weekByMonth},
	{shortUnit: 'M', unit: 'months', modulo: 12},
	{shortUnit: 'Y', unit: 'years', modulo: 100},
	{shortUnit: 'c', unit: 'centuries', modulo: 10},
	{shortUnit: 'ky', unit: 'millennia', modulo: 999_999_999_999_999},
];
for (let i = 1; i < factors.length; i++) {
	factors[i].factor = factors[i - 1].factor * factors[i - 1].modulo;
	if (factors[i - 1].factor >= 1) {
		factors[i - 1].factor = Math.trunc(factors[i - 1].factor);
	}

	// Factors[i].modulo = Math.ceil(factors[i].modulo);
}

const lastFactor = factors[factors.length - 1];
if (lastFactor.factor >= 1) {
	lastFactor.factor = Math.trunc(lastFactor.factor);
}

factors.reverse();

const toLongUnit = {};
for (const f of factors) {
	toLongUnit[f.unit] = f.unit;
	toLongUnit[f.shortUnit] = f.unit;
}

const toShortUnit = {};
for (const f of factors) {
	toShortUnit[f.unit] = f.shortUnit;
	toShortUnit[f.shortUnit] = f.shortUnit;
}

export default function parseMilliseconds(milliseconds, upToUnit = 'days', downToUnit = 'nanoseconds', outputFormat = 'long') {
	if (typeof milliseconds !== 'number') {
		throw new TypeError(`Expected a number, received : ${milliseconds}`);
	}

	if (toLongUnit[upToUnit]) {
		upToUnit = toLongUnit[upToUnit];
	} else {
		throw new TypeError(`Unknown unit : ${upToUnit} (known : ${toLongUnit.join(', ')}`);
	}

	if (toLongUnit[downToUnit]) {
		downToUnit = toLongUnit[downToUnit];
	} else {
		throw new TypeError(`Unknown unit : ${downToUnit} (known : ${toLongUnit.join(', ')}`);
	}

	let intPower = 0;
	while (!Number.isInteger(milliseconds)) {
		milliseconds *= 10;
		intPower++;
	}

	const result = {};
	let convertToThisUnit = false;
	for (const u of factors) {
		if (u.unit === upToUnit) {
			convertToThisUnit = true;
		}

		if (!convertToThisUnit) {
			continue;
		}

		if (u.unit === downToUnit) {
			result[u.unit] = Math.round(milliseconds / u.factor / (10 ** intPower));
			return choosNameFormat(result, outputFormat);
		}

		result[u.unit] = Math.trunc(milliseconds / u.factor / (10 ** intPower));
		if (result[u.unit]) {
			milliseconds -= result[u.unit] * u.factor * (10 ** intPower);
		}
	}

	return choosNameFormat(result, outputFormat);
}

function choosNameFormat(result, format = 'long') {
	if (format === 'long') {
		return result;
	}

	if (format === 'short') {
		return convertToShort(result);
	}

	if (format === 'both') {
		return {...convertToShort(result), ...result};
	}

	throw new TypeError(`output format "${format}" unknown. Choose between "short", "long" or "both".`);
}

function convertToShort(result) {
	const shortFormat = {};
	for (const k of Object.keys(result)) {
		shortFormat[toShortUnit[k]] = result[k];
	}

	return shortFormat;
}
