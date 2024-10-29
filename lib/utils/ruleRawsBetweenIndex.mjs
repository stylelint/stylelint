import getRuleSelector from './getRuleSelector.mjs';

/**
 * @param {import('postcss').Rule} rule
 * @returns {number}
 */
export default function ruleRawsBetweenIndex(rule) {
	return getRuleSelector(rule).length;
}
