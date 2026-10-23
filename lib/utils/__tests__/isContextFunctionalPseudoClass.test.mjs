import { describe, it } from 'node:test';

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
	it('handles non-context-functional pseudo-classes, like hover', (t) => {
		t.assert.strictEqual(isContextFunctionalPseudoClass(pseudo('a:hover {}')), false);
	});

	it('handles logical combinations', (t) => {
		t.assert.strictEqual(isContextFunctionalPseudoClass(pseudo('a:has(.foo) {}')), true);
		t.assert.strictEqual(isContextFunctionalPseudoClass(pseudo('a:is(.foo) {}')), true);
		t.assert.strictEqual(isContextFunctionalPseudoClass(pseudo('a:matches(.foo) {}')), true);
		t.assert.strictEqual(isContextFunctionalPseudoClass(pseudo('a:not(.foo) {}')), true);
		t.assert.strictEqual(isContextFunctionalPseudoClass(pseudo('a:where(.foo) {}')), true);
	});

	it('handles tree structural/NPlusBOfSNotationPseudoClasses classes', (t) => {
		t.assert.strictEqual(isContextFunctionalPseudoClass(pseudo('a:nth-child(n+7) {}')), true);
		t.assert.strictEqual(isContextFunctionalPseudoClass(pseudo('a:nth-last-child(n+7) {}')), true);
	});
});
