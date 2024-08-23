import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import isStandardSyntaxRule from '../../utils/isStandardSyntaxRule.mjs';
import isStandardSyntaxSelector from '../../utils/isStandardSyntaxSelector.mjs';
import optionsMatches from '../../utils/optionsMatches.mjs';
import parseSelector from '../../utils/parseSelector.mjs';
import { pseudoElements } from '../../reference/selectors.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';
import vendor from '../../utils/vendor.mjs';

const ruleName = 'selector-pseudo-element-no-unknown';

const messages = ruleMessages(ruleName, {
	rejected: (selector) => `Unexpected unknown pseudo-element selector "${selector}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-pseudo-element-no-unknown',
};

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{ actual: primary },
			{
				actual: secondaryOptions,
				possible: {
					ignorePseudoElements: [isString, isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		root.walkRules((ruleNode) => {
			const selector = ruleNode.selector;

			// Return early before parse if no pseudos for performance

			if (!selector.includes(':')) {
				return;
			}

			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}

			parseSelector(selector, result, ruleNode)?.walkPseudos((pseudoNode) => {
				const value = pseudoNode.value;

				if (!isStandardSyntaxSelector(value)) {
					return;
				}

				// Ignore pseudo-classes
				if (value.slice(0, 2) !== '::') {
					return;
				}

				if (optionsMatches(secondaryOptions, 'ignorePseudoElements', pseudoNode.value.slice(2))) {
					return;
				}

				const name = value.slice(2);

				if (vendor.prefix(name) || pseudoElements.has(name.toLowerCase())) {
					return;
				}

				report({
					message: messages.rejected,
					messageArgs: [value],
					node: ruleNode,
					index: pseudoNode.sourceIndex,
					ruleName,
					result,
					word: value,
				});
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
