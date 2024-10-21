import postcss from 'postcss';
import ruleRawsAfterIndex from '../ruleRawsAfterIndex.mjs';

describe('ruleRawsAfterIndex', () => {
	it('has no spaces in the rule', () => {
		expect(ruleRawsAfterIndex(rule('a {}'))).toBe(4);
	});

	it('has a constructed rule', () => {
		expect(ruleRawsAfterIndex(new postcss.Rule({ selector: 'a' }))).toBe(4);
	});

	it('has multiple spaces in the rule', () => {
		expect(ruleRawsAfterIndex(rule('a {  }'))).toBe(6);
	});

	it('has a newline in the rule', () => {
		expect(ruleRawsAfterIndex(rule('a {\n}'))).toBe(5);
	});
});

function rule(css) {
	const list = [];

	postcss.parse(css).walkRules((node) => list.push(node));

	return list[0];
}
