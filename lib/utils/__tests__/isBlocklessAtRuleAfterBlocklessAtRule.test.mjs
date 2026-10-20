import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import isBlocklessAtRuleAfterBlocklessAtRule from '../isBlocklessAtRuleAfterBlocklessAtRule.mjs';
import postcss from 'postcss';

describe('isBlocklessAtRuleAfterBlocklessAtRule', () => {
	it('returns false with the first node', () => {
		const root = postcss.parse(`
      @import 'x.css'
    `);

		assert.equal(isBlocklessAtRuleAfterBlocklessAtRule(root.nodes[0]), false);
	});

	it('returns false with a non-at-rule', () => {
		const root = postcss.parse(`
      foo {}
    `);

		assert.equal(isBlocklessAtRuleAfterBlocklessAtRule(root.nodes[0]), false);
	});

	it('returns false when blockless-at-rule follows a non-at-rule', () => {
		const root = postcss.parse(`
      foo {}
      @import 'x.css';
    `);

		assert.equal(isBlocklessAtRuleAfterBlocklessAtRule(root.nodes[1]), false);
	});

	it('returns false when blockless-at-rule follows a non-blockless-at-rule', () => {
		const root = postcss.parse(`
      @media {}
      @import 'x.css';
    `);

		assert.equal(isBlocklessAtRuleAfterBlocklessAtRule(root.nodes[1]), false);
	});

	it('returns false when non-blockless-at-rule follows a blockless-at-rule', () => {
		const root = postcss.parse(`
      @import 'y.css';
      @media {}
    `);

		assert.equal(isBlocklessAtRuleAfterBlocklessAtRule(root.nodes[1]), false);
	});

	it('returns true when blockless-at-rule follows a blockless-at-rule', () => {
		const root = postcss.parse(`
      @import 'y.css';
      @import 'x.css';
    `);

		assert.equal(isBlocklessAtRuleAfterBlocklessAtRule(root.nodes[1]), true);
	});

	it('returns true when blockless-at-rule follows a blockless-at-rule with a shared-line comment', () => {
		const root = postcss.parse(`
      @import 'y.css'; /* comment */
      @import 'x.css';
    `);

		assert.equal(isBlocklessAtRuleAfterBlocklessAtRule(root.nodes[2]), true);
	});
});
