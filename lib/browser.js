'use strict';

const LazyResult = require('postcss/lib/lazy-result');
const postcss = require('postcss');
const postcssSafeParser = require('postcss-safe-parser');

const createPartialStylelintResult = require('./createPartialStylelintResult');
const jsonFormatter = require('./formatters/jsonFormatter');
const lintPostcssResult = require('./lintPostcssResult');
const normalizeAllRuleSettings = require('./normalizeAllRuleSettings');
const prepareReturnValue = require('./prepareReturnValue');

const postcssProcessor = postcss();

/** @typedef {import('stylelint').StylelintStandaloneOptions} StylelintStandaloneOptions */
/** @typedef {import('stylelint').StylelintStandaloneReturnValue} StylelintStandaloneReturnValue */
/** @typedef {import('stylelint').StylelintResult} StylelintResult */
/** @typedef {import('stylelint').StylelintInternalApi} StylelintInternalApi */
/** @typedef {import('postcss').Syntax} Syntax */

/** TODO: create new type that's a subset of StylelintStandaloneOptions */
/**
 * @param {StylelintStandaloneOptions} options
 * @returns {Promise<StylelintStandaloneReturnValue>}
 */
async function lint(options) {
	if (!options.code) {
		throw new Error(
			`"options.code" is missing. You must provide a string value in "options.code".`,
		);
	}

	if (!options.config) {
		throw new Error(
			`"options.config" is missing. You must provide a config object in "options.config".`,
		);
	}

	if (options.formatter) {
		throw new Error(
			`"options.formatter" is not supported for stylelint's browser bundle. Remove the formatter option or try the standalone version of stylelint. TODO: link here?`,
		);
	}

	if (options.syntax) {
		throw new Error(
			`"options.syntax" is not supported for stylelint's browser bundle. You must load a syntax and pass it in to "options.customSyntax". Refer to the stylelint browser bundle docs for more info. TODO: url here`,
		);
	}

	if (options.config.plugins) {
		throw new Error(
			`"options.config.plugins" is not supported for stylelint's browser bundle. Remove the plugins from your config or try the standalone version of stylelint. TODO: url here`,
		);
	}

	// TODO: more input validation? check for other options that aren't supported here

	const syntax = syntaxFromOptions(options);

	const postcssOptions = {
		syntax,
		from: undefined,
	};

	let cssResult;
	let stylelintResult /** @type StylelintResult */;

	try {
		const lazyResult = await new LazyResult(postcssProcessor, options.code, postcssOptions);

		cssResult = Object.assign(lazyResult, {
			stylelint: {
				ruleSeverities: {},
				customMessages: {},
				disabledRanges: {},
			},
		});

		const normalizedConfig = normalizeAllRuleSettings(options.config);

		await lintPostcssResult(options, cssResult, normalizedConfig);

		stylelintResult = createPartialStylelintResult(cssResult);
	} catch (error) {
		// This is equivalent to the `handleError` function in standalone.js
		if (error.name === 'CssSyntaxError') {
			stylelintResult = createPartialStylelintResult(undefined, error);
		} else {
			throw error;
		}
	}

	// TODO: this is mostly the same in standalone.js. Extract out?
	const postcssResult = stylelintResult._postcssResult;
	const returnValue = prepareReturnValue([stylelintResult], options, jsonFormatter);

	if (options.fix && postcssResult && !postcssResult.stylelint.ignored) {
		if (!postcssResult.stylelint.disableWritingFix) {
			// If we're fixing, the output should be the fixed code
			// @ts-ignore note: ts complaining that .root might not exist
			returnValue.output = postcssResult.root.toString(syntax);
		} else {
			// If the writing of the fix is disabled, the input code is returned as-is
			returnValue.output = options.code;
		}
	}

	return returnValue;
}

/**
 * @param {StylelintStandaloneOptions} options
 * @returns {Syntax}
 */
function syntaxFromOptions(options) {
	const { customSyntax, fix } = options;

	if (!customSyntax)
		return {
			parse: fix ? postcssSafeParser : postcss.parse,
			stringify: postcss.stringify,
		};

	if (
		customSyntax &&
		typeof customSyntax === 'object' &&
		typeof customSyntax.parse == 'function' &&
		typeof customSyntax.stringify == 'function'
	) {
		return customSyntax;
	}

	throw new Error(
		`Provided customSyntax is invalid. You must provide an object containing 'parse' and 'stringify' methods. TODO docs link?`,
	);
}

module.exports = { lint };
