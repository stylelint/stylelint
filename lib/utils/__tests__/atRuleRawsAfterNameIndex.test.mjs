import atRuleRawsAfterNameIndex from '../atRuleRawsAfterNameIndex.mjs';
import postcss from 'postcss';

describe('atRuleRawsAfterNameIndex', () => {
	it('had a "media" condition', () => {
		expect(atRuleRawsAfterNameIndex(atRule('@media (color) {}'))).toBe(6);
	});

	it('has a "supports" condition', () => {
		expect(atRuleRawsAfterNameIndex(atRule('@supports (color) {}'))).toBe(9);
	});

	it('has a space before the @', () => {
		expect(atRuleRawsAfterNameIndex(atRule(' @media (color) {}'))).toBe(6);
	});

	it('has a newline before the @', () => {
		expect(atRuleRawsAfterNameIndex(atRule('\n@media (color) {}'))).toBe(6);
	});

	it('has a comment after the name', () => {
		expect(atRuleRawsAfterNameIndex(atRule('@media /* a comment */ (color) {}'))).toBe(6);
	});
});

function atRule(css) {
	const list = [];

	postcss.parse(css).walkAtRules((rule) => list.push(rule));

	return list[0];
}
