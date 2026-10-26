import { describe, it } from 'node:test';

import isStandardSyntaxCombinator from '../isStandardSyntaxCombinator.mjs';
import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';

describe('isStandardSyntaxCombinator', () => {
	it('tag', (t) => {
		t.assert.ok(!isStandardSyntaxCombinator(postcss.parse('a {}').first));
	});
	it('descendant', (t) => {
		t.assert.ok(isStandardSyntaxCombinator(combinator('a b {}')));
	});
	it('descendant tab', (t) => {
		t.assert.ok(isStandardSyntaxCombinator(combinator('a\tb {}')));
	});
	it('descendant newline', (t) => {
		t.assert.ok(isStandardSyntaxCombinator(combinator('a\nb {}')));
	});
	it('descendant (double child)', (t) => {
		t.assert.ok(isStandardSyntaxCombinator(combinator('a >> b {}')));
	});
	it('child', (t) => {
		t.assert.ok(isStandardSyntaxCombinator(combinator('a > b {}')));
	});
	it('next sibling', (t) => {
		t.assert.ok(isStandardSyntaxCombinator(combinator('a + b {}')));
	});
	it('subsequent-sibling', (t) => {
		t.assert.ok(isStandardSyntaxCombinator(combinator('a ~ b {}')));
	});
	it('lowercase reference', (t) => {
		t.assert.ok(!isStandardSyntaxCombinator(combinator('a /for/ b {}')));
	});
	it('mixedcase reference', (t) => {
		t.assert.ok(!isStandardSyntaxCombinator(combinator('a /fOr/ b {}')));
	});
	it('uppercase reference', (t) => {
		t.assert.ok(!isStandardSyntaxCombinator(combinator('a /FOR/ b {}')));
	});
	it('last node is combinator', (t) => {
		t.assert.ok(!isStandardSyntaxCombinator(combinator('a ~, {}')));
	});
	it('first node is combinator', (t) => {
		t.assert.ok(!isStandardSyntaxCombinator(combinator('~ b {}')));
	});
	it('last node (in first container) is combinator', (t) => {
		t.assert.ok(!isStandardSyntaxCombinator(combinator('a ~, b {}')));
	});
	it('first node (in second container) is combinator', (t) => {
		t.assert.ok(!isStandardSyntaxCombinator(combinator('a, ~ b {}')));
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
