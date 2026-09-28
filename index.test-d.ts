import {expectTypeOf} from 'nz';
import parseMilliseconds, {type TimeComponents} from './index.js';

const result1: TimeComponents = parseMilliseconds(3000);

expectTypeOf(result1.days).toBe<number>();
expectTypeOf(result1.hours).toBe<number>();
expectTypeOf(result1.minutes).toBe<number>();
expectTypeOf(result1.seconds).toBe<number>();
expectTypeOf(result1.milliseconds).toBe<number>();
expectTypeOf(result1.microseconds).toBe<number>();
expectTypeOf(result1.nanoseconds).toBe<number>();

const result2: TimeComponents<bigint> = parseMilliseconds(3000n);

expectTypeOf(result2.days).toBe<bigint>();
expectTypeOf(result2.hours).toBe<bigint>();
expectTypeOf(result2.minutes).toBe<bigint>();
expectTypeOf(result2.seconds).toBe<bigint>();
expectTypeOf(result2.milliseconds).toBe<bigint>();
expectTypeOf(result2.microseconds).toBe<bigint>();
expectTypeOf(result2.nanoseconds).toBe<bigint>();
