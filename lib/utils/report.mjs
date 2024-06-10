import { RULE_NAME_ALL } from '../constants.mjs';
import { isNumber } from './validateTypes.mjs';

/**
 * Report a problem.
 *
 * This function accounts for `disabledRanges` attached to the result.
 * That is, if the reported problem is within a disabledRange,
 * it is ignored. Otherwise, it is attached to the result as a
 * postcss warning.
 *
 * It also accounts for the rule's severity.
 *
 * You *must* pass *either* a node or a line number.
 *
 * @type {import('stylelint').Utils['report']}
 */
export default function report(problem) {
	const { ruleName, result, message, messageArgs, line, node, index, endIndex, word, severity } =
		problem;

	if (isFixApplied(problem)) return;

	const ruleSeverityOption = severity || result.stylelint.ruleSeverities[ruleName];
	const defaultSeverity = result.stylelint.config?.defaultSeverity || 'error';
	const ruleSeverity =
		typeof ruleSeverityOption === 'function'
			? ruleSeverityOption(...(messageArgs || [])) || defaultSeverity
			: ruleSeverityOption;

	// In quiet mode, mere warnings are ignored
	if (result.stylelint.quiet && ruleSeverity !== 'error') {
		return;
	}

	// endIndex is optional
	const { start } = (node && node.rangeBy({ index, endIndex })) || {};

	// If a line is not passed, use the node.rangeBy method to get the
	// line number that the complaint pertains to
	const startLine = line || (start && start.line);

	if (!startLine) {
		throw new Error(
			`The "${ruleName}" rule failed to pass either a node or a line number to the \`report()\` function.`,
		);
	}

	const { disabledRanges } = result.stylelint;

	if (isDisabled(ruleName, startLine, disabledRanges)) {
		// Collect disabled warnings
		// Used to report `needlessDisables` in subsequent processing.
		const disabledWarnings =
			result.stylelint.disabledWarnings || (result.stylelint.disabledWarnings = []);

		disabledWarnings.push({
			rule: ruleName,
			line: startLine,
		});

		const { ignoreDisables } = result.stylelint.config || {};

		if (!ignoreDisables) {
			return;
		}
	}

	if (!result.stylelint.stylelintError && ruleSeverity === 'error') {
		result.stylelint.stylelintError = true;
	}

	if (!result.stylelint.stylelintWarning && ruleSeverity === 'warning') {
		result.stylelint.stylelintWarning = true;
	}

	/** @type {import('stylelint').WarningOptions} */
	const warningProperties = {
		severity: ruleSeverity,
		rule: ruleName,
	};

	if (node) {
		warningProperties.node = node;
	}

	if (problem.start) {
		warningProperties.start = problem.start;
	} else if (typeof index === 'number') {
		warningProperties.index = index;
	}

	if (problem.end) {
		warningProperties.end = problem.end;
	} else if (typeof endIndex === 'number') {
		warningProperties.endIndex = endIndex;
	}

	if (word) {
		warningProperties.word = word;
	}

	const { customMessages } = result.stylelint;
	const warningMessage = buildWarningMessage(
		(customMessages && customMessages[ruleName]) || message,
		messageArgs,
	);

	result.warn(warningMessage, warningProperties);
}

/**
 * @param {import('stylelint').RuleMessage} message
 * @param {import('stylelint').Problem['messageArgs']} messageArgs
 * @returns {string}
 */
function buildWarningMessage(message, messageArgs) {
	const args = messageArgs || [];

	if (typeof message === 'string') {
		return printfLike(message, ...args);
	}

	return message(...args);
}

/**
 * @param {string} format
 * @param {Array<unknown>} args
 * @returns {string}
 */
function printfLike(format, ...args) {
	return args.reduce((/** @type {string} */ result, arg) => {
		return result.replace(/%[ds]/, String(arg));
	}, format);
}

/** @typedef {import('stylelint').DisabledRangeObject} DisabledRangeObject */
/** @typedef {import('stylelint').StylelintPostcssResult} StylelintPostcssResult */
/** @typedef {import('stylelint').Range} Range */
/** @typedef {import('stylelint').Problem} Problem */

/**
 * @param {string} ruleName
 * @param {number} startLine
 * @param {DisabledRangeObject} disabledRanges
 */
function isDisabled(ruleName, startLine, disabledRanges) {
	if (!disabledRanges) return false;

	const ranges = disabledRanges[ruleName] ?? disabledRanges[RULE_NAME_ALL] ?? [];

	for (const range of ranges) {
		if (
			// If the problem is within a disabledRange,
			// and that disabledRange's rules include this one
			range.start <= startLine &&
			(range.end === undefined || range.end >= startLine) &&
			(!range.rules || range.rules.includes(ruleName))
		) {
			return true;
		}
	}

	return false;
}

/** @param {Problem} problem */
function isFixApplied(problem) {
	const { end, start, index, endIndex, fix, node, result, ruleName, word } = problem;
	const hasRange = start && isNumber(end?.column);
	const hasIndexes = isNumber(index) && isNumber(endIndex);
	const hasRangeData = hasRange || hasIndexes || word;
	const { disabledRanges, config = {}, fixersData } = result.stylelint;

	if (typeof fix !== 'function') {
		addFixData({ fixersData, ruleName, fixed: false });

		return false;
	}

	// even though stylelint-disable comments cannot be inserted inside a declaration or a selector list,
	// a complete range is requested as a prerequisite
	if (!hasRangeData) {
		throw new Error(
			`The fix callback for rule "${ruleName}" requires index/endIndex or start/end or word to be passed to the \`report()\` function.`,
		);
	}

	const range = hasRange ? { start, end } : node?.rangeBy({ index, endIndex, word });
	const hasFix = Boolean(config.fix && !config.rules?.[ruleName][1]?.disableFix);
	const fixed =
		hasFix && (config.ignoreDisables || !isDisabled(ruleName, range.start.line, disabledRanges));

	if (fixed) {
		addFixData({ fixersData, ruleName, fixed, range: fix() });

		return true;
	}

	addFixData({ fixersData, ruleName, fixed });

	return false;
}

/**
 * @param {object} o
 * @param {StylelintPostcssResult['fixersData']} o.fixersData
 * @param {string} o.ruleName
 * @param {Range | void} [o.range] new range
 * @param {boolean} o.fixed
 * @todo stylelint/stylelint#7192
 */
function addFixData({ fixersData, ruleName, range, fixed }) {
	const array = (fixersData[ruleName] ??= []);

	array.push({ range, fixed });
}
