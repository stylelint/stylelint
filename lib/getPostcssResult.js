'use strict';

const fs = require('fs');
const LazyResult = require('postcss/lib/lazy-result');
const path = require('path');
const postcss = require('postcss');

/** @typedef {import('postcss').Result} Result */
/** @typedef {import('postcss').Syntax} Syntax */
/** @typedef {import('stylelint').CustomSyntax} CustomSyntax */
/** @typedef {import('stylelint').GetPostcssOptions} GetPostcssOptions */
/** @typedef {import('stylelint').StylelintInternalApi} StylelintInternalApi */

const postcssProcessor = postcss();

/**
 * @param {StylelintInternalApi} stylelint
 * @param {GetPostcssOptions} options
 *
 * @returns {Promise<Result>}
 */
module.exports = function (stylelint, options = {}) {
	const cached = options.filePath ? stylelint._postcssResultCache.get(options.filePath) : undefined;

	if (cached) return Promise.resolve(cached);

	/** @type {Promise<string> | undefined} */
	let getCode;

	if (options.code !== undefined) {
		getCode = Promise.resolve(options.code);
	} else if (options.filePath) {
		getCode = readFile(options.filePath);
	}

	if (!getCode) {
		throw new Error('code or filePath required');
	}

	return getCode
		.then((code) => {
			/** @type {Syntax | null} */
			let syntax = null;

			if (stylelint._options.customSyntax) {
				syntax = getCustomSyntax(stylelint._options.customSyntax);
			} else {
				syntax = cssSyntax(stylelint, options.filePath);
			}

			const postcssOptions = {
				from: options.filePath,
				syntax,
			};

			const source = options.code ? options.codeFilename : options.filePath;
			let preProcessedCode = code;

			if (options.codeProcessors && options.codeProcessors.length) {
				if (stylelint._options.fix) {
					console.warn(
						'Autofix is incompatible with processors and will be disabled. Are you sure you need a processor?',
					);
					stylelint._options.fix = false;
				}

				options.codeProcessors.forEach((codeProcessor) => {
					preProcessedCode = codeProcessor(preProcessedCode, source);
				});
			}

			const result = new LazyResult(postcssProcessor, preProcessedCode, postcssOptions);

			return result;
		})
		.then((postcssResult) => {
			if (options.filePath) {
				stylelint._postcssResultCache.set(options.filePath, postcssResult);
			}

			return postcssResult;
		});
};

/**
 * @param {CustomSyntax} customSyntax
 * @returns {Syntax}
 */
function getCustomSyntax(customSyntax) {
	let resolved;

	if (typeof customSyntax === 'string') {
		try {
			resolved = require(customSyntax);
		} catch {
			throw new Error(
				`Cannot resolve custom syntax module ${customSyntax}. Check that module ${customSyntax} is available and spelled correctly.`,
			);
		}

		/*
		 * PostCSS allows for syntaxes that only contain a parser, however,
		 * it then expects the syntax to be set as the `parse` option.
		 */
		if (!resolved.parse) {
			resolved = {
				parse: resolved,
				stringify: postcss.stringify,
			};
		}

		return resolved;
	}

	if (typeof customSyntax === 'object') {
		if (typeof customSyntax.parse === 'function') {
			resolved = { ...customSyntax };
		} else {
			throw new TypeError(
				`An object provided to the "customSyntax" option must have a "parse" property. Ensure the "parse" property exists and its value is a function.`,
			);
		}

		return resolved;
	}

	throw new Error(`Custom syntax must be a string or a Syntax object`);
}

/**
 * @param {string} filePath
 * @returns {Promise<string>}
 */
function readFile(filePath) {
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, 'utf8', (err, content) => {
			if (err) {
				return reject(err);
			}

			resolve(content);
		});
	});
}

/**
 * @param {StylelintInternalApi} stylelint
 * @param {string|undefined} filePath
 * @returns {Syntax}
 */
function cssSyntax(stylelint, filePath) {
	let fileExtension = '';

	if (filePath) {
		fileExtension = path
			.extname(filePath || '')
			.slice(1)
			.toLowerCase();
	}

	const extensions = ['css', 'pcss', 'postcss'];

	return {
		parse:
			stylelint._options.fix && extensions.includes(fileExtension)
				? require('postcss-safe-parser')
				: postcss.parse,
		stringify: postcss.stringify,
	};
}
