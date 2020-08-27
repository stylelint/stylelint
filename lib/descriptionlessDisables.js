'use strict';

/** @typedef {import('stylelint').RangeType} RangeType */
/** @typedef {import('stylelint').DisableReportRange} DisableReportRange */
/** @typedef {import('stylelint').StylelintDisableOptionsReport} StylelintDisableOptionsReport */

/**
 * @param {import('stylelint').StylelintResult[]} results
 * @returns {StylelintDisableOptionsReport}
 */
module.exports = function (results) {
	/** @type {StylelintDisableOptionsReport} */
	const report = [];

	results.forEach((result) => {
		// File with `CssSyntaxError` have not `_postcssResult`
		if (!result._postcssResult) {
			return;
		}

		const rangeData = result._postcssResult.stylelint.disabledRanges;

		/** @type {import('stylelint').StylelintDisableReportEntry} */
		const entry = { source: result.source, ranges: [] };

		Object.keys(rangeData).forEach((rule) => {
			rangeData[rule].forEach((range) => {
				if (range.description) return;

				// Avoid duplicates from stylelint-disable comments with multiple rules.
				const alreadyReported = entry.ranges.find((existing) => {
					return existing.start === range.start && existing.end === range.end;
				});

				if (alreadyReported) return;

				entry.ranges.push({
					rule,
					start: range.start,
					end: range.end,
					unusedRule: rule,
				});
			});
		});

		if (entry.ranges.length > 0) {
			report.push(entry);
		}
	});

	return report;
};
