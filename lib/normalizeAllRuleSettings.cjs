'use strict';

const getStylelintRule = require('./utils/getStylelintRule.cjs');
const normalizeRuleSettings = require('./normalizeRuleSettings.cjs');

/** @typedef {import('stylelint').Config} StylelintConfig */

/**
 * @param {StylelintConfig} config
 * @return {Promise<StylelintConfig>}
 */
async function normalizeAllRuleSettings(config) {
	if (!config.rules) return config;

	/** @type {StylelintConfig['rules']} */
	const normalizedRules = {};

	for (const [ruleName, rawRuleSettings] of Object.entries(config.rules)) {
		const rule = await getStylelintRule(ruleName, config);

		if (rule) {
			normalizedRules[ruleName] = normalizeRuleSettings(rawRuleSettings, rule);
		} else {
			normalizedRules[ruleName] = [];
		}
	}

	config.rules = normalizedRules;

	return config;
}

module.exports = normalizeAllRuleSettings;
