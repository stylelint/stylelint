import containsNestingSelector from '../containsNestingSelector.mjs';
import selectorParser from 'postcss-selector-parser';

describe('containsNestingSelector', () => {
	it('is true when the selector contains a nesting selector', () => {
		const root = selectorParser().astSync('& a');

		expect(containsNestingSelector(root.first)).toBe(true);
	});

	it('is true for a nested nesting selector', () => {
		const root = selectorParser().astSync('a > &');

		expect(containsNestingSelector(root.first)).toBe(true);
	});

	it('is false when the selector has no nesting selector', () => {
		const root = selectorParser().astSync('a b');

		expect(containsNestingSelector(root.first)).toBe(false);
	});
});
