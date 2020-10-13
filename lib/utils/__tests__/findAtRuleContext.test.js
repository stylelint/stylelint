'use strict';

const findAtRuleContext = require('../findAtRuleContext');
const postcss = require('postcss');

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

	expect(findAtRuleContext(rule(css, 'a'))).toBeNull();
	expect(findAtRuleContext(rule(css, 'b'))).toHaveProperty('params', 'print');
	expect(findAtRuleContext(rule(css, 'c'))).toHaveProperty('params', '(min-width: 900px)');
});

function rule(css, selector) {
	const rules = [];

	postcss.parse(css).walkRules(selector, (rule) => rules.push(rule));

	return rules[0];
}
