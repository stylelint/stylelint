import {
	isFunction as isFn,
	isNumber,
	isPlainObject,
	isRange,
	isString,
} from '../utils/validateTypes.mjs';

import {
	DEFAULT_SEVERITY,
	RULE_NAME_ALL,
	SEVERITY_ERROR,
	SEVERITY_WARNING,
} from '../constants.mjs';
import emitDeprecationWarning from './emitDeprecationWarning.mjs';
import narrowFixRange from './narrowFixRange.mjs';

/** @import { DisabledRangeObject, Problem, FixObject, FixCallback, Range, RuleMessage, StylelintPostcssResult, Utils, WarningOptions } from 'stylelint' */
/** @import { Position as PostcssPosition, Node as PostcssNode } from 'postcss' */

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
	const { node, index, endIndex, line, start, end, result, ruleName, word, fix, ...rest } = problem;

	checkProblemRangeDeprecations(problem);

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

	// If a line is not passed, use the node.rangeBy method to get the
	// line number that the complaint pertains to
	const startLine = line ?? node?.rangeBy({ index, endIndex }).start.line;

	if (!startLine) {
		throw new Error(
			`The "${ruleName}" rule failed to pass either a node or a line number to the \`report()\` function.`,
		);
	}

	const fixData = applyFix({ ...problem, line: startLine });

	if (fixData.applied) return;

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

	if ('range' in fixData) {
		warningProperties.fix = {
			range: fixData.range,
			text: fixData.text,
		};
	}

	const warningMessage = buildWarningMessage(message, messageArgs);

	result.warn(warningMessage, warningProperties);
}

/**
 * @param {Problem} problem
 */
function checkProblemRangeDeprecations(problem) {
	if (problem.result.stylelint.quietDeprecationWarnings) return;

	if (!problem.node) {
		emitDeprecationWarning(
			`Omitting the \`node\` argument in the \`utils.report()\` function is deprecated ("${problem.ruleName}").`,
			'REPORT_AMBIGUOUS_POSITION',
			`Please pass a \`node\` argument in the \`utils.report()\` function of "${problem.ruleName}".`,
		);
	}

	if (!isRange(problem) && ('start' in problem || 'end' in problem)) {
		emitDeprecationWarning(
			`Partial position information in the \`utils.report()\` function is deprecated ("${problem.ruleName}").`,
			'REPORT_AMBIGUOUS_POSITION',
			`Please pass both a valid \`start\` and \`end\` argument in the \`utils.report()\` function of "${problem.ruleName}".`,
		);
	}

	if (!hasIndices(problem) && ('index' in problem || 'endIndex' in problem)) {
		emitDeprecationWarning(
			`Partial position information in the \`utils.report()\` function is deprecated ("${problem.ruleName}").`,
			'REPORT_AMBIGUOUS_POSITION',
			`Please pass both \`index\` and \`endIndex\` as arguments in the \`utils.report()\` function of "${problem.ruleName}".`,
		);
	}

	if ('line' in problem) {
		emitDeprecationWarning(
			`Providing the \`line\` argument in the \`utils.report()\` function is deprecated ("${problem.ruleName}").`,
			'REPORT_AMBIGUOUS_POSITION',
			`Please pass both \`index\` and \`endIndex\` as arguments in the \`utils.report()\` function of "${problem.ruleName}" instead.`,
		);
	}
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

/**
 * @param {Problem & { line: number }} problem
 * @returns {{range: [number, number], text: string, applied: false} | {applied: boolean}}
 */
function applyFix({ fix, line, result: { stylelint }, ruleName }) {
	if (!fix) return { applied: false };

	const { disabledRanges, config = {}, fixersData, fixedRanges } = stylelint;

	/** @type {FixCallback | undefined} */
	let apply;
	/** @type {PostcssNode | undefined} */
	let node;

	if (isFixObject(fix)) {
		apply = fix.apply;
		node = fix.node;
	} else if (isFn(fix)) {
		apply = fix;
	}

	if (!apply) return { applied: false };

	const shouldFix = Boolean(config.fix || (config.computeReplacementText && node));
	const shouldFixThisRule = Boolean(shouldFix && !config.rules?.[ruleName][1]?.disableFix);
	const mayFix =
		shouldFixThisRule && (config.ignoreDisables || !isDisabled(ruleName, line, disabledRanges));

	if (!mayFix) return { applied: false };

	if (!config.computeReplacementText) {
		apply();

		incrementFixCounter({ fixersData, ruleName });

		return { applied: true };
	}

	if (!node?.source || !isNumber(node.source.start?.offset) || !isNumber(node.source.end?.offset)) {
		return { applied: false };
	}

	/** @type [number, number] */
	const fixedNodeRange = [node.source.start.offset, node.source.end.offset];

	// When recording replacement text we want to ensure that there is no overlap with any other fix.
	// We only record the first fix for each node.
	if (fixedRanges.some((fixedRange) => rangesOverlap(fixedRange, fixedNodeRange))) {
		return { applied: false };
	}

	// Record the current state of the node that will be fixed
	const fixedNodeClone = node.clone();

	// Apply the fix
	apply();

	// Compute the smallest range and text of the fix
	const fixData = narrowFixRange(node, {
		range: fixedNodeRange,
		text: node.toString(),
	});

	// Restore the previous state of the fixed node
	node.replaceWith(fixedNodeClone);

	// Mark the fixed range as mutated
	fixedRanges.push(fixData.range);

	return { ...fixData, applied: false };
}

/**
 * @param {object} o
 * @param {StylelintPostcssResult['fixersData']} o.fixersData
 * @param {string} o.ruleName
 */
function incrementFixCounter({ fixersData, ruleName }) {
	fixersData[ruleName] ??= 0;
	fixersData[ruleName]++;
}

/**
 * @param {[number, number]} a
 * @param {[number, number]} b
 * @returns {boolean}
 */
function rangesOverlap(a, b) {
	// TODO: are these correct?
	// Shouldn't either of these be gte/lte instead of gt/lt?

	// a: ----
	// b:      ----
	if (a[1] < b[0]) return false;

	// a:      ----
	// b: ----
	if (a[0] > b[1]) return false;

	return true;
}

/**
 * @param {unknown} value
 * @returns {value is { index: number, endIndex: number }}
 */
function hasIndices(value) {
	if (!isPlainObject(value)) return false;

	if (!isNumber(value.index)) return false;

	if (!isNumber(value.endIndex)) return false;

	return true;
}

/**
 * @param {unknown} value
 * @returns {value is FixObject}
 */
function isFixObject(value) {
	if (!isPlainObject(value)) return false;

	if (!value.node) return false;

	if (!isFn(value.apply)) return false;

	return true;
}
