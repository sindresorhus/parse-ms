const weekByMonth = 365.25 / 7 / 12;

const factors = [
	{unit: 'nanoseconds', modulo: 1000, factor: 1e-6},
	{unit: 'microseconds', modulo: 1000},
	{unit: 'milliseconds', modulo: 1000},
	{unit: 'seconds', modulo: 60},
	{unit: 'minutes', modulo: 60},
	{unit: 'hours', modulo: 24},
	{unit: 'days', modulo: 7},
	{unit: 'weeks', modulo: weekByMonth},
	{unit: 'months', modulo: 12},
	{unit: 'years', modulo: 100},
	{unit: 'centuries', modulo: 10},
	{unit: 'millennia', modulo: 999_999_999_999_999},
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

const factorsUnit = factors.map(f => f.unit);

export default function parseMilliseconds(milliseconds, upToUnit = 'days') {
	if (typeof milliseconds !== 'number') {
		throw new TypeError(`Expected a number, received : ${milliseconds}`);
	}

	if (!factorsUnit.includes(upToUnit)) {
		throw new TypeError(`Unknow unit : ${upToUnit} (known : ${factorsUnit.join(', ')}`);
	}

	let intPower = 0;
	while (!Number.isInteger(milliseconds)) {
		milliseconds *= 10;
		intPower++;
		if (intPower >= 6) {
			milliseconds = Math.round(milliseconds);
		}
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

		result[u.unit] = Math.trunc(milliseconds / u.factor / (10 ** intPower));
		if (result[u.unit]) {
			milliseconds -= result[u.unit] * u.factor * (10 ** intPower);
		}
	}

	return result;
}
