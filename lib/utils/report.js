'use strict';

/** @typedef {import('stylelint').Problem} Problem */

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
 * @param {Problem} problem
 * @returns {void}
 */
function report(problem) {
	const ruleName = problem.ruleName;
	const result = problem.result;
	const message = problem.message;
	const line = problem.line;
	const node = problem.node;
	const index = problem.index;
	const word = problem.word;

	result.stylelint = result.stylelint || {
		ruleSeverities: {},
		customMessages: {},
		ruleMetadata: {},
	};

	// In quiet mode, mere warnings are ignored
	if (result.stylelint.quiet && result.stylelint.ruleSeverities[ruleName] !== 'error') {
		return;
	}

	// If a line is not passed, use the node.positionBy method to get the
	// line number that the complaint pertains to
	const startLine = line || node.positionBy({ index }).line;

	const { ignoreDisables } = result.stylelint.config || {};

	if (result.stylelint.disabledRanges) {
		const ranges = result.stylelint.disabledRanges[ruleName] || result.stylelint.disabledRanges.all;

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

	if (index) {
		warningProperties.index = index;
	}

	if (word) {
		warningProperties.word = word;
	}

	const warningMessage =
		(result.stylelint.customMessages && result.stylelint.customMessages[ruleName]) || message;

	result.warn(warningMessage, warningProperties);
}

module.exports = /** @type {typeof import('stylelint').utils.report} */ (report);
