'use strict';

const assignDisabledRanges = require('./assignDisabledRanges');
const getOsEol = require('./utils/getOsEol');
const reportUnknownRuleNames = require('./reportUnknownRuleNames');
const rulesOrder = require('./rules');

/** @typedef {import('stylelint').LinterOptions} LinterOptions */
/** @typedef {import('stylelint').PostcssResult} PostcssResult */
/** @typedef {import('stylelint').Config} StylelintConfig */

/**
 * @param {LinterOptions} stylelintOptions
 * @param {PostcssResult} postcssResult
 * @param {StylelintConfig} config
 * @returns {Promise<any>}
 */
function lintPostcssResult(stylelintOptions, postcssResult, config) {
	postcssResult.stylelint.ruleSeverities = {};
	postcssResult.stylelint.customMessages = {};
	postcssResult.stylelint.stylelintError = false;
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

		newline = newlineMatch ? newlineMatch[0] : getOsEol();

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

	const rules = config.rules
		? Object.keys(config.rules).sort(
				(a, b) => Object.keys(rulesOrder).indexOf(a) - Object.keys(rulesOrder).indexOf(b),
		  )
		: [];

	rules.forEach((ruleName) => {
		const ruleFunction =
			rulesOrder[ruleName] || (config.pluginFunctions && config.pluginFunctions[ruleName]);

		if (ruleFunction === undefined) {
			performRules.push(
				Promise.all(
					postcssRoots.map((postcssRoot) =>
						reportUnknownRuleNames(ruleName, postcssRoot, postcssResult),
					),
				),
			);

			return;
		}

		const ruleSettings = config.rules && config.rules[ruleName];

		if (ruleSettings === null || ruleSettings[0] === null) {
			return;
		}

		const primaryOption = ruleSettings[0];
		const secondaryOptions = ruleSettings[1];

		// Log the rule's severity in the PostCSS result
		const defaultSeverity = config.defaultSeverity || 'error';
		// disableFix in secondary option
		const disableFix = (secondaryOptions && secondaryOptions.disableFix === true) || false;

		if (disableFix) {
			postcssResult.stylelint.ruleDisableFix = true;
		}

		postcssResult.stylelint.ruleSeverities[ruleName] =
			(secondaryOptions && secondaryOptions.severity) || defaultSeverity;
		postcssResult.stylelint.customMessages[ruleName] = secondaryOptions && secondaryOptions.message;

		performRules.push(
			Promise.all(
				postcssRoots.map((postcssRoot) =>
					ruleFunction(primaryOption, secondaryOptions, {
						fix:
							!disableFix &&
							stylelintOptions.fix &&
							// Next two conditionals are temporary measures until #2643 is resolved
							isFileFixCompatible &&
							!postcssResult.stylelint.disabledRanges[ruleName],
						newline,
					})(postcssRoot, postcssResult),
				),
			),
		);
	});

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
	// Check for issue #2643
	if (stylelint.disabledRanges.all.length) return false;

	return true;
}

module.exports = lintPostcssResult;
