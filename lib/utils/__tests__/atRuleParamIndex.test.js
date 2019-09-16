'use strict';

const atRuleParamIndex = require('../atRuleParamIndex');
const postcss = require('postcss');

describe('atRuleParamIndex', () => {
	it('has a single space before the param', () => {
		atRules('@media (color) {}', (atRule) => {
			expect(atRuleParamIndex(atRule)).toBe(7);
		});
	});

	it('has multiple spaces before the param', () => {
		atRules('@media  (color) {}', (atRule) => {
			expect(atRuleParamIndex(atRule)).toBe(8);
		});
	});

	it('has a newline before the param', () => {
		atRules("@import\n'x.css');", (atRule) => {
			expect(atRuleParamIndex(atRule)).toBe(8);
		});
	});

	it('has a function param', () => {
		atRules('@document url-prefix(http://www.w3.org/Style/)', (atRule) => {
			expect(atRuleParamIndex(atRule)).toBe(10);
		});
	});
});

function atRules(css, cb) {
	postcss.parse(css).walkAtRules(cb);
}
