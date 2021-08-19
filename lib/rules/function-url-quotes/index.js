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
	expected: () => 'Expected quotes',
	rejected: () => 'Unexpected quotes',
});

/** @type {import('stylelint').StylelintRule} */
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

				// @ts-expect-error -- Should the message include the function name?
				complain(messages.expected(functionName), node, complaintIndex);
			} else {
				if (!hasQuotes) {
					return;
				}

				// @ts-expect-error -- Should the message include the function name?
				complain(messages.rejected(functionName), node, complaintIndex);
			}
		}

		/**
		 * @param {string} message
		 * @param {import('postcss').Node} node
		 * @param {number} index
		 */
		function complain(message, node, index) {
			report({
				message,
				node,
				index,
				result,
				ruleName,
			});
		}
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
