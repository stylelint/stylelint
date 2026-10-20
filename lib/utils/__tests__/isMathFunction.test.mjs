import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import isMathFunction from '../isMathFunction.mjs';
import valueParser from 'postcss-value-parser';

describe('isMathFunction', () => {
	it('matches calc', () => {
		assert.equal(isMathFunction(valueParser('calc(10% + 10px)').nodes[0]), true);
	});

	it('matches calc. insensitive', () => {
		assert.equal(isMathFunction(valueParser('cALc(10% + 10px)').nodes[0]), true);
	});

	it('matches calc-size', () => {
		assert.equal(isMathFunction(valueParser('calc-size(any, 0px)').nodes[0]), true);
	});

	it('does not match var', () => {
		assert.equal(isMathFunction(valueParser('var(--foo, 1px)').nodes[0]), false);
	});
});
