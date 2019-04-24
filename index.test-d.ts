import {expectType} from 'tsd';
import parseMilliseconds = require('.');

const parsed: parseMilliseconds.Parsed = parseMilliseconds(3000);

expectType<number>(parsed.days);
expectType<number>(parsed.hours);
expectType<number>(parsed.minutes);
expectType<number>(parsed.seconds);
expectType<number>(parsed.milliseconds);
expectType<number>(parsed.microseconds);
expectType<number>(parsed.nanoseconds);
