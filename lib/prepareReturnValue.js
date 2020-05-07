'use strict';

const invalidScopeDisables = require('./invalidScopeDisables');
const needlessDisables = require('./needlessDisables');

/** @typedef {import('stylelint').Formatter} Formatter */
/** @typedef {import('stylelint').StylelintResult} StylelintResult */
/** @typedef {import('stylelint').StylelintStandaloneOptions} StylelintStandaloneOptions */
/** @typedef {import('stylelint').StylelintStandaloneReturnValue} StylelintStandaloneReturnValue */

/**
 * @param {StylelintResult[]} stylelintResults
 * @param {StylelintStandaloneOptions} options
 * @param {Formatter} formatter
 *
 * @returns {StylelintStandaloneReturnValue}
 */
function prepareReturnValue(stylelintResults, options, formatter) {
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

	returnValue.output = formatter(stylelintResults);
	returnValue.results = stylelintResults;

	return returnValue;
}

module.exports = prepareReturnValue;
