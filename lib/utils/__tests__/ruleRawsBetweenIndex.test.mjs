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

	it('has a between value', () => {
		expect(rule('a\n{}').raws.between).toBe('\n');
		expect(ruleRawsBetweenIndex(rule('a\n{}'))).toBe(1);
	});

	it('has no comments', () => {
		expect(ruleRawsBetweenIndex(rule('a b {}'))).toBe(3);
	});

	it('has a comment', () => {
		expect(ruleRawsBetweenIndex(rule('a /* a comment */ b {}'))).toBe(19);
	});
});

function rule(css) {
	const list = [];

	postcss.parse(css).walkRules((node) => list.push(node));

	return list[0];
}
