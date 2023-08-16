'use strict';

const index = require('../rules/index.cjs');

/**
 * @param {string} ruleName
 * @param {import('stylelint').Config | undefined} [config]
 * @returns {import('stylelint').Rule | undefined}
 */
function getStylelintRule(ruleName, config) {
	return index[ruleName] || (config && config.pluginFunctions && config.pluginFunctions[ruleName]);
}

module.exports = getStylelintRule;
