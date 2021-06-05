'use strict';

const { isAtRule, isRule } = require('./typeGuards');

/**
 * Find the at-rule in which a rule is nested.
 *
 * Returns `null` if the rule is not nested within an at-rule.
 *
 * @param {import('postcss').Rule} rule
 * @returns {null | import('postcss').AtRule}
 */
module.exports = function findAtRuleContext(rule) {
	const parent = rule.parent;

	if (!parent) {
		return null;
	}

	if (isAtRule(parent)) {
		return parent;
	}

	if (isRule(parent)) {
		return findAtRuleContext(parent);
	}

	return null;
};
