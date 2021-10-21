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

/** @type {import('stylelint').PublicApi} */
const stylelint = Object.assign(postcssPlugin, {
	lint: standalone,
	rules,
	formatters,
	createPlugin,
	createLinter: createStylelint,
	utils: {
		report,
		ruleMessages,
		validateOptions,
		checkAgainstRule,
	},
});

module.exports = stylelint;
