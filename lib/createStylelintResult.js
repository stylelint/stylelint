'use strict';

const createPartialStylelintResult = require('./createPartialStylelintResult');

/** @typedef {import('stylelint').PostcssResult} PostcssResult */
/** @typedef {import('stylelint').LintResult} StylelintResult */

/**
 * @param {import('stylelint').InternalApi} stylelint
 * @param {PostcssResult} [postcssResult]
 * @param {string} [filePath]
 * @param {import('stylelint').CssSyntaxError} [cssSyntaxError]
 * @return {Promise<StylelintResult>}
 */
module.exports = async function createStylelintResult(
	stylelint,
	postcssResult,
	filePath,
	cssSyntaxError,
) {
	let stylelintResult = createPartialStylelintResult(postcssResult, cssSyntaxError);

	const configForFile = await stylelint.getConfigForFile(filePath, filePath);

	const config = configForFile === null ? {} : configForFile.config;
	const file = stylelintResult.source || (cssSyntaxError && cssSyntaxError.file);

	if (config.resultProcessors) {
		config.resultProcessors.forEach((resultProcessor) => {
			// Result processors might just mutate the result object,
			// or might return a new one
			const returned = resultProcessor(stylelintResult, file);

			if (returned) {
				stylelintResult = returned;
			}
		});
	}

	return stylelintResult;
};
