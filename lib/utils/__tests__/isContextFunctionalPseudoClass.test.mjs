import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import isContextFunctionalPseudoClass from '../isContextFunctionalPseudoClass.mjs';
import parseSelector from 'postcss-selector-parser';
import postcss from 'postcss';

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
		assert.equal(isContextFunctionalPseudoClass(pseudo('a:hover {}')), false);
	});

	it('handles logical combinations', () => {
		assert.equal(isContextFunctionalPseudoClass(pseudo('a:has(.foo) {}')), true);
		assert.equal(isContextFunctionalPseudoClass(pseudo('a:is(.foo) {}')), true);
		assert.equal(isContextFunctionalPseudoClass(pseudo('a:matches(.foo) {}')), true);
		assert.equal(isContextFunctionalPseudoClass(pseudo('a:not(.foo) {}')), true);
		assert.equal(isContextFunctionalPseudoClass(pseudo('a:where(.foo) {}')), true);
	});

	it('handles tree structural/NPlusBOfSNotationPseudoClasses classes', () => {
		assert.equal(isContextFunctionalPseudoClass(pseudo('a:nth-child(n+7) {}')), true);
		assert.equal(isContextFunctionalPseudoClass(pseudo('a:nth-last-child(n+7) {}')), true);
	});
});
