import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import containsNestingSelector from '../containsNestingSelector.mjs';
import selectorParser from 'postcss-selector-parser';

describe('containsNestingSelector', () => {
	it('is true when the selector contains a nesting selector', () => {
		const root = selectorParser().astSync('& a');

		assert.equal(containsNestingSelector(root.first), true);
	});

	it('is true for a nested nesting selector', () => {
		const root = selectorParser().astSync('a > &');

		assert.equal(containsNestingSelector(root.first), true);
	});

	it('is false when the selector has no nesting selector', () => {
		const root = selectorParser().astSync('a b');

		assert.equal(containsNestingSelector(root.first), false);
	});
});
