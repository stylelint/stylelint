import { describe, it } from 'node:test';

import isMathFunction from '../isMathFunction.mjs';
import valueParser from 'postcss-value-parser';

describe('isMathFunction', () => {
	it('matches calc', (t) => {
		t.assert.strictEqual(isMathFunction(valueParser('calc(10% + 10px)').nodes[0]), true);
	});

	it('matches calc. insensitive', (t) => {
		t.assert.strictEqual(isMathFunction(valueParser('cALc(10% + 10px)').nodes[0]), true);
	});

	it('matches calc-size', (t) => {
		t.assert.strictEqual(isMathFunction(valueParser('calc-size(any, 0px)').nodes[0]), true);
	});

	it('does not match var', (t) => {
		t.assert.strictEqual(isMathFunction(valueParser('var(--foo, 1px)').nodes[0]), false);
	});
});
