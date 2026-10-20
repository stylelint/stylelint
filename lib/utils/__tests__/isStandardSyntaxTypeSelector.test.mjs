import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import isStandardSyntaxTypeSelector from '../isStandardSyntaxTypeSelector.mjs';
import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';

describe('isStandardSyntaxTypeSelector', () => {
	it('tag', () => {
		assert.equal(isStandardSyntaxTypeSelector(tag('a {}')), true);
	});
	it('lowercase nth-child pseudo selector', () => {
		assert.equal(isStandardSyntaxTypeSelector(tag('.foo:nth-child(n) {}')), false);
	});
	it('mixedcase nth-child pseudo selector', () => {
		assert.equal(isStandardSyntaxTypeSelector(tag('.foo:nTh-ChIlD(n) {}')), false);
	});
	it('uppercase nth-child pseudo selector', () => {
		assert.equal(isStandardSyntaxTypeSelector(tag('.foo:NTH-CHILD(n) {}')), false);
	});
	it('nth-last-child pseudo selector', () => {
		assert.equal(isStandardSyntaxTypeSelector(tag('.foo:nth-last-child(n) {}')), false);
	});
	it('nth-of-type pseudo selector', () => {
		assert.equal(isStandardSyntaxTypeSelector(tag('.foo:nth-of-type(n) {}')), false);
	});
	it('lowercase lang pseudo selector', () => {
		assert.equal(isStandardSyntaxTypeSelector(tag(':lang(en) {}')), false);
	});
	it('mixedcase lang pseudo selector', () => {
		assert.equal(isStandardSyntaxTypeSelector(tag(':lAnG(en) {}')), false);
	});
	it('uppercase lang pseudo selector', () => {
		assert.equal(isStandardSyntaxTypeSelector(tag(':LANG(en) {}')), false);
	});
	it('dir pseudo selector', () => {
		assert.equal(isStandardSyntaxTypeSelector(tag(':dir(ltr) {}')), false);
	});
	it('nesting selector', () => {
		assert.equal(isStandardSyntaxTypeSelector(tag('.foo { &-bar {} }')), false);
	});
	it('nesting selector underscores', () => {
		assert.equal(isStandardSyntaxTypeSelector(tag('.foo { &__bar {} }')), false);
	});
	it('placeholder selector', () => {
		assert.equal(isStandardSyntaxTypeSelector(tag('%foo {}')), false);
	});
	// "Reference combinator" is unsupported? (see #2508)
	it.skip('shadow-piercing descendant combinator', () => {
		assert.equal(isStandardSyntaxTypeSelector(tag('.foo /deep/ .bar {}')), false);
	});
	it('shadow-parts ident', () => {
		assert.equal(isStandardSyntaxTypeSelector(tag('::part(foo) {}')), false);
	});
	// "Reference combinator" is unsupported? (see #2508)
	it.skip('lowercase reference combinators', () => {
		assert.equal(isStandardSyntaxTypeSelector(tag('.foo /for/ .bar {}')), false);
	});
	// "Reference combinator" is unsupported? (see #2508)
	it.skip('mixedcase reference combinators', () => {
		assert.equal(isStandardSyntaxTypeSelector(tag('.foo /fOr/ .bar {}')), false);
	});
	// "Reference combinator" is unsupported? (see #2508)
	it.skip('uppercase reference combinators', () => {
		assert.equal(isStandardSyntaxTypeSelector(tag('.foo /FOR/ .bar {}')), false);
	});
});

function tag(css) {
	const tags = [];

	postcss.parse(css).walkRules((rule) => {
		selectorParser((selectorAST) => {
			selectorAST.walkTags((t) => tags.push(t));
		}).processSync(rule.selector);
	});

	return tags[0];
}
