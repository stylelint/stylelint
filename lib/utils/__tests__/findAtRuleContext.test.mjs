import { it } from 'node:test';

import findAtRuleContext from '../findAtRuleContext.mjs';
import postcss from 'postcss';

it('findAtRuleContext', (t) => {
	const css = `
	a {}
	@media print {
		b {}
	}
	@media (min-width: 900px) {
		c {}
	}
	`;

	t.assert.strictEqual(findAtRuleContext(rule(css, 'a')), null);
	t.assert.strictEqual(findAtRuleContext(rule(css, 'b')).params, 'print');
	t.assert.strictEqual(findAtRuleContext(rule(css, 'c')).params, '(min-width: 900px)');
});

function rule(css, selector) {
	const rules = [];

	postcss.parse(css).walkRules(selector, (r) => rules.push(r));

	return rules[0];
}
