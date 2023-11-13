import resolvedNestedSelector from 'postcss-resolve-nested-selector';

import isKeyframeRule from '../../utils/isKeyframeRule.mjs';
import isStandardSyntaxRule from '../../utils/isStandardSyntaxRule.mjs';
import isStandardSyntaxSelector from '../../utils/isStandardSyntaxSelector.mjs';
import isStandardSyntaxTypeSelector from '../../utils/isStandardSyntaxTypeSelector.mjs';
import optionsMatches from '../../utils/optionsMatches.mjs';
import parseSelector from '../../utils/parseSelector.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'selector-no-qualifying-type';

const messages = ruleMessages(ruleName, {
	rejected: (selector) => `Unexpected qualifying type selector "${selector}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-no-qualifying-type',
};

const selectorCharacters = ['#', '.', '['];

/**
 * @param {string} value
 * @returns {boolean}
 */
function isSelectorCharacters(value) {
	return selectorCharacters.some((char) => value.includes(char));
}

/**
 * @param {import('postcss-selector-parser').Tag} node
 * @returns {Array<import('postcss-selector-parser').Node>}
 */
function getRightNodes(node) {
	const result = [];

	/** @type {import('postcss-selector-parser').Node} */
	let rightNode = node;

	while ((rightNode = rightNode.next())) {
		if (rightNode.type === 'combinator') {
			break;
		}

		if (rightNode.type !== 'id' && rightNode.type !== 'class' && rightNode.type !== 'attribute') {
			continue;
		}

		result.push(rightNode);
	}

	return result;
}

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
				possible: [true],
			},
			{
				actual: secondaryOptions,
				possible: {
					ignore: ['attribute', 'class', 'id'],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		const ignoreId = optionsMatches(secondaryOptions, 'ignore', 'id');
		const ignoreClass = optionsMatches(secondaryOptions, 'ignore', 'class');
		const ignoreAttribute = optionsMatches(secondaryOptions, 'ignore', 'attribute');

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}

			if (isKeyframeRule(ruleNode)) {
				return;
			}

			if (!isSelectorCharacters(ruleNode.selector)) {
				return;
			}

			/**
			 * @param {import('postcss-selector-parser').Root} selectorAST
			 */
			function checkSelector(selectorAST) {
				selectorAST.walkTags((tagNode) => {
					if (!isStandardSyntaxTypeSelector(tagNode)) return;

					const selectorParent = tagNode.parent;

					if (selectorParent && selectorParent.nodes.length === 1) {
						return;
					}

					const selectorNodes = getRightNodes(tagNode);

					for (const selectorNode of selectorNodes) {
						if (
							(selectorNode.type === 'id' && !ignoreId) ||
							(selectorNode.type === 'class' && !ignoreClass) ||
							(selectorNode.type === 'attribute' && !ignoreAttribute)
						) {
							const selector = [tagNode, ...selectorNodes].join('').trimStart();

							complain(selector);
						}
					}
				});
			}

			for (const resolvedSelector of resolvedNestedSelector(ruleNode.selector, ruleNode)) {
				if (!isStandardSyntaxSelector(resolvedSelector)) {
					continue;
				}

				parseSelector(resolvedSelector, result, ruleNode, checkSelector);
			}

			/**
			 * @param {string} selector
			 */
			function complain(selector) {
				report({
					ruleName,
					result,
					node: ruleNode,
					message: messages.rejected,
					messageArgs: [selector],
					word: selector,
				});
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
