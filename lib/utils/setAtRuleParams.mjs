/** @import { AtRule } from 'postcss' */

import cleanRaws from './cleanRaws.mjs';

/**
 * @param {AtRule} atRule
 * @param {string} params
 * @returns {AtRule} The atRulearation that was passed in.
 */
export default function setAtRuleParams(atRule, params) {
	const raws = atRule.raws;

	if (raws.params) {
		atRule.params = cleanRaws(params);
		raws.params.value = atRule.params;
		raws.params.raw = params;
	} else {
		atRule.params = params;
	}

	return atRule;
}
