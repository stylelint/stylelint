import selectorParser from 'postcss-selector-parser';
const { isPseudo, isPseudoElement, isTag } = selectorParser;

import {
	deprecatedHtmlTypeSelectors,
	deprecatedPseudoClasses,
	deprecatedPseudoElements,
	deprecatedSvgTypeSelectors,
} from '../../reference/selectors.mjs';
import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import getRuleSelector from '../../utils/getRuleSelector.mjs';
import isCustomSelector from '../../utils/isCustomSelector.mjs';
import isStandardSyntaxRule from '../../utils/isStandardSyntaxRule.mjs';
import isStandardSyntaxSelector from '../../utils/isStandardSyntaxSelector.mjs';
import optionsMatches from '../../utils/optionsMatches.mjs';
import parseSelector from '../../utils/parseSelector.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import uniteSets from '../../utils/uniteSets.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'selector-no-deprecated';

const messages = ruleMessages(ruleName, {
	expected: (unfixed, fixed) => `Expected "${unfixed}" to be "${fixed}"`,
	rejected: (selector) => `Unexpected deprecated selector "${selector}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-no-deprecated',
	fixable: true,
};

const DEPRECATED_SELECTORS = uniteSets(deprecatedHtmlTypeSelectors, deprecatedSvgTypeSelectors);

/** Combines referenced and vendor-prefixed deprecated pseudo-classes. */
const DEPRECATED_PSEUDO_CLASSES = uniteSets(
	deprecatedPseudoClasses,
	new Set(['-webkit-any', '-moz-any']),
);

/** @type {Record<string, string | null>} */
const DEPRECATED_PSEUDO_CLASSES_REMAP = {
	'focus-ring': 'focus-visible',
	matches: 'is',
	'-webkit-any': 'is',
	'-moz-any': 'is',
};

const DEPRECATED_PSEUDOS = uniteSets(DEPRECATED_PSEUDO_CLASSES, deprecatedPseudoElements);

const DEPRECATED_PSEUDO_PATTERN = new RegExp(
	`\\:(?:${Array.from(DEPRECATED_PSEUDOS).join('|')})\\b`,
	'i',
);

const DEPRECATED_SELECTOR_PATTERN = new RegExp(
	`\\b(?:${Array.from(DEPRECATED_SELECTORS).join('|')})\\b`,
	'i',
);

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
					ignoreSelectors: [isString, isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) return;

		root.walkRules((ruleNode) => {
			if (!isStandardSyntaxRule(ruleNode)) return;

			const selector = getRuleSelector(ruleNode);

			const hasDeprecatedPseudo = DEPRECATED_PSEUDO_PATTERN.test(selector);
			const hasDeprecatedSelector = DEPRECATED_SELECTOR_PATTERN.test(selector);

			if (!hasDeprecatedPseudo && !hasDeprecatedSelector) return;

			const resolvedRoot = parseSelector(selector, result, ruleNode);

			if (!resolvedRoot) return;

			resolvedRoot.walk((node) => {
				if (hasDeprecatedPseudo && isPseudo(node)) {
					const { value, sourceIndex } = node;

					if (!isStandardSyntaxSelector(value)) return;

					if (isCustomSelector(value)) return;

					let namedValue;
					let mappedValue;

					if (isPseudoElement(node)) {
						namedValue = value.slice(2);
						const normalized = namedValue.toLowerCase();

						if (!deprecatedPseudoElements.has(normalized)) return;
					} else {
						namedValue = value.slice(1);
						const normalized = namedValue.toLowerCase();

						if (!DEPRECATED_PSEUDO_CLASSES.has(normalized)) return;

						const remap = DEPRECATED_PSEUDO_CLASSES_REMAP[normalized];

						if (remap) mappedValue = `:${remap}`;
					}

					if (optionsMatches(secondaryOptions, 'ignoreSelectors', namedValue)) return;

					let fix;
					let message;
					let messageArgs = [];

					if (typeof mappedValue === 'string') {
						message = messages.expected;
						messageArgs = [value, mappedValue];
						fix = () => {
							node.value = mappedValue;
							ruleNode.selector = resolvedRoot.toString();
						};
					} else {
						message = messages.rejected;
						messageArgs = [value];
					}

					report({
						result,
						ruleName,
						message,
						messageArgs,
						node: ruleNode,
						index: sourceIndex,
						endIndex: sourceIndex + value.length,
						fix: {
							apply: fix,
							node: ruleNode,
						},
					});
				}

				if (hasDeprecatedSelector && isTag(node)) {
					const { sourceIndex, value } = node;
					const normalizedValue = value.toLowerCase();

					if (optionsMatches(secondaryOptions, 'ignoreSelectors', value)) return;

					if (
						!deprecatedHtmlTypeSelectors.has(normalizedValue) &&
						!deprecatedSvgTypeSelectors.has(value)
					)
						return;

					report({
						result,
						ruleName,
						message: messages.rejected,
						messageArgs: [value],
						node: ruleNode,
						index: sourceIndex,
						endIndex: sourceIndex + value.length,
					});
				}
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
