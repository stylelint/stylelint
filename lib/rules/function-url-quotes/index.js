'use strict';

const atRuleParamIndex = require('../../utils/atRuleParamIndex');
const declarationValueIndex = require('../../utils/declarationValueIndex');
const functionArgumentsSearch = require('../../utils/functionArgumentsSearch');
const getAtRuleParams = require('../../utils/getAtRuleParams');
const getDeclarationValue = require('../../utils/getDeclarationValue');
const isStandardSyntaxUrl = require('../../utils/isStandardSyntaxUrl');
const isStandardSyntaxDeclaration = require('../../utils/isStandardSyntaxDeclaration');
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

const URL_FUNC_REGEX = /url\(/i;

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

		const exceptEmpty = optionsMatches(secondaryOptions, 'except', 'empty');
		const emptyArgumentPatterns = new Set(['', "''", '""']);

		root.walkAtRules(checkAtRuleParams);
		root.walkDecls(checkDeclParams);

		/**
		 * @param {import('postcss').Declaration} decl
		 */
		function checkDeclParams(decl) {
			if (!URL_FUNC_REGEX.test(decl.value)) return;

			if (!isStandardSyntaxDeclaration(decl)) return;

			const value = getDeclarationValue(decl);
			const startIndex = declarationValueIndex(decl);
			const parsed = functionArgumentsSearch(value, /^url$/i, (args, index, funcNode) => {
				checkArgs(decl, args, startIndex + index, funcNode);
			});

			if (context.fix) {
				decl.value = parsed.toString();
			}
		}

		/**
		 * @param {import('postcss').AtRule} atRule
		 */
		function checkAtRuleParams(atRule) {
			const params = getAtRuleParams(atRule);
			const startIndex = atRuleParamIndex(atRule);

			let hasUrlFunction = false;

			const parsed = functionArgumentsSearch(params, /^url$/i, (args, index, funcNode) => {
				hasUrlFunction = true;
				checkArgs(atRule, args, startIndex + index, funcNode);
			});

			if (!hasUrlFunction) return;

			if (context.fix) {
				atRule.params = parsed.toString();
			}
		}

		/**
		 * @param {import('postcss-value-parser').FunctionNode} funcNode
		 */
		function addQuotes(funcNode) {
			for (const argNode of funcNode.nodes) {
				if (argNode.type === 'word') {
					argNode.value = `"${argNode.value}"`;
				}
			}
		}

		/**
		 * @param {import('postcss-value-parser').FunctionNode} funcNode
		 */
		function removeQuotes(funcNode) {
			for (const argNode of funcNode.nodes) {
				if (argNode.type === 'string') {
					// NOTE: We can ignore this error because the test passes.
					// @ts-expect-error -- TS2322: Type '"word"' is not assignable to type '"string"'.
					argNode.type = 'word';
				}
			}
		}

		/**
		 * @param {import('postcss').Declaration | import('postcss').AtRule} node
		 * @param {string} args
		 * @param {number} index
		 * @param {import('postcss-value-parser').FunctionNode} funcNode
		 */
		function checkArgs(node, args, index, funcNode) {
			const functionName = funcNode.value.toLowerCase();
			let shouldHasQuotes = primary === 'always';

			const leftTrimmedArgs = args.trimStart();

			if (!isStandardSyntaxUrl(leftTrimmedArgs)) {
				return;
			}

			const complaintIndex = index + args.length - leftTrimmedArgs.length;
			const complaintEndIndex = index + args.length;
			const hasQuotes = leftTrimmedArgs.startsWith("'") || leftTrimmedArgs.startsWith('"');

			if (exceptEmpty && emptyArgumentPatterns.has(args.trim())) {
				shouldHasQuotes = !shouldHasQuotes;
			}

			if (shouldHasQuotes) {
				if (hasQuotes) {
					return;
				}

				if (context.fix) {
					addQuotes(funcNode);

					return;
				}

				complain(messages.expected(functionName), node, complaintIndex, complaintEndIndex);
			} else {
				if (!hasQuotes) {
					return;
				}

				if (context.fix) {
					removeQuotes(funcNode);

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
