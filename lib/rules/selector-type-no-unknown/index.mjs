import svgTags from 'svg-tags';

import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import { htmlTypeSelectors } from '../../reference/selectors.mjs';
import isCustomElement from '../../utils/isCustomElement.mjs';
import isKeyframeSelector from '../../utils/isKeyframeSelector.mjs';
import isStandardSyntaxRule from '../../utils/isStandardSyntaxRule.mjs';
import isStandardSyntaxTypeSelector from '../../utils/isStandardSyntaxTypeSelector.mjs';
import mathMLTags from '../../utils/mathMLTags.mjs';
import optionsMatches from '../../utils/optionsMatches.mjs';
import parseSelector from '../../utils/parseSelector.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'selector-type-no-unknown';

const messages = ruleMessages(ruleName, {
	rejected: (selector) => `Unexpected unknown type selector "${selector}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-type-no-unknown',
};

const STARTS_A_TAG_NAME_REGEX = /(?:[^.#[:a-z-]|^)[a-z]/i;

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{ actual: primary },
			{
				actual: secondaryOptions,
				possible: {
					ignore: ['custom-elements', 'default-namespace'],
					ignoreNamespaces: [isString, isRegExp],
					ignoreTypes: [isString, isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		root.walkRules((ruleNode) => {
			const { selector } = ruleNode;

			if (!STARTS_A_TAG_NAME_REGEX.test(selector)) return;

			if (!isStandardSyntaxRule(ruleNode)) return;

			const { selectors } = ruleNode;

			if (selectors.some((s) => isKeyframeSelector(s))) {
				return;
			}

			parseSelector(selector, result, ruleNode, (selectorTree) => {
				selectorTree.walkTags((tagNode) => {
					if (!isStandardSyntaxTypeSelector(tagNode)) {
						return;
					}

					if (
						optionsMatches(secondaryOptions, 'ignore', 'custom-elements') &&
						isCustomElement(tagNode.value)
					) {
						return;
					}

					if (
						optionsMatches(secondaryOptions, 'ignore', 'default-namespace') &&
						!(typeof tagNode.namespace === 'string')
					) {
						return;
					}

					if (optionsMatches(secondaryOptions, 'ignoreNamespaces', tagNode.namespace)) {
						return;
					}

					if (optionsMatches(secondaryOptions, 'ignoreTypes', tagNode.value)) {
						return;
					}

					const tagName = tagNode.value;
					const tagNameLowerCase = tagName.toLowerCase();

					if (
						htmlTypeSelectors.has(tagNameLowerCase) ||
						// SVG tags are case-sensitive
						svgTags.includes(tagName) ||
						mathMLTags.includes(tagNameLowerCase)
					) {
						return;
					}

					report({
						message: messages.rejected,
						messageArgs: [tagName],
						node: ruleNode,
						index: tagNode.sourceIndex,
						ruleName,
						result,
						word: tagName,
					});
				});
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
