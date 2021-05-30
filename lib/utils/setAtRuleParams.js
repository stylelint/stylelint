'use strict';

/** @typedef {import('postcss').AtRule} AtRule */

/**
 * @param {AtRule} atRule
 * @param {string} params
 * @returns {AtRule} The atRulearation that was passed in.
 */
module.exports = function setAtRuleParams(atRule, params) {
	// Casting this to any because 'params' does not exist on type 'NodeRaws'
	/** @type {any} */
	const raws = atRule.raws;

	if (raws.params) {
		raws.params.raw = params;
	} else {
		atRule.params = params;
	}

	return atRule;
};
