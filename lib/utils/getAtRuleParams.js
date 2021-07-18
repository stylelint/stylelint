'use strict';

/**
 * @param {import('postcss').AtRule} atRule
 * @returns {string}
 */
module.exports = function getAtRuleParams(atRule) {
	const raws = atRule.raws;

	return (raws.params && raws.params.raw) || atRule.params;
};
