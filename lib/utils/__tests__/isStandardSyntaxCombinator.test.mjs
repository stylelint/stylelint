import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import isStandardSyntaxCombinator from '../isStandardSyntaxCombinator.mjs';
import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';

describe('isStandardSyntaxCombinator', () => {
	it('tag', () => {
		assert.ok(!isStandardSyntaxCombinator(postcss.parse('a {}').first));
	});
	it('descendant', () => {
		assert.ok(isStandardSyntaxCombinator(combinator('a b {}')));
	});
	it('descendant tab', () => {
		assert.ok(isStandardSyntaxCombinator(combinator('a\tb {}')));
	});
	it('descendant newline', () => {
		assert.ok(isStandardSyntaxCombinator(combinator('a\nb {}')));
	});
	it('descendant (double child)', () => {
		assert.ok(isStandardSyntaxCombinator(combinator('a >> b {}')));
	});
	it('child', () => {
		assert.ok(isStandardSyntaxCombinator(combinator('a > b {}')));
	});
	it('next sibling', () => {
		assert.ok(isStandardSyntaxCombinator(combinator('a + b {}')));
	});
	it('subsequent-sibling', () => {
		assert.ok(isStandardSyntaxCombinator(combinator('a ~ b {}')));
	});
	it('lowercase reference', () => {
		assert.ok(!isStandardSyntaxCombinator(combinator('a /for/ b {}')));
	});
	it('mixedcase reference', () => {
		assert.ok(!isStandardSyntaxCombinator(combinator('a /fOr/ b {}')));
	});
	it('uppercase reference', () => {
		assert.ok(!isStandardSyntaxCombinator(combinator('a /FOR/ b {}')));
	});
	it('last node is combinator', () => {
		assert.ok(!isStandardSyntaxCombinator(combinator('a ~, {}')));
	});
	it('first node is combinator', () => {
		assert.ok(!isStandardSyntaxCombinator(combinator('~ b {}')));
	});
	it('last node (in first container) is combinator', () => {
		assert.ok(!isStandardSyntaxCombinator(combinator('a ~, b {}')));
	});
	it('first node (in second container) is combinator', () => {
		assert.ok(!isStandardSyntaxCombinator(combinator('a, ~ b {}')));
	});
});

function combinator(css) {
	const list = [];

	postcss.parse(css).walkRules((rule) => {
		selectorParser((selectorAST) => {
			selectorAST.walkCombinators((c) => list.push(c));
		}).processSync(rule.selector);
	});

	return list[0];
}
