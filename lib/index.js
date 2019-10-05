'use strict';

const checkAgainstRule = require('./utils/checkAgainstRule');
const createPlugin = require('./createPlugin');
const createRuleTester = require('./testUtils/createRuleTester');
const createStylelint = require('./createStylelint');
const formatters = require('./formatters');
const postcssPlugin = require('./postcssPlugin');
const report = require('./utils/report');
const requireRule = require('./requireRule');
const ruleMessages = require('./utils/ruleMessages');
const rules = require('./rules');
const standalone = require('./standalone');
const validateOptions = require('./utils/validateOptions');

const api = /**
 * @type {import('postcss').Plugin<unknown> & {
		utils: {
			report: import('./utils/report'),
			ruleMessages: import('./utils/ruleMessages'),
			validateOptions: import('./utils/validateOptions'),
			checkAgainstRule: import('./utils/checkAgainstRule')
		},
		lint: import('./standalone'),
		rules: {[k: string]: Function},
		formatters: import('./formatters/index'),
		createPlugin: import('./createPlugin'),
		createRuleTester: import('./testUtils/createRuleTester'),
		createLinter: import('./createStylelint')
  }}
 */ (postcssPlugin);

const requiredRules = rules.reduce(
	(acc, cur) => {
		acc[cur] = requireRule(cur);

		return acc;
	},
	/** @type {{[k: string]: Function}} */ ({}),
);

api.utils = {
	report,
	ruleMessages,
	validateOptions,
	checkAgainstRule,
};

api.lint = standalone;
api.rules = requiredRules;
api.formatters = formatters;
api.createPlugin = createPlugin;
api.createRuleTester = createRuleTester;
api.createLinter = createStylelint;

module.exports = api;
