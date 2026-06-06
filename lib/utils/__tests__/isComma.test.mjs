import isComma from '../isComma.mjs';
import valueParser from 'postcss-value-parser';

describe('isComma', () => {
	it('matches a comma div node', () => {
		expect(isComma(valueParser('a, b').nodes[1])).toBe(true);
	});

	it('ignores other div nodes', () => {
		expect(isComma(valueParser('a / b').nodes[1])).toBe(false);
	});

	it('ignores non-div nodes', () => {
		expect(isComma(valueParser('a').nodes[0])).toBe(false);
	});
});
