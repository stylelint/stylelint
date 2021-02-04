'use strict';

/** @typedef {import('postcss/lib/comment')} PostcssComment */
/** @typedef {import('stylelint').RangeType} RangeType */
/** @typedef {import('stylelint').DisableReportRange} DisableReportRange */
/** @typedef {import('stylelint').StylelintDisableOptionsReport} StylelintDisableOptionsReport */

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

		if (!stylelintResult.config.reportDescriptionlessDisables) return;

		const rangeData = stylelintResult.disabledRanges;

		/** @type {Set<PostcssComment>} */
		const alreadyReported = new Set();

		Object.keys(rangeData).forEach((rule) => {
			rangeData[rule].forEach((range) => {
				if (range.description) return;

				if (alreadyReported.has(range.comment)) return;

				alreadyReported.add(range.comment);

				// If the comment doesn't have a location, we can't report a useful error.
				// In practice we expect all comments to have locations, though.
				if (!range.comment.source || !range.comment.source.start) return;

				result.warnings.push({
					text: `Disable for "${rule}" is missing a description`,
					rule: '--report-descriptionless-disables',
					line: range.comment.source.start.line,
					column: range.comment.source.start.column,
					severity: 'error',
				});
			});
		});
	});
};
