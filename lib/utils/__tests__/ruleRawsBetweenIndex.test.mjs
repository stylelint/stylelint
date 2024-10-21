import postcss from 'postcss';
import ruleRawsBetweenIndex from '../ruleRawsBetweenIndex.mjs';

describe('ruleRawsBetweenIndex', () => {
	it('has a single space between the param and the rule', () => {
		expect(ruleRawsBetweenIndex(rule('a {}'))).toBe(1);
	});

	it('has multiple spaces between the param and the rule', () => {
		expect(ruleRawsBetweenIndex(rule('a  {}'))).toBe(1);
	});

	it('has a newline between the param and the rule', () => {
		expect(ruleRawsBetweenIndex(rule('a\n{}'))).toBe(1);
	});

	it('has complex selectors', () => {
		expect(ruleRawsBetweenIndex(rule('a > b,\nc:is(d) {}'))).toBe(14);
	});
});

function rule(css) {
	const list = [];

	postcss.parse(css).walkRules((node) => list.push(node));

	return list[0];
}
