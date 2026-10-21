import { describe, it } from 'node:test';

import isStandardSyntaxTypeSelector from '../isStandardSyntaxTypeSelector.mjs';
import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';

describe('isStandardSyntaxTypeSelector', () => {
	it('tag', (t) => {
		t.assert.strictEqual(isStandardSyntaxTypeSelector(tag('a {}')), true);
	});
	it('lowercase nth-child pseudo selector', (t) => {
		t.assert.strictEqual(isStandardSyntaxTypeSelector(tag('.foo:nth-child(n) {}')), false);
	});
	it('mixedcase nth-child pseudo selector', (t) => {
		t.assert.strictEqual(isStandardSyntaxTypeSelector(tag('.foo:nTh-ChIlD(n) {}')), false);
	});
	it('uppercase nth-child pseudo selector', (t) => {
		t.assert.strictEqual(isStandardSyntaxTypeSelector(tag('.foo:NTH-CHILD(n) {}')), false);
	});
	it('nth-last-child pseudo selector', (t) => {
		t.assert.strictEqual(isStandardSyntaxTypeSelector(tag('.foo:nth-last-child(n) {}')), false);
	});
	it('nth-of-type pseudo selector', (t) => {
		t.assert.strictEqual(isStandardSyntaxTypeSelector(tag('.foo:nth-of-type(n) {}')), false);
	});
	it('lowercase lang pseudo selector', (t) => {
		t.assert.strictEqual(isStandardSyntaxTypeSelector(tag(':lang(en) {}')), false);
	});
	it('mixedcase lang pseudo selector', (t) => {
		t.assert.strictEqual(isStandardSyntaxTypeSelector(tag(':lAnG(en) {}')), false);
	});
	it('uppercase lang pseudo selector', (t) => {
		t.assert.strictEqual(isStandardSyntaxTypeSelector(tag(':LANG(en) {}')), false);
	});
	it('dir pseudo selector', (t) => {
		t.assert.strictEqual(isStandardSyntaxTypeSelector(tag(':dir(ltr) {}')), false);
	});
	it('nesting selector', (t) => {
		t.assert.strictEqual(isStandardSyntaxTypeSelector(tag('.foo { &-bar {} }')), false);
	});
	it('nesting selector underscores', (t) => {
		t.assert.strictEqual(isStandardSyntaxTypeSelector(tag('.foo { &__bar {} }')), false);
	});
	it('placeholder selector', (t) => {
		t.assert.strictEqual(isStandardSyntaxTypeSelector(tag('%foo {}')), false);
	});
	// "Reference combinator" is unsupported? (see #2508)
	it.skip('shadow-piercing descendant combinator', (t) => {
		t.assert.strictEqual(isStandardSyntaxTypeSelector(tag('.foo /deep/ .bar {}')), false);
	});
	it('shadow-parts ident', (t) => {
		t.assert.strictEqual(isStandardSyntaxTypeSelector(tag('::part(foo) {}')), false);
	});
	// "Reference combinator" is unsupported? (see #2508)
	it.skip('lowercase reference combinators', (t) => {
		t.assert.strictEqual(isStandardSyntaxTypeSelector(tag('.foo /for/ .bar {}')), false);
	});
	// "Reference combinator" is unsupported? (see #2508)
	it.skip('mixedcase reference combinators', (t) => {
		t.assert.strictEqual(isStandardSyntaxTypeSelector(tag('.foo /fOr/ .bar {}')), false);
	});
	// "Reference combinator" is unsupported? (see #2508)
	it.skip('uppercase reference combinators', (t) => {
		t.assert.strictEqual(isStandardSyntaxTypeSelector(tag('.foo /FOR/ .bar {}')), false);
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
