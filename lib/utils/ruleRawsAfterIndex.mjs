/**
 * @param {import('postcss').Rule} rule
 * @returns {number}
 */
export default function ruleRawsAfterIndex(rule) {
	return rule.source?.end?.offset ?? rule.toString().length;
}
