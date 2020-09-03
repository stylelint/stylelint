'use strict';

const atRuleParamIndex = require('../atRuleParamIndex');
const postcss = require('postcss');

describe('atRuleParamIndex', () => {
	it('has a single space before the param', () => {
		expect(atRuleParamIndex(atRule('@media (color) {}'))).toBe(7);
	});

	it('has multiple spaces before the param', () => {
		expect(atRuleParamIndex(atRule('@media  (color) {}'))).toBe(8);
	});

	it('has a newline before the param', () => {
		expect(atRuleParamIndex(atRule("@import\n'x.css');"))).toBe(8);
	});

	it('has a function param', () => {
		expect(atRuleParamIndex(atRule('@document url-prefix(http://www.w3.org/Style/)'))).toBe(10);
	});
});

function atRule(css) {
	const list = [];

	postcss.parse(css).walkAtRules((rule) => list.push(rule));

	return list[0];
}
