import findAtRuleContext from '../findAtRuleContext.js';
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

	expect(findAtRuleContext(rule(css, 'a'))).toBeNull();
	expect(findAtRuleContext(rule(css, 'b'))).toHaveProperty('params', 'print');
	expect(findAtRuleContext(rule(css, 'c'))).toHaveProperty('params', '(min-width: 900px)');
});

function rule(css, selector) {
	const rules = [];

	postcss.parse(css).walkRules(selector, (r) => rules.push(r));

	return rules[0];
}
