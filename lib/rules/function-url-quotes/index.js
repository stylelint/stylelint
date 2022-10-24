'use strict';

const atRuleParamIndex = require('../../utils/atRuleParamIndex');
const functionArgumentsSearch = require('../../utils/functionArgumentsSearch');
const isStandardSyntaxUrl = require('../../utils/isStandardSyntaxUrl');
const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'function-url-quotes';

const messages = ruleMessages(ruleName, {
	expected: (functionName) => `Expected quotes around "${functionName}" function argument`,
	rejected: (functionName) => `Unexpected quotes around "${functionName}" function argument`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/function-url-quotes',
};

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
				possible: ['always', 'never'],
			},
			{
				actual: secondaryOptions,
				possible: {
					except: ['empty'],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		root.walkAtRules(checkAtRuleParams);
		root.walkDecls(checkDeclParams);

		/**
		 * @param {import('postcss').Declaration} decl
		 */
		function checkDeclParams(decl) {
			functionArgumentsSearch(decl.toString().toLowerCase(), 'url', (args, index) => {
				checkArgs(args, decl, index, 'url');
			});
		}

		/**
		 * @param {import('postcss').AtRule} atRule
		 */
		function checkAtRuleParams(atRule) {
			const atRuleParamsLowerCase = atRule.params.toLowerCase();

			functionArgumentsSearch(atRuleParamsLowerCase, 'url', (args, index) => {
				checkArgs(args, atRule, index + atRuleParamIndex(atRule), 'url');
			});
			functionArgumentsSearch(atRuleParamsLowerCase, 'url-prefix', (args, index) => {
				checkArgs(args, atRule, index + atRuleParamIndex(atRule), 'url-prefix');
			});
			functionArgumentsSearch(atRuleParamsLowerCase, 'domain', (args, index) => {
				checkArgs(args, atRule, index + atRuleParamIndex(atRule), 'domain');
			});
		}

		/**
		 * @param {string} args
		 * @param {import('postcss').Node} node
		 * @param {number} index
		 * @param {string} functionName
		 */
		function checkArgs(args, node, index, functionName) {
			let shouldHasQuotes = primary === 'always';

			const leftTrimmedArgs = args.trimStart();

			if (!isStandardSyntaxUrl(leftTrimmedArgs)) {
				return;
			}

			const complaintIndex = index + args.length - leftTrimmedArgs.length;
			const complaintEndIndex = index + args.length;
			const hasQuotes = leftTrimmedArgs.startsWith("'") || leftTrimmedArgs.startsWith('"');

			const trimmedArg = args.trim();
			const isEmptyArgument = ['', "''", '""'].includes(trimmedArg);

			if (optionsMatches(secondaryOptions, 'except', 'empty') && isEmptyArgument) {
				shouldHasQuotes = !shouldHasQuotes;
			}

			if (shouldHasQuotes) {
				if (hasQuotes) {
					return;
				}

				complain(messages.expected(functionName), node, complaintIndex, complaintEndIndex);
			} else {
				if (!hasQuotes) {
					return;
				}

				complain(messages.rejected(functionName), node, complaintIndex, complaintEndIndex);
			}
		}

		/**
		 * @param {string} message
		 * @param {import('postcss').Node} node
		 * @param {number} index
		 * @param {number} endIndex
		 */
		function complain(message, node, index, endIndex) {
			report({
				message,
				node,
				index,
				endIndex,
				result,
				ruleName,
			});
		}
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
