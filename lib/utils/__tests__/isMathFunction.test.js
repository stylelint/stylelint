'use strict';

const isMathFunction = require('../isMathFunction');
const valueParser = require('postcss-value-parser');

describe('isMathFunction', () => {
	it('matches calc', () => {
		expect(isMathFunction(valueParser('calc(10% + 10px)').nodes[0])).toBe(true);
	});

	it('matches calc. insensitive', () => {
		expect(isMathFunction(valueParser('cALc(10% + 10px)').nodes[0])).toBe(true);
	});

	it('does not match var', () => {
		expect(isMathFunction(valueParser('var(--foo, 1px)').nodes[0])).toBe(false);
	});
});
