'use strict';

const isPathNotFoundError = require('./utils/isPathNotFoundError');
const lintPostcssResult = require('./lintPostcssResult');
const path = require('path');

/** @typedef {import('stylelint').InternalApi} StylelintInternalApi */
/** @typedef {import('stylelint').GetLintSourceOptions} Options */
/** @typedef {import('postcss').Result} Result */
/** @typedef {import('stylelint').PostcssResult} PostcssResult */
/** @typedef {import('stylelint').StylelintPostcssResult} StylelintPostcssResult */

/**
 * Run stylelint on a PostCSS Result, either one that is provided
 * or one that we create
 * @param {StylelintInternalApi} stylelint
 * @param {Options} options
 * @returns {Promise<PostcssResult>}
 */
module.exports = async function lintSource(stylelint, options = {}) {
	if (!options.filePath && options.code === undefined && !options.existingPostcssResult) {
		return Promise.reject(new Error('You must provide filePath, code, or existingPostcssResult'));
	}

	const isCodeNotFile = options.code !== undefined;

	const inputFilePath = isCodeNotFile ? options.codeFilename : options.filePath;

	if (inputFilePath !== undefined && !path.isAbsolute(inputFilePath)) {
		if (isCodeNotFile) {
			return Promise.reject(new Error('codeFilename must be an absolute path'));
		}

		return Promise.reject(new Error('filePath must be an absolute path'));
	}

	const isIgnored = await stylelint.isPathIgnored(inputFilePath).catch((err) => {
		if (isCodeNotFile && isPathNotFoundError(err)) return false;

		throw err;
	});

	if (isIgnored) {
		return options.existingPostcssResult
			? Object.assign(options.existingPostcssResult, {
					stylelint: createEmptyStylelintPostcssResult(),
			  })
			: createEmptyPostcssResult(inputFilePath);
	}

	const configSearchPath = stylelint._options.configFile || inputFilePath;

	const configForFile = await stylelint
		.getConfigForFile(configSearchPath, inputFilePath)
		.catch((err) => {
			if (isCodeNotFile && isPathNotFoundError(err))
				return stylelint.getConfigForFile(process.cwd());

			throw err;
		});

	if (!configForFile) {
		return Promise.reject(new Error('Config file not found'));
	}

	const config = configForFile.config;
	const existingPostcssResult = options.existingPostcssResult;
	const stylelintResult = {
		ruleSeverities: {},
		customMessages: {},
		disabledRanges: {},
	};

	const postcssResult =
		existingPostcssResult ||
		(await stylelint._getPostcssResult({
			code: options.code,
			codeFilename: options.codeFilename,
			filePath: inputFilePath,
			codeProcessors: config.codeProcessors,
			customSyntax: config.customSyntax,
		}));

	const stylelintPostcssResult = Object.assign(postcssResult, {
		stylelint: stylelintResult,
	});

	await lintPostcssResult(stylelint._options, stylelintPostcssResult, config);

	return stylelintPostcssResult;
};

/**
 * @returns {StylelintPostcssResult}
 */
function createEmptyStylelintPostcssResult() {
	return {
		ruleSeverities: {},
		customMessages: {},
		disabledRanges: {},
		ignored: true,
		stylelintError: false,
	};
}

/**
 * @param {string} [filePath]
 * @returns {PostcssResult}
 */
function createEmptyPostcssResult(filePath) {
	return {
		root: {
			source: {
				input: { file: filePath },
			},
		},
		messages: [],
		opts: undefined,
		stylelint: createEmptyStylelintPostcssResult(),
		warn: () => {},
	};
}
