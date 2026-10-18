import { compare, selectorSpecificity } from '@csstools/selector-specificity';

import { assertNumber, isString } from '../../utils/validateTypes.mjs';
import getStrippedSelectorSource from '../../utils/getStrippedSelectorSource.mjs';
import isStandardSyntaxRule from '../../utils/isStandardSyntaxRule.mjs';
import report from '../../utils/report.mjs';
import resolveNestedSelectorsForRule from '../../utils/resolveNestedSelectorsForRule.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'selector-max-specificity';

const messages = ruleMessages(ruleName, {
	expected: (selector, max, resolvedSelector) => {
		selector = `"${selector}"${resolvedSelector ? ` ("${resolvedSelector}")` : ''}`;

		return `Too high specificity in ${selector}, maximum "${max}"`;
	},
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-max-specificity',
};

/** @type {import('stylelint').CoreRules[typeof ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [
				// Check that the max specificity is in the form "a,b,c"
				(spec) => isString(spec) && /^\d+,\d+,\d+$/.test(spec),
			],
		});

		if (!validOptions) {
			return;
		}

		const [a, b, c] = primary.split(',').map((s) => Number.parseFloat(s));

		assertNumber(a);
		assertNumber(b);
		assertNumber(c);

		const maxSpecificity = { a, b, c };

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) return;

			resolveNestedSelectorsForRule(ruleNode, result).forEach(({ selector, resolvedSelectors }) => {
				resolvedSelectors.each((resolvedSelector) => {
					const specificity = selectorSpecificity(resolvedSelector);

					// Check if the selector specificity exceeds the allowed maximum
					if (compare(specificity, maxSpecificity) > 0) {
						const { index, endIndex, selector: selectorStr } = getStrippedSelectorSource(selector);
						let { selector: resolvedSelectorStr } = getStrippedSelectorSource(resolvedSelector);

						resolvedSelectorStr = resolvedSelectorStr === selectorStr ? '' : resolvedSelectorStr;

						report({
							ruleName,
							result,
							node: ruleNode,
							message: messages.expected,
							messageArgs: [selectorStr, primary, resolvedSelectorStr],
							index,
							endIndex,
						});
					}
				});
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
