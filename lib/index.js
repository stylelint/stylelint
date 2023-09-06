'use strict';

const checkAgainstRule = require('./utils/checkAgainstRule.cjs');
const createPlugin = require('./createPlugin.cjs');
const createStylelint = require('./createStylelint.cjs');
const formatters = require('./formatters/index.cjs');
const postcssPlugin = require('./postcssPlugin.js');
const report = require('./utils/report.cjs');
const resolveConfig = require('./resolveConfig.cjs');
const ruleMessages = require('./utils/ruleMessages.cjs');
const rules = require('./rules/index.cjs');
const { longhandSubPropertiesOfShorthandProperties } = require('./reference/properties.cjs');
const standalone = require('./standalone.cjs');
const validateOptions = require('./utils/validateOptions.cjs');

/** @type {import('stylelint')} */
const stylelint = Object.assign(postcssPlugin, {
	lint: standalone,
	rules,
	formatters,
	createPlugin,
	resolveConfig,
	_createLinter: createStylelint,
	utils: {
		report,
		ruleMessages,
		validateOptions,
		checkAgainstRule,
	},
	reference: {
		longhandSubPropertiesOfShorthandProperties,
	},
});

module.exports = stylelint;
