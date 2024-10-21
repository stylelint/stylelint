import atRuleRawsAfterIndex from '../atRuleRawsAfterIndex.mjs';
import postcss from 'postcss';

describe('atRuleRawsAfterIndex', () => {
	it('has no spaces in the rule', () => {
		expect(atRuleRawsAfterIndex(atRule('@media screen {}'))).toBe(16);
	});

	it('has a constructed rule', () => {
		expect(
			atRuleRawsAfterIndex(new postcss.AtRule({ name: 'media', params: 'screen', nodes: [] })),
		).toBe(16);
	});

	it('has a statement', () => {
		expect(atRuleRawsAfterIndex(atRule('@import "foo.css"'))).toBe(17);
	});

	it('has a constructed statement', () => {
		expect(atRuleRawsAfterIndex(new postcss.AtRule({ name: 'import', params: '"foo.css"' }))).toBe(
			17,
		);
	});

	it('has a statement with a semi-colon', () => {
		expect(atRuleRawsAfterIndex(atRule('@import "foo.css";'))).toBe(18);
	});

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
