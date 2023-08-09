import stripAnsi from 'strip-ansi';

const symbolConversions = new Map();

symbolConversions.set('ℹ', 'i');
symbolConversions.set('✔', '√');
symbolConversions.set('⚠', '‼');
symbolConversions.set('✖', '×');

/**
 * @param {string} output
 * @returns {string}
 */
export default function getCleanOutput(output) {
	let cleanOutput = stripAnsi(output).trim();

	for (const [nix, win] of symbolConversions.entries()) {
		cleanOutput = cleanOutput.replace(new RegExp(nix, 'g'), win);
	}

	return cleanOutput;
}

/**
 * @param {import('stylelint').LintResult[]} results
 * @param {import('stylelint').Formatter} formatter
 * @param {Pick<import('stylelint').LinterResult, 'ruleMetadata'>} [returnValue]
 * @returns {string}
 */
export function getCleanFormatterOutput(results, formatter, returnValue = { ruleMetadata: {} }) {
	// @ts-expect-error -- This error is acceptable because of the test use only.
	return getCleanOutput(formatter(results, returnValue));
}
