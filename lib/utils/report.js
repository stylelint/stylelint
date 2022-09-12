'use strict';

const util = require('util');

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
 * @type {typeof import('stylelint').utils.report}
 */
module.exports = function report(problem) {
	const { ruleName, result, message, messageArgs, line, node, index, endIndex, word } = problem;

	result.stylelint = result.stylelint || {
		ruleSeverities: {},
		customMessages: {},
		ruleMetadata: {},
	};

	// In quiet mode, mere warnings are ignored
	if (result.stylelint.quiet && result.stylelint.ruleSeverities[ruleName] !== 'error') {
		return;
	}

	const { start } = (node && node.rangeBy({ index, endIndex })) || {};

	// If a line is not passed, use the node.rangeBy method to get the
	// line number that the complaint pertains to
	const startLine = line || (start && start.line);

	if (!startLine) {
		throw new Error('You must pass either a node or a line number');
	}

	const { ignoreDisables } = result.stylelint.config || {};

	if (result.stylelint.disabledRanges) {
		const ranges =
			result.stylelint.disabledRanges[ruleName] || result.stylelint.disabledRanges.all || [];

		for (const range of ranges) {
			if (
				// If the problem is within a disabledRange,
				// and that disabledRange's rules include this one,
				// do not register a warning
				range.start <= startLine &&
				(range.end === undefined || range.end >= startLine) &&
				(!range.rules || range.rules.includes(ruleName))
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

	const severity = result.stylelint.ruleSeverities && result.stylelint.ruleSeverities[ruleName];

	if (!result.stylelint.stylelintError && severity === 'error') {
		result.stylelint.stylelintError = true;
	}

	/** @type {import('stylelint').WarningOptions} */
	const warningProperties = {
		severity,
		rule: ruleName,
	};

	if (node) {
		warningProperties.node = node;
	}

	if (problem.start) {
		warningProperties.start = problem.start;
	} else if (index) {
		warningProperties.index = index;
	}

	if (problem.end) {
		warningProperties.end = problem.end;
	} else if (endIndex) {
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
};

/**
 * @param {import('stylelint').RuleMessage} message
 * @param {import('stylelint').Problem['messageArgs']} messageArgs
 * @returns {string}
 */
function buildWarningMessage(message, messageArgs) {
	const args = messageArgs || [];

	if (typeof message === 'string') {
		return util.format(message, ...args);
	}

	return message(...args);
}
