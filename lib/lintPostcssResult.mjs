import { EOL } from 'node:os';

import { DEFAULT_CONFIGURATION_COMMENT } from './utils/configurationComment.mjs';
import { RULE_NAME_ALL } from './constants.mjs';
import assignDisabledRanges from './assignDisabledRanges.mjs';
import getStylelintRule from './utils/getStylelintRule.mjs';
import reportUnknownRuleNames from './reportUnknownRuleNames.mjs';
import rules from './rules/index.mjs';

/** @typedef {import('stylelint').LinterOptions} LinterOptions */
/** @typedef {import('stylelint').PostcssResult} PostcssResult */
/** @typedef {import('stylelint').Config} StylelintConfig */

/**
 * @param {LinterOptions} stylelintOptions
 * @param {PostcssResult} postcssResult
 * @param {StylelintConfig} config
 * @returns {Promise<any>}
 */
export default async function lintPostcssResult(stylelintOptions, postcssResult, config) {
	postcssResult.stylelint.ruleSeverities = {};
	postcssResult.stylelint.customMessages = {};
	postcssResult.stylelint.ruleMetadata = {};
	postcssResult.stylelint.stylelintError = false;
	postcssResult.stylelint.stylelintWarning = false;
	postcssResult.stylelint.quiet = config.quiet;
	postcssResult.stylelint.config = config;

	/** @type {string | undefined} */
	let newline;
	const postcssDoc = postcssResult.root;

	if (postcssDoc) {
		if (!('type' in postcssDoc)) {
			throw new Error('Unexpected Postcss root object!');
		}

		const newlineMatch = postcssDoc.source && postcssDoc.source.input.css.match(/\r?\n/);

		newline = newlineMatch ? newlineMatch[0] : EOL;

		assignDisabledRanges(postcssDoc, postcssResult);
	}

	const isFileFixCompatible = isFixCompatible(postcssResult);

	if (!isFileFixCompatible) {
		postcssResult.stylelint.disableWritingFix = true;
	}

	const postcssRoots = /** @type {import('postcss').Root[]} */ (
		postcssDoc && postcssDoc.constructor.name === 'Document' ? postcssDoc.nodes : [postcssDoc]
	);

	// Promises for the rules. Although the rule code runs synchronously now,
	// the use of Promises makes it compatible with the possibility of async
	// rules down the line.
	/** @type {Array<Promise<any>>} */
	const performRules = [];

	const rulesOrder = Object.keys(rules);
	const ruleNames = config.rules
		? Object.keys(config.rules).sort((a, b) => rulesOrder.indexOf(a) - rulesOrder.indexOf(b))
		: [];

	for (const ruleName of ruleNames) {
		const ruleFunction = await getStylelintRule(ruleName, config);

		if (ruleFunction === undefined) {
			performRules.push(
				Promise.all(
					postcssRoots.map((postcssRoot) =>
						reportUnknownRuleNames(ruleName, postcssRoot, postcssResult),
					),
				),
			);

			continue;
		}

		const ruleSettings = config.rules && config.rules[ruleName];

		if (ruleSettings === null || ruleSettings[0] === null) {
			continue;
		}

		if (
			ruleFunction.meta &&
			ruleFunction.meta.deprecated &&
			!stylelintOptions.quietDeprecationWarnings
		) {
			warnDeprecatedRule(postcssResult, ruleName);
		}

		const primaryOption = ruleSettings[0];
		const secondaryOptions = ruleSettings[1];

		// Log the rule's severity in the PostCSS result
		const defaultSeverity = config.defaultSeverity || 'error';
		// disableFix in secondary option
		const disableFix = (secondaryOptions && secondaryOptions.disableFix === true) || false;

		postcssResult.stylelint.ruleSeverities[ruleName] =
			(secondaryOptions && secondaryOptions.severity) || defaultSeverity;
		postcssResult.stylelint.customMessages[ruleName] = secondaryOptions && secondaryOptions.message;
		postcssResult.stylelint.ruleMetadata[ruleName] = ruleFunction.meta || {};

		performRules.push(
			Promise.all(
				postcssRoots.map((postcssRoot) =>
					ruleFunction(primaryOption, secondaryOptions, {
						configurationComment: config.configurationComment || DEFAULT_CONFIGURATION_COMMENT,
						fix:
							!disableFix &&
							config.fix &&
							// Next two conditionals are temporary measures until #2643 is resolved
							isFileFixCompatible &&
							!postcssResult.stylelint.disabledRanges[ruleName],
						newline,
					})(postcssRoot, postcssResult),
				),
			),
		);
	}

	return Promise.all(performRules);
}

/**
 * There are currently some bugs in the autofixer of Stylelint.
 * The autofixer does not yet adhere to stylelint-disable comments, so if there are disabled
 * ranges we can not autofix this document. More info in issue #2643.
 *
 * @param {PostcssResult} postcssResult
 * @returns {boolean}
 */
function isFixCompatible({ stylelint }) {
	return !stylelint.disabledRanges[RULE_NAME_ALL]?.length;
}

/**
 * @param {PostcssResult} result
 * @param {string} ruleName
 * @returns {void}
 */
function warnDeprecatedRule(result, ruleName) {
	result.warn(`The "${ruleName}" rule is deprecated.`, { stylelintType: 'deprecation' });
}
