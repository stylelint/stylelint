/* @flow */
'use strict';

/*:: type rangeDataType = {
  all: Array<Object>,
}
*/

/*:: type rangeType = {
  unusedRule: string,
  end?: number,
  start: number,
  used?: boolean,
}*/

/*:: type unusedRangeT = {
  start: number,
  end?: number,
  strictStart: boolean,
  strictEnd?: boolean
}*/

module.exports = function(
	results /*: Array<stylelint$result>*/,
	config /*: stylelint$config*/,
) /*: stylelint$disableOptionsReport*/ {
	const report = [];
	const usedRules = new Set(Object.keys(config.rules || {}));

	usedRules.add('all');

	results.forEach((result) => {
		// File with `CssSyntaxError` have not `_postcssResult`
		if (!result._postcssResult) {
			return;
		}

		const sourceReport = { source: result.source, ranges: [] };
		const rangeData /*: rangeDataType*/ = result._postcssResult.stylelint.disabledRanges;
		const disabledRules = Object.keys(rangeData);

		disabledRules.forEach((rule) => {
			if (usedRules.has(rule)) {
				return;
			}

			rangeData[rule].forEach((range /*: unusedRangeT */) => {
				if (!range.strictStart && !range.strictEnd) {
					return;
				}

				sourceReport.ranges.push({
					unusedRule: rule,
					start: range.start,
					end: range.end,
				});
			});
		});

		if (sourceReport.ranges.length > 0) {
			report.push(sourceReport);
		}
	});

	return report;
};
