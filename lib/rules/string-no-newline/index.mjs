import valueParser from 'postcss-value-parser';

import atRuleParamIndex from '../../utils/atRuleParamIndex.mjs';
import declarationValueIndex from '../../utils/declarationValueIndex.mjs';
import isStandardSyntaxSelector from '../../utils/isStandardSyntaxSelector.mjs';
import parseSelector from '../../utils/parseSelector.mjs';
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
					checkDeclOrAtRule(node, node.params, atRuleParamIndex);
					break;
				case 'decl':
					checkDeclOrAtRule(node, node.value, declarationValueIndex);
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

			parseSelector(ruleNode.selector, result, ruleNode, (selectorTree) => {
				selectorTree.walkAttributes((attributeNode) => {
					const { value, quoteMark } = attributeNode;

					if (!value || !reNewLine.test(value)) {
						return;
					}

					const openIndex = [
						// length of our attribute
						attributeNode.attribute,
						// length of our operator , ie '='
						attributeNode.operator || '',
					].reduce(
						(index, str) => index + str.length,
						// index of the start of our attribute node in our source
						// plus 1 for the opening quotation mark
						attributeNode.sourceIndex + 1,
					);

					const valueLength = value.length + (quoteMark || '').length * 2;

					report({
						message: messages.rejected,
						node: ruleNode,
						index: openIndex,
						endIndex: openIndex + valueLength,
						result,
						ruleName,
					});
				});
			});
		}

		/**
		 * @template {import('postcss').AtRule | import('postcss').Declaration} T
		 * @param {T} node
		 * @param {string} value
		 * @param {(node: T) => number} getIndex
		 * @returns {void}
		 */
		function checkDeclOrAtRule(node, value, getIndex) {
			// Get out quickly if there are no new line
			if (!reNewLine.test(value)) {
				return;
			}

			valueParser(value).walk((valueNode) => {
				if (valueNode.type !== 'string') {
					return;
				}

				if (!reNewLine.test(valueNode.value)) {
					return;
				}

				const nodeIndex = getIndex(node);

				report({
					message: messages.rejected,
					node,
					index: nodeIndex + valueNode.sourceIndex,
					endIndex: nodeIndex + valueNode.sourceEndIndex,
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
