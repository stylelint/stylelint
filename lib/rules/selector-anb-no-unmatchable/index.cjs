// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const cssTree = require('css-tree');
const selectors = require('../../reference/selectors.cjs');
const validateTypes = require('../../utils/validateTypes.cjs');
const getRuleSelector = require('../../utils/getRuleSelector.cjs');
const hasANPlusBNotationPseudoClasses = require('../../utils/hasANPlusBNotationPseudoClasses.cjs');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');

const ruleName = 'selector-anb-no-unmatchable';

const messages = ruleMessages(ruleName, {
	rejected: (pseudoClass) => `Unexpected unmatchable An+B selector "${pseudoClass}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-anb-no-unmatchable',
};

function isUnmatchableNth(/** @type {import('css-tree').AnPlusB} */ nth) {
	const { a, b } = nth;

	if (a !== null && a !== '0' && a !== '-0') {
		return false;
	}

	if (b !== null && b !== '0' && b !== '-0') {
		return false;
	}

	return true;
}

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) {
			return;
		}

		root.walkRules((ruleNode) => {
			if (!hasANPlusBNotationPseudoClasses(ruleNode.selector)) return;

			if (!isStandardSyntaxRule(ruleNode)) return;

			const ruleSelector = getRuleSelector(ruleNode);
			let cssTreeSelectors;

			try {
				cssTreeSelectors = cssTree.parse(ruleSelector, {
					context: 'selectorList',
					positions: true,
				});
			} catch {
				return;
			}

			if (cssTreeSelectors.type !== 'SelectorList') return;

			cssTreeSelectors.children.forEach((cssTreeSelector) => {
				checkSelector(cssTreeSelector);
			});

			function checkSelector(/** @type {import('css-tree').CssNode} */ selector) {
				if (selector.type !== 'Selector') {
					return;
				}

				selector.children.forEach((selectorChild) => {
					if (
						selectorChild.type !== 'PseudoClassSelector' ||
						(!selectors.aNPlusBNotationPseudoClasses.has(selectorChild.name) &&
							!selectors.aNPlusBOfSNotationPseudoClasses.has(selectorChild.name))
					) {
						return;
					}

					const pseudoClassSelector = selectorChild;

					if (pseudoClassSelector.children === null) {
						return;
					}

					pseudoClassSelector.children.forEach((child) => {
						if (child.type !== 'Nth' || child.nth.type !== 'AnPlusB') {
							return;
						}

						// `loc` is expected to be present when calling `parse()` with `{ positions: true }`
						validateTypes.assert(pseudoClassSelector.loc);

						const index = pseudoClassSelector.loc.start.offset;
						const endIndex = pseudoClassSelector.loc.end.offset;

						if (isUnmatchableNth(child.nth)) {
							report({
								message: messages.rejected,
								messageArgs: [ruleSelector.slice(index, endIndex)],
								node: ruleNode,
								index,
								endIndex,
								result,
								ruleName,
							});
						}
					});
				});
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
