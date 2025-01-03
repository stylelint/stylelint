// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const getStylelintRule = require('./utils/getStylelintRule.cjs');
const normalizeRuleSettings = require('./normalizeRuleSettings.cjs');

/** @import {Config as StylelintConfig} from 'stylelint' */

/**
 * @param {StylelintConfig} config
 * @returns {Promise<StylelintConfig>}
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
