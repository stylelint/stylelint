'use strict';

const checkAgainstRule = require('./utils/checkAgainstRule');
const createPlugin = require('./createPlugin');
const createStylelint = require('./createStylelint');
const formatters = require('./formatters');
const keywordSets = require('./reference/keywordSets');
const mathFunctions = require('./reference/mathFunctions');
const postcssPlugin = require('./postcssPlugin');
const propertySets = require('./reference/propertySets');
const punctuationSets = require('./reference/punctuationSets');
const report = require('./utils/report');
const ruleMessages = require('./utils/ruleMessages');
const rules = require('./rules');
const shorthandData = require('./reference/shorthandData');
const standalone = require('./standalone');
const validateOptions = require('./utils/validateOptions');
const resolveConfig = require('./resolveConfig');

/** @type {import('stylelint').PublicApi} */
const stylelint = Object.assign(postcssPlugin, {
	lint: standalone,
	rules,
	formatters,
	createPlugin,
	resolveConfig,
	createLinter: createStylelint,
	reference: {
		keywordSets,
		mathFunctions,
		propertySets,
		punctuationSets,
		shorthandData,
	},
	utils: {
		report,
		ruleMessages,
		validateOptions,
		checkAgainstRule,
	},
});

module.exports = stylelint;
