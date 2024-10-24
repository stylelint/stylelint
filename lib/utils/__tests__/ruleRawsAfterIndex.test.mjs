import postcss from 'postcss';
import ruleRawsAfterIndex from '../ruleRawsAfterIndex.mjs';

describe('ruleRawsAfterIndex', () => {
	it('has no spaces in the rule', () => {
		expect(ruleRawsAfterIndex(rule('a {}'))).toBe(3);
	});

	it('has a constructed rule', () => {
		expect(ruleRawsAfterIndex(new postcss.Rule({ selector: 'a' }))).toBe(3);
	});

	it('has multiple spaces in the rule', () => {
		expect(ruleRawsAfterIndex(rule('a {  }'))).toBe(3);
	});

	it('has a newline in the rule', () => {
		expect(ruleRawsAfterIndex(rule('a {\n}'))).toBe(3);
	});

	it('has an after value', () => {
		expect(rule('a { color: red;\n}').raws.after).toBe('\n');
		expect(ruleRawsAfterIndex(rule('a { color: red;\n}'))).toBe(15);
	});
});

function rule(css) {
	const list = [];

	postcss.parse(css).walkRules((node) => list.push(node));

	return list[0];
}
