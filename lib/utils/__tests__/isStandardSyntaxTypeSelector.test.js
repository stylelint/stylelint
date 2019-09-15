'use strict';

const isStandardSyntaxTypeSelector = require('../isStandardSyntaxTypeSelector');
const postcss = require('postcss');
const selectorParser = require('postcss-selector-parser');

describe('isStandardSyntaxTypeSelector', () => {
	it('tag', () => {
		rules('a {}', (func) => {
			expect(isStandardSyntaxTypeSelector(func)).toBeTruthy();
		});
	});
	it('lowercase nth-child pseudo selector', () => {
		rules('.foo:nth-child(n) {}', (func) => {
			expect(isStandardSyntaxTypeSelector(func)).toBeFalsy();
		});
	});
	it('mixedcase nth-child pseudo selector', () => {
		rules('.foo:nTh-ChIlD(n) {}', (func) => {
			expect(isStandardSyntaxTypeSelector(func)).toBeFalsy();
		});
	});
	it('uppercase nth-child pseudo selector', () => {
		rules('.foo:NTH-CHILD(n) {}', (func) => {
			expect(isStandardSyntaxTypeSelector(func)).toBeFalsy();
		});
	});
	it('nth-last-child pseudo selector', () => {
		rules('.foo:nth-last-child(n) {}', (func) => {
			expect(isStandardSyntaxTypeSelector(func)).toBeFalsy();
		});
	});
	it('nth-of-type pseudo selector', () => {
		rules('.foo:nth-of-type(n) {}', (func) => {
			expect(isStandardSyntaxTypeSelector(func)).toBeFalsy();
		});
	});
	it('lowercase lang pseudo selector', () => {
		rules(':lang(en) {}', (func) => {
			expect(isStandardSyntaxTypeSelector(func)).toBeFalsy();
		});
	});
	it('mixedcase lang pseudo selector', () => {
		rules(':lAnG(en) {}', (func) => {
			expect(isStandardSyntaxTypeSelector(func)).toBeFalsy();
		});
	});
	it('uppercase lang pseudo selector', () => {
		rules(':LANG(en) {}', (func) => {
			expect(isStandardSyntaxTypeSelector(func)).toBeFalsy();
		});
	});
	it('dir pseudo selector', () => {
		rules(':dir(ltr) {}', (func) => {
			expect(isStandardSyntaxTypeSelector(func)).toBeFalsy();
		});
	});
	it('nesting selector', () => {
		rules('.foo { &-bar {} }', (func) => {
			expect(isStandardSyntaxTypeSelector(func)).toBeFalsy();
		});
	});
	it('nesting selector underscores', () => {
		rules('.foo { &__bar {} }', (func) => {
			expect(isStandardSyntaxTypeSelector(func)).toBeFalsy();
		});
	});
	it('placeholder selector', () => {
		rules('%foo {}', (func) => {
			expect(isStandardSyntaxTypeSelector(func)).toBeFalsy();
		});
	});
	it('shadow-piercing descendant combinator', () => {
		rules('.foo /deep/ .bar {}', (func) => {
			expect(isStandardSyntaxTypeSelector(func)).toBeFalsy();
		});
	});
	it('lowercase reference combinators', () => {
		rules('.foo /for/ .bar {}', (func) => {
			expect(isStandardSyntaxTypeSelector(func)).toBeFalsy();
		});
	});
	it('mixedcase reference combinators', () => {
		rules('.foo /fOr/ .bar {}', (func) => {
			expect(isStandardSyntaxTypeSelector(func)).toBeFalsy();
		});
	});
	it('uppercase reference combinators', () => {
		rules('.foo /FOR/ .bar {}', (func) => {
			expect(isStandardSyntaxTypeSelector(func)).toBeFalsy();
		});
	});
});

function rules(css, cb) {
	postcss.parse(css).walkRules((rule) => {
		selectorParser((selectorAST) => {
			selectorAST.walkTags(cb);
		}).processSync(rule.selector);
	});
}
