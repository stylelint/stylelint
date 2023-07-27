'use strict';

const isStandardSyntaxSelector = require('./isStandardSyntaxSelector.cjs');

/**
 * Check whether a Node is a standard rule
 *
 * @param {import('postcss').Rule | import('postcss-less').Rule} rule
 * @returns {boolean}
 */
function isStandardSyntaxRule(rule) {
	if (rule.type !== 'rule') {
		return false;
	}

	// Ignore Less &:extend rule
	if ('extend' in rule && rule.extend) {
		return false;
	}

	if (!isStandardSyntaxSelector(rule.selector)) {
		return false;
	}

	return true;
}

module.exports = isStandardSyntaxRule;
