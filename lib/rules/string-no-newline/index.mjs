import { isTokenBadString, tokenize } from '@csstools/css-tokenizer';

import atRuleParamIndex from '../../utils/atRuleParamIndex.mjs';
import declarationValueIndex from '../../utils/declarationValueIndex.mjs';
import isStandardSyntaxSelector from '../../utils/isStandardSyntaxSelector.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

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

			/** @typedef {import('@csstools/css-tokenizer').ParseError} ParseError */
			/** @type {Array<ParseError>} */
			let errors = [];
			const tokens = tokenize(
				{ css: value },
				{
					onParseError: (/** @type {ParseError} */ err) => {
						if (err.message === 'Unexpected newline while consuming a string token.') {
							errors.push(err);
						}
					},
				},
			);

			if (errors.length === 0) return;

			const nodeIndex = getIndex(node);

			tokens.forEach((token) => {
				if (!isTokenBadString(token)) return;

				const [, , start, end] = token;

				const error = errors.find((err) => err.sourceStart === start);

				if (!error) return;

				report({
					message: messages.rejected,
					node,
					index: nodeIndex + start,
					endIndex: nodeIndex + end + 1,
					result,
					ruleName,
				});
			});
		}
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
