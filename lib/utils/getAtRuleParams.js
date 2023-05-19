'use strict';

/**
 * @param {import('postcss').AtRule} atRule
 * @returns {string}
 */
module.exports = function getAtRuleParams(atRule) {
	return atRule.raws.params?.raw ?? atRule.params;
};
