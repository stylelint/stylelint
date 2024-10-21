import atRuleRawsAfterIndex from '../atRuleRawsAfterIndex.mjs';
import postcss from 'postcss';

describe('atRuleRawsAfterIndex', () => {
	it('has a single space in the rule', () => {
		expect(atRuleRawsAfterIndex(atRule('@media screen { }'))).toBe(17);
	});

	it('has multiple spaces in the rule', () => {
		expect(atRuleRawsAfterIndex(atRule('@media screen {  }'))).toBe(18);
	});

	it('has a newline in the rule', () => {
		expect(atRuleRawsAfterIndex(atRule('@media screen {\n}'))).toBe(17);
	});
});

function atRule(css) {
	const list = [];

	postcss.parse(css).walkAtRules((rule) => list.push(rule));

	return list[0];
}
