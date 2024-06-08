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
	const { ruleName, result, message, messageArgs, line, node, index, endIndex, word, severity } =
		problem;

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

	const { customMessages, customUrls } = result.stylelint;

	if (customUrls?.[ruleName]) {
		warningProperties.url = customUrls[ruleName];
	}

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
