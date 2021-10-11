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
 *
 * @returns {LinterResult}
 */
function prepareReturnValue(stylelintResults, maxWarnings, formatter) {
	reportDisables(stylelintResults);
	needlessDisables(stylelintResults);
	invalidScopeDisables(stylelintResults);
	descriptionlessDisables(stylelintResults);

	const errored = stylelintResults.some(
		(result) =>
			result.errored ||
			result.parseErrors.length > 0 ||
			result.warnings.some((warning) => warning.severity === 'error'),
	);

	/** @type {LinterResult} */
	const returnValue = {
		errored,
		results: [],
		output: '',
		reportedDisables: [],
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
}

module.exports = prepareReturnValue;
