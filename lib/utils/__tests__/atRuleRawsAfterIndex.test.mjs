import atRuleRawsAfterIndex from '../atRuleRawsAfterIndex.mjs';
import postcss from 'postcss';

describe('atRuleRawsAfterIndex', () => {
	it('has no spaces in the rule', () => {
		expect(atRuleRawsAfterIndex(atRule('@media screen {}'))).toBe(15);
	});

	it('has a constructed rule', () => {
		expect(
			atRuleRawsAfterIndex(new postcss.AtRule({ name: 'media', params: 'screen', nodes: [] })),
		).toBe(15);
	});

	it('has a statement', () => {
		expect(atRuleRawsAfterIndex(atRule('@import "foo.css"'))).toBe(16);
	});

	it('has a constructed statement', () => {
		expect(atRuleRawsAfterIndex(new postcss.AtRule({ name: 'import', params: '"foo.css"' }))).toBe(
			16,
		);
	});

	it('has a statement with a semi-colon', () => {
		expect(atRuleRawsAfterIndex(atRule('@import "foo.css";'))).toBe(17);
	});

	it('has a single space in the rule', () => {
		expect(atRuleRawsAfterIndex(atRule('@media screen { color: red; }'))).toBe(27);
	});

	it('has multiple spaces in the rule', () => {
		expect(atRuleRawsAfterIndex(atRule('@media screen { color: red;  }'))).toBe(27);
	});

	it('has a newline in the rule', () => {
		expect(atRuleRawsAfterIndex(atRule('@media screen { color: red;\n}'))).toBe(27);
	});

	it('has an after value', () => {
		expect(atRule('@media screen { color: red;\n}').raws.after).toBe('\n');
		expect(atRuleRawsAfterIndex(atRule('@media screen { color: red;\n}'))).toBe(27);
	});
});

function atRule(css) {
	const list = [];

	postcss.parse(css).walkAtRules((rule) => list.push(rule));

	return list[0];
}
