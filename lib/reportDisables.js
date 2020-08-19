'use strict';

const _ = require('lodash');

/** @typedef {import('stylelint').RangeType} RangeType */
/** @typedef {import('stylelint').DisableReportRange} DisabledRange */
/** @typedef {import('stylelint').StylelintDisableOptionsReport} StylelintDisableOptionsReport */

/**
 * Returns a report describing which `results` (if any) contain disabled ranges
 * for rules that disallow disables via `reportDisables: true`.
 *
 * @param {import('stylelint').StylelintResult[]} results
 * @returns {StylelintDisableOptionsReport}
 */
module.exports = function (results) {
	/** @type {StylelintDisableOptionsReport} */
	const report = [];

	results.forEach((result) => {
		// File with `CssSyntaxError` don't have `_postcssResult`s.
		if (!result._postcssResult) {
			return;
		}

		/** @type {{ranges: DisabledRange[], source: string}} */
		const reported = { source: result.source || '', ranges: [] };

		/** @type {{[ruleName: string]: Array<RangeType>}} */
		const rangeData = result._postcssResult.stylelint.disabledRanges;

		if (!rangeData) return;

		const config = result._postcssResult.stylelint.config;

		// If no rules actually disallow disables, don't bother looking for ranges
		// that correspond to disabled rules.
		if (!Object.values(_.get(config, 'rules', {})).some(reportDisablesForRule)) {
			return [];
		}

		Object.keys(rangeData).forEach((rule) => {
			rangeData[rule].forEach((range) => {
				if (!reportDisablesForRule(_.get(config, ['rules', rule], []))) return;

				reported.ranges.push({
					rule,
					start: range.start,
					end: range.end,
					unusedRule: rule,
				});
			});
		});

		reported.ranges = _.sortBy(reported.ranges, ['start', 'end']);

		report.push(reported);
	});

	return report;
};

/**
 * @param {[any, object]|null} options
 * @return {boolean}
 */
function reportDisablesForRule(options) {
	if (!options) return false;

	return _.get(options[1], 'reportDisables', false);
}
