import atRuleParamIndex from '../../utils/atRuleParamIndex.mjs';
import declarationValueIndex from '../../utils/declarationValueIndex.mjs';
import functionArgumentsSearch from '../../utils/functionArgumentsSearch.mjs';
import getAtRuleParams from '../../utils/getAtRuleParams.mjs';
import getDeclarationValue from '../../utils/getDeclarationValue.mjs';
import isStandardSyntaxDeclaration from '../../utils/isStandardSyntaxDeclaration.mjs';
import isStandardSyntaxUrl from '../../utils/isStandardSyntaxUrl.mjs';
import optionsMatches from '../../utils/optionsMatches.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

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

/** @import { Problem, Rule } from 'stylelint' */
/** @import { FunctionNode, ParsedValue } from 'postcss-value-parser' */
/** @import { AtRule, Declaration } from 'postcss' */

/** @type {Rule} */
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

		const exceptEmpty = optionsMatches(secondaryOptions, 'except', 'empty');
		const emptyArgumentPatterns = new Set(['', "''", '""']);

		root.walkAtRules(checkAtRuleParams);
		root.walkDecls(checkDeclParams);

		/**
		 * @param {Declaration|AtRule} node
		 * @param {FunctionNode} fn
		 * @param {'add'|'remove'} mutateType
		 * @param {ParsedValue} parsedValue
		 */
		function fixer(node, fn, mutateType, parsedValue) {
			return () => {
				switch (mutateType) {
					case 'add':
						addQuotes(fn);
						break;
					case 'remove':
						removeQuotes(fn);
						break;
				}

				switch (node.type) {
					case 'decl':
						node.value = parsedValue.toString();
						break;
					case 'atrule':
						node.params = parsedValue.toString();
						break;
				}
			};
		}

		/** @typedef {[Declaration|AtRule, FunctionNode, 'add'|'remove']} ArgsArray */
		/** @typedef {Array<[Omit<Problem, 'node'>, ArgsArray]>} ReportQueue */

		/**
		 * @param {AtRule|Declaration} node
		 * @param {string} source
		 * @param {number} startIndex
		 */
		function complain(node, source, startIndex) {
			/** @type {ReportQueue} */
			const reportQueue = [];
			const parsedValue = functionArgumentsSearch(source, /^url$/i, (args, index, funcNode) => {
				const problem = checkArgs(args, startIndex + index, funcNode);

				if (problem) {
					reportQueue.push([
						problem,
						[node, funcNode, problem.message.startsWith('Expected') ? 'add' : 'remove'],
					]);
				}
			});

			reportQueue.forEach(([problem, argsArray]) => {
				const fix = fixer.apply(null, [...argsArray, parsedValue]);

				report({ ...problem, node, fix });
			});
		}

		/** @param {Declaration} decl */
		function checkDeclParams(decl) {
			if (!URL_FUNC_REGEX.test(decl.value)) return;

			if (!isStandardSyntaxDeclaration(decl)) return;

			const value = getDeclarationValue(decl);
			const startIndex = declarationValueIndex(decl);

			complain(decl, value, startIndex);
		}

		/** @param {AtRule} atRule */
		function checkAtRuleParams(atRule) {
			const params = getAtRuleParams(atRule);
			const startIndex = atRuleParamIndex(atRule);

			complain(atRule, params, startIndex);
		}

		/** @param {FunctionNode} funcNode */
		function addQuotes(funcNode) {
			for (const argNode of funcNode.nodes) {
				if (argNode.type === 'word') {
					argNode.value = `"${argNode.value}"`;
				}
			}
		}

		/** @param {FunctionNode} funcNode */
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
		 * @param {string} args
		 * @param {number} index
		 * @param {FunctionNode} funcNode
		 */
		function checkArgs(args, index, funcNode) {
			const leftTrimmedArgs = args.trimStart();

			if (!isStandardSyntaxUrl(leftTrimmedArgs)) return;

			let expectQuotes = primary === 'always';

			if (exceptEmpty && emptyArgumentPatterns.has(args.trim())) {
				expectQuotes = !expectQuotes;
			}

			const hasQuotes = leftTrimmedArgs.startsWith("'") || leftTrimmedArgs.startsWith('"');

			if (expectQuotes && hasQuotes) return;

			if (!expectQuotes && !hasQuotes) return;

			const messageType = expectQuotes ? 'expected' : 'rejected';
			const functionName = funcNode.value.toLowerCase();
			const reportIndex = index + args.length - leftTrimmedArgs.length;
			const reportEndIndex = index + args.length;

			return {
				message: messages[messageType](functionName),
				index: reportIndex,
				endIndex: reportEndIndex,
				result,
				ruleName,
			};
		}
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
