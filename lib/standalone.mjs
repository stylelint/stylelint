import { isAbsolute, join, normalize, relative } from 'node:path';
import process from 'node:process';

import createDebug from 'debug';
const debug = createDebug('stylelint:standalone');

import fastGlob from 'fast-glob';
import { globby } from 'globby';
import micromatch from 'micromatch';
import normalizePath from 'normalize-path';

import {
	AllFilesIgnoredError,
	NoFilesFoundError,
	SuppressionFileNotFoundError,
} from './utils/errors.mjs';
import { assertString, isString } from './utils/validateTypes.mjs';
import lintFiles, { handleError, postProcessStylelintResult } from './lintFiles.mjs';
import lintFilesInWorkers, {
	resolveWorkerCount,
	validateConcurrency,
} from './lintFilesInWorkers.mjs';
import { DEFAULT_SUPPRESSION_FILENAME } from './constants.mjs';
import { SuppressionsService } from './utils/suppressionsService.mjs';
import createPartialStylelintResult from './createPartialStylelintResult.mjs';
import createStylelint from './createStylelint.mjs';
import { emitExperimentalWarning } from './utils/emitWarning.mjs';
import filterFilePaths from './utils/filterFilePaths.mjs';
import getConfigForFile from './getConfigForFile.mjs';
import getFileIgnorer from './utils/getFileIgnorer.mjs';
import getFormatter from './utils/getFormatter.mjs';
import lintSource from './lintSource.mjs';
import normalizeFixMode from './utils/normalizeFixMode.mjs';
import pathExists from './utils/pathExists.mjs';
import prepareReturnValue from './prepareReturnValue.mjs';
import resolveFilePath from './utils/resolveFilePath.mjs';
import resolveOptionValue from './utils/resolveOptionValue.mjs';
import toPath from './utils/toPath.mjs';

const ALWAYS_IGNORED_GLOBS = ['**/node_modules/**'];

/** @import {LintResult} from 'stylelint' */

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

	validateConcurrency(concurrency);

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
				(!disableDefaultIgnores &&
					micromatch.isMatch(absoluteCodeFilename, ALWAYS_IGNORED_GLOBS, { dot: true })))
		) {
			return prepareReturnValue({
				results: [],
				maxWarnings,
				quietDeprecationWarnings,
				formatter: formatterFunction,
				cwd,
			});
		}

		let stylelintResult;
		let fixedCss;

		try {
			if (abortSignal?.aborted) {
				throw abortSignal.reason;
			}

			const postcssResult = await lintSource(stylelint, {
				code,
				codeFilename: absoluteCodeFilename,
				abortSignal,
			});

			const autofix = normalizeFixMode(stylelint._options.fix) ?? config?.fix ?? false;

			if (autofix && !postcssResult.stylelint.ignored) {
				fixedCss = postcssResult.root.toString(postcssResult.opts.syntax);

				if (code !== fixedCss) {
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
		});

		if (fixedCss !== undefined) {
			returnValue.code = fixedCss;
		}

		return returnValue;
	}

	let fileList = await Promise.all(
		(typeof files === 'string' ? [files] : files).map(async (entry) => {
			const globCWD = toPath(globbyOptions?.cwd) || cwd;
			const absolutePath = !isAbsolute(entry) ? join(globCWD, entry) : normalize(entry);

			if (await pathExists(absolutePath)) {
				// This path points to a file. Return an escaped path to avoid globbing
				return fastGlob.escapePath(normalizePath(entry));
			}

			return entry;
		}),
	);

	if (!disableDefaultIgnores) {
		fileList = fileList.concat(ALWAYS_IGNORED_GLOBS.map((glob) => `!${glob}`));
	}

	const useCache = await resolveOptionValue({ stylelint, name: 'cache', default: false });

	if (!useCache) {
		stylelint._fileCache.destroy();
	}

	const effectiveGlobbyOptions = {
		cwd,
		...(globbyOptions || {}),
		absolute: true,
	};

	const globCWD = toPath(effectiveGlobbyOptions.cwd);

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
		const absoluteFilePaths = filePaths.map((filePath) =>
			isAbsolute(filePath) ? normalize(filePath) : join(globCWD, filePath),
		);

		const resolvedConcurrency = await resolveOptionValue({
			stylelint,
			name: 'concurrency',
			default: concurrency,
		});

		validateConcurrency(resolvedConcurrency);

		const useWorkers = resolvedConcurrency !== undefined && resolvedConcurrency !== 1;

		/** Files to lint in worker threads; with the cache enabled, only the files that changed. */
		let workerFiles = absoluteFilePaths;
		/** Files whose previous clean result is served from the cache in the main thread. */
		/** @type {string[]} */
		const cachedFiles = [];

		if (useWorkers && useCache) {
			// Mirror the sequence `lintSource()` runs per file: the config hash is
			// locked to the first file's config, and `hasFileChanged()` records the
			// file's current descriptor as a side effect, so a changed file that
			// lints cleanly ends up cached on `reconcile()`.
			const configForFile = await getConfigForFile({
				stylelint,
				searchPath: absoluteFilePaths[0],
				filePath: absoluteFilePaths[0],
			});

			stylelint._fileCache.calcHashOfConfig(configForFile?.config ?? {});

			workerFiles = [];

			for (const absoluteFilepath of absoluteFilePaths) {
				if (stylelint._fileCache.hasFileChanged(absoluteFilepath)) {
					workerFiles.push(absoluteFilepath);
				} else {
					cachedFiles.push(absoluteFilepath);
				}
			}
		}

		// Sizing on the files that actually need linting means a warm-cache run
		// stays in the main thread instead of spawning workers for a handful of
		// changed files.
		const workerCount = useWorkers
			? resolveWorkerCount(resolvedConcurrency, workerFiles.length)
			: 1;

		if (workerCount > 1) {
			const workerOptions = {
				config,
				configFile,
				configBasedir,
				customSyntax,
				cwd,
				disableDefaultIgnores,
				fix,
				computeEditInfo,
				ignoreDisables,
				ignorePath,
				ignorePattern,
				quiet,
				quietDeprecationWarnings,
				reportDescriptionlessDisables,
				reportInvalidScopeDisables,
				reportNeedlessDisables,
				reportUnscopedDisables,
				validate,
			};

			const workerResults = await lintFilesInWorkers(
				workerFiles,
				workerOptions,
				workerCount,
				abortSignal,
			);

			if (useCache) {
				workerResults.forEach((result, index) => {
					// Mirror the main-thread path: don't cache files with lint
					// errors or warnings. A result without `_postcssResult` is a
					// CSS syntax error.
					const postcssResult = result._postcssResult?.stylelint;

					if (!postcssResult || postcssResult.stylelintError || postcssResult.stylelintWarning) {
						debug(`${workerFiles[index]} contains linting errors and will not be cached.`);
						stylelint._fileCache.removeEntry(/** @type {string} */ (workerFiles[index]));
					}
				});
			}

			if (cachedFiles.length > 0) {
				// Serving a cache hit is a short-circuit in `lintSource()` (no file
				// read, no parse), so these run in the main thread.
				const cachedResults = await lintFiles(stylelint, cachedFiles, {
					useCache,
					fix,
					abortSignal,
				});

				/** @type {Map<string, LintResult>} */
				const resultByFilePath = new Map();

				workerFiles.forEach((file, index) => {
					resultByFilePath.set(file, /** @type {LintResult} */ (workerResults[index]));
				});
				cachedFiles.forEach((file, index) => {
					resultByFilePath.set(file, /** @type {LintResult} */ (cachedResults[index]));
				});

				stylelintResults = absoluteFilePaths.map(
					(file) => /** @type {LintResult} */ (resultByFilePath.get(file)),
				);
			} else {
				stylelintResults = workerResults;
			}
		} else {
			stylelintResults = await lintFiles(stylelint, absoluteFilePaths, {
				useCache,
				fix,
				abortSignal,
			});
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
	});

	debug(`Linting complete in ${Date.now() - startTime}ms`);

	return result;
}
