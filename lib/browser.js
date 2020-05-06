'use strict';

const LazyResult = require('postcss/lib/lazy-result');
const postcss = require('postcss');

const createStylelintResult = require('./createStylelintResult');

const lintPostcssResult = require('./lintPostcssResult');
const normalizeAllRuleSettings = require('./normalizeAllRuleSettings');

const postcssProcessor = postcss();

/** @typedef {import('stylelint').StylelintStandaloneOptions} StylelintOptions */
/** @typedef {import('stylelint').StylelintStandaloneReturnValue} StylelintStandaloneReturnValue */
/** @typedef {import('stylelint').StylelintResult} StylelintResult */
/** @typedef {import('stylelint').StylelintInternalApi} StylelintInternalApi */

/**
 * @param {StylelintOptions} options
 * @returns {Promise<StylelintStandaloneReturnValue>}
 */
async function lint(options) {
	// text, config, parser = null
	const text = options.code || '';
	const config = options.config || {};

	const syntax = options.syntax || {
		parse: postcss.parse,
		stringify: postcss.stringify,
	};

	const postcssOptions = {
		syntax,
		from: undefined,
	};

	// TODO: why create a LazyResult here? Why not use postcss.process()?
	const result = await new LazyResult(postcssProcessor, text, postcssOptions);

	result.stylelint = {};

	const normalizedConfig = normalizeAllRuleSettings(config);

	await lintPostcssResult({ _options: {} }, result, normalizedConfig);

	/** @type {Partial<StylelintInternalApi>} */
	const stylelintStub = {
		getConfigForFile: () => Promise.resolve({ config }),
	};

	return createStylelintResult(stylelintStub, result);
}

module.exports = lint;
