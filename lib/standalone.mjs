import { isAbsolute, join, normalize, relative } from 'node:path';
import { existsSync } from 'node:fs';
import process from 'node:process';

import createDebug from 'debug';
const debug = createDebug('stylelint:standalone');

import fastGlob from 'fast-glob';
import globby from 'globby';
import normalizePath from 'normalize-path';
import writeFileAtomic from 'write-file-atomic';

import { assertString, isString } from './utils/validateTypes.mjs';
import AllFilesIgnoredError from './utils/allFilesIgnoredError.mjs';
import NoFilesFoundError from './utils/noFilesFoundError.mjs';
import createPartialStylelintResult from './createPartialStylelintResult.mjs';
import createStylelint from './createStylelint.mjs';
import filterFilePaths from './utils/filterFilePaths.mjs';
import formatters from './formatters/index.mjs';
import getConfigForFile from './getConfigForFile.mjs';
import getFileIgnorer from './utils/getFileIgnorer.mjs';
import getFormatterOptionsText from './utils/getFormatterOptionsText.mjs';
import lintSource from './lintSource.mjs';
import prepareReturnValue from './prepareReturnValue.mjs';

const ALWAYS_IGNORED_GLOBS = ['**/node_modules/**'];

/** @typedef {import('stylelint').Formatter} Formatter */
/** @typedef {import('stylelint').FormatterType} FormatterType */

/**
 * @type {import('stylelint').PublicApi['lint']}
 */
export default async function standalone({
	allowEmptyInput,
	cache,
	cacheLocation,
	cacheStrategy,
	code,
	codeFilename,
	config,
	configBasedir,
	configFile,
	customSyntax,
	cwd = process.cwd(),
	disableDefaultIgnores,
	files,
	fix,
	formatter,
	globbyOptions,
	ignoreDisables,
	ignorePath,
	ignorePattern,
	maxWarnings,
	quiet,
	quietDeprecationWarnings = false,
	reportDescriptionlessDisables,
	reportInvalidScopeDisables,
	reportNeedlessDisables,
}) {
	const startTime = Date.now();

	const hasOneValidInput = (files && !isString(code)) || (!files && isString(code));

	if (!hasOneValidInput) {
		return Promise.reject(
			new Error('You must pass stylelint a `files` glob or a `code` string, though not both'),
		);
	}

	// The ignorer will be used to filter file paths after the glob is checked,
	// before any files are actually read

	/** @type {import('ignore').Ignore} */
	let ignorer;

	try {
		ignorer = getFileIgnorer({ cwd, ignorePath, ignorePattern });
	} catch (error) {
		return Promise.reject(error);
	}

	/** @type {Formatter} */
	let formatterFunction;

	try {
		formatterFunction = await getFormatterFunction(formatter);
	} catch (error) {
		return Promise.reject(error);
	}

	const stylelint = createStylelint({
		cacheLocation,
		cacheStrategy,
		config,
		configFile,
		configBasedir,
		cwd,
		ignoreDisables,
		ignorePath,
		reportNeedlessDisables,
		reportInvalidScopeDisables,
		reportDescriptionlessDisables,
		customSyntax,
		fix,
		quiet,
		quietDeprecationWarnings,
	});

	if (!files) {
		assertString(code);

		const absoluteCodeFilename =
			codeFilename !== undefined && !isAbsolute(codeFilename)
				? join(cwd, codeFilename)
				: codeFilename;

		// if file is ignored, return nothing
		if (
			absoluteCodeFilename &&
			!filterFilePaths(ignorer, [relative(cwd, absoluteCodeFilename)]).length
		) {
			return prepareReturnValue([], maxWarnings, formatterFunction, cwd);
		}

		let stylelintResult;

		try {
			const postcssResult = await lintSource(stylelint, {
				code,
				codeFilename: absoluteCodeFilename,
			});

			stylelintResult = createPartialStylelintResult(postcssResult);
		} catch (error) {
			stylelintResult = handleError(error);
		}

		const postcssResult = stylelintResult._postcssResult;
		const returnValue = prepareReturnValue([stylelintResult], maxWarnings, formatterFunction, cwd);

		const autofix = fix ?? config?.fix ?? false;

		if (autofix && postcssResult && !postcssResult.stylelint.ignored) {
			returnValue.code =
				!postcssResult.stylelint.disableWritingFix && postcssResult.opts
					? // If we're fixing, the output should be the fixed code
					  postcssResult.root.toString(postcssResult.opts.syntax)
					: // If the writing of the fix is disabled, the input code is returned as-is
					  code;
			returnValue._output = returnValue.code; // TODO: Deprecated. Remove in the next major version.
		}

		return returnValue;
	}

	let fileList = [files].flat().map((entry) => {
		const globCWD = (globbyOptions && globbyOptions.cwd) || cwd;
		const absolutePath = !isAbsolute(entry) ? join(globCWD, entry) : normalize(entry);

		if (existsSync(absolutePath)) {
			// This path points to a file. Return an escaped path to avoid globbing
			return fastGlob.escapePath(normalizePath(entry));
		}

		return entry;
	});

	if (!disableDefaultIgnores) {
		fileList = fileList.concat(ALWAYS_IGNORED_GLOBS.map((glob) => `!${glob}`));
	}

	// do not cache if config is explicitly overridden by option
	const useCache = cache ?? config?.cache ?? false;

	if (!useCache) {
		stylelint._fileCache.destroy();
	}

	const effectiveGlobbyOptions = {
		cwd,
		...(globbyOptions || {}),
		absolute: true,
	};

	const globCWD = effectiveGlobbyOptions.cwd;

	let filePaths = await globby(fileList, effectiveGlobbyOptions);
	// Record the length of filePaths before ignore operation
	// Prevent prompting "No files matching the pattern 'xx' were found." when .stylelintignore ignore all input files
	const filePathsLengthBeforeIgnore = filePaths.length;

	// The ignorer filter needs to check paths relative to cwd
	filePaths = filterFilePaths(
		ignorer,
		filePaths.map((p) => relative(globCWD, p)),
	);

	let stylelintResults;

	if (filePaths.length) {
		let absoluteFilePaths = filePaths.map((filePath) => {
			const absoluteFilepath = !isAbsolute(filePath)
				? join(globCWD, filePath)
				: normalize(filePath);

			return absoluteFilepath;
		});

		const getStylelintResults = absoluteFilePaths.map(async (absoluteFilepath) => {
			debug(`Processing ${absoluteFilepath}`);

			try {
				const postcssResult = await lintSource(stylelint, {
					filePath: absoluteFilepath,
					cache: useCache,
				});

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
				if (
					postcssResult.root &&
					postcssResult.opts &&
					!postcssResult.stylelint.ignored &&
					fix &&
					!postcssResult.stylelint.disableWritingFix
				) {
					const fixedCss = postcssResult.root.toString(postcssResult.opts.syntax);

					if (
						postcssResult.root &&
						postcssResult.root.source &&
						postcssResult.root.source.input.css !== fixedCss
					) {
						await writeFileAtomic(absoluteFilepath, fixedCss);
					}
				}

				return createPartialStylelintResult(postcssResult);
			} catch (error) {
				// On any error, we should not cache the lint result
				stylelint._fileCache.removeEntry(absoluteFilepath);

				return handleError(error);
			}
		});

		stylelintResults = await Promise.all(getStylelintResults);
	} else if (allowEmptyInput ?? config?.allowEmptyInput ?? (await canAllowEmptyInput(stylelint))) {
		stylelintResults = await Promise.all([]);
	} else if (filePathsLengthBeforeIgnore) {
		// All input files ignored
		stylelintResults = await Promise.reject(new AllFilesIgnoredError());
	} else {
		stylelintResults = await Promise.reject(new NoFilesFoundError(fileList));
	}

	if (useCache) {
		stylelint._fileCache.reconcile();
	}

	const result = prepareReturnValue(stylelintResults, maxWarnings, formatterFunction, cwd);

	debug(`Linting complete in ${Date.now() - startTime}ms`);

	return result;
}

/**
 * @param {FormatterType | Formatter | undefined} selected
 * @returns {Promise<Formatter>}
 */
function getFormatterFunction(selected) {
	if (typeof selected === 'string') {
		const formatterFunction = formatters[selected];

		if (formatterFunction === undefined) {
			const formattersText = getFormatterOptionsText(', ', '"');

			throw new Error(`You must use a valid formatter option: ${formattersText} or a function`);
		}

		return formatterFunction;
	}

	if (typeof selected === 'function') {
		return Promise.resolve(selected);
	}

	return formatters.json;
}

/**
 * @typedef {import('stylelint').CssSyntaxError} CssSyntaxError
 *
 * @param {unknown} error
 * @return {import('stylelint').LintResult}
 */
function handleError(error) {
	if (error instanceof Error && error.name === 'CssSyntaxError') {
		return createPartialStylelintResult(undefined, /** @type {CssSyntaxError} */ (error));
	}

	throw error;
}

/**
 * @param {import('stylelint').InternalApi} stylelint
 * @returns {Promise<boolean>}
 */
async function canAllowEmptyInput(stylelint) {
	const config = await getConfigForFile(stylelint);

	return Boolean(config?.config?.allowEmptyInput);
}
