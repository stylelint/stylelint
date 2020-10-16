'use strict';

const isStandardSyntaxTypeSelector = require('../isStandardSyntaxTypeSelector');
const postcss = require('postcss');
const selectorParser = require('postcss-selector-parser');

describe('isStandardSyntaxTypeSelector', () => {
	it('tag', () => {
		expect(isStandardSyntaxTypeSelector(tag('a {}'))).toBe(true);
	});
	it('lowercase nth-child pseudo selector', () => {
		expect(isStandardSyntaxTypeSelector(tag('.foo:nth-child(n) {}'))).toBe(false);
	});
	it('mixedcase nth-child pseudo selector', () => {
		expect(isStandardSyntaxTypeSelector(tag('.foo:nTh-ChIlD(n) {}'))).toBe(false);
	});
	it('uppercase nth-child pseudo selector', () => {
		expect(isStandardSyntaxTypeSelector(tag('.foo:NTH-CHILD(n) {}'))).toBe(false);
	});
	it('nth-last-child pseudo selector', () => {
		expect(isStandardSyntaxTypeSelector(tag('.foo:nth-last-child(n) {}'))).toBe(false);
	});
	it('nth-of-type pseudo selector', () => {
		expect(isStandardSyntaxTypeSelector(tag('.foo:nth-of-type(n) {}'))).toBe(false);
	});
	it('lowercase lang pseudo selector', () => {
		expect(isStandardSyntaxTypeSelector(tag(':lang(en) {}'))).toBe(false);
	});
	it('mixedcase lang pseudo selector', () => {
		expect(isStandardSyntaxTypeSelector(tag(':lAnG(en) {}'))).toBe(false);
	});
	it('uppercase lang pseudo selector', () => {
		expect(isStandardSyntaxTypeSelector(tag(':LANG(en) {}'))).toBe(false);
	});
	it('dir pseudo selector', () => {
		expect(isStandardSyntaxTypeSelector(tag(':dir(ltr) {}'))).toBe(false);
	});
	it('nesting selector', () => {
		expect(isStandardSyntaxTypeSelector(tag('.foo { &-bar {} }'))).toBe(false);
	});
	it('nesting selector underscores', () => {
		expect(isStandardSyntaxTypeSelector(tag('.foo { &__bar {} }'))).toBe(false);
	});
	it('placeholder selector', () => {
		expect(isStandardSyntaxTypeSelector(tag('%foo {}'))).toBe(false);
	});
	// eslint-disable-next-line jest/no-disabled-tests -- "Reference combinator" is unsupported? (see #2508)
	it.skip('shadow-piercing descendant combinator', () => {
		expect(isStandardSyntaxTypeSelector(tag('.foo /deep/ .bar {}'))).toBe(false);
	});
	it('shadow-parts ident', () => {
		expect(isStandardSyntaxTypeSelector(tag('::part(foo) {}'))).toBe(false);
	});
	// eslint-disable-next-line jest/no-disabled-tests -- "Reference combinator" is unsupported? (see #2508)
	it.skip('lowercase reference combinators', () => {
		expect(isStandardSyntaxTypeSelector(tag('.foo /for/ .bar {}'))).toBe(false);
	});
	// eslint-disable-next-line jest/no-disabled-tests -- "Reference combinator" is unsupported? (see #2508)
	it.skip('mixedcase reference combinators', () => {
		expect(isStandardSyntaxTypeSelector(tag('.foo /fOr/ .bar {}'))).toBe(false);
	});
	// eslint-disable-next-line jest/no-disabled-tests -- "Reference combinator" is unsupported? (see #2508)
	it.skip('uppercase reference combinators', () => {
		expect(isStandardSyntaxTypeSelector(tag('.foo /FOR/ .bar {}'))).toBe(false);
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
