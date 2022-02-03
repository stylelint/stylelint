'use strict';

const isKeyframeRule = require('../../utils/isKeyframeRule');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule');
const isStandardSyntaxSelector = require('../../utils/isStandardSyntaxSelector');
const optionsMatches = require('../../utils/optionsMatches');
const parseSelector = require('../../utils/parseSelector');
const report = require('../../utils/report');
const resolvedNestedSelector = require('postcss-resolve-nested-selector');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'selector-no-qualifying-type';

const messages = ruleMessages(ruleName, {
	rejected: 'Unexpected qualifying type selector',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/selector-no-qualifying-type',
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
				possible: [true, false],
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
				selectorAST.walkTags((selector) => {
					const selectorParent = selector.parent;

					if (selectorParent && selectorParent.nodes.length === 1) {
						return;
					}

					const selectorNodes = getRightNodes(selector);
					const index = selector.sourceIndex;

					for (const selectorNode of selectorNodes) {
						if (selectorNode.type === 'id' && !optionsMatches(secondaryOptions, 'ignore', 'id')) {
							complain(index);
						}

						if (
							selectorNode.type === 'class' &&
							!optionsMatches(secondaryOptions, 'ignore', 'class')
						) {
							complain(index);
						}

						if (
							selectorNode.type === 'attribute' &&
							!optionsMatches(secondaryOptions, 'ignore', 'attribute')
						) {
							complain(index);
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
			 * @param {number} index
			 */
			function complain(index) {
				report({
					ruleName,
					result,
					node: ruleNode,
					message: messages.rejected,
					index,
				});
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
