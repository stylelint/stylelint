'use strict';

const isStandardSyntaxCombinator = require('../isStandardSyntaxCombinator');
const postcss = require('postcss');
const selectorParser = require('postcss-selector-parser');

describe('isStandardSyntaxCombinator', () => {
	it('tag', () => {
		rules('a {}', (func) => {
			expect(isStandardSyntaxCombinator(func)).toBeTruthy();
		});
	});
	it('descendant', () => {
		rules('a b {}', (func) => {
			expect(isStandardSyntaxCombinator(func)).toBeTruthy();
		});
	});
	it('descendant tab', () => {
		rules('a\tb {}', (func) => {
			expect(isStandardSyntaxCombinator(func)).toBeTruthy();
		});
	});
	it('descendant newline', () => {
		rules('a\nb {}', (func) => {
			expect(isStandardSyntaxCombinator(func)).toBeTruthy();
		});
	});
	it('descendant (double child)', () => {
		rules('a >> b {}', (func) => {
			expect(isStandardSyntaxCombinator(func)).toBeTruthy();
		});
	});
	it('child', () => {
		rules('a > b {}', (func) => {
			expect(isStandardSyntaxCombinator(func)).toBeTruthy();
		});
	});
	it('next sibling', () => {
		rules('a + b {}', (func) => {
			expect(isStandardSyntaxCombinator(func)).toBeTruthy();
		});
	});
	it('subsequent-sibling', () => {
		rules('a ~ b {}', (func) => {
			expect(isStandardSyntaxCombinator(func)).toBeTruthy();
		});
	});
	it('lowercase reference', () => {
		rules('a /for/ b {}', (func) => {
			expect(isStandardSyntaxCombinator(func)).toBeFalsy();
		});
	});
	it('mixedcase reference', () => {
		rules('a /fOr/ b {}', (func) => {
			expect(isStandardSyntaxCombinator(func)).toBeFalsy();
		});
	});
	it('uppercase reference', () => {
		rules('a /FOR/ b {}', (func) => {
			expect(isStandardSyntaxCombinator(func)).toBeFalsy();
		});
	});
});

function rules(css, cb) {
	postcss.parse(css).walkRules((rule) => {
		selectorParser((selectorAST) => {
			selectorAST.walkCombinators(cb);
		}).processSync(rule.selector);
	});
}
