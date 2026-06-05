import normalizeCombinator from '../normalizeCombinator.mjs';

describe('normalizeCombinator', () => {
	it('collapses whitespace runs to a single space', () => {
		expect(normalizeCombinator('   ')).toBe(' ');
		expect(normalizeCombinator('\n\t ')).toBe(' ');
		expect(normalizeCombinator('>\n')).toBe('> ');
	});

	it('leaves single-character combinators unchanged', () => {
		expect(normalizeCombinator('>')).toBe('>');
		expect(normalizeCombinator('+')).toBe('+');
		expect(normalizeCombinator('~')).toBe('~');
	});
});
