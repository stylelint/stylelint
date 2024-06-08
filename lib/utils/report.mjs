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

	const { ignoreDisables } = result.stylelint.config || {};
	const { disabledRanges } = result.stylelint;

	if (disabledRanges) {
		const ranges = disabledRanges[ruleName] ?? disabledRanges[RULE_NAME_ALL] ?? [];

		for (const range of ranges) {
			if (
				// If the problem is within a disabledRange,
				// and that disabledRange's rules include this one,
				// do not register a warning
				isDisabled(ruleName, startLine, range)
			) {
				// Collect disabled warnings
				// Used to report `needlessDisables` in subsequent processing.
				const disabledWarnings =
					result.stylelint.disabledWarnings || (result.stylelint.disabledWarnings = []);

				disabledWarnings.push({
					rule: ruleName,
					line: startLine,
				});

				if (!ignoreDisables) {
					return;
				}

				break;
			}
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

/** @typedef {import('stylelint').DisabledRange} DisabledRange */
/** @typedef {import('stylelint').Range} Range */
/** @typedef {import('stylelint').Problem} Problem */

/**
 * @param {string} ruleName
 * @param {number} startLine
 * @param {DisabledRange} range
 */
function isDisabled(ruleName, startLine, { start, end, rules }) {
	return (
		start <= startLine &&
		(end === undefined || end >= startLine) &&
		(!rules || rules.includes(ruleName))
	);
}

/** @param {Problem} problem */
function isFixApplied(problem) {
	const { end, start, index, endIndex, fix, node, result, ruleName } = problem;
	const hasRange = end?.column && start;
	const hasIndexes = isNumber(index) && isNumber(endIndex);
	const hasRangeData = hasRange || hasIndexes;
	const hasFixCallback = typeof fix === 'function';

	if (hasFixCallback) {
		if (!hasRangeData) {
			throw new Error(
				`The fix callback for rule "${ruleName}" requires either index/endIndex or start/end to be passed to the \`report()\` function.`,
			);
		}

		const config = result.stylelint.config || {};
		const hasFix = config.fix && !config.rules?.[ruleName][1]?.disableFix;

		if (hasFix) {
			const range = hasRange ? { start, end } : node.rangeBy({ index, endIndex });

			applyFix({ fix, result, ruleName, range });

			return true;
		}
	}

	return false;
}

/**
 * even though stylelint-disable comments cannot be inserted inside a declaration or a selector list,
 * new lines cannot be disregarded because Range is exposed through StylelintPostcssResult['fixersData']
 * i.e. ranges must be accurate to be exploited
 * @see stylelint/stylelint#7192
 * @summary apply fix while taking into account the disabled ranges
 * @param {object} o
 * @param {NonNullable<Problem['fix']>} o.fix
 * @param {Problem['result']} o.result
 * @param {Problem['ruleName']} o.ruleName
 * @param {Range} o.range
 */
function applyFix({ fix, result, ruleName, range }) {
	const {
		disabledRanges,
		disabledRanges: { all = [] },
		config,
		fixersData,
	} = result.stylelint;
	const fn = isDisabled.bind(null, ruleName, range.start.line);
	const ranges = disabledRanges[ruleName] ?? all;
	const mayFix = config?.ignoreDisables || !ranges.length || !ranges.some(fn);
	const array = fixersData[ruleName] || (fixersData[ruleName] = []);

	array.push({ range, fixed: mayFix });

	if (mayFix) fix();
}
