import { dirname, isAbsolute, join, normalize, relative } from 'node:path';
import process from 'node:process';
import { stat } from 'node:fs/promises';

import { escapePath, glob } from 'tinyglobby';
import picomatch from 'picomatch';
import writeFileAtomic from 'write-file-atomic';

import {
	AllFilesIgnoredError,
	NoFilesFoundError,
	SuppressionFileNotFoundError,
} from './utils/errors.mjs';
import { assertString, isString } from './utils/validateTypes.mjs';
import { DEFAULT_SUPPRESSION_FILENAME } from './constants.mjs';
import { SuppressionsService } from './utils/suppressionsService.mjs';
import createDebug from './utils/createDebug.mjs';
import createPartialStylelintResult from './createPartialStylelintResult.mjs';
import createStylelint from './createStylelint.mjs';
import { emitExperimentalWarning } from './utils/emitWarning.mjs';
import filterFilePaths from './utils/filterFilePaths.mjs';
import getConfigForFile from './getConfigForFile.mjs';
import getFileIgnorer from './utils/getFileIgnorer.mjs';
import getFormatter from './utils/getFormatter.mjs';
import getOrInsertComputed from './utils/getOrInsertComputed.mjs';
import lintSource from './lintSource.mjs';
import pathExists from './utils/pathExists.mjs';
import prepareReturnValue from './prepareReturnValue.mjs';
import resolveFilePath from './utils/resolveFilePath.mjs';
import resolveOptionValue from './utils/resolveOptionValue.mjs';
import toUnixPath from './utils/toUnixPath.mjs';
import validateGlobbyOptions from './utils/validateGlobbyOptions.mjs';

const ALWAYS_IGNORED_GLOBS = ['**/node_modules/**'];
const isAlwaysIgnored = picomatch(ALWAYS_IGNORED_GLOBS, { dot: true });
const debug = createDebug('stylelint:standalone');

/** @import {InternalApi, LintResult, PostcssResult} from 'stylelint' */

/**
 * @type {import('stylelint').PublicApi['lint']}
 */
export default async function standalone({
	abortSignal,
	allowEmptyInput,
	cache,
	cacheLocation,
	cacheStrategy,
	code,
	codeFilename,
	color,
	config,
	configBasedir,
	configFile,
	customSyntax,
	cwd = process.cwd(),
	disableDefaultIgnores,
	files,
	fix,
	computeEditInfo,
	formatter,
	_defaultFormatter,
	globbyOptions,
	ignoreDisables,
	ignorePath,
	ignorePattern,
	maxWarnings: maxWarningsOpt,
	quiet,
	quietDeprecationWarnings = false,
	reportDescriptionlessDisables,
	reportInvalidScopeDisables,
	reportNeedlessDisables,
	reportUnscopedDisables,
	suppressAll,
	suppressRule,
	suppressLocation,
	validate = true,
}) {
	const startTime = Date.now();

	const useInputCode = !files && isString(code);
	const hasOneValidInput = (files && !isString(code)) || useInputCode;

	if (!hasOneValidInput) {
		return Promise.reject(
			new Error('You must pass stylelint a `files` glob or a `code` string, though not both'),
		);
	}

	validateGlobbyOptions(globbyOptions);

	// The ignorer will be used to filter file paths after the glob is checked,
	// before any files are actually read
	/** @type {import('ignore').Ignore} */
	let ignorer;

	try {
		ignorer = getFileIgnorer({ cwd, ignorePath, ignorePattern });
	} catch (error) {
		return Promise.reject(error);
	}

	const stylelint = createStylelint({
		allowEmptyInput,
		cache,
		cacheLocation,
		cacheStrategy,
		config,
		configFile,
		configBasedir,
		cwd,
		formatter,
		_defaultFormatter,
		ignoreDisables,
		ignorePath,
		reportNeedlessDisables,
		reportInvalidScopeDisables,
		reportDescriptionlessDisables,
		reportUnscopedDisables,
		maxWarnings: maxWarningsOpt,
		customSyntax,
		fix,
		computeEditInfo,
		quiet,
		quietDeprecationWarnings,
		validate,
	});

	const formatterFunction = await getFormatter(stylelint);
	const maxWarnings = await resolveOptionValue({
		stylelint,
		name: 'maxWarnings',
		default: maxWarningsOpt,
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
			(!filterFilePaths(ignorer, [relative(cwd, absoluteCodeFilename)]).length ||
				(!disableDefaultIgnores && isAlwaysIgnored(absoluteCodeFilename)))
		) {
			return prepareReturnValue({
				results: [],
				maxWarnings,
				quietDeprecationWarnings,
				formatter: formatterFunction,
				cwd,
				color,
			});
		}

		let stylelintResult;
		let fixedCode;

		try {
			if (abortSignal?.aborted) {
				throw abortSignal.reason;
			}

			const postcssResult = await lintSource(stylelint, {
				code,
				codeFilename: absoluteCodeFilename,
				abortSignal,
			});

			if (isAutofixEnabled(postcssResult)) {
				fixedCode = postcssResult.root.toString(postcssResult.opts.syntax);

				if (code !== fixedCode) {
					postcssResult.stylelint.autofixed = true;
				}
			}

			if (abortSignal?.aborted) {
				throw abortSignal.reason;
			}

			stylelintResult = createPartialStylelintResult(postcssResult);
		} catch (error) {
			stylelintResult = handleError(error);
		}

		await postProcessStylelintResult(stylelint, stylelintResult, absoluteCodeFilename);

		const returnValue = prepareReturnValue({
			results: [stylelintResult],
			maxWarnings,
			quietDeprecationWarnings,
			formatter: formatterFunction,
			cwd,
			color,
		});

		if (fixedCode !== undefined) {
			returnValue.code = fixedCode;
		}

		return returnValue;
	}

	const entries = await Promise.all(
		(typeof files === 'string' ? [files] : files).map(async (entry) => {
			const absolutePath = !isAbsolute(entry) ? join(cwd, entry) : normalize(entry);
			// TODO: Replace `catch()` with the `throwIfNoEntry` option from Node.js 25.7.
			// const stats = await stat(absolutePath, { throwIfNoEntry: false });
			const stats = await stat(absolutePath).catch(() => undefined);

			return {
				// This path points to a file or directory. Return an escaped path to avoid globbing
				pattern: stats ? escapePath(toUnixPath(entry)) : entry,
				fileDirectory: stats?.isFile() ? dirname(absolutePath) : undefined,
			};
		}),
	);

	const fileList = entries.map(({ pattern }) => pattern);
	/** @type {string[]} */
	const patterns = [];
	/** @type {Map<string, string[]>} */
	const filePathsByDirectory = new Map();

	for (const { pattern, fileDirectory } of entries) {
		if (fileDirectory === undefined) {
			patterns.push(pattern);
		} else {
			getOrInsertComputed(filePathsByDirectory, fileDirectory, () => []).push(pattern);
		}
	}

	if (!disableDefaultIgnores) {
		patterns.push(...ALWAYS_IGNORED_GLOBS.map((ignoredGlob) => `!${ignoredGlob}`));
	}

	const useCache = await resolveOptionValue({ stylelint, name: 'cache', default: false });

	if (!useCache) {
		stylelint._fileCache.destroy();
	}

	// The abort signal is checked per file below rather than passed as tinyglobby's
	// `signal` option, which resolves with a partial file list instead of rejecting
	let filePaths = await globFiles(patterns, filePathsByDirectory, {
		...globbyOptions,
		cwd,
		absolute: true,
	});

	// Record the length of filePaths before ignore operation
	// Prevent prompting "No files matching the pattern 'xx' were found." when .stylelintignore ignore all input files
	const filePathsLengthBeforeIgnore = filePaths.length;

	// The ignorer filter needs to check paths relative to cwd
	filePaths = filterFilePaths(
		ignorer,
		filePaths.map((p) => relative(cwd, p)),
	);

	let stylelintResults;

	if (filePaths.length) {
		const absoluteFilePaths = filePaths.map((filePath) =>
			isAbsolute(filePath) ? normalize(filePath) : join(cwd, filePath),
		);

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
				stylelint._fileCache.removeEntry(absoluteFilepath);

				const stylelintResult = handleError(error);

				await postProcessStylelintResult(stylelint, stylelintResult, absoluteFilepath);

				return stylelintResult;
			}
		});

		stylelintResults = await Promise.all(getStylelintResults);
	} else if (await resolveOptionValue({ stylelint, name: 'allowEmptyInput', default: false })) {
		stylelintResults = await Promise.all([]);
	} else if (filePathsLengthBeforeIgnore) {
		// All input files ignored
		stylelintResults = await Promise.reject(new AllFilesIgnoredError());
	} else {
		stylelintResults = await Promise.reject(new NoFilesFoundError(fileList));
	}

	if (!useInputCode) {
		const resolvedSuppressLocation = resolveFilePath(
			suppressLocation || DEFAULT_SUPPRESSION_FILENAME,
			cwd,
			DEFAULT_SUPPRESSION_FILENAME,
		);

		const existsSuppressionsFile = await pathExists(resolvedSuppressLocation);

		if (suppressLocation && !existsSuppressionsFile && !suppressAll && !suppressRule) {
			throw new SuppressionFileNotFoundError();
		}

		if (suppressAll || suppressRule || existsSuppressionsFile) {
			emitExperimentalWarning(
				'The suppressions feature is experimental.',
				'SUPPRESSIONS',
				'See https://stylelint.io/user-guide/suppressions for more information.',
			);

			const suppressions = new SuppressionsService({
				filePath: resolvedSuppressLocation,
				cwd: process.cwd(),
			});

			if (suppressAll || suppressRule) {
				await suppressions.suppress(stylelintResults, suppressRule);
			}

			const suppressionResults = suppressions.applySuppressions(
				stylelintResults,
				await suppressions.load(),
			);

			stylelintResults = suppressionResults.results;
		}
	}

	if (useCache) {
		stylelint._fileCache.reconcile();
	}

	const result = prepareReturnValue({
		results: stylelintResults,
		maxWarnings,
		quietDeprecationWarnings,
		formatter: formatterFunction,
		cwd,
		color,
	});

	debug(`Linting complete in ${Date.now() - startTime}ms`);

	return result;
}

/**
 * @param {PostcssResult} postcssResult
 * @returns {boolean}
 */
function isAutofixEnabled(postcssResult) {
	const { config, ignored } = postcssResult.stylelint;

	return Boolean(config?.fix && !ignored);
}

/**
 * @import {CssSyntaxError} from 'stylelint'
 *
 * @param {unknown} error
 * @returns {LintResult}
 */
function handleError(error) {
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
async function postProcessStylelintResult(stylelint, stylelintResult, filePath) {
	const configForFile = await getConfigForFile({ stylelint, searchPath: filePath, filePath });

	const config = configForFile === null ? {} : configForFile.config;

	if (!config._processorFunctions) {
		return;
	}

	for (const postprocess of config._processorFunctions.values()) {
		postprocess?.(stylelintResult, stylelintResult._postcssResult?.root);
	}
}

/**
 * Calls `glob` once for each directory of the paths to files and once for the other
 * patterns, as tinyglobby crawls from the common directory of a call's patterns and
 * matches each crawled path against each pattern.
 *
 * @todo Check whether this is still needed once tinyglobby is replaced.
 *
 * @see https://github.com/stylelint/stylelint/issues/9675
 *
 * @param {string[]} patterns
 * @param {Map<string, string[]>} filePathsByDirectory
 * @param {import('tinyglobby').GlobOptions} options
 * @returns {Promise<string[]>}
 */
async function globFiles(patterns, filePathsByDirectory, options) {
	if (filePathsByDirectory.size === 0) return glob(patterns, options);

	// The same test as tinyglobby's processPatterns(), which no public API exposes
	const negatedPatterns = patterns.filter((pattern) => pattern[0] === '!' && pattern[1] !== '(');
	const globs = [...filePathsByDirectory.values()].map((filePaths) => [
		...filePaths,
		// So that the negated patterns still exclude the paths to files
		...negatedPatterns,
	]);

	if (negatedPatterns.length < patterns.length) globs.push(patterns);

	return getUniqueFilePaths(
		(await Promise.all(globs.map((globPatterns) => glob(globPatterns, options)))).flat(),
	);
}

/**
 * Keeps the first of the paths that differ only in case or Unicode normalization
 *
 * @param {string[]} filePaths
 * @returns {Promise<string[]>}
 */
async function getUniqueFilePaths(filePaths) {
	/** @type {Map<string, string>} */
	const firstFilePathByFoldedPath = new Map();
	/** @type {string[]} */
	const uniqueFilePaths = [];

	for (const filePath of new Set(filePaths)) {
		const foldedPath = filePath.normalize('NFC').toLowerCase();
		const firstFilePath = firstFilePathByFoldedPath.get(foldedPath);

		if (firstFilePath === undefined) {
			firstFilePathByFoldedPath.set(foldedPath, filePath);
			uniqueFilePaths.push(filePath);
		} else if (!(await isSameFile(firstFilePath, filePath))) {
			uniqueFilePaths.push(filePath);
		}
	}

	return uniqueFilePaths;
}

/**
 * @param {string} filePath
 * @param {string} otherFilePath
 * @returns {Promise<boolean>}
 */
async function isSameFile(filePath, otherFilePath) {
	const [stats, otherStats] = await Promise.all([stat(filePath), stat(otherFilePath)]);

	return stats.dev === otherStats.dev && stats.ino === otherStats.ino;
}
