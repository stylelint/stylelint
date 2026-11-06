import { describe, it } from 'node:test';

import postcss from 'postcss';

import getRuleSelector from '../getRuleSelector.mjs';
import setRuleSelector from '../setRuleSelector.mjs';

const node = (code) => postcss.parse(code).first;

describe('setRuleSelector', () => {
	it('sets the selector', (t) => {
		const ruleNode = setRuleSelector(node('a {}'), 'b');

		t.assert.strictEqual(ruleNode.toString(), 'b {}');
		t.assert.strictEqual(getRuleSelector(ruleNode), 'b');
		t.assert.strictEqual(ruleNode.selector, 'b');
	});

	it('sets the raw selector when the selector has a comment', (t) => {
		const ruleNode = setRuleSelector(node('a, /* foo */ b {}'), 'a, /* foo */ c');

		t.assert.strictEqual(ruleNode.toString(), 'a, /* foo */ c {}');
		t.assert.strictEqual(getRuleSelector(ruleNode), 'a, /* foo */ c');
		t.assert.strictEqual(ruleNode.selector, 'a,  c');
	});
});
