/**
 * @param {import('postcss').AtRule} atRule
 * @returns {number}
 */
export default function atRuleRawsAfterNameIndex(atRule) {
	// Initial 1 is for the `@`
	return 1 + atRule.name.length;
}
