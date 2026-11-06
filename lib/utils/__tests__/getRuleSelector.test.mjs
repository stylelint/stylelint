import { describe, it } from 'node:test';

import postcss from 'postcss';

import getRuleSelector from '../getRuleSelector.mjs';

const node = (code) => postcss.parse(code).first;

describe('getRuleSelector', () => {
	it('returns the selector', (t) => {
		t.assert.strictEqual(getRuleSelector(node('a {}')), 'a');
	});

	it('returns the raw selector with its comment', (t) => {
		t.assert.strictEqual(getRuleSelector(node('a, /* foo */ b {}')), 'a, /* foo */ b');
	});

	it('returns a new selector assigned over a raw one', (t) => {
		const ruleNode = node('a, /* foo */ b {}');

		ruleNode.selector = 'c';

		t.assert.strictEqual(getRuleSelector(ruleNode), 'c');
	});
});
