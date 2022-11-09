'use strict';

const normalizeRuleSettings = require('../normalizeRuleSettings');
const Result = require('postcss/lib/result');
const { isPlainObject } = require('./validateTypes');
const getStylelintRule = require('./getStylelintRule');

/**
 * Useful for third-party code (e.g. plugins) to run a PostCSS Root
 * against a specific rule and do something with the warnings
 * @template T
 * @template {Object} O
 * @param {{
 *   ruleName: string,
 *   ruleSettings: import('stylelint').ConfigRuleSettings<T, O>,
 *   root: import('postcss').Root,
 *   result?: import('stylelint').PostcssResult,
 * }} options
 * @param {(warning: import('postcss').Warning) => void} callback
 * @returns {void}
 */
function checkAgainstRule(options, callback) {
	if (!isPlainObject(options)) throw new Error('checkAgainstRule requires an options object');

	if (!callback) throw new Error('checkAgainstRule requires a callback');

	const { ruleName, ruleSettings, root, result } = options;

	if (!ruleName) throw new Error("checkAgainstRule requires a 'ruleName' option");

	const rule = getStylelintRule(ruleName, result && result.stylelint.config);

	if (!rule) throw new Error(`Rule '${ruleName}' does not exist`);

	if (!ruleSettings) throw new Error("checkAgainstRule requires a 'ruleSettings' option");

	if (!root) throw new Error("checkAgainstRule requires a 'root' option");

	const settings = normalizeRuleSettings(ruleSettings, rule);

	if (!settings) {
		return;
	}

	// @ts-expect-error - this error should not occur with PostCSS 8
	const tmpPostcssResult = new Result();

	rule(settings[0], /** @type {O} */ (settings[1]), {})(root, tmpPostcssResult);

	for (const warning of tmpPostcssResult.warnings()) callback(warning);
}

module.exports = /** @type {typeof import('stylelint').utils.checkAgainstRule} */ (
	checkAgainstRule
);
