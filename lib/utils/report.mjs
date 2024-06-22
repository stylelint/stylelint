import { isFunction as isFn, isNumber, isString } from '../utils/validateTypes.mjs';
import { RULE_NAME_ALL } from '../constants.mjs';

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
	const { node, index, endIndex, line, start, end, result, ruleName, word, ...rest } = problem;
	const {
		disabledRanges,
		quiet,
		ruleSeverities,
		config: { defaultSeverity = 'error', ignoreDisables } = {},
		customMessages: { [ruleName]: message = rest.message } = {},
		customUrls: { [ruleName]: customUrl } = {},
	} = result.stylelint;
	const { messageArgs = [], severity = ruleSeverities[ruleName] } = rest;
	const ruleSeverity = isFn(severity) ? severity(...messageArgs) || defaultSeverity : severity;

	// In quiet mode, mere warnings are ignored
	if (quiet && ruleSeverity !== 'error') return;

	const range = node?.rangeBy({ index, endIndex }) ?? {};
	// If a line is not passed, use the node.rangeBy method to get the
	// line number that the complaint pertains to
	const startLine = line ?? range.start?.line;

	if (!startLine) {
		throw new Error(
			`The "${ruleName}" rule failed to pass either a node or a line number to the \`report()\` function.`,
		);
	}

	if (isFixApplied({ ...problem, line: startLine, range })) return;

	if (isDisabled(ruleName, startLine, disabledRanges)) {
		// Collect disabled warnings
		// Used to report `needlessDisables` in subsequent processing.
		const disabledWarnings = (result.stylelint.disabledWarnings ||= []);

		disabledWarnings.push({
			rule: ruleName,
			line: startLine,
		});

		if (!ignoreDisables) return;
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

	if (start) {
		warningProperties.start = start;
	} else if (isNumber(index)) {
		warningProperties.index = index;
	}

	if (end) {
		warningProperties.end = end;
	} else if (isNumber(endIndex)) {
		warningProperties.endIndex = endIndex;
	}

	if (word) {
		warningProperties.word = word;
	}

	if (customUrl) {
		warningProperties.url = customUrl;
	}

	const warningMessage = buildWarningMessage(message, messageArgs);

	result.warn(warningMessage, warningProperties);
}

/** @typedef {import('stylelint').Problem} Problem */
/** @typedef {import('stylelint').DisabledRangeObject} DisabledRangeObject */
/** @typedef {import('stylelint').StylelintPostcssResult} StylelintPostcssResult */
/** @typedef {import('stylelint').Range} Range */
/** @typedef {import('stylelint').FixerData} FixerData */

/**
 * @param {import('stylelint').RuleMessage} message
 * @param {NonNullable<Problem['messageArgs']>} messageArgs
 * @returns {string}
 */
function buildWarningMessage(message, messageArgs) {
	if (isString(message)) {
		return printfLike(message, ...messageArgs);
	}

	return message(...messageArgs);
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

/** @param {Problem & { line: number, range: Range }} problem */
function isFixApplied({ fix, line, start, end, range: warnRange, result, ruleName }) {
	const { disabledRanges, config = {}, fixersData } = result.stylelint;
	const range = start && isNumber(end?.column) ? { start, end } : warnRange;
	const editInfo = { range, ...fix?.editInfo };

	if (!isFn(fix)) {
		addFixData(fixersData, ruleName, { fixed: false, ...editInfo });

		return false;
	}

	const shouldFix = Boolean(config.fix && !config.rules?.[ruleName][1]?.disableFix);
	const mayFix =
		shouldFix && (config.ignoreDisables || !isDisabled(ruleName, line, disabledRanges));

	if (mayFix) {
		fix();
		addFixData(fixersData, ruleName, { fixed: true, ...editInfo });

		return true;
	}

	addFixData(fixersData, ruleName, { fixed: false, ...editInfo });

	return false;
}

/**
 * @param {StylelintPostcssResult['fixersData']} fixersData
 * @param {string} ruleName
 * @param {FixerData} data
 * @todo stylelint/stylelint#7192
 */
function addFixData(fixersData, ruleName, data) {
	const ruleFixers = (fixersData[ruleName] ??= []);

	ruleFixers.push(data);
}
