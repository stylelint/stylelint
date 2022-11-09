'use strict';

const normalizeRuleSettings = require('./normalizeRuleSettings');
const getStylelintRule = require('./utils/getStylelintRule');

/** @typedef {import('stylelint').ConfigRules} StylelintConfigRules */
/** @typedef {import('stylelint').Config} StylelintConfig */

/**
 * @param {StylelintConfig} config
 * @return {StylelintConfig}
 */
function normalizeAllRuleSettings(config) {
	if (!config.rules) return config;

	/** @type {StylelintConfigRules} */
	const normalizedRules = {};

	for (const [ruleName, rawRuleSettings] of Object.entries(config.rules)) {
		const rule = getStylelintRule(ruleName, config);

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
