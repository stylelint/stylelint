import { describe, it } from 'node:test';

import isBlocklessAtRuleAfterBlocklessAtRule from '../isBlocklessAtRuleAfterBlocklessAtRule.mjs';
import postcss from 'postcss';

describe('isBlocklessAtRuleAfterBlocklessAtRule', () => {
	it('returns false with the first node', (t) => {
		const root = postcss.parse(`
      @import 'x.css'
    `);

		t.assert.strictEqual(isBlocklessAtRuleAfterBlocklessAtRule(root.nodes[0]), false);
	});

	it('returns false with a non-at-rule', (t) => {
		const root = postcss.parse(`
      foo {}
    `);

		t.assert.strictEqual(isBlocklessAtRuleAfterBlocklessAtRule(root.nodes[0]), false);
	});

	it('returns false when blockless-at-rule follows a non-at-rule', (t) => {
		const root = postcss.parse(`
      foo {}
      @import 'x.css';
    `);

		t.assert.strictEqual(isBlocklessAtRuleAfterBlocklessAtRule(root.nodes[1]), false);
	});

	it('returns false when blockless-at-rule follows a non-blockless-at-rule', (t) => {
		const root = postcss.parse(`
      @media {}
      @import 'x.css';
    `);

		t.assert.strictEqual(isBlocklessAtRuleAfterBlocklessAtRule(root.nodes[1]), false);
	});

	it('returns false when non-blockless-at-rule follows a blockless-at-rule', (t) => {
		const root = postcss.parse(`
      @import 'y.css';
      @media {}
    `);

		t.assert.strictEqual(isBlocklessAtRuleAfterBlocklessAtRule(root.nodes[1]), false);
	});

	it('returns true when blockless-at-rule follows a blockless-at-rule', (t) => {
		const root = postcss.parse(`
      @import 'y.css';
      @import 'x.css';
    `);

		t.assert.strictEqual(isBlocklessAtRuleAfterBlocklessAtRule(root.nodes[1]), true);
	});

	it('returns true when blockless-at-rule follows a blockless-at-rule with a shared-line comment', (t) => {
		const root = postcss.parse(`
      @import 'y.css'; /* comment */
      @import 'x.css';
    `);

		t.assert.strictEqual(isBlocklessAtRuleAfterBlocklessAtRule(root.nodes[2]), true);
	});
});
