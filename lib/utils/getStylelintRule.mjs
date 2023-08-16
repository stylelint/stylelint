import rules from '../rules/index.mjs';

/**
 * @param {string} ruleName
 * @param {import('stylelint').Config | undefined} [config]
 * @returns {import('stylelint').Rule | undefined}
 */
export default function getStylelintRule(ruleName, config) {
	return rules[ruleName] || (config && config.pluginFunctions && config.pluginFunctions[ruleName]);
}
