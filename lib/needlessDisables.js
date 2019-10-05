'use strict';

const _ = require('lodash');

/** @typedef {{ [k: string]: Array<Object> }} RangeDataType */
/** @typedef {{ unusedRule: string, end?: number, start: number, used?: boolean }} RangeType */
/** @typedef {{ unusedRule: string, start: number, end?: number }} UnusedRange */
/** @typedef {import('stylelint').StylelintDisableOptionsReport} StylelintDisableOptionsReport */
/** @typedef {{[k: string]: Array<import('stylelint').DisabledRange & {used?: boolean}>}} NeedlessDisablesDisabledRangeObject */

/**
 * @param {import('stylelint').StylelintResult[]} results
 * @returns {StylelintDisableOptionsReport}
 */
module.exports = function(results) {
	/** @type {StylelintDisableOptionsReport} */
	const report = [];

	results.forEach((result) => {
		// File with `CssSyntaxError` have not `_postcssResult`
		if (!result._postcssResult) {
			return;
		}

		/** @type {{ranges: UnusedRange[], source?: string}} */
		const unused = { source: result.source, ranges: [] };
		/** @type {NeedlessDisablesDisabledRangeObject} */
		const rangeData = _.cloneDeep(result._postcssResult.stylelint.disabledRanges);

		if (!rangeData) {
			return;
		}

		result.warnings.forEach((warning) => {
			const rule = warning.rule;

			const ruleRanges = rangeData[rule];

			if (ruleRanges) {
				// Back to front so we get the *last* range that applies to the warning
				for (const range of ruleRanges.reverse()) {
					if (isWarningInRange(warning, range)) {
						range.used = true;

						return;
					}
				}
			}

			for (const range of rangeData.all.reverse()) {
				if (isWarningInRange(warning, range)) {
					range.used = true;

					return;
				}
			}
		});

		Object.keys(rangeData).forEach((rule) => {
			rangeData[rule].forEach((range) => {
				/**
				 * Is an equivalent range already marked as unused?
				 * @type {UnusedRange | undefined}
				 */
				const alreadyMarkedUnused = unused.ranges.find((unusedRange) => {
					return unusedRange.start === range.start && unusedRange.end === range.end;
				});

				// If this range is unused and no equivalent is marked,
				// mark this range as unused
				if (!range.used && !alreadyMarkedUnused) {
					const unusedRange = Object.assign(
						/** @type {UnusedRange} */ (_.omit(range, 'strictStart', 'strictEnd')),
						{ unusedRule: rule },
					);

					unused.ranges.push(unusedRange);
				}

				// If this range is used but an equivalent has been marked as unused,
				// remove that equivalent. This can happen because of the duplication
				// of ranges in rule-specific range sets and the "all" range set
				if (range.used && alreadyMarkedUnused) {
					_.remove(unused.ranges, alreadyMarkedUnused);
				}
			});
		});

		unused.ranges = _.sortBy(unused.ranges, ['start', 'end']);

		report.push(unused);
	});

	return report;
};

/**
 * @param {{ column: number, rule: string, line: number, severity: string, text: string, }} warning
 * @param {{ rules?: string[], start: number, end?: number, used?: boolean }} range
 * @returns {boolean}
 */
function isWarningInRange(warning, range) {
	const rule = warning.rule;
	const line = warning.line;

	// Need to check if range.end exist, because line number type cannot be compared to undefined
	return (
		range.start <= line &&
		((range.end !== undefined && range.end >= line) || range.end === undefined) &&
		(!range.rules || range.rules.indexOf(rule) !== -1)
	);
}
