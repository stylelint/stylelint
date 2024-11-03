import { isFunction as isFn, isString } from '../utils/validateTypes.mjs';

import {
	DEFAULT_SEVERITY,
	RULE_NAME_ALL,
	SEVERITY_ERROR,
	SEVERITY_WARNING,
} from '../constants.mjs';

import nodeRangeBy from './nodeRangeBy.mjs';

/** @import { DisabledRangeObject, Problem, ProblemWithNormalizedPositions, Range, RuleMessage, StylelintPostcssResult, Utils, WarningOptions } from 'stylelint' */

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
 * @type {Utils['report']}
 */
export default function report(problem) {
	const { node, result, ruleName, word, fix, ...rest } = problem;
	const {
		disabledRanges,
		quiet,
		ruleSeverities,
		config: { defaultSeverity, ignoreDisables } = {},
		customMessages: { [ruleName]: message = rest.message },
		customUrls: { [ruleName]: customUrl },
		ruleMetadata: { [ruleName]: metadata },
	} = result.stylelint;
	const { messageArgs = [], severity = ruleSeverities[ruleName] } = rest;
	const ruleSeverity =
		(isFn(severity) ? severity(...messageArgs) : severity) ?? defaultSeverity ?? DEFAULT_SEVERITY;

	// In quiet mode, mere warnings are ignored
	if (quiet && ruleSeverity === SEVERITY_WARNING) return;

	if (isFn(fix) && metadata && !metadata.fixable) {
		throw new Error(
			`The "${ruleName}" rule requires "meta.fixable" to be truthy if the "fix" callback is being passed`,
		);
	}

	normalizeProblemSourceLocation(problem);

	if (!isProblemWithNormalizedPositions(problem)) {
		throw new Error(
			`The "${ruleName}" rule failed to pass either a node or a line number to the \`report()\` function.`,
		);
	}

	const { start, end, line } = problem;

	if (isFixApplied({ ...problem, line })) return;

	if (isDisabled(ruleName, line, disabledRanges)) {
		// Collect disabled warnings
		// Used to report `needlessDisables` in subsequent processing.
		const disabledWarnings = (result.stylelint.disabledWarnings ||= []);

		disabledWarnings.push({
			rule: ruleName,
			line,
		});

		if (!ignoreDisables) return;
	}

	if (!result.stylelint.stylelintError && ruleSeverity === SEVERITY_ERROR) {
		result.stylelint.stylelintError = true;
	}

	if (!result.stylelint.stylelintWarning && ruleSeverity === SEVERITY_WARNING) {
		result.stylelint.stylelintWarning = true;
	}

	/** @type {WarningOptions} */
	const warningProperties = {
		severity: ruleSeverity,
		rule: ruleName,
	};

	if (node) {
		warningProperties.node = node;
	}

	if (start) {
		warningProperties.start = start;
	}

	if (end) {
		warningProperties.end = end;
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

/**
 * @param {Problem} problem
 * @return {void}
 */
function normalizeProblemSourceLocation(problem) {
	// Use the given node to calculate the start and end positions.
	if (problem.node && (!problem.start || !problem.end)) {
		const range = nodeRangeBy(problem.node, { index: problem.index, endIndex: problem.endIndex });

		if (range) {
			problem.start ??= range.start;
			problem.end ??= range.end;
		}
	}

	if (!problem.line && problem.start?.line) {
		// Fallback the line to the line of the start position
		problem.line = problem.start.line;
	} else if (!problem.start && problem.line) {
		// Fallback the start position to the line
		problem.start = {
			line: problem.line,
			column: 1,
		};
	}

	// `index` and `endIndex` must not be used directly
	delete problem.index;
	delete problem.endIndex;
}

/**
 * @param {Problem} problem
 * @return {problem is ProblemWithNormalizedPositions}
 */
function isProblemWithNormalizedPositions(problem) {
	return Boolean(
		problem.start?.line &&
			problem.line &&
			typeof problem.index === 'undefined' &&
			typeof problem.endIndex === 'undefined',
	);
}

/**
 * @param {RuleMessage} message
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
 * Check whether a rule is disabled for a given line
 * @param {string} ruleName
 * @param {number} startLine
 * @param {DisabledRangeObject} disabledRanges
 */
function isDisabled(ruleName, startLine, disabledRanges) {
	const ranges = disabledRanges[ruleName] ?? disabledRanges[RULE_NAME_ALL] ?? [];

	for (const range of ranges) {
		if (
			// If the problem is within a disabledRange,
			// and that disabledRange's rules include this one
			range.start <= startLine &&
			(range.end === undefined || range.end >= startLine) &&
			/** @todo populate rules in assignDisabledRanges util */
			(!range.rules || range.rules.includes(ruleName))
		) {
			return true;
		}
	}

	return false;
}

/** @param {ProblemWithNormalizedPositions} problem */
function isFixApplied({ fix, line, result: { stylelint }, ruleName }) {
	const { disabledRanges, config = {}, fixersData } = stylelint;

	if (!isFn(fix)) {
		addFixData({ fixersData, ruleName, fixed: false });

		return false;
	}

	const shouldFix = Boolean(config.fix && !config.rules?.[ruleName][1]?.disableFix);
	const mayFix =
		shouldFix && (config.ignoreDisables || !isDisabled(ruleName, line, disabledRanges));

	addFixData({ fixersData, ruleName, fixed: mayFix });

	if (!mayFix) return false;

	fix();

	return true;
}

/**
 * @param {object} o
 * @param {StylelintPostcssResult['fixersData']} o.fixersData
 * @param {string} o.ruleName
 * @param {Range} [o.range]
 * @param {boolean} o.fixed
 * @todo stylelint/stylelint#7192
 */
function addFixData({ fixersData, ruleName, range, fixed }) {
	const ruleFixers = (fixersData[ruleName] ??= []);

	ruleFixers.push({ range, fixed });
}
