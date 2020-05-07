'use strict';

const invalidScopeDisables = require('./invalidScopeDisables');
const needlessDisables = require('./needlessDisables');

/**
 * @param {StylelintResult[]} stylelintResults
 * @returns {StylelintStandaloneReturnValue}
 */
function prepareReturnValue(stylelintResults, options, formatterFunction) {
	const { reportNeedlessDisables, reportInvalidScopeDisables, maxWarnings } = options;

	const errored = stylelintResults.some(
		(result) => result.errored || result.parseErrors.length > 0,
	);

	/** @type {StylelintStandaloneReturnValue} */
	const returnValue = {
		errored,
		results: [],
		output: '',
	};

	if (reportNeedlessDisables) {
		returnValue.needlessDisables = needlessDisables(stylelintResults);
	}

	if (reportInvalidScopeDisables) {
		returnValue.invalidScopeDisables = invalidScopeDisables(stylelintResults);
	}

	if (maxWarnings !== undefined) {
		const foundWarnings = stylelintResults.reduce((count, file) => {
			return count + file.warnings.length;
		}, 0);

		if (foundWarnings > maxWarnings) {
			returnValue.maxWarningsExceeded = { maxWarnings, foundWarnings };
		}
	}

	returnValue.output = formatterFunction(stylelintResults, returnValue);
	returnValue.results = stylelintResults;

	// TODO: re-enable
	// debug(`Linting complete in ${Date.now() - startTime}ms`);

	return returnValue;
}

module.exports = prepareReturnValue;
