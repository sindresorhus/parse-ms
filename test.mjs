import test from 'ava';
import parseMilliseconds from './index.mjs';

const zeroReference = {
	days: 0,
	hours: 0,
	minutes: 0,
	seconds: 0,
	milliseconds: 0,
	microseconds: 0,
	nanoseconds: 0,
};
const zeroFullReference = {
	millennia: 0,
	centuries: 0,
	years: 0,
	months: 0,
	weeks: 0,
	...zeroReference};

function testParseMilliseconds(input, expectedOutput) {
	test(`parseMilliseconds(${input}) -> ${JSON.stringify(expectedOutput)}`, t => {
		t.deepEqual(parseMilliseconds(input), {...zeroReference, ...expectedOutput});
	});
}

testParseMilliseconds(1000 + 400, {seconds: 1, milliseconds: 400});
testParseMilliseconds(1000 * 55, {seconds: 55});
testParseMilliseconds(1000 * 67, {minutes: 1, seconds: 7});
testParseMilliseconds(1000 * 60 * 5, {minutes: 5});
testParseMilliseconds(1000 * 60 * 67, {hours: 1, minutes: 7});
testParseMilliseconds(1000 * 60 * 60 * 12, {hours: 12});
testParseMilliseconds(1000 * 60 * 60 * 40, {days: 1, hours: 16});
testParseMilliseconds(0.000_543, {nanoseconds: 543});
testParseMilliseconds(1000 * 60 * 60 * 999, {days: 41,	hours: 15});
testParseMilliseconds(0.4, {microseconds: 400});
testParseMilliseconds(0.123_456_789, {microseconds: 123, nanoseconds: 457});
testParseMilliseconds((1000 * 60) + 500 + 0.345_678, {
	minutes: 1,
	seconds: 0,
	milliseconds: 500,
	microseconds: 345,
	nanoseconds: 678,
});
test('split days in bigger units if asked', t => {
	t.deepEqual(parseMilliseconds(1000 * 60 * 60 * 999, 'millennia'), {...zeroFullReference,
		months: 1,
		weeks: 1,
		days: 4,
		hours: 4,
		minutes: 30,
	});
});
test('up and down unit can be given in short format and so for output', t => {
	t.deepEqual(parseMilliseconds(0.123_456_789, 's', 's', 'short'), {s: 0});
	t.deepEqual(parseMilliseconds(999, 's', 's', 'both'), {s: 1, seconds: 1});
});
test('round smaller units if asked', t => {
	t.deepEqual(parseMilliseconds(0.123_456_789, 's', 's'), {seconds: 0});
	t.deepEqual(parseMilliseconds(999, 's', 's'), {seconds: 1});
});
test('go deeper in small units if asked', t => {
	t.deepEqual(parseMilliseconds(0.123_456_789, 'millennia', 'picoseconds'),
		{...zeroFullReference, microseconds: 123, nanoseconds: 456, picoseconds: 789});
});
test('throw when bad input', t => {
	t.throws(() => parseMilliseconds('a string'));
	t.throws(() => parseMilliseconds(42, 'unknown unit'));
	t.throws(() => parseMilliseconds(42, 's', ''));
	t.throws(() => parseMilliseconds(42, 's', 's', 'nop'));
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
