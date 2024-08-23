import { parse } from 'css-tree';

import {
	aNPlusBNotationPseudoClasses,
	aNPlusBOfSNotationPseudoClasses,
} from '../../reference/selectors.mjs';
import hasANPlusBNotationPseudoClasses from '../../utils/hasANPlusBNotationPseudoClasses.mjs';
import isStandardSyntaxRule from '../../utils/isStandardSyntaxRule.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

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

			ruleNode.selectors.forEach((selector) => {
				let cssTreeSelector;

				try {
					cssTreeSelector = parse(selector, { context: 'selector', positions: true });
				} catch (e) {
					return;
				}

				checkSelector(cssTreeSelector);
			});

			function checkSelector(/** @type {import('css-tree').CssNode} */ selector) {
				if (selector.type !== 'Selector') {
					return;
				}

				selector.children.forEach((selectorChild) => {
					if (
						selectorChild.type !== 'PseudoClassSelector' ||
						(!aNPlusBNotationPseudoClasses.has(selectorChild.name) &&
							!aNPlusBOfSNotationPseudoClasses.has(selectorChild.name))
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

						if (isUnmatchableNth(child.nth)) {
							report({
								message: messages.rejected,
								messageArgs: [`:${pseudoClassSelector.name}`],
								node: ruleNode,
								index: pseudoClassSelector.loc?.start.column,
								endIndex: pseudoClassSelector.loc?.end.column,
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
export default rule;
