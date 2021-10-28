'use strict';

const optionsMatches = require('./utils/optionsMatches');
const putIfAbsent = require('./utils/putIfAbsent');
const validateDisableSettings = require('./validateDisableSettings');

/** @typedef {import('postcss').Comment} PostcssComment */
/** @typedef {import('stylelint').DisabledRange} DisabledRange */
/** @typedef {import('stylelint').RangeType} RangeType */
/** @typedef {import('stylelint').DisableReportRange} DisableReportRange */

/**
 * @param {import('stylelint').LintResult[]} results
 */
module.exports = function needlessDisables(results) {
	for (const result of results) {
		const settings = validateDisableSettings(result._postcssResult, 'reportNeedlessDisables');

		if (!settings) continue;

		const [enabled, options, stylelintResult] = settings;

		const rangeData = stylelintResult.disabledRanges;

		if (!rangeData) continue;

		const disabledWarnings = stylelintResult.disabledWarnings || [];

		// A map from `stylelint-disable` comments to the set of rules that
		// are usefully disabled by each comment. We track this
		// comment-by-comment rather than range-by-range because ranges that
		// disable *all* rules are duplicated for each rule they apply to in
		// practice.
		/** @type {Map<PostcssComment, Set<string>>}} */
		const usefulDisables = new Map();

		for (const warning of disabledWarnings) {
			const rule = warning.rule;
			const ruleRanges = rangeData[rule];

			if (ruleRanges) {
				for (const range of ruleRanges) {
					if (isWarningInRange(warning, range)) {
						putIfAbsent(usefulDisables, range.comment, () => new Set()).add(rule);
					}
				}
			}

			for (const range of rangeData.all) {
				if (isWarningInRange(warning, range)) {
					putIfAbsent(usefulDisables, range.comment, () => new Set()).add(rule);
				}
			}
		}

		const allRangeComments = new Set(rangeData.all.map((range) => range.comment));

		for (const [rule, ranges] of Object.entries(rangeData)) {
			for (const range of ranges) {
				if (rule !== 'all' && allRangeComments.has(range.comment)) continue;

				if (enabled === optionsMatches(options, 'except', rule)) continue;

				const useful = usefulDisables.get(range.comment) || new Set();

				// Only emit a warning if this range's comment isn't useful for this rule.
				// For the special rule "all", only emit a warning if it's not useful for
				// *any* rules, because it covers all of them.
				if (rule === 'all' ? useful.size !== 0 : useful.has(rule)) continue;

				// If the comment doesn't have a location, we can't report a useful error.
				// In practice we expect all comments to have locations, though.
				if (!range.comment.source || !range.comment.source.start) continue;

				result.warnings.push({
					text: `Needless disable for "${rule}"`,
					rule: '--report-needless-disables',
					line: range.comment.source.start.line,
					column: range.comment.source.start.column,
					severity: options.severity,
				});
			}
		}
	}
};

/**
 * @param {import('stylelint').DisabledWarning} warning
 * @param {RangeType} range
 * @return {boolean}
 */
function isWarningInRange(warning, range) {
	const line = warning.line;

	// Need to check if range.end exist, because line number type cannot be compared to undefined
	return (
		range.start <= line &&
		((range.end !== undefined && range.end >= line) || range.end === undefined)
	);
}
