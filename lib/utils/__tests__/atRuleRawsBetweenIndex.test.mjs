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

	it('has a between value', () => {
		expect(atRule('@media screen\n{}').raws.between).toBe('\n');
		expect(atRuleRawsBetweenIndex(atRule('@media screen\n{}'))).toBe(13);
	});

	it('has no comments', () => {
		expect(atRuleRawsBetweenIndex(atRule('@media screen and (color) {}'))).toBe(25);
	});

	it('has a comment', () => {
		expect(atRuleRawsBetweenIndex(atRule('@media screen and /* a comment */ (color) {}'))).toBe(41);
	});
});

function atRule(css) {
	const list = [];

	postcss.parse(css).walkAtRules((rule) => list.push(rule));

	return list[0];
}
