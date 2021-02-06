'use strict';

/** @typedef {import('stylelint').RangeType} RangeType */

/**
 * @param {import('stylelint').StylelintResult[]} results
 */
module.exports = function (results) {
	results.forEach((result) => {
		// File with `CssSyntaxError` have not `_postcssResult`
		if (!result._postcssResult) {
			return;
		}

		const stylelintResult = result._postcssResult.stylelint;

		if (!stylelintResult.config) return; // Linting error

		if (!stylelintResult.config.reportInvalidScopeDisables) return;

		const configRules = stylelintResult.config.rules || {};

		const usedRules = new Set(Object.keys(configRules));

		usedRules.add('all');

		const rangeData = stylelintResult.disabledRanges;
		const disabledRules = Object.keys(rangeData);

		disabledRules.forEach((rule) => {
			if (usedRules.has(rule)) {
				return;
			}

			rangeData[rule].forEach((range) => {
				if (!range.strictStart && !range.strictEnd) {
					return;
				}

				// If the comment doesn't have a location, we can't report a useful error.
				// In practice we expect all comments to have locations, though.
				if (!range.comment.source || !range.comment.source.start) return;

				result.warnings.push({
					text: `Rule "${rule}" isn't enabled`,
					rule: '--report-invalid-scope-disables',
					line: range.comment.source.start.line,
					column: range.comment.source.start.column,
					severity: 'error',
				});
			});
		});
	});
};
