'use strict';

const typeGuards = require('./typeGuards.cjs');

/**
 * Find the at-rule in which a rule is nested.
 *
 * Returns `null` if the rule is not nested within an at-rule.
 *
 * @param {import('postcss').Rule} rule
 * @returns {null | import('postcss').AtRule}
 */
function findAtRuleContext(rule) {
	const parent = rule.parent;

	if (!parent) {
		return null;
	}

	if (typeGuards.isAtRule(parent)) {
		return parent;
	}

	if (typeGuards.isRule(parent)) {
		return findAtRuleContext(parent);
	}

	return null;
}

module.exports = findAtRuleContext;
