'use strict';

const isContextFunctionalPseudoClass = require('../isContextFunctionalPseudoClass');
const parseSelector = require('postcss-selector-parser');
const postcss = require('postcss');

function pseudo(css) {
	const pseudos = [];

	postcss.parse(css).walkRules((rule) => {
		parseSelector((selectorAST) => {
			selectorAST.walkPseudos((p) => pseudos.push(p));
		}).processSync(rule.selector);
	});

	return pseudos[0];
}

describe('isContextFunctionalPseudoClass', () => {
	it('handles non-context-functional pseudo-classes, like hover', () => {
		expect(isContextFunctionalPseudoClass(pseudo('a:hover {}'))).toBe(false);
	});

	it('handles logical combinations, ', () => {
		expect(isContextFunctionalPseudoClass(pseudo('a:has(.foo) {}'))).toBe(true);
		expect(isContextFunctionalPseudoClass(pseudo('a:is(.foo) {}'))).toBe(true);
		expect(isContextFunctionalPseudoClass(pseudo('a:matches(.foo) {}'))).toBe(true);
		expect(isContextFunctionalPseudoClass(pseudo('a:not(.foo) {}'))).toBe(true);
		expect(isContextFunctionalPseudoClass(pseudo('a:where(.foo) {}'))).toBe(true);
	});

	it('handles tree structural/NPlusBOfSNotationPseudoClasses classes', () => {
		expect(isContextFunctionalPseudoClass(pseudo('a:nth-child(n+7) {}'))).toBe(true);
		expect(isContextFunctionalPseudoClass(pseudo('a:nth-last-child(n+7) {}'))).toBe(true);
	});
});
