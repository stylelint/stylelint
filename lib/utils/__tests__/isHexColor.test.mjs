import isHexColor from '../isHexColor.js';
import { test } from '@jest/globals';
import valueParser from 'postcss-value-parser';

test.each([
	['#fff', true],
	['#abcabc', true],
	['#f1f2f3', true],
	['#123', true],
	['#123123', true],
	['#0080FF44', true],
	['ffffff', false],
	['#12345', false],
	['#123456a', false],
	['#-111', false],
	[' #fff', false],
])('isHexColor(%s)', (argument, expected) => {
	expect(isHexColor(valueParser(argument).nodes[0])).toBe(expected);
});
