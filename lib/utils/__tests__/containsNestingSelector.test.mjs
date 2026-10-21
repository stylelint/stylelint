import { describe, it } from 'node:test';

import containsNestingSelector from '../containsNestingSelector.mjs';
import selectorParser from 'postcss-selector-parser';

describe('containsNestingSelector', () => {
	it('is true when the selector contains a nesting selector', (t) => {
		const root = selectorParser().astSync('& a');

		t.assert.strictEqual(containsNestingSelector(root.first), true);
	});

	it('is true for a nested nesting selector', (t) => {
		const root = selectorParser().astSync('a > &');

		t.assert.strictEqual(containsNestingSelector(root.first), true);
	});

	it('is false when the selector has no nesting selector', (t) => {
		const root = selectorParser().astSync('a b');

		t.assert.strictEqual(containsNestingSelector(root.first), false);
	});
});
