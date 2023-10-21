'use strict';

const index = require('../rules/index.cjs');

/**
 * @param {string} ruleName
 * @param {import('stylelint').Config | undefined} [config]
 * @returns {Promise<import('stylelint').Rule | undefined>}
 */
function getStylelintRule(ruleName, config) {
	if (isBuiltInRule(ruleName)) {
		return index[ruleName];
	}

	return Promise.resolve(config?.pluginFunctions?.[ruleName]);
}

/**
 * @param {string} ruleName
 * @returns {ruleName is keyof rules}
 */
function isBuiltInRule(ruleName) {
	return ruleName in index;
}

module.exports = getStylelintRule;
