import atRuleRawsBetweenIndex from '../atRuleRawsBetweenIndex.mjs';
import postcss from 'postcss';

describe('atRuleRawsBetweenIndex', () => {
	it('has a single space between the param and the rule', () => {
		expect(atRuleRawsBetweenIndex(atRule('@media screen {}'))).toBe(13);
	});

	it('has multiple spaces between the param and the rule', () => {
		expect(atRuleRawsBetweenIndex(atRule('@media screen  {}'))).toBe(13);
	});

	it('has a newline between the param and the rule', () => {
		expect(atRuleRawsBetweenIndex(atRule('@media screen\n{}'))).toBe(13);
	});

	it('has complex params', () => {
		expect(atRuleRawsBetweenIndex(atRule('@media screen and (color),\nprint {}'))).toBe(32);
	});
});

function atRule(css) {
	const list = [];

	postcss.parse(css).walkAtRules((rule) => list.push(rule));

	return list[0];
}
