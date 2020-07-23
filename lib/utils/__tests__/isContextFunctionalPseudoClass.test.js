'use strict';

const isContextFunctionalPseudoClass = require('../isContextFunctionalPseudoClass');
const parseSelector = require('postcss-selector-parser');
const postcss = require('postcss');

function selector(css, cb) {
	postcss.parse(css).walkRules((rule) => {
		parseSelector((selectorAST) => {
			selectorAST.walkPseudos(cb);
		}).processSync(rule.selector);
	});
}

describe('isContextFunctionalPseudoClass', () => {
	it('handles non-context-functional pseudo-classes, like hover', () => {
		selector('a:hover {}', (selector) => {
			expect(isContextFunctionalPseudoClass(selector)).toBe(false);
		});
	});

	it('handles logical combinations, ', () => {
		selector('a:has(.foo) {}', (selector) => {
			expect(isContextFunctionalPseudoClass(selector)).toBe(true);
		});
		selector('a:is(.foo) {}', (selector) => {
			expect(isContextFunctionalPseudoClass(selector)).toBe(true);
		});
		selector('a:matches(.foo) {}', (selector) => {
			expect(isContextFunctionalPseudoClass(selector)).toBe(true);
		});
		selector('a:not(.foo) {}', (selector) => {
			expect(isContextFunctionalPseudoClass(selector)).toBe(true);
		});
		selector('a:where(.foo) {}', (selector) => {
			expect(isContextFunctionalPseudoClass(selector)).toBe(true);
		});
	});

	it('handles tree structural/NPlusBOfSNotationPseudoClasses classes', () => {
		selector('a:nth-child(n+7) {}', (selector) => {
			expect(isContextFunctionalPseudoClass(selector)).toBe(true);
		});
		selector('a:nth-last-child(n+7) {}', (selector) => {
			expect(isContextFunctionalPseudoClass(selector)).toBe(true);
		});
	});
});
