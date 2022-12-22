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

	if (stylelint._options.syntax) {
		let error = 'The "syntax" option is no longer available. ';

		error +=
			stylelint._options.syntax === 'css'
				? 'You can remove the "--syntax" CLI flag as stylelint will now parse files as CSS by default'
				: `You should install an appropriate syntax, e.g. postcss-scss, and use the "customSyntax" option`;

		return Promise.reject(new Error(error));
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

	if (options.codeProcessors && options.codeProcessors.length) {
		if (stylelint._options.fix) {
			console.warn(
				'Autofix is incompatible with processors and will be disabled. Are you sure you need a processor?',
			);
			stylelint._options.fix = false;
		}

		const sourceName = options.code ? options.codeFilename : options.filePath;

		for (const codeProcessor of options.codeProcessors) {
			getCode = codeProcessor(getCode, sourceName);
		}
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

/** @type {{ [key: string]: string }} */
const previouslyInferredExtensions = {
	html: 'postcss-html',
	js: '@stylelint/postcss-css-in-js',
	jsx: '@stylelint/postcss-css-in-js',
	less: 'postcss-less',
	md: 'postcss-markdown',
	sass: 'postcss-sass',
	sss: 'sugarss',
	scss: 'postcss-scss',
	svelte: 'postcss-html',
	ts: '@stylelint/postcss-css-in-js',
	tsx: '@stylelint/postcss-css-in-js',
	vue: 'postcss-html',
	xml: 'postcss-html',
	xst: 'postcss-html',
};

/**
 * @param {StylelintInternalApi} stylelint
 * @param {string|undefined} filePath
 * @returns {Syntax}
 */
function cssSyntax(stylelint, filePath) {
	const fileExtension = filePath ? path.extname(filePath).slice(1).toLowerCase() : '';
	const extensions = ['css', 'pcss', 'postcss'];

	if (previouslyInferredExtensions[fileExtension]) {
		console.warn(
			`${filePath}: When linting something other than CSS, you should install an appropriate syntax, e.g. "${previouslyInferredExtensions[fileExtension]}", and use the "customSyntax" option`,
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
