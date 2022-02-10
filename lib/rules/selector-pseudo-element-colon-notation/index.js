'use strict';

const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule');
const keywordSets = require('../../reference/keywordSets');
const parseSelector = require('../../utils/parseSelector');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'selector-pseudo-element-colon-notation';

const messages = ruleMessages(ruleName, {
	expected: (q) => `Expected ${q} colon pseudo-element notation`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/selector-pseudo-element-colon-notation',
};

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['single', 'double'],
		});

		if (!validOptions) {
			return;
		}

		let fixedColon = '';

		if (primary === 'single') {
			fixedColon = ':';
		} else if (primary === 'double') {
			fixedColon = '::';
		}

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}

			const selector = ruleNode.selector;

			// get out early if no pseudo elements or classes
			if (!selector.includes(':')) {
				return;
			}

			const fixedSelector = parseSelector(selector, result, ruleNode, (selectors) => {
				selectors.walkPseudos((pseudo) => {
					const pseudoElement = pseudo.value.replace(/:/g, '');

					if (!keywordSets.levelOneAndTwoPseudoElements.has(pseudoElement.toLowerCase())) {
						return;
					}

					const isDouble = pseudo.value.startsWith('::');

					if (primary === 'single' && !isDouble) {
						return;
					}

					if (primary === 'double' && isDouble) {
						return;
					}

					if (context.fix) {
						pseudo.replaceWith(pseudo.clone({ value: fixedColon + pseudoElement }));

						return;
					}

					report({
						message: messages.expected(primary),
						node: ruleNode,
						index: pseudo.sourceIndex,
						result,
						ruleName,
					});
				});
			});

			if (context.fix && fixedSelector) {
				ruleNode.selector = fixedSelector;
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
