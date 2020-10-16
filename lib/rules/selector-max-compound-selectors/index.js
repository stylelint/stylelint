// @ts-nocheck

'use strict';

const isContextFunctionalPseudoClass = require('../../utils/isContextFunctionalPseudoClass');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule');
const parseSelector = require('../../utils/parseSelector');
const report = require('../../utils/report');
const resolvedNestedSelector = require('postcss-resolve-nested-selector');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'selector-max-compound-selectors';

const messages = ruleMessages(ruleName, {
	expected: (selector, max) =>
		`Expected "${selector}" to have no more than ${max} compound ${
			max === 1 ? 'selector' : 'selectors'
		}`,
});

function rule(max) {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: max,
			possible: [
				// TODO: Issue #4985
				// eslint-disable-next-line no-shadow
				function (max) {
					return typeof max === 'number' && max > 0;
				},
			],
		});

		if (!validOptions) {
			return;
		}

		// Finds actual selectors in selectorNode object and checks them
		// TODO: Issue #4985
		// eslint-disable-next-line no-shadow
		function checkSelector(selectorNode, rule) {
			let compoundCount = 1;

			selectorNode.each((childNode) => {
				// Only traverse inside actual selectors and context functional pseudo-classes
				if (childNode.type === 'selector' || isContextFunctionalPseudoClass(childNode)) {
					checkSelector(childNode, rule);
				}

				// Compound selectors are separated by combinators, so increase count when meeting one
				if (childNode.type === 'combinator') {
					compoundCount++;
				}
			});

			if (selectorNode.type !== 'root' && selectorNode.type !== 'pseudo' && compoundCount > max) {
				report({
					ruleName,
					result,
					node: rule,
					message: messages.expected(selectorNode, max),
					word: selectorNode,
				});
			}
		}

		// TODO: Issue #4985
		// eslint-disable-next-line no-shadow
		root.walkRules((rule) => {
			if (!isStandardSyntaxRule(rule)) {
				return;
			}

			// Using `rule.selectors` gets us each selector if there is a comma separated set
			rule.selectors.forEach((selector) => {
				resolvedNestedSelector(selector, rule).forEach((resolvedSelector) => {
					// Process each resolved selector with `checkSelector` via postcss-selector-parser
					parseSelector(resolvedSelector, result, rule, (s) => checkSelector(s, rule));
				});
			});
		});
	};
}

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
