'use strict';

const isStandardSyntaxSelector = require('../utils/isStandardSyntaxSelector');

/**
 * Check whether a Node is a standard rule
 *
 * @param {import('postcss').Rule | import('postcss-less').Rule} rule
 * @returns {boolean}
 */
module.exports = function (rule) {
	if (rule.type !== 'rule') {
		return false;
	}

	const raws = rule.raws;

	// Get full selector
	const selector = (raws.selector && raws.selector.raw) || rule.selector;

	if (!isStandardSyntaxSelector(rule.selector)) {
		return false;
	}

	// Non-outputting Less mixin definition (e.g. .mixin() {})
	if (selector.endsWith(')') && !selector.includes(':')) {
		return false;
	}

	// Less Parametric mixins (e.g. .mixin(@variable: x) {})
	if (/\(@.*\)$/.test(selector)) {
		return false;
	}

	// Ignore Scss nested properties
	if (selector.endsWith(':')) {
		return false;
	}

	return true;
};
