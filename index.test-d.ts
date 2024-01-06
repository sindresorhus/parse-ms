import {expectType, expectError} from 'tsd';
import parseMilliseconds, {TimeComponents} from './index.js';

const result1: TimeComponents<number> = parseMilliseconds(3000);

expectType<number>(result1.days);
expectType<number>(result1.hours);
expectType<number>(result1.minutes);
expectType<number>(result1.seconds);
expectType<number>(result1.milliseconds);
expectType<number>(result1.microseconds);
expectType<number>(result1.nanoseconds);

const result2: TimeComponents<bigint> = parseMilliseconds(3000n);

expectType<bigint>(result2.days);
expectType<bigint>(result2.hours);
expectType<bigint>(result2.minutes);
expectType<bigint>(result2.seconds);
expectType<bigint>(result2.milliseconds);
expectType<bigint>(result2.microseconds);
expectType<bigint>(result2.nanoseconds);
