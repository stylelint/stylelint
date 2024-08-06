import { EOL } from 'node:os';

import { DEFAULT_SEVERITY, RULE_NAME_ALL } from './constants.mjs';
import { DEFAULT_CONFIGURATION_COMMENT } from './utils/configurationComment.mjs';
import assignDisabledRanges from './assignDisabledRanges.mjs';
import emitDeprecationWarning from './utils/emitDeprecationWarning.mjs';
import getStylelintRule from './utils/getStylelintRule.mjs';
import reportUnknownRuleNames from './reportUnknownRuleNames.mjs';
import rules from './rules/index.mjs';

/** @import {Config, LinterOptions, PostcssResult} from 'stylelint' */

/**
 * @param {LinterOptions} stylelintOptions
 * @param {PostcssResult} postcssResult
 * @param {Config} config
 * @returns {Promise<any>}
 */
export default async function lintPostcssResult(stylelintOptions, postcssResult, config) {
	postcssResult.stylelint.stylelintError = false;
	postcssResult.stylelint.stylelintWarning = false;
	postcssResult.stylelint.quiet = config.quiet;
	postcssResult.stylelint.config = config;

	const postcssDoc = postcssResult.root;

	if (!('type' in postcssDoc)) {
		throw new Error('Unexpected Postcss root object!');
	}

	const newlineMatch = postcssDoc.source?.input.css.match(/\r?\n/);
	const newline = newlineMatch ? newlineMatch[0] : EOL;
	const configurationComment = config.configurationComment || DEFAULT_CONFIGURATION_COMMENT;
	const ctx = { configurationComment, newline };

	assignDisabledRanges(postcssDoc, postcssResult);

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

		const ruleSettings = config.rules?.[ruleName];

		if (ruleSettings === null || ruleSettings[0] === null) continue;

		if (ruleFunction.meta?.deprecated && !stylelintOptions.quietDeprecationWarnings) {
			warnDeprecatedRule(postcssResult, ruleName);
		}

		const primaryOption = ruleSettings[0];
		const secondaryOptions = ruleSettings[1];

		// Log the rule's severity in the PostCSS result
		const defaultSeverity = config.defaultSeverity || DEFAULT_SEVERITY;

		postcssResult.stylelint.ruleSeverities[ruleName] =
			(secondaryOptions && secondaryOptions.severity) || defaultSeverity;
		postcssResult.stylelint.customMessages[ruleName] = secondaryOptions && secondaryOptions.message;
		postcssResult.stylelint.customUrls[ruleName] = secondaryOptions && secondaryOptions.url;
		postcssResult.stylelint.ruleMetadata[ruleName] = ruleFunction.meta || {};

		const shouldWarn = ruleFunction.meta?.fixable && !stylelintOptions.quietDeprecationWarnings;
		const disableFix = secondaryOptions?.disableFix === true;
		const fix = !disableFix && config.fix && isFixCompatible(postcssResult, ruleName);
		let warningFlag = false;
		const context = {
			...ctx,
			// context.fix is unlikely to be removed in the foreseeable future
			// due to the sheer number of rules in the wild that rely on it
			get fix() {
				if (shouldWarn && !warningFlag) {
					emitDeprecationWarning(
						'`context.fix` is being deprecated.',
						'CONTEXT_FIX',
						`Please pass a \`fix\` callback to the \`report\` utility of "${ruleName}" instead.`,
					);
					warningFlag = true;
				}

				return fix;
			},
		};

		performRules.push(
			Promise.all(
				postcssRoots.map((postcssRoot) =>
					ruleFunction(primaryOption, secondaryOptions, context)(postcssRoot, postcssResult),
				),
			),
		);
	}

	return Promise.all(performRules);
}

/**
 * using context.fix instead of the fix callback has the drawback
 * of not honouring the configuration comments in subtle ways
 * @see file://./../docs/user-guide/options.md#fix for details
 * @param {PostcssResult} postcssResult
 * @param {string} name
 * @returns {boolean}
 */
function isFixCompatible({ stylelint: { disabledRanges } }, name) {
	return !disabledRanges[RULE_NAME_ALL]?.length && !disabledRanges[name];
}

/**
 * @param {PostcssResult} result
 * @param {string} ruleName
 * @returns {void}
 */
function warnDeprecatedRule(result, ruleName) {
	result.warn(`The "${ruleName}" rule is deprecated.`, { stylelintType: 'deprecation' });
}
