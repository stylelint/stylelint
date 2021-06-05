'use strict';

/**
 * @param {import('postcss').AtRule} atRule
 * @returns {string}
 */
module.exports = function getAtRuleParams(atRule) {
	// Casting this to any because 'params' does not exist on type 'NodeRaws'
	/** @type {any} */
	const raws = atRule.raws;

	return (raws.params && raws.params.raw) || atRule.params;
};
