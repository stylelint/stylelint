'use strict';

const LazyResult = require('postcss/lib/lazy-result');
const postcss = require('postcss');

const createPartialStylelintResult = require('./createPartialStylelintResult');
const lintPostcssResult = require('./lintPostcssResult');
const normalizeAllRuleSettings = require('./normalizeAllRuleSettings');

const postcssProcessor = postcss();

/** @typedef {import('stylelint').StylelintStandaloneOptions} StylelintOptions */
/** @typedef {import('stylelint').StylelintStandaloneReturnValue} StylelintStandaloneReturnValue */
/** @typedef {import('stylelint').StylelintResult} StylelintResult */
/** @typedef {import('stylelint').StylelintInternalApi} StylelintInternalApi */

/**
 * @param {Partial<StylelintOptions>} options
 * @returns {Promise<StylelintStandaloneReturnValue>}
 */
async function lint(options) {
	const postcssOptions = {
		syntax: options.syntax || {
			parse: postcss.parse,
			stringify: postcss.stringify,
		},
		from: undefined,
	};

	const result = await new LazyResult(postcssProcessor, options.code, postcssOptions);

	result.stylelint = {};

	const normalizedConfig = normalizeAllRuleSettings(options.config);

	await lintPostcssResult({ _options: {} }, result, normalizedConfig);

	return createPartialStylelintResult(result);
}

module.exports = lint;
