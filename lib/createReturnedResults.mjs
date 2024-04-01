import createPartialStylelintResult from './createPartialStylelintResult.mjs';
import getConfigForFile from './getConfigForFile.mjs';

/**
 * @param {import('stylelint').InternalApi} stylelint
 * @param {import('stylelint').PostcssResult} [postcssResult]
 * @param {string} [filePath]
 * @param {import('stylelint').CssSyntaxError} [cssSyntaxError]
 * @return {Promise<import('stylelint').LintResult>}
 */
export default async function createStylelintResult(
	stylelint,
	postcssResult,
	filePath,
	cssSyntaxError,
) {
	let stylelintResult = createPartialStylelintResult(postcssResult, cssSyntaxError);

	const configForFile = await getConfigForFile(stylelint, filePath, filePath);

	const config = configForFile === null ? {} : configForFile.config;

	config.processors?.forEach(
		(
			/** @type {import('stylelint').Processor} */
			processor,
		) => {
			processor.postprocess?.(stylelintResult);
		},
	);

	return stylelintResult;
}
