'use strict';

const Result = require('postcss/lib/result').default;

const normalizeRuleSettings = require('../normalizeRuleSettings');
const { isPlainObject } = require('./validateTypes');
const getStylelintRule = require('./getStylelintRule');

/**
 * @type {import('stylelint').Utils['checkAgainstRule']}
 */
module.exports = function checkAgainstRule(options, callback) {
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

	const tmpPostcssResult = new Result(
		// NOTE: The first argument is unused, so passing `undefined` raises no problems.
		//       But this PostCSS's behavior may change in the future.
		// @ts-expect-error -- TS2345: Argument of type 'undefined' is not assignable to parameter of type 'Processor'.
		undefined,
		undefined,
		undefined,
	);

	const [primary, secondary] = settings;
	const ruleFunc = rule(primary, secondary || {}, context);

	ruleFunc(
		root,

		// NOTE: This temporary PostCSS result doesn't have a property for Stylelint use.
		//       Problems may occur if some rules use the property.
		// @ts-expect-error -- TS2345: Argument of type 'Result' is not assignable to parameter of type 'PostcssResult'.
		tmpPostcssResult,
	);

	for (const warning of tmpPostcssResult.warnings()) callback(warning);
};
