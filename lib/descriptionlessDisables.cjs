// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const constants = require('./constants.cjs');
const optionsMatches = require('./utils/optionsMatches.cjs');
const reportCommentProblem = require('./utils/reportCommentProblem.cjs');
const validateDisableSettings = require('./validateDisableSettings.cjs');

/**
 * @param {import('stylelint').PostcssResult} postcssResult
 * @returns {void}
 */
function descriptionlessDisables(postcssResult) {
	const [enabled, options] = validateDisableSettings(
		postcssResult,
		'reportDescriptionlessDisables',
	);

	if (!options) return;

	/** @type {Set<import('postcss').Comment>} */
	const alreadyReported = new Set();

	for (const [rule, ruleRanges] of Object.entries(postcssResult.stylelint.disabledRanges)) {
		for (const range of ruleRanges) {
			if (range.description) continue;

			const commentNode = range.comment;

			if (alreadyReported.has(commentNode)) continue;

			if (enabled === optionsMatches(options, 'except', rule)) {
				// An 'all' rule will get copied for each individual rule. If the
				// configuration is `[false, {except: ['specific-rule']}]`, we
				// don't want to report the copies that match except, so we record
				// the comment as already reported.
				if (!enabled && rule === constants.RULE_NAME_ALL) alreadyReported.add(commentNode);

				continue;
			}

			alreadyReported.add(commentNode);

			reportCommentProblem({
				rule: '--report-descriptionless-disables',
				message: `Disable for "${rule}" is missing a description`,
				severity: options.severity,
				commentNode,
				postcssResult,
			});
		}
	}
}

module.exports = descriptionlessDisables;
