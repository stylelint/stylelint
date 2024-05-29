/** @typedef {import('stylelint').PostcssResult} PostcssResult */
/** @typedef {import('stylelint').DisabledRange} DisabledRange */
/** @typedef {import('stylelint').FixerData} FixerData */
/** @typedef {[number, number?]} Tuple */

/**
 * @param {DisabledRange} object
 * @returns {Tuple}
 */
const cb = ({ start, end }) => [start, end];

/**
 * even though stylelint-disable comments cannot be inserted inside a declaration or a selector list,
 * new lines cannot be disregarded because FixerData['range'] is exposed through StylelintPostcssResult['fixersData']
 * i.e. ranges must be accurate to be exploited
 * @see stylelint/stylelint#7192
 * @summary apply fix while taking into account the disabled ranges
 * @param {object} o
 * @param {import('stylelint').PostcssResult} o.result
 * @param {string} o.ruleName
 * @param {FixerData['range']} o.range
 * @param {FixerData['callback']} o.callback
 * @param {FixerData['unfixable']} [o.unfixable]
 */
const fix = ({ result, ruleName, range, callback, unfixable }) => {
	const {
		disabledRanges,
		disabledRanges: { all = [] },
		config,
	} = result.stylelint;
	const isInRange = (/** @type {Tuple} */ [start, end]) =>
		range.start.line >= start && (!end || range.start.line <= end);
	const ruleRanges = disabledRanges[ruleName]?.map(cb) || [];
	const ranges = all.map(cb).concat(ruleRanges);
	// the ranges were set before any fixer could be run
	// hence we can compare without having to worry about potential offsets
	const mayFix =
		!unfixable && (config?.ignoreDisables || !ranges.length || !ranges.some(isInRange));

	if (mayFix) callback();

	addFixerData(result, ruleName, { range, fixed: Boolean(mayFix) });
};

/**
 * @param {import('stylelint').PostcssResult} result
 * @param {string} name
 * @param {{ range: FixerData['range'], fixed: boolean }} data
 */
function addFixerData(result, name, data) {
	const list = result.stylelint.fixersData[name];

	if (!list) result.stylelint.fixersData[name] = [data];
	else list.push(data);
}

export default fix;
