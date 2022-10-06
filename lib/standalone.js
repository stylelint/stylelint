'use strict';

const debug = require('debug')('stylelint:standalone');
const fastGlob = require('fast-glob');
const fs = require('fs');
const globby = require('globby');
const normalizePath = require('normalize-path');
const path = require('path');

const createStylelint = require('./createStylelint');
const createStylelintResult = require('./createStylelintResult');
const filterFilePaths = require('./utils/filterFilePaths');
const formatters = require('./formatters');
const getFileIgnorer = require('./utils/getFileIgnorer');
const getFormatterOptionsText = require('./utils/getFormatterOptionsText');
const NoFilesFoundError = require('./utils/noFilesFoundError');
const AllFilesIgnoredError = require('./utils/allFilesIgnoredError');
const { assert } = require('./utils/validateTypes');
const prepareReturnValue = require('./prepareReturnValue');

const ALWAYS_IGNORED_GLOBS = ['**/node_modules/**'];
const writeFileAtomic = require('write-file-atomic');

/** @typedef {import('stylelint').LinterOptions} LinterOptions */
/** @typedef {import('stylelint').LinterResult} LinterResult */
/** @typedef {import('stylelint').LintResult} StylelintResult */
/** @typedef {import('stylelint').Formatter} Formatter */
/** @typedef {import('stylelint').FormatterType} FormatterType */

/**
 *
 * @param {LinterOptions} options
 * @returns {Promise<LinterResult>}
 */
async function standalone({
	allowEmptyInput = false,
	cache: useCache = false,
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
	reportDescriptionlessDisables,
	reportInvalidScopeDisables,
	reportNeedlessDisables,
	syntax,
}) {
	const startTime = Date.now();

	const isValidCode = typeof code === 'string';

	if ((!files && !isValidCode) || (files && (code || isValidCode))) {
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
		formatterFunction = getFormatterFunction(formatter);
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
		syntax,
		customSyntax,
		fix,
		quiet,
	});

	if (!files) {
		const absoluteCodeFilename =
			codeFilename !== undefined && !path.isAbsolute(codeFilename)
				? path.join(cwd, codeFilename)
				: codeFilename;

		// if file is ignored, return nothing
		if (
			absoluteCodeFilename &&
			!filterFilePaths(ignorer, [path.relative(cwd, absoluteCodeFilename)]).length
		) {
			return prepareReturnValue([], maxWarnings, formatterFunction, cwd);
		}

		let stylelintResult;

		try {
			const postcssResult = await stylelint._lintSource({
				code,
				codeFilename: absoluteCodeFilename,
			});

			stylelintResult = await stylelint._createStylelintResult(postcssResult, absoluteCodeFilename);
		} catch (error) {
			stylelintResult = await handleError(stylelint, error);
		}

		const postcssResult = stylelintResult._postcssResult;
		const returnValue = prepareReturnValue([stylelintResult], maxWarnings, formatterFunction, cwd);

		if (
			fix &&
			postcssResult &&
			!postcssResult.stylelint.ignored &&
			!postcssResult.stylelint.ruleDisableFix
		) {
			returnValue.output =
				!postcssResult.stylelint.disableWritingFix && postcssResult.opts
					? // If we're fixing, the output should be the fixed code
					  postcssResult.root.toString(postcssResult.opts.syntax)
					: // If the writing of the fix is disabled, the input code is returned as-is
					  code;
		}

		return returnValue;
	}

	let fileList = [files].flat().map((entry) => {
		const globCWD = (globbyOptions && globbyOptions.cwd) || cwd;
		const absolutePath = !path.isAbsolute(entry)
			? path.join(globCWD, entry)
			: path.normalize(entry);

		if (fs.existsSync(absolutePath)) {
			// This path points to a file. Return an escaped path to avoid globbing
			return fastGlob.escapePath(normalizePath(entry));
		}

		return entry;
	});

	if (!disableDefaultIgnores) {
		fileList = fileList.concat(ALWAYS_IGNORED_GLOBS.map((glob) => `!${glob}`));
	}

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
		filePaths.map((p) => path.relative(globCWD, p)),
	);

	let stylelintResults;

	if (filePaths.length) {
		let absoluteFilePaths = filePaths.map((filePath) => {
			const absoluteFilepath = !path.isAbsolute(filePath)
				? path.join(globCWD, filePath)
				: path.normalize(filePath);

			return absoluteFilepath;
		});

		const getStylelintResults = absoluteFilePaths.map(async (absoluteFilepath) => {
			debug(`Processing ${absoluteFilepath}`);

			try {
				const postcssResult = await stylelint._lintSource({
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

				return stylelint._createStylelintResult(postcssResult, absoluteFilepath);
			} catch (error) {
				// On any error, we should not cache the lint result
				stylelint._fileCache.removeEntry(absoluteFilepath);

				return handleError(stylelint, error, absoluteFilepath);
			}
		});

		stylelintResults = await Promise.all(getStylelintResults);
	} else if (allowEmptyInput) {
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
 * @returns {Formatter}
 */
function getFormatterFunction(selected) {
	if (typeof selected === 'string') {
		const formatterFunction = formatters[selected];

		if (formatterFunction === undefined) {
			throw new Error(
				`You must use a valid formatter option: ${getFormatterOptionsText()} or a function`,
			);
		}

		return formatterFunction;
	}

	if (typeof selected === 'function') {
		return selected;
	}

	assert(formatters.json);

	return formatters.json;
}

/**
 * @param {import('stylelint').InternalApi} stylelint
 * @param {any} error
 * @param {string} [filePath]
 * @return {Promise<StylelintResult>}
 */
function handleError(stylelint, error, filePath = undefined) {
	if (error.name === 'CssSyntaxError') {
		return createStylelintResult(stylelint, undefined, filePath, error);
	}

	throw error;
}

module.exports = /** @type {typeof import('stylelint').lint} */ (standalone);
