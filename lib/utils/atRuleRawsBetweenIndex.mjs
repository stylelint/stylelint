import atRuleParamIndex from './atRuleParamIndex.mjs';

/**
 * @param {import('postcss').AtRule} atRule
 * @returns {number}
 */
export default function atRuleRawsBetweenIndex(atRule) {
	return atRuleParamIndex(atRule) + atRule.params.length;
}
