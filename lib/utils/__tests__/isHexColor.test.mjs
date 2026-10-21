import { test } from 'node:test';

import isHexColor from '../isHexColor.mjs';
import valueParser from 'postcss-value-parser';

const cases = [
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
];

for (const [argument, expected] of cases) {
	test(`isHexColor(${argument})`, (t) => {
		t.assert.strictEqual(isHexColor(valueParser(argument).nodes[0]), expected);
	});
}
