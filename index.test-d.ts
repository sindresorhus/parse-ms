import {expectType} from 'tsd';
import parseMilliseconds, {TimeComponents} from './index.js';

const components: TimeComponents = parseMilliseconds(3000);

expectType<number>(components.days);
expectType<number>(components.hours);
expectType<number>(components.minutes);
expectType<number>(components.seconds);
expectType<number>(components.milliseconds);
expectType<number>(components.microseconds);
expectType<number>(components.nanoseconds);
