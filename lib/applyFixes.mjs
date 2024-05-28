/** @typedef {import('stylelint').PostcssResult} PostcssResult */
/** @typedef {import('stylelint').DisabledRange} DisabledRange */
/** @typedef {[number, number?]} Tuple */

/**
 * @param {DisabledRange} object
 * @returns {Tuple}
 */
const cb = ({ start, end }) => [start, end];

/**
 * even though stylelint-disable comments cannot be inserted inside a declaration or a selector list,
 * new lines cannot be disregarded because FixerData['source'] will eventually be exposed
 * i.e. source must be accurate to be exploited
 * @see stylelint/stylelint#7192
 * @summary apply fixes while taking into account the disabled ranges
 * @param {PostcssResult} result
 */
export default function applyFixes(result) {
	const {
		disabledRanges,
		disabledRanges: { all = [] },
		fixersData,
		config,
	} = result.stylelint;
	const rules = Object.entries(fixersData);

	rules.forEach(([ruleName, array]) => {
		const ruleRanges = disabledRanges[ruleName]?.map(cb) || [];
		const ranges = all.map(cb).concat(ruleRanges);

		array.forEach(({ source, callback, unfixable }) => {
			// the ranges were set before any fixer could be run
			// hence we can compare without having to worry about potential offsets
			const isInRange = (/** @type {Tuple} */ [start, end]) =>
				source.start.line >= start && (!end || source.start.line <= end);
			const mayFix =
				!unfixable && (config?.ignoreDisables || !ranges.length || !ranges.some(isInRange));

			if (mayFix) callback();
		});
	});
}
