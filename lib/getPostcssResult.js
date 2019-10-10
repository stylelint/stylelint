/* @flow */
'use strict';

const dynamicRequire = require('./dynamicRequire');
const fs = require('fs');
const LazyResult = require('postcss/lib/lazy-result');
const postcss = require('postcss');
let autoSyntax = null;

const postcssProcessor = postcss();

module.exports = function(stylelint /*: stylelint$internalApi*/) /*: Promise<?Object>*/ {
	const options /*: {
    code?: string,
    codeFilename?: string,
    filePath?: string,
    codeProcessors?: Array<Function>,
    syntax?: stylelint$syntaxes,
    customSyntax?: string
  }*/ =
		arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	const cached /*: ?postcss$result*/ = stylelint._postcssResultCache.get(options.filePath);

	if (cached) return Promise.resolve(cached);

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
			const customSyntax = stylelint._options.customSyntax;
			let syntax = stylelint._options.syntax;

			if (customSyntax) {
				try {
					syntax = dynamicRequire(customSyntax);
				} catch (e) {
					throw new Error(`Cannot resolve custom syntax module ${customSyntax}`);
				}

				/*
				 * PostCSS allows for syntaxes that only contain a parser, however,
				 * it then expects the syntax to be set as the `parser` option rather than `syntax`.
				 */
				if (!syntax.parse) {
					syntax = {
						parse: syntax,
						stringify: postcss.stringify,
					};
				}
			} else if (syntax === 'css') {
				syntax = cssSyntax(stylelint);
			} else if (syntax) {
				const syntaxes = {
					'css-in-js': 'postcss-jsx',
					html: 'postcss-html',
					less: 'postcss-less',
					markdown: 'postcss-markdown',
					sass: 'postcss-sass',
					scss: 'postcss-scss',
					sugarss: 'sugarss',
				};

				syntax = syntaxes[syntax];

				if (!syntax) {
					throw new Error(
						'You must use a valid syntax option, either: css, css-in-js, html, less, markdown, sass, scss, or sugarss',
					);
				}

				syntax = dynamicRequire(syntax);
			} else if (
				!(options.codeProcessors && options.codeProcessors.length) ||
				(options.filePath && /\.(scss|sass|less)$/.test(options.filePath))
			) {
				if (!autoSyntax) {
					autoSyntax = require('postcss-syntax');
				}

				syntax = autoSyntax({
					css: cssSyntax(stylelint),
				});
			}

			const postcssOptions /*: postcss$options*/ = {
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
			stylelint._postcssResultCache.set(options.filePath, postcssResult);

			return postcssResult;
		});
};

function readFile(filePath /*: string*/) /*: Promise<string>*/ {
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, 'utf8', (err, content) => {
			if (err) {
				return reject(err);
			}

			resolve(content);
		});
	});
}

function cssSyntax(stylelint) {
	return {
		parse: stylelint._options.fix ? dynamicRequire('postcss-safe-parser') : postcss.parse,
		stringify: postcss.stringify,
	};
}
