import { SEVERITY_ERROR } from './constants.mjs';

/** @import { Formatter, LinterOptions, LinterResult, LintResult } from 'stylelint' */

/**
 * @param {object} args
 * @param {LintResult[]} args.results
 * @param {LinterOptions['maxWarnings']} args.maxWarnings
 * @param {LinterOptions['quietDeprecationWarnings']} args.quietDeprecationWarnings
 * @param {Formatter} args.formatter
 * @param {string} args.cwd
 * @returns {LinterResult}
 */
export default function prepareReturnValue({ results, maxWarnings, formatter, cwd }) {
	let errored = false;

	for (const result of results) {
		if (
			result.errored ||
			result.parseErrors.length > 0 ||
			result.warnings.some((warning) => warning.severity === SEVERITY_ERROR)
		) {
			errored = true;
			result.errored = true;
		}
	}

	/** @type {LinterResult} */
	const returnValue = {
		cwd,
		errored,
		results: [],
		report: '',
		reportedDisables: [],
		ruleMetadata: getRuleMetadata(results),
	};

	if (maxWarnings !== undefined) {
		const foundWarnings = results.reduce((count, file) => count + file.warnings.length, 0);

		if (foundWarnings > maxWarnings) {
			returnValue.maxWarningsExceeded = { maxWarnings, foundWarnings };
		}
	}

	returnValue.report = formatter(results, returnValue);
	returnValue.results = results;

	return returnValue;
}

/**
 * @param {LintResult[]} lintResults
 */
function getRuleMetadata(lintResults) {
	const [lintResult] = lintResults;

	if (lintResult === undefined) return {};

	if (lintResult._postcssResult === undefined) return {};

	return lintResult._postcssResult.stylelint.ruleMetadata;
}
