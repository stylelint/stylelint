// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const Result = require('postcss/lib/result');
const cssTree = require('css-tree');
const getStylelintRule = require('./getStylelintRule.cjs');
const validateTypes = require('./validateTypes.cjs');
const normalizeRuleSettings = require('../normalizeRuleSettings.cjs');

/**
 * @type {import('stylelint').Utils['checkAgainstRule']}
 */
async function checkAgainstRule(options, callback) {
	if (!validateTypes.isPlainObject(options)) throw new Error('Expected an options object');

	if (!callback) throw new Error('Expected a callback function');

	const { ruleName, ruleSettings, root, result, context = {} } = options;

	if (!ruleName) throw new Error('Expected a "ruleName" option');

	const rule = await getStylelintRule(ruleName, result?.stylelint?.config);

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

	/** @type {import('stylelint').StylelintPostcssResult} */
	const stylelint = result?.stylelint ?? {
		ruleSeverities: {},
		customMessages: {},
		customUrls: {},
		ruleMetadata: {},
		fixersData: {},
		disabledRanges: {},
		lexer: cssTree.lexer,
	};

	// @ts-expect-error -- TS2339: Property 'stylelint' does not exist on type 'Result<undefined>'.
	tmpPostcssResult.stylelint = stylelint;

	const [primary, secondary] = settings;
	const ruleFunc = rule(primary, secondary || {}, context);

	await ruleFunc(
		root,

		// NOTE: This temporary PostCSS result doesn't have a property for Stylelint use.
		//       Problems may occur if some rules use the property.
		// @ts-expect-error -- TS2345: Argument of type 'Result' is not assignable to parameter of type 'PostcssResult'.
		tmpPostcssResult,
	);

	for (const warning of tmpPostcssResult.warnings()) callback(warning);
}

module.exports = checkAgainstRule;
