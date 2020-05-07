'use strict';

const LazyResult = require('postcss/lib/lazy-result');
const postcss = require('postcss');

const createPartialStylelintResult = require('./createPartialStylelintResult');
const lintPostcssResult = require('./lintPostcssResult');
const normalizeAllRuleSettings = require('./normalizeAllRuleSettings');

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

	const lazyResult = await new LazyResult(postcssProcessor, options.code, postcssOptions);

	const result = Object.assign(lazyResult, {
		stylelint: {
			ruleSeverities: {},
			customMessages: {},
			disabledRanges: {},
		},
	});

	const normalizedConfig = normalizeAllRuleSettings(options.config);

	await lintPostcssResult(options, result, normalizedConfig);

	const browserResult = createPartialStylelintResult(result);

	return browserResult;
}

module.exports = lint;
