'use strict';

const atRuleParamIndex = require('../../utils/atRuleParamIndex');
const declarationValueIndex = require('../../utils/declarationValueIndex');
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
	fixable: true,
};

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions, context) => {
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
			functionArgumentsSearch(decl.toString(), /^url$/i, (args, index) => {
				checkArgs(args, decl, index, 'url');
			});
		}

		/**
		 * @param {import('postcss').AtRule} atRule
		 */
		function checkAtRuleParams(atRule) {
			functionArgumentsSearch(atRule.params, /^url$/i, (args, index) => {
				checkArgs(args, atRule, index + atRuleParamIndex(atRule), 'url');
			});
			functionArgumentsSearch(atRule.params, /^url-prefix$/i, (args, index) => {
				checkArgs(args, atRule, index + atRuleParamIndex(atRule), 'url-prefix');
			});
			functionArgumentsSearch(atRule.params, /^domain$/i, (args, index) => {
				checkArgs(args, atRule, index + atRuleParamIndex(atRule), 'domain');
			});
		}

		/**
		 * @param {import('postcss').AtRule} node
		 * @param {string} args
		 * @param {number} index
		 */
		function addQuotesForAtRule(node, args, index) {
			const fixedName = `"${args}"`;
			const openIndex = index - atRuleParamIndex(node);
			const closeIndex = openIndex + args.length;

			node.params =
				node.params.substring(0, openIndex) + fixedName + node.params.substring(closeIndex);
		}

		/**
		 * @param {import('postcss').Declaration} node
		 * @param {string} args
		 * @param {number} index
		 */
		function addQuotesForDecl(node, args, index) {
			const fixedName = `"${args}"`;
			const openIndex = index - declarationValueIndex(node);
			const closeIndex = openIndex + args.length;

			node.value =
				node.value.substring(0, openIndex) + fixedName + node.value.substring(closeIndex);
		}

		/**
		 * @param {import('postcss').AtRule} node
		 * @param {string} args
		 * @param {number} index
		 */

		function removeQuotesForAtRule(node, args, index) {
			const fixedName = args.slice(1, args.length - 1);
			const openIndex = index - atRuleParamIndex(node);
			const closeIndex = openIndex + args.length;

			node.params = node.params.slice(0, openIndex) + fixedName + node.params.slice(closeIndex);
		}

		/**
		 * @param {import('postcss').Declaration} node
		 * @param {string} args
		 * @param {number} index
		 */

		function removeQuotesForDecl(node, args, index) {
			const fixedName = args.slice(1, args.length - 1);
			const openIndex = index - declarationValueIndex(node);
			const closeIndex = openIndex + args.length;

			node.value = node.value.slice(0, openIndex) + fixedName + node.value.slice(closeIndex);
		}

		/**
		 * @param {string} args
		 * @param {import('postcss').Declaration | import('postcss').AtRule} node
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

				if (context.fix) {
					if (node.type === 'atrule') {
						addQuotesForAtRule(node, trimmedArg, complaintIndex);
					} else {
						addQuotesForDecl(node, trimmedArg, complaintIndex);
					}

					return;
				}

				complain(messages.expected(functionName), node, complaintIndex, complaintEndIndex);
			} else {
				if (!hasQuotes) {
					return;
				}

				if (context.fix) {
					if (node.type === 'atrule') {
						removeQuotesForAtRule(node, trimmedArg, complaintIndex);
					} else {
						removeQuotesForDecl(node, trimmedArg, complaintIndex);
					}

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
