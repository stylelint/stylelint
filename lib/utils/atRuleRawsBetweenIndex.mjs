import atRuleParamIndex from './atRuleParamIndex.mjs';
import getAtRuleParams from './getAtRuleParams.mjs';

/**
 * @param {import('postcss').AtRule} atRule
 * @returns {number}
 */
export default function atRuleRawsBetweenIndex(atRule) {
	return atRuleParamIndex(atRule) + getAtRuleParams(atRule).length;
}
