'use strict';

const LazyResult = require('postcss/lib/lazy-result').default;
const path = require('path');
const { default: postcss } = require('postcss');
const { promises: fs } = require('fs');

/** @typedef {import('postcss').Result} Result */
/** @typedef {import('postcss').Syntax} Syntax */
/** @typedef {import('stylelint').CustomSyntax} CustomSyntax */
/** @typedef {import('stylelint').GetPostcssOptions} GetPostcssOptions */
/** @typedef {import('stylelint').StylelintInternalApi} StylelintInternalApi */

const commonErrorMessages = {
	noConfig: (name) => `Install "postcss-${name}" and use the "customSyntax" option`,
	hasConfig: (name) =>
		`Extend "stylelint-config-standard-${name}" or install "postcss-${name}" and use the "customSyntax" option directly`,
	sugarss: () => `Install "sugarss" and use the "customSyntax" option`,
	cssInJs: () =>
		`Install an appropriate syntax, e.g. postcss-styled-components, and use the "customSyntax" option`,
};

const postcssProcessor = postcss();

/**
 * @param {StylelintInternalApi} stylelint
 * @param {GetPostcssOptions} options
 *
 * @returns {Promise<Result>}
 */
module.exports = async function getPostcssResult(stylelint, options = {}) {
	const cached = options.filePath ? stylelint._postcssResultCache.get(options.filePath) : undefined;

	if (cached) {
		return cached;
	}

	if (stylelint._options.syntax) {
		let error = 'The "syntax" option has been removed';

		switch (stylelint._options.syntax) {
			case 'css':
				error +=
					'. Remove the "--syntax" CLI flag as stylelint will now parse files as CSS by default';
				break;
			case 'html':
			case 'markdown':
			case 'sass':
				error += `. ${commonErrorMessages.noConfig(stylelint._options.syntax)}`;
				break;
			case 'less':
			case 'scss':
				error += `. ${commonErrorMessages.hasConfig(stylelint._options.syntax)}`;
				break;
			case 'sugarss':
				error += `. ${commonErrorMessages.sugarss()}`;
				break;
			case 'css-in-js':
				error += `. ${commonErrorMessages.cssInJs()}`;
				break;
			default:
				error += '. Install an appropriate syntax and use the "customSyntax" option instead';
		}

		return Promise.reject(new Error(error));
	}

	const syntax = options.customSyntax
		? getCustomSyntax(options.customSyntax)
		: cssSyntax(stylelint, options.filePath);

	const postcssOptions = {
		from: options.filePath,
		syntax,
	};

	/** @type {string | undefined} */
	let getCode;

	if (options.code !== undefined) {
		getCode = options.code;
	} else if (options.filePath) {
		getCode = await fs.readFile(options.filePath, 'utf8');
	}

	if (getCode === undefined) {
		return Promise.reject(new Error('code or filePath required'));
	}

	if (options.codeProcessors && options.codeProcessors.length) {
		if (stylelint._options.fix) {
			console.warn(
				'Autofix is incompatible with processors and will be disabled. Are you sure you need a processor?',
			);
			stylelint._options.fix = false;
		}

		const sourceName = options.code ? options.codeFilename : options.filePath;

		options.codeProcessors.forEach((codeProcessor) => {
			getCode = codeProcessor(getCode, sourceName);
		});
	}

	const postcssResult = await new LazyResult(postcssProcessor, getCode, postcssOptions);

	if (options.filePath) {
		stylelint._postcssResultCache.set(options.filePath, postcssResult);
	}

	return postcssResult;
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
				`Cannot resolve custom syntax module "${customSyntax}". Check that module "${customSyntax}" is available and spelled correctly.`,
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
 * @param {StylelintInternalApi} stylelint
 * @param {string|undefined} filePath
 * @returns {Syntax}
 */
function cssSyntax(stylelint, filePath) {
	const fileExtension = filePath
		? path
				.extname(filePath || '')
				.slice(1)
				.toLowerCase()
		: '';

	const extensions = ['css', 'pcss', 'postcss'];

	switch (fileExtension) {
		case 'html':
		case 'markdown':
		case 'sass':
			console.warn(`${commonErrorMessages.noConfig(fileExtension)}`);
			break;
		case 'md':
			console.warn(`${commonErrorMessages.noConfig('markdown')}`);
			break;
		case 'less':
		case 'scss':
			console.warn(`${commonErrorMessages.hasConfig(fileExtension)}`);
			break;
		case 'sugarss':
			console.warn(`${commonErrorMessages.sugarss()}`);
			break;
		case 'js':
		case 'ts':
		case 'jsx':
		case 'tsx':
			console.warn(`${commonErrorMessages.cssInJs()}`);
			break;
	}

	return {
		parse:
			stylelint._options.fix && extensions.includes(fileExtension)
				? require('postcss-safe-parser')
				: postcss.parse,
		stringify: postcss.stringify,
	};
}
