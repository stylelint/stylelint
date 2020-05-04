'use strict';

const LazyResult = require('postcss/lib/lazy-result');
const postcss = require('postcss');

const createStylelintResult = require('../lib/createStylelintResult');
const jsonFormatter = require('../lib/formatters/jsonFormatter');
const lintPostcssResult = require('../lib/lintPostcssResult');
const normalizeRuleSettings = require('../lib/normalizeRuleSettings');

const postcssProcessor = postcss();

async function lint(text, config, parser = null) {
	const syntax = parser || {
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

	const formattedResult = await formatResult(result, config);

	return formattedResult;
}

async function formatResult(result, config) {
	const stylelintStub = {
		getConfigForFile: () => Promise.resolve({ config }),
	};
	const res = await createStylelintResult(stylelintStub, result);
	const formatted = jsonFormatter([res]);

	return formatted;
}

// // Run normalizeRuleSettings on all rules in the config
function normalizeAllRuleSettings(config) {
	let normalizedRules = {};

	Object.entries(config.rules).forEach(([ruleName, ruleSettings]) => {
		normalizedRules[ruleName] = normalizeRuleSettings(ruleSettings, ruleName);
	});

	return { ...config, rules: normalizedRules };
}

module.exports = lint;
