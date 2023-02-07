'use strict';

const normalizeRuleSettings = require('../normalizeRuleSettings');
const Result = require('postcss/lib/result');
const { isPlainObject } = require('./validateTypes');
const getStylelintRule = require('./getStylelintRule');

/**
 * @type {import('stylelint').Utils['checkAgainstRule']}
 */
function checkAgainstRule(options, callback) {
	if (!isPlainObject(options)) throw new Error('Expected an options object');

	if (!callback) throw new Error('Expected a callback function');

	const { ruleName, ruleSettings, root, result, context = {} } = options;

	if (!ruleName) throw new Error('Expected a "ruleName" option');

	const rule = getStylelintRule(ruleName, result && result.stylelint.config);

	if (!rule) throw new Error(`Rule "${ruleName}" does not exist`);

	if (!ruleSettings) throw new Error('Expected a "ruleSettings" option');

	if (!root) throw new Error('Expected a "root" option');

	const settings = normalizeRuleSettings(ruleSettings, rule);

	if (!settings) {
		return;
	}

	// @ts-expect-error - this error should not occur with PostCSS 8
	const tmpPostcssResult = new Result();

	rule(settings[0], /** @type {Object} */ (settings[1]), context)(root, tmpPostcssResult);

	for (const warning of tmpPostcssResult.warnings()) callback(warning);
}

module.exports = checkAgainstRule;
