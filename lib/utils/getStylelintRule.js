const rules = require('../rules');

/**
 * @param {string} ruleName
 * @param {import('stylelint').Config | undefined} [config]
 * @returns {import('stylelint').Rule | undefined}
 */
module.exports = function getStylelintRule(ruleName, config) {
	return rules[ruleName] || (config && config.pluginFunctions && config.pluginFunctions[ruleName]);
};
