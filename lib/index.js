'use strict';

const checkAgainstRule = require('./utils/checkAgainstRule');
const createPlugin = require('./createPlugin');
const createStylelint = require('./createStylelint');
const formatters = require('./formatters');
const postcssPlugin = require('./postcssPlugin');
const report = require('./utils/report');
const ruleMessages = require('./utils/ruleMessages');
const rules = require('./rules');
const standalone = require('./standalone');
const validateOptions = require('./utils/validateOptions');

/**
 * @type {import('postcss').PluginCreator<import('stylelint').PostcssPluginOptions> & import('stylelint').StylelintPublicAPI}
 */
module.exports = postcssPlugin;

module.exports.utils = {
	report,
	ruleMessages,
	validateOptions,
	checkAgainstRule,
};

module.exports.lint = standalone;
module.exports.rules = rules;
module.exports.formatters = formatters;
module.exports.createPlugin = createPlugin;
module.exports.createLinter = createStylelint;
