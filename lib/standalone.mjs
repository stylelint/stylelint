import { isAbsolute, join, normalize, relative } from 'node:path';
import process from 'node:process';

import { escapePath, glob } from 'tinyglobby';
import picomatch from 'picomatch';

import {
	AllFilesIgnoredError,
	NoFilesFoundError,
	SuppressionFileNotFoundError,
} from './utils/errors.mjs';
import { assertString, isString } from './utils/validateTypes.mjs';
import lintFile, {
	handleError,
	isAutofixEnabled,
	postProcessStylelintResult,
} from './lintFile.mjs';
import lintFilesInWorkers, {
	calculateWorkerCount,
	validateConcurrency,
	validateOptionCloneability,
} from './lintFilesInWorkers.mjs';
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
import isPathIgnored from './isPathIgnored.mjs';
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

/** @import {InternalApi, LinterOptions, LintResult} from 'stylelint' */

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
	concurrency,
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
		concurrency,
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

	/**
	 * The options workers lint with; the main thread handles the globs, cache,
	 * formatter, `maxWarnings` and suppressions.
	 *
	 * @type {LinterOptions}
	 */
	const workerOptions = {
		config,
		configFile,
		configBasedir,
		cwd,
		ignoreDisables,
		ignorePath,
		reportNeedlessDisables,
		reportInvalidScopeDisables,
		reportDescriptionlessDisables,
		reportUnscopedDisables,
		customSyntax,
		fix,
		computeEditInfo,
		quiet,
		quietDeprecationWarnings,
		validate,
	};

	const formatterFunction = await getFormatter(stylelint);
	const maxWarnings = await resolveOptionValue({
		stylelint,
		name: 'maxWarnings',
		default: maxWarningsOpt,
	});
	const resolvedConcurrency = await resolveOptionValue({ stylelint, name: 'concurrency' });

	validateConcurrency(resolvedConcurrency);

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

	let fileList = await Promise.all(
		(typeof files === 'string' ? [files] : files).map(async (entry) => {
			const absolutePath = !isAbsolute(entry) ? join(cwd, entry) : normalize(entry);

			if (await pathExists(absolutePath)) {
				// This path points to a file. Return an escaped path to avoid globbing
				return escapePath(toUnixPath(entry));
			}

			return entry;
		}),
	);

	if (!disableDefaultIgnores) {
		fileList = fileList.concat(ALWAYS_IGNORED_GLOBS.map((ignoredGlob) => `!${ignoredGlob}`));
	}

	const useCache = await resolveOptionValue({ stylelint, name: 'cache', default: false });

	if (!useCache) {
		stylelint._fileCache.destroy();
	}

	// The abort signal is checked per file below rather than passed as tinyglobby's
	// `signal` option, which resolves with a partial file list instead of rejecting
	let filePaths = await glob(fileList, { ...globbyOptions, cwd, absolute: true });

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

		/** @type {Set<string> | undefined} the files to lint when the cache was checked up front */
		let changedFilePaths;
		let workerCount = 0;

		if (resolvedConcurrency !== undefined) {
			emitExperimentalWarning(
				'The concurrency option is experimental.',
				'CONCURRENCY',
				'See https://stylelint.io/user-guide/options#concurrency for more information.',
			);

			validateOptionCloneability(workerOptions);

			// Only the changed files need linting, so they size the pool
			if (useCache) {
				changedFilePaths = await getChangedFilePaths(stylelint, absoluteFilePaths);
			}

			workerCount = calculateWorkerCount(
				resolvedConcurrency,
				changedFilePaths?.size ?? absoluteFilePaths.length,
			);
		}

		/** @type {Map<string, LintResult>} */
		const workerResultsByFilePath = new Map();

		if (workerCount) {
			const filePathsToLint = changedFilePaths ? [...changedFilePaths] : absoluteFilePaths;
			const workerResults = await lintFilesInWorkers(
				filePathsToLint,
				workerCount,
				workerOptions,
				abortSignal,
			);

			for (const [index, filePath] of filePathsToLint.entries()) {
				workerResultsByFilePath.set(filePath, /** @type {LintResult} */ (workerResults[index]));
			}
		}

		stylelintResults = await Promise.all(
			absoluteFilePaths.map(
				(absoluteFilepath) =>
					workerResultsByFilePath.get(absoluteFilepath) ??
					lintFile(stylelint, absoluteFilepath, {
						useCache: useCache && !changedFilePaths?.has(absoluteFilepath),
						abortSignal,
					}),
			),
		);

		if (changedFilePaths) {
			for (const [index, result] of stylelintResults.entries()) {
				const filePath = /** @type {string} */ (absoluteFilePaths[index]);
				const postcssResult = result._postcssResult?.stylelint;

				// Like `lintFile()`, don't cache files with problems or CSS syntax errors
				if (
					changedFilePaths.has(filePath) &&
					(!postcssResult || postcssResult.stylelintError || postcssResult.stylelintWarning)
				) {
					debug(`${filePath} contains linting errors and will not be cached.`);
					stylelint._fileCache.removeEntry(filePath);
				}
			}
		}
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
 * Mirror the checks `lintSource()` runs before linting a file: ignored files
 * aren't cached, and the config hash is that of the first file linted.
 *
 * @param {InternalApi} stylelint
 * @param {string[]} absoluteFilePaths
 * @returns {Promise<Set<string>>}
 */
async function getChangedFilePaths(stylelint, absoluteFilePaths) {
	const changed = await Promise.all(
		absoluteFilePaths.map(async (absoluteFilepath) => {
			if (await isPathIgnored(stylelint, absoluteFilepath)) return false;

			const configForFile = await getConfigForFile({
				stylelint,
				searchPath: absoluteFilepath,
				filePath: absoluteFilepath,
			});

			// Leave a missing config to fail when linting, as without workers
			if (!configForFile) return false;

			stylelint._fileCache.calcHashOfConfig(configForFile.config);

			return stylelint._fileCache.hasFileChanged(absoluteFilepath);
		}),
	);

	return new Set(absoluteFilePaths.filter((_, index) => changed[index]));
}
