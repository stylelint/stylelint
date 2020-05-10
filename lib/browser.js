'use strict';

const LazyResult = require('postcss/lib/lazy-result');
const postcss = require('postcss');

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

/**
 * @param {StylelintStandaloneOptions} options
 * @returns {Promise<StylelintStandaloneReturnValue>}
 */
async function lint(options) {
	if (!options.code) throw new Error('No code provided');

	if (!options.config) throw new Error('No config provided');

	const postcssOptions = {
		syntax: options.syntax || {
			parse: postcss.parse,
			stringify: postcss.stringify,
		},
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

		throw error;
	}

	return prepareReturnValue([stylelintResult], options, jsonFormatter);
}

module.exports = lint;
