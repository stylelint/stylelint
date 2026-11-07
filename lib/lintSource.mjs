import { isAbsolute } from 'node:path';

import postcss from 'postcss';

import descriptionlessDisables from './descriptionlessDisables.mjs';
import getConfigForFile from './getConfigForFile.mjs';
import getPostcssResult from './getPostcssResult.mjs';
import invalidScopeDisables from './invalidScopeDisables.mjs';
import isPathIgnored from './isPathIgnored.mjs';
import isPathNotFoundError from './utils/isPathNotFoundError.mjs';
import lintPostcssResult from './lintPostcssResult.mjs';
import needlessDisables from './needlessDisables.mjs';
import reportDisables from './reportDisables.mjs';
import reportUnscopedDisables from './unscopedDisables.mjs';

/** @import {Config, GetLintSourceOptions as Options, InternalApi as StylelintInternalApi, LinterOptions, PostcssResult, StylelintPostcssResult} from 'stylelint' */

// Stops fixers that change the code in every pass
const MAX_FIX_PASSES = 10;

/**
 * Run stylelint on a PostCSS Result, either one that is provided
 * or one that we create
 * @param {StylelintInternalApi} stylelint
 * @param {Options} options
 * @returns {Promise<PostcssResult>}
 */
export default async function lintSource(stylelint, options = {}) {
	if (!options.filePath && options.code === undefined && !options.existingPostcssResult) {
		return Promise.reject(new Error('You must provide filePath, code, or existingPostcssResult'));
	}

	const { abortSignal } = options;

	if (abortSignal?.aborted) {
		throw abortSignal.reason;
	}

	const isCodeNotFile = options.code !== undefined;

	const inputFilePath = isCodeNotFile ? options.codeFilename : options.filePath;

	if (inputFilePath !== undefined && !isAbsolute(inputFilePath)) {
		if (isCodeNotFile) {
			return Promise.reject(new Error('codeFilename must be an absolute path'));
		}

		return Promise.reject(new Error('filePath must be an absolute path'));
	}

	const isIgnored = await isPathIgnored(stylelint, inputFilePath).catch((err) => {
		if (isCodeNotFile && isPathNotFoundError(err)) return false;

		throw err;
	});

	if (abortSignal?.aborted) {
		throw abortSignal.reason;
	}

	if (isIgnored) {
		return createEmptyPostcssResult(inputFilePath, options.existingPostcssResult);
	}

	const configForFile = await getConfigForFile({
		stylelint,
		searchPath: inputFilePath,
		filePath: inputFilePath,
	});

	if (abortSignal?.aborted) {
		throw abortSignal.reason;
	}

	if (!configForFile) {
		return Promise.reject(new Error('Config file not found'));
	}

	const config = configForFile.config;
	const existingPostcssResult = options.existingPostcssResult;

	if (options.cache) {
		stylelint._fileCache.calcHashOfConfig(config);

		if (options.filePath && !stylelint._fileCache.hasFileChanged(options.filePath)) {
			return createEmptyPostcssResult(inputFilePath, existingPostcssResult);
		}
	}

	const postcssResultEntry = existingPostcssResult
		? { result: existingPostcssResult, code: undefined }
		: await getPostcssResult(stylelint, {
				code: options.code,
				codeFilename: options.codeFilename,
				filePath: inputFilePath,
				customSyntax: config._resolvedCustomSyntax,
			});
	const { result: postcssResult, code } = postcssResultEntry;

	if (abortSignal?.aborted) {
		throw abortSignal.reason;
	}

	const referenceRoots = await stylelint._referenceRootsCache.getRoots(
		config._resolvedReferenceFiles,
	);

	if (abortSignal?.aborted) {
		throw abortSignal.reason;
	}

	let stylelintPostcssResult = Object.assign(postcssResult, {
		stylelint: createStylelintPostcssResult({
			lexer: (await import('./utils/getLexer.mjs')).default(config),
			referenceRoots,
			code,
		}),
	});

	if (existingPostcssResult) {
		// Other plugins hold the root, so a re-parse can't replace it
		await lintPostcssResult(stylelint._options, stylelintPostcssResult, config);
	} else {
		stylelintPostcssResult = await lintInFixPasses(
			stylelint._options,
			stylelintPostcssResult,
			config,
		);
		// `getPostcssResult` caches the entry, so this frees the first pass's result
		postcssResultEntry.result = stylelintPostcssResult;
	}

	if (abortSignal?.aborted) {
		throw abortSignal.reason;
	}

	reportDisables(stylelintPostcssResult);
	needlessDisables(stylelintPostcssResult);
	invalidScopeDisables(stylelintPostcssResult);
	descriptionlessDisables(stylelintPostcssResult);
	reportUnscopedDisables(stylelintPostcssResult);

	return stylelintPostcssResult;
}

/**
 * @returns {Promise<StylelintPostcssResult>}
 */
async function createEmptyStylelintPostcssResult() {
	return {
		...createStylelintPostcssResult({
			lexer: (await import('./utils/getLexer.mjs')).default({}),
			referenceRoots: [],
		}),
		ignored: true,
		stylelintError: false,
		stylelintWarning: false,
	};
}

/**
 * Only `persisted` carries over between passes.
 *
 * @param {Pick<StylelintPostcssResult, 'lexer' | 'referenceRoots' | 'code'> & Partial<Pick<StylelintPostcssResult, 'fixersData'>>} persisted
 * @returns {StylelintPostcssResult}
 */
function createStylelintPostcssResult({ lexer, referenceRoots, code, fixersData = {} }) {
	return {
		ruleSeverities: {},
		customMessages: {},
		customUrls: {},
		ruleMetadata: {},
		fixersData,
		rangesOfComputedEditInfos: [],
		disabledRanges: {},
		lexer,
		referenceRoots,
		postcss,
		code,
	};
}

/**
 * @param {string | undefined} filePath
 * @param {Options['existingPostcssResult']} existingPostcssResult
 * @returns {Promise<PostcssResult>}
 */
async function createEmptyPostcssResult(filePath, existingPostcssResult) {
	return Object.assign(existingPostcssResult ?? postcss().process('', { from: filePath }).sync(), {
		stylelint: await createEmptyStylelintPostcssResult(),
	});
}

/**
 * Reruns the rules until a pass leaves the code unchanged, as a fix can
 * introduce a problem for a rule that already ran.
 *
 * @param {LinterOptions} stylelintOptions
 * @param {PostcssResult} postcssResult
 * @param {Config} config
 * @returns {Promise<PostcssResult>} The last pass's result.
 */
async function lintInFixPasses(stylelintOptions, postcssResult, config) {
	let passResult = postcssResult;
	let { code } = postcssResult.stylelint;

	for (let pass = 1; pass <= MAX_FIX_PASSES; pass++) {
		const fixCount = countFixes(passResult.stylelint.fixersData);

		await lintPostcssResult(stylelintOptions, passResult, config);

		if (countFixes(passResult.stylelint.fixersData) === fixCount) return passResult;

		const fixedCode = passResult.root.toString(passResult.opts.syntax);

		passResult = getFixedPostcssResult(passResult, fixedCode);

		// A further pass would repeat this one
		if (fixedCode === code) break;

		code = fixedCode;
	}

	// The passes stopped with fixes still being made, so report what remains
	await lintPostcssResult(stylelintOptions, passResult, {
		...config,
		fix: false,
		computeEditInfo: false,
	});
	// `lintPostcssResult` stores the config it is given
	passResult.stylelint.config = config;

	return passResult;
}

/**
 * @param {StylelintPostcssResult['fixersData']} fixersData
 * @returns {number}
 */
function countFixes(fixersData) {
	return Object.values(fixersData).reduce((count, ruleFixCount) => count + ruleFixCount, 0);
}

/**
 * Re-parsed, so the source text and positions are those of the fixed code.
 * A new result and `stylelint` object, so plugin state keyed on either lasts one pass.
 *
 * @param {PostcssResult} postcssResult
 * @param {string} fixedCode
 * @returns {PostcssResult}
 */
function getFixedPostcssResult({ opts, stylelint }, fixedCode) {
	return Object.assign(postcss().process(fixedCode, opts).sync(), {
		stylelint: createStylelintPostcssResult(stylelint),
	});
}
