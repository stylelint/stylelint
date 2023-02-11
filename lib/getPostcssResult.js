'use strict';

const LazyResult = require('postcss/lib/lazy-result').default;
const path = require('path');
const { default: postcss } = require('postcss');
const { promises: fs } = require('fs');

const getModulePath = require('./utils/getModulePath');

/** @typedef {import('postcss').Result} Result */
/** @typedef {import('postcss').Syntax} Syntax */
/** @typedef {import('stylelint').CustomSyntax} CustomSyntax */
/** @typedef {import('stylelint').GetPostcssOptions} GetPostcssOptions */
/** @typedef {import('stylelint').InternalApi} StylelintInternalApi */

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

	const syntax = options.customSyntax
		? getCustomSyntax(options.customSyntax, stylelint._options.configBasedir)
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

	const postcssResult = await new LazyResult(postcssProcessor, getCode, postcssOptions);

	if (options.filePath) {
		stylelint._postcssResultCache.set(options.filePath, postcssResult);
	}

	return postcssResult;
};

/**
 * @param {CustomSyntax} customSyntax
 * @param {string | undefined} basedir
 * @returns {Syntax}
 */
function getCustomSyntax(customSyntax, basedir) {
	if (typeof customSyntax === 'string') {
		const customSyntaxLookup = basedir ? getModulePath(basedir, customSyntax) : customSyntax;

		let resolved;

		try {
			resolved = require(customSyntaxLookup);
		} catch (error) {
			if (
				error &&
				typeof error === 'object' &&
				'code' in error &&
				error.code === 'MODULE_NOT_FOUND' &&
				'message' in error &&
				typeof error.message === 'string' &&
				error.message.includes(customSyntax)
			) {
				throw new Error(
					`Cannot resolve custom syntax module "${customSyntax}". Check that module "${customSyntax}" is available and spelled correctly.\n\nCaused by: ${error}`,
				);
			}

			throw error;
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
			return { ...customSyntax };
		}

		throw new TypeError(
			'An object provided to the "customSyntax" option must have a "parse" property. Ensure the "parse" property exists and its value is a function.',
		);
	}

	throw new Error('Custom syntax must be a string or a Syntax object');
}

/**
 * @param {StylelintInternalApi} stylelint
 * @param {string|undefined} filePath
 * @returns {Syntax}
 */
function cssSyntax(stylelint, filePath) {
	const fileExtension = filePath ? path.extname(filePath).slice(1).toLowerCase() : '';
	const extensions = ['css', 'pcss', 'postcss'];

	if (fileExtension && !extensions.includes(fileExtension)) {
		console.warn(
			`${filePath}: you should use the "customSyntax" option when linting something other than CSS`,
		);
	}

	return {
		parse:
			stylelint._options.fix && extensions.includes(fileExtension)
				? require('postcss-safe-parser')
				: postcss.parse,
		stringify: postcss.stringify,
	};
}
