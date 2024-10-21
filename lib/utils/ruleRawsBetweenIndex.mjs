/**
 * @param {import('postcss').Rule} rule
 * @returns {number}
 */
export default function ruleRawsBetweenIndex(rule) {
	return rule.selector.length;
}
