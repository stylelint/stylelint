/** @typedef {import('stylelint').DisabledRange} DisabledRange */
/** @typedef {import('stylelint').FixerData} FixerData */
/** @typedef {import('stylelint').Problem} Problem */

/**
 * even though stylelint-disable comments cannot be inserted inside a declaration or a selector list,
 * new lines cannot be disregarded because FixerData['range'] is exposed through StylelintPostcssResult['fixersData']
 * i.e. ranges must be accurate to be exploited
 * @see stylelint/stylelint#7192
 * @summary apply fix while taking into account the disabled ranges
 * @param {object} o
 * @param {NonNullable<Problem['fix']>} o.fix
 * @param {Problem['result']} o.result
 * @param {Problem['ruleName']} o.ruleName
 * @param {FixerData['range']} o.range
 */
export default function applyFix({ fix, result, ruleName, range }) {
	const {
		disabledRanges,
		disabledRanges: { all = [] },
		config,
		fixersData,
	} = result.stylelint;
	const isInRange = (/** @type {DisabledRange} */ { start, end }) =>
		range.start.line >= start && (!end || range.start.line <= end);
	const ranges = disabledRanges[ruleName] ?? all;
	const mayFix = config?.ignoreDisables || !ranges.length || !ranges.some(isInRange);
	const array = fixersData[ruleName] || (fixersData[ruleName] = []);

	array.push({ range, fixed: mayFix });

	if (mayFix) fix();
}
