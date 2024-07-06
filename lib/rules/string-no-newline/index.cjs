// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const cssTokenizer = require('@csstools/css-tokenizer');
const atRuleParamIndex = require('../../utils/atRuleParamIndex.cjs');
const declarationValueIndex = require('../../utils/declarationValueIndex.cjs');
const isStandardSyntaxSelector = require('../../utils/isStandardSyntaxSelector.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');

const ruleName = 'string-no-newline';
const reNewLine = /\r?\n/;

const messages = ruleMessages(ruleName, {
	rejected: 'Unexpected newline in string',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/string-no-newline',
};

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) {
			return;
		}

		root.walk((node) => {
			switch (node.type) {
				case 'atrule':
					check(node, node.params, atRuleParamIndex);
					break;
				case 'decl':
					check(node, node.value, declarationValueIndex);
					break;
				case 'rule':
					checkRule(node);
					break;
			}
		});

		/**
		 * @param {import('postcss').Rule} ruleNode
		 * @returns {void}
		 */
		function checkRule(ruleNode) {
			// Get out quickly if there are no new line
			if (!reNewLine.test(ruleNode.selector)) {
				return;
			}

			if (!isStandardSyntaxSelector(ruleNode.selector)) {
				return;
			}

			check(ruleNode, ruleNode.selector, () => 0);
		}

		/**
		 * @template {import('postcss').AtRule | import('postcss').Rule | import('postcss').Declaration} T
		 * @param {T} node
		 * @param {string} value
		 * @param {(node: T) => number} getIndex
		 * @returns {void}
		 */
		function check(node, value, getIndex) {
			// Get out quickly if there are no new line
			if (!reNewLine.test(value)) {
				return;
			}

			cssTokenizer.tokenize(
				{ css: value },
				{
					onParseError: (err) => {
						if (!(err instanceof cssTokenizer.ParseErrorWithToken)) return;

						if (err.message !== cssTokenizer.ParseErrorMessage.UnexpectedNewLineInString) return;

						const [, , start, end] = err.token;

						const nodeIndex = getIndex(node);

						report({
							message: messages.rejected,
							node,
							index: nodeIndex + start,
							endIndex: nodeIndex + end + 1,
							result,
							ruleName,
						});
					},
				},
			);
		}
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
