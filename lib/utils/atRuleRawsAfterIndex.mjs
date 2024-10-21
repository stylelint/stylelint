/**
 * @param {import('postcss').AtRule} atRule
 * @returns {number}
 */
export default function atRuleRawsAfterIndex(atRule) {
	return atRule.source?.end?.offset ?? atRule.toString().length;
}
