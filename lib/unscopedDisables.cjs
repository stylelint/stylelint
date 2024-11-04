// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const constants = require('./constants.cjs');
const optionsMatches = require('./utils/optionsMatches.cjs');
const reportCommentProblem = require('./utils/reportCommentProblem.cjs');
const validateDisableSettings = require('./validateDisableSettings.cjs');

/** @typedef {import('postcss').Node} Node */

/** @param {import('stylelint').PostcssResult} postcssResult */
function reportUnscopedDisables(postcssResult) {
	const [enabled, options] = validateDisableSettings(postcssResult, 'reportUnscopedDisables');

	if (!options) return;

	const isDisabled = !enabled && !options.except.length;

	if (isDisabled) return;

	const stylelint = postcssResult.stylelint;
	const unscopedComments = stylelint.disabledRanges[constants.RULE_NAME_ALL];

	if (!unscopedComments) return;

	/** @param {Node} node */
	const report = (node) => {
		reportCommentProblem({
			rule: '--report-unscoped-disables',
			message: `Configuration comment must be scoped`,
			severity: options.severity,
			node,
			postcssResult,
		});
	};

	const hasExceptions = options.except.length;

	if (hasExceptions && !enabled) {
		const configRules = stylelint.config?.rules;

		if (!configRules) return;

		const warnings = stylelint.disabledWarnings;

		if (!warnings) return;

		/** @type {Set<Node>} */
		const alreadyReported = new Set();

		for (const { line, rule } of warnings) {
			const isException = optionsMatches(options, 'except', rule);

			if (!isException) continue;

			for (const { start, end, node } of unscopedComments) {
				if (alreadyReported.has(node)) continue;

				if (start <= line && (end === undefined || end >= line)) {
					report(node);
					alreadyReported.add(node);
				}
			}
		}
	} else if (enabled) {
		for (const { node } of unscopedComments) report(node);
	}
}

module.exports = reportUnscopedDisables;
