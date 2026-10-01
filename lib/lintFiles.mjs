import createDebug from 'debug';
const debug = createDebug('stylelint:standalone');

import writeFileAtomic from 'write-file-atomic';

import createPartialStylelintResult from './createPartialStylelintResult.mjs';
import getConfigForFile from './getConfigForFile.mjs';
import lintSource from './lintSource.mjs';

/** @import {InternalApi, LinterOptions, LintResult} from 'stylelint' */

/**
 * Lint each of the given files and return one result per file.
 *
 * @param {InternalApi} stylelint
 * @param {string[]} absoluteFilePaths
 * @param {object} options
 * @param {boolean} [options.useCache]
 * @param {LinterOptions['fix']} [options.fix]
 * @param {AbortSignal} [options.abortSignal]
 * @returns {Promise<LintResult[]>}
 */
export default function lintFiles(
	stylelint,
	absoluteFilePaths,
	{ useCache = false, fix, abortSignal } = {},
) {
	const getStylelintResults = absoluteFilePaths.map(async (absoluteFilepath) => {
		debug(`Processing ${absoluteFilepath}`);

		try {
			if (abortSignal?.aborted) {
				throw abortSignal.reason;
			}

			const postcssResult = await lintSource(stylelint, {
				filePath: absoluteFilepath,
				cache: useCache,
				abortSignal,
			});

			if (abortSignal?.aborted) {
				throw abortSignal.reason;
			}

			if (
				(postcssResult.stylelint.stylelintError || postcssResult.stylelint.stylelintWarning) &&
				useCache
			) {
				debug(`${absoluteFilepath} contains linting errors and will not be cached.`);
				stylelint._fileCache.removeEntry(absoluteFilepath);
			}

			/**
			 * If we're fixing, save the file with changed code
			 */
			if (postcssResult.root && postcssResult.opts && !postcssResult.stylelint.ignored && fix) {
				const fixedCss = postcssResult.root.toString(postcssResult.opts.syntax);

				if (
					postcssResult.root &&
					postcssResult.root.source &&
					postcssResult.root.source.input.css !== fixedCss
				) {
					await writeFileAtomic(absoluteFilepath, fixedCss);
					postcssResult.stylelint.autofixed = true;
				}
			}

			const stylelintResult = createPartialStylelintResult(postcssResult);

			await postProcessStylelintResult(stylelint, stylelintResult, absoluteFilepath);

			return stylelintResult;
		} catch (error) {
			// On any error, we should not cache the lint result
			stylelint._fileCache.removeEntry(absoluteFilepath);

			const stylelintResult = handleError(error);

			await postProcessStylelintResult(stylelint, stylelintResult, absoluteFilepath);

			return stylelintResult;
		}
	});

	return Promise.all(getStylelintResults);
}

/**
 * @import {CssSyntaxError} from 'stylelint'
 *
 * @param {unknown} error
 * @returns {LintResult}
 */
export function handleError(error) {
	if (error instanceof Error && error.name === 'CssSyntaxError') {
		return createPartialStylelintResult(undefined, /** @type {CssSyntaxError} */ (error));
	}

	throw error;
}

/**
 * @param {InternalApi} stylelint
 * @param {LintResult} stylelintResult
 * @param {string} [filePath]
 * @returns {Promise<void>}
 */
export async function postProcessStylelintResult(stylelint, stylelintResult, filePath) {
	const configForFile = await getConfigForFile({ stylelint, searchPath: filePath, filePath });

	const config = configForFile === null ? {} : configForFile.config;

	if (!config._processorFunctions) {
		return;
	}

	for (const postprocess of config._processorFunctions.values()) {
		postprocess?.(stylelintResult, stylelintResult._postcssResult?.root);
	}
}
