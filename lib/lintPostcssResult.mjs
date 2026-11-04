import { EOL } from 'node:os';
import process from 'node:process';

import { DEFAULT_CONFIGURATION_COMMENT } from './utils/configurationComment.mjs';
import { DEFAULT_SEVERITY } from './constants.mjs';
import assignDisabledRanges from './assignDisabledRanges.mjs';
import { emitDeprecationWarning } from './utils/emitWarning.mjs';
import getStylelintRule from './utils/getStylelintRule.mjs';
import reportUnknownRuleNames from './reportUnknownRuleNames.mjs';
import rules from './rules/index.mjs';

/** @import {Config, LinterOptions, PostcssResult, StylelintPostcssResult} from 'stylelint' */

// Stops fixers that undo each other
const MAX_FIX_PASSES = 10;

/**
 * Reruns the rules until a pass fixes nothing, as a fix can introduce a problem
 * for a rule that already ran.
 *
 * @param {LinterOptions} stylelintOptions
 * @param {PostcssResult} postcssResult
 * @param {Config} config
 * @returns {Promise<void>}
 */
export default async function lintPostcssResult(stylelintOptions, postcssResult, config) {
	const { abortSignal } = stylelintOptions;

	postcssResult.stylelint.stylelintError = false;
	postcssResult.stylelint.stylelintWarning = false;
	postcssResult.stylelint.quiet = config.quiet;
	postcssResult.stylelint.quietDeprecationWarnings = stylelintOptions.quietDeprecationWarnings;
	postcssResult.stylelint.config = config;

	const postcssDoc = postcssResult.root;

	if (!('type' in postcssDoc)) {
		throw new Error('Unexpected Postcss root object!');
	}

	const newlineMatch = postcssDoc.source?.input.css.match(/\r?\n/);
	const newline = newlineMatch ? newlineMatch[0] : EOL;
	const configurationComment = config.configurationComment || DEFAULT_CONFIGURATION_COMMENT;
	const context = { configurationComment, newline };

	assignDisabledRanges(postcssDoc, postcssResult);

	const postcssRoots = /** @type {import('postcss').Root[]} */ (
		postcssDoc && postcssDoc.constructor.name === 'Document' ? postcssDoc.nodes : [postcssDoc]
	);

	/** @type {string[]} */
	let ruleNames;

	if (config.rules) {
		const rulesOrder = new Map(Object.keys(rules).map((ruleName, index) => [ruleName, index]));

		ruleNames = Object.keys(config.rules).sort(
			(a, b) => (rulesOrder.get(a) ?? -1) - (rulesOrder.get(b) ?? -1),
		);
	} else {
		ruleNames = [];
	}

	// Load all rules in parallel.
	/** @type {Array<[string, import('stylelint').Rule | undefined]>} */
	const ruleEntries = await Promise.all(
		ruleNames.map(async (ruleName) => {
			const ruleFunction = await getStylelintRule(ruleName, config);

			return [ruleName, ruleFunction];
		}),
	);

	const timing = process.env.TIMING ? (await import('./timing.mjs')).default : undefined;

	async function runRules() {
		// Promises for the rules. Although the rule code runs synchronously now,
		// the use of Promises makes it compatible with the possibility of async
		// rules down the line.
		/** @type {Array<Promise<unknown>>} */
		const performRules = [];

		for (const [ruleName, ruleFunction] of ruleEntries) {
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
			postcssResult.stylelint.customMessages[ruleName] =
				secondaryOptions && secondaryOptions.message;
			postcssResult.stylelint.customUrls[ruleName] = secondaryOptions && secondaryOptions.url;
			postcssResult.stylelint.ruleMetadata[ruleName] = ruleFunction.meta || {};

			const ruleFn = ruleFunction(primaryOption, secondaryOptions, context);

			/**
			 * @param {import('postcss').Root} postcssRoot
			 */
			async function runRule(postcssRoot) {
				if (timing?.enabled) {
					return timing.time(ruleName, () => ruleFn(postcssRoot, postcssResult))();
				}

				return ruleFn(postcssRoot, postcssResult);
			}

			performRules.push(
				Promise.all(postcssRoots.map(runRule)).then((result) => {
					if (abortSignal?.aborted) {
						throw abortSignal.reason;
					}

					return result;
				}),
			);
		}

		return Promise.all(performRules);
	}

	const messageCount = postcssResult.messages.length;

	for (let pass = 1; pass <= MAX_FIX_PASSES; pass++) {
		const fixCount = countFixes(postcssResult.stylelint.fixersData);

		await runRules();

		if (countFixes(postcssResult.stylelint.fixersData) === fixCount) return;

		discardPassResults(postcssResult, messageCount);
	}

	// The cap was hit, so report what remains
	postcssResult.stylelint.config = { ...config, fix: false, computeEditInfo: false };
	await runRules();
	postcssResult.stylelint.config = config;
}

/**
 * @param {StylelintPostcssResult['fixersData']} fixersData
 * @returns {number}
 */
function countFixes(fixersData) {
	return Object.values(fixersData).reduce((count, ruleFixCount) => count + ruleFixCount, 0);
}

/**
 * @param {PostcssResult} postcssResult
 * @param {number} messageCount messages that preceded the rules, such as parse errors
 * @returns {void}
 */
function discardPassResults(postcssResult, messageCount) {
	postcssResult.messages.length = messageCount;
	postcssResult.stylelint.stylelintError = false;
	postcssResult.stylelint.stylelintWarning = false;
	delete postcssResult.stylelint.disabledWarnings;
}

/**
 * @param {PostcssResult} result
 * @param {string} ruleName
 * @returns {void}
 */
function warnDeprecatedRule(result, ruleName) {
	const message = `The "${ruleName}" rule is deprecated.`;

	emitDeprecationWarning(
		message,
		'RULE',
		`Please be aware that the "${ruleName}" rule will soon be either removed or renamed.`,
	);

	result.warn(message, { stylelintType: 'deprecation' });
}
