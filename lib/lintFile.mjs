import writeFileAtomic from 'write-file-atomic';

import createDebug from './utils/createDebug.mjs';
import createPartialStylelintResult from './createPartialStylelintResult.mjs';
import getConfigForFile from './getConfigForFile.mjs';
import lintSource from './lintSource.mjs';

const debug = createDebug('stylelint:standalone');

/** @import {CssSyntaxError, InternalApi, LintResult, PostcssResult} from 'stylelint' */

/**
 * Lint a file, used by both the main thread and the worker threads.
 *
 * @param {InternalApi} stylelint
 * @param {string} absoluteFilepath
 * @param {object} options
 * @param {boolean} options.useCache
 * @param {AbortSignal} [options.abortSignal]
 * @returns {Promise<LintResult>}
 */
export default async function lintFile(stylelint, absoluteFilepath, { useCache, abortSignal }) {
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
		if (postcssResult.root && postcssResult.opts && isAutofixEnabled(postcssResult)) {
			const fixedCode = postcssResult.root.toString(postcssResult.opts.syntax);
			const sourceCode = postcssResult.stylelint.code;

			if (sourceCode !== undefined && sourceCode !== fixedCode) {
				await writeFileAtomic(absoluteFilepath, fixedCode);
				postcssResult.stylelint.autofixed = true;
			}
		}

		const stylelintResult = createPartialStylelintResult(postcssResult);

		await postProcessStylelintResult(stylelint, stylelintResult, absoluteFilepath);

		return stylelintResult;
	} catch (error) {
		// On any error, we should not cache the lint result
		if (useCache) {
			stylelint._fileCache.removeEntry(absoluteFilepath);
		}

		const stylelintResult = handleError(error);

		await postProcessStylelintResult(stylelint, stylelintResult, absoluteFilepath);

		return stylelintResult;
	}
}

/**
 * @param {PostcssResult} postcssResult
 * @returns {boolean}
 */
export function isAutofixEnabled(postcssResult) {
	const { config, ignored } = postcssResult.stylelint;

	return Boolean(config?.fix && !ignored);
}

/**
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
