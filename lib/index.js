'use strict';

const checkAgainstRule = require('./utils/checkAgainstRule');
const createPlugin = require('./createPlugin');
const createStylelint = require('./createStylelint');
const formatters = require('./formatters');
const postcssPlugin = require('./postcssPlugin');
const report = require('./utils/report');
const resolveConfig = require('./resolveConfig');
const ruleMessages = require('./utils/ruleMessages');
const rules = require('./rules');
const { longhandSubPropertiesOfShorthandProperties } = require('./reference/properties');
const standalone = require('./standalone');
const validateOptions = require('./utils/validateOptions');

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
