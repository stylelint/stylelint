import assert from 'node:assert/strict';
import { it } from 'node:test';

import findAtRuleContext from '../findAtRuleContext.mjs';
import postcss from 'postcss';

it('findAtRuleContext', () => {
	const css = `
	a {}
	@media print {
		b {}
	}
	@media (min-width: 900px) {
		c {}
	}
	`;

	assert.equal(findAtRuleContext(rule(css, 'a')), null);
	assert.equal(findAtRuleContext(rule(css, 'b')).params, 'print');
	assert.equal(findAtRuleContext(rule(css, 'c')).params, '(min-width: 900px)');
});

function rule(css, selector) {
	const rules = [];

	postcss.parse(css).walkRules(selector, (r) => rules.push(r));

	return rules[0];
}
