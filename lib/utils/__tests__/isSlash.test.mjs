import isSlash from '../isSlash.mjs';
import valueParser from 'postcss-value-parser';

describe('isSlash', () => {
	it('matches a slash div node', () => {
		expect(isSlash(valueParser('a / b').nodes[1])).toBe(true);
	});

	it('ignores other div nodes', () => {
		expect(isSlash(valueParser('a, b').nodes[1])).toBe(false);
	});

	it('ignores non-div nodes', () => {
		expect(isSlash(valueParser('a').nodes[0])).toBe(false);
	});
});
