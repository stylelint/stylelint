import { isFunction as isFn, isNumber, isString } from '../utils/validateTypes.mjs';

import {
	DEFAULT_SEVERITY,
	RULE_NAME_ALL,
	SEVERITY_ERROR,
	SEVERITY_WARNING,
} from '../constants.mjs';
import { isContainer } from './typeGuards.mjs';

/** @import { DisabledRangeObject, Problem, Range, RuleMessage, StylelintPostcssResult, Utils, WarningOptions } from 'stylelint' */
/** @import { Node as PostcssNode } from 'postcss' */

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
 * @returns {{range: Range, text: string, applied: false} | {applied: boolean}}
 */
function applyFix({ node, fix, line, result: { stylelint }, ruleName }) {
	const { disabledRanges, config = {}, fixersData, fixedNodes } = stylelint;

	if (!isFn(fix)) return { applied: false };

	const shouldFix = Boolean(config.fix || config.computeReplacementText);
	const shouldFixThisRule = Boolean(shouldFix && !config.rules?.[ruleName][1]?.disableFix);
	const mayFix =
		shouldFixThisRule && (config.ignoreDisables || !isDisabled(ruleName, line, disabledRanges));

	if (!mayFix) return { applied: false };

	const fixedNode = fix();

	if (!config.computeReplacementText) {
		addFixData({ fixersData, ruleName });

		return { applied: true };
	}

	if (!fixedNode?.source?.start || !fixedNode?.source?.end) {
		return { applied: false };
	}

	// When recording replacement text we want to ensure that there is no overlap with any other fix.
	// We only record the first fix for each node.
	if (fixedNodes.has(node)) return { applied: false };

	const fixedRange = reduceFixRange(fixedNode, {
		range: {
			start: fixedNode.source.start,
			end: fixedNode.source.end,
		},
		text: fixedNode.toString(),
	});

	addFixData({
		fixersData,
		ruleName,
	});

	addFixedNode(fixedNodes, fixedNode);

	return { ...fixedRange, applied: false };
}

/**
 * @param {object} o
 * @param {StylelintPostcssResult['fixersData']} o.fixersData
 * @param {string} o.ruleName
 * @param {Range} [o.range]
 * @param {string} [o.text]
 * @todo stylelint/stylelint#7192
 */
function addFixData({ fixersData, ruleName, range }) {
	const ruleFixers = (fixersData[ruleName] ??= []);

	ruleFixers.push({ range });
}

/**
 * @param {WeakSet<PostcssNode>} fixedNodes
 * @param {PostcssNode} node
 */
function addFixedNode(fixedNodes, node) {
	fixedNodes.add(node);

	if (isContainer(node)) {
		node.walk((childNode) => {
			fixedNodes.add(childNode);
		});
	}
}

/**
 * @param {PostcssNode} node
 * @param {{range: Range, text: string}} fixData
 * @returns {{range: Range, text: string}}
 */
function reduceFixRange(node, fixData) {
	if (!isNumber(node.source?.start?.offset) || !isNumber(node.source?.end?.offset)) {
		return fixData;
	}

	const stringRepresentation = node.source.input.css.slice(
		node.source?.start?.offset,
		node.source?.end?.offset,
	);

	let replacementStartOffset = 0;
	let startOffset = node.source?.start?.offset;

	for (let i = 0; i < stringRepresentation.length; i++) {
		const a = stringRepresentation[i];
		const b = fixData.text[i];

		if (a !== b) break;

		startOffset++;
		replacementStartOffset++;
	}

	const start = node.positionInside(startOffset);

	let replacementEndOffset = fixData.text.length;
	let endOffset = node.source?.end?.offset;

	for (let i = 0; i < stringRepresentation.length; i++) {
		const ia = stringRepresentation.length - 1 - i;
		const a = stringRepresentation[ia];

		const ib = fixData.text.length - 1 - i;
		const b = fixData.text[ib];

		if (a !== b) break;

		endOffset--;
		replacementEndOffset--;
	}

	const end = node.positionInside(endOffset);

	return {
		text: fixData.text.slice(replacementStartOffset, replacementEndOffset),
		range: {
			start,
			end,
		},
	};
}
