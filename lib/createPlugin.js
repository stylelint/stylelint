'use strict';

/** @typedef {import('stylelint').Rule} StylelintRule */

/**
 * @param {string} ruleName
 * @param {StylelintRule} rule
 * @returns {{ruleName: string, rule: StylelintRule}}
 */
function createPlugin(ruleName, rule) {
	return {
		ruleName,
		rule,
	};
}

module.exports = /** @type {typeof import('stylelint').createPlugin} */ (createPlugin);
