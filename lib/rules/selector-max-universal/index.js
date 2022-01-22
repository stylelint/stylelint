'use strict';

const isNonNegativeInteger = require('../../utils/isNonNegativeInteger');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule');
const parseSelector = require('../../utils/parseSelector');
const report = require('../../utils/report');
const resolvedNestedSelector = require('postcss-resolve-nested-selector');
const ruleMessages = require('../../utils/ruleMessages');
const selectorParser = require('postcss-selector-parser');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'selector-max-universal';

const messages = ruleMessages(ruleName, {
	expected: (selector, max) =>
		`Expected "${selector}" to have no more than ${max} universal ${
			max === 1 ? 'selector' : 'selectors'
		}`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/selector-max-universal',
};

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: isNonNegativeInteger,
		});

		if (!validOptions) {
			return;
		}

		/**
		 * @param {import('postcss-selector-parser').Container<unknown>} selectorNode
		 * @param {import('postcss').Rule} ruleNode
		 */
		function checkSelector(selectorNode, ruleNode) {
			const count = selectorNode.reduce((total, childNode) => {
				// Only traverse inside actual selectors
				// All logical combinations will be resolved as nested selector in `postcss-resolve-nested-selector`
				if (childNode.type === 'selector') {
					checkSelector(childNode, ruleNode);
				}

				if (childNode.type === 'universal') total += 1;

				return total;
			}, 0);

			if (selectorNode.type !== 'root' && selectorNode.type !== 'pseudo' && count > primary) {
				const selector = selectorNode.toString();

				report({
					ruleName,
					result,
					node: ruleNode,
					message: messages.expected(selector, primary),
					word: selector,
				});
			}
		}

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}

			/** @type {string[]} */
			const selectors = [];

			selectorParser()
				.astSync(ruleNode.selector)
				.walk((node) => {
					if (node.type === 'selector') {
						selectors.push(String(node).trim());
					}
				});

			for (const selector of selectors) {
				for (const resolvedSelector of resolvedNestedSelector(selector, ruleNode)) {
					parseSelector(resolvedSelector, result, ruleNode, (container) =>
						checkSelector(container, ruleNode),
					);
				}
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
