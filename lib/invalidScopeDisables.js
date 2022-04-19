'use strict';

const optionsMatches = require('./utils/optionsMatches');
const validateDisableSettings = require('./validateDisableSettings');

/** @typedef {import('stylelint').RangeType} RangeType */

/**
 * @param {import('stylelint').LintResult[]} results
 */
module.exports = function invalidScopeDisables(results) {
	for (const result of results) {
		const settings = validateDisableSettings(result._postcssResult, 'reportInvalidScopeDisables');

		if (!settings) continue;

		const [enabled, options, stylelintResult] = settings;

		const configRules = (stylelintResult.config || {}).rules || {};

		const usedRules = new Set(Object.keys(configRules));

		usedRules.add('all');

		for (const [rule, ruleRanges] of Object.entries(stylelintResult.disabledRanges)) {
			if (usedRules.has(rule)) continue;

			if (enabled === optionsMatches(options, 'except', rule)) continue;

			for (const range of ruleRanges) {
				if (!range.strictStart && !range.strictEnd) continue;

				// If the comment doesn't have a location, we can't report a useful error.
				// In practice we expect all comments to have locations, though.
				if (!range.comment.source || !range.comment.source.start) continue;

				result.warnings.push({
					text: `Rule "${rule}" isn't enabled`,
					rule: '--report-invalid-scope-disables',
					line: range.comment.source.start.line,
					column: range.comment.source.start.column,
					endLine: range.comment.source.end && range.comment.source.end.line,
					endColumn: range.comment.source.end && range.comment.source.end.column,
					severity: options.severity,
				});
			}
		}
	}
};
