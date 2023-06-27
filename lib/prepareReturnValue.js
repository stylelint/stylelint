'use strict';

const descriptionlessDisables = require('./descriptionlessDisables');
const invalidScopeDisables = require('./invalidScopeDisables');
const needlessDisables = require('./needlessDisables');
const reportDisables = require('./reportDisables');

/** @typedef {import('stylelint').Formatter} Formatter */
/** @typedef {import('stylelint').LintResult} StylelintResult */
/** @typedef {import('stylelint').LinterOptions["maxWarnings"]} maxWarnings */
/** @typedef {import('stylelint').LinterResult} LinterResult */

/**
 * @param {StylelintResult[]} stylelintResults
 * @param {maxWarnings} maxWarnings
 * @param {Formatter} formatter
 * @param {string} cwd
 *
 * @returns {LinterResult}
 */
module.exports = function prepareReturnValue(stylelintResults, maxWarnings, formatter, cwd) {
	reportDisables(stylelintResults);
	needlessDisables(stylelintResults);
	invalidScopeDisables(stylelintResults);
	descriptionlessDisables(stylelintResults);

	let errored = false;

	for (const result of stylelintResults) {
		if (
			result.errored ||
			result.parseErrors.length > 0 ||
			result.warnings.some((warning) => warning.severity === 'error')
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
		output: '',
		reportedDisables: [],
		ruleMetadata: getRuleMetadata(stylelintResults),
	};

	if (maxWarnings !== undefined) {
		const foundWarnings = stylelintResults.reduce((count, file) => count + file.warnings.length, 0);

		if (foundWarnings > maxWarnings) {
			returnValue.maxWarningsExceeded = { maxWarnings, foundWarnings };
		}
	}

	returnValue.output = formatter(stylelintResults, returnValue);
	returnValue.results = stylelintResults;

	return returnValue;
};

/**
 * @param {StylelintResult[]} lintResults
 */
function getRuleMetadata(lintResults) {
	const [lintResult] = lintResults;

	if (lintResult === undefined) return {};

	if (lintResult._postcssResult === undefined) return {};

	return lintResult._postcssResult.stylelint.ruleMetadata;
}
