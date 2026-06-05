import isFamilyNameKeyword from '../isFamilyNameKeyword.mjs';
import valueParser from 'postcss-value-parser';

describe('isFamilyNameKeyword', () => {
	it('matches generic font-family keywords', () => {
		expect(isFamilyNameKeyword(valueParser('serif').nodes[0])).toBe(true);
		expect(isFamilyNameKeyword(valueParser('SANS-SERIF').nodes[0])).toBe(true);
		expect(isFamilyNameKeyword(valueParser('monospace').nodes[0])).toBe(true);
	});

	it('ignores quoted strings', () => {
		expect(isFamilyNameKeyword(valueParser('"serif"').nodes[0])).toBe(false);
	});

	it('ignores non-keyword family names', () => {
		expect(isFamilyNameKeyword(valueParser('Arial').nodes[0])).toBe(false);
	});
});
