'use strict';

const fs = require('fs');
const LazyResult = require('postcss/lib/lazy-result');
const postcss = require('postcss');
const syntaxes = require('./syntaxes');

/** @typedef {import('stylelint').StylelintInternalApi} StylelintInternalApi */
/** @typedef {{parse: any, stringify: any}} Syntax */

const postcssProcessor = postcss();

/**
 * @param {StylelintInternalApi} stylelint
 * @param {import('stylelint').GetPostcssOptions} options
 *
 * @returns {Promise<import('postcss').Result>}
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
				try {
					// TODO TYPES determine which type has customSyntax
					const customSyntax = /** @type {any} */ require(stylelint._options.customSyntax);

					/*
					 * PostCSS allows for syntaxes that only contain a parser, however,
					 * it then expects the syntax to be set as the `parser` option rather than `syntax`.
					 */
					if (!customSyntax.parse) {
						syntax = {
							parse: customSyntax,
							stringify: postcss.stringify,
						};
					} else {
						syntax = customSyntax;
					}
				} catch (e) {
					throw new Error(`Cannot resolve custom syntax module ${stylelint._options.customSyntax}`);
				}
			} else if (stylelint._options.syntax) {
				if (stylelint._options.syntax === 'css') {
					syntax = cssSyntax(stylelint);
				} else {
					const keys = Object.keys(syntaxes);

					if (!keys.includes(stylelint._options.syntax)) {
						throw new Error(
							`You must use a valid syntax option, either: css, ${keys
								.slice(0, -1)
								.join(', ')} or ${keys.slice(-1)}`,
						);
					}

					syntax = syntaxes[stylelint._options.syntax];
				}
			} else if (!(options.codeProcessors && options.codeProcessors.length)) {
				const autoSyntax = require('postcss-syntax');

				// TODO: investigate why lazy import HTML syntax causes
				// JS files with the word "html" to throw TypeError
				// https://github.com/stylelint/stylelint/issues/4793
				const { html, ...rest } = syntaxes;

				syntax = autoSyntax({
					css: cssSyntax(stylelint),
					jsx: syntaxes['css-in-js'],
					...rest,
				});
			}

			const postcssOptions = {
				from: options.filePath,
				syntax,
			};

			const source = options.code ? options.codeFilename : options.filePath;
			let preProcessedCode = code;

			if (options.codeProcessors && options.codeProcessors.length) {
				if (stylelint._options.fix) {
					// eslint-disable-next-line no-console
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
 * @returns {Syntax}
 */
function cssSyntax(stylelint) {
	return {
		parse: stylelint._options.fix ? require('postcss-safe-parser') : postcss.parse,
		stringify: postcss.stringify,
	};
}
