'use strict';

const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule');
const keywordSets = require('../../reference/keywordSets');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const styleSearch = require('style-search');
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

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}

			const selector = ruleNode.selector;

			// get out early if no pseudo elements or classes
			if (!selector.includes(':')) {
				return;
			}

			/** @type {Array<{ ruleNode: import('postcss').Rule, startIndex: number }>} */
			const fixPositions = [];

			// match only level 1 and 2 pseudo elements
			const pseudoElementsWithColons = [...keywordSets.levelOneAndTwoPseudoElements].map(
				(x) => `:${x}`,
			);

			styleSearch({ source: selector.toLowerCase(), target: pseudoElementsWithColons }, (match) => {
				const prevCharIsColon = selector[match.startIndex - 1] === ':';

				if (primary === 'single' && !prevCharIsColon) {
					return;
				}

				if (primary === 'double' && prevCharIsColon) {
					return;
				}

				if (context.fix) {
					fixPositions.unshift({ ruleNode, startIndex: match.startIndex });

					return;
				}

				report({
					message: messages.expected(primary),
					node: ruleNode,
					index: match.startIndex,
					result,
					ruleName,
				});
			});

			if (fixPositions.length) {
				// If expecting : then we found :: so remove one of the colons
				// If expecting :: then we found : so add one extra colon
				const expectedSingle = primary === 'single';
				const offset = expectedSingle ? 1 : 0;
				const extraColon = expectedSingle ? '' : ':';

				for (const fixPosition of fixPositions) {
					ruleNode.selector =
						ruleNode.selector.substring(0, fixPosition.startIndex - offset) +
						extraColon +
						ruleNode.selector.substring(fixPosition.startIndex);
				}
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
