// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const checkAgainstRule = require('./utils/checkAgainstRule.cjs');
const createPlugin = require('./createPlugin.cjs');
const createStylelint = require('./createStylelint.cjs');
const index$1 = require('./formatters/index.cjs');
const properties = require('./reference/properties.cjs');
const postcssPlugin = require('./postcssPlugin.cjs');
const report = require('./utils/report.cjs');
const resolveConfig = require('./resolveConfig.cjs');
const ruleMessages = require('./utils/ruleMessages.cjs');
const index = require('./rules/index.cjs');
const standalone = require('./standalone.cjs');
const validateOptions = require('./utils/validateOptions.cjs');

/** @type {import('stylelint').PublicApi} */
const stylelint = Object.assign(postcssPlugin, {
	lint: standalone,
	rules: index,
	formatters: index$1,
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
		longhandSubPropertiesOfShorthandProperties: properties.longhandSubPropertiesOfShorthandProperties,
	},
});

// TODO: This comment is just for testing. Please remove it.

module.exports = stylelint;
