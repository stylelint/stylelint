import selectorParser from 'postcss-selector-parser';

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
import { mayIncludeRegexes } from '../../utils/regexes.mjs';
import optionsMatches from '../../utils/optionsMatches.mjs';
import parseSelector from '../../utils/parseSelector.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
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

const { isPseudo, isPseudoElement, isTag } = selectorParser;

/** @type {Record<string, string | null>} */
const DEPRECATED_TYPE_SELECTORS_REMAP = {};

/** @type {Record<string, string | null>} */
const DEPRECATED_PSEUDO_CLASSES_REMAP = {
	'focus-ring': 'focus-visible',
	matches: 'is',
	'-webkit-any': 'is',
	'-moz-any': 'is',
	'top-layer': 'open',
	'popup-open': 'open',
	'user-error': 'user-invalid',
};

/** @type {Record<string, string | null>} */
const DEPRECATED_PSEUDO_ELEMENTS_REMAP = {
	content: 'slotted',
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
					ignoreSelectors: [isString, isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) return;

		root.walkRules((ruleNode) => {
			const selector = getRuleSelector(ruleNode);
			const hasDeprecatedPseudo = mayIncludeRegexes.deprecatedPseudo.test(selector);
			const hasDeprecatedTypeSelector = mayIncludeRegexes.deprecatedTypeSelector.test(selector);

			if (!hasDeprecatedPseudo && !hasDeprecatedTypeSelector) return;

			if (!isStandardSyntaxRule(ruleNode)) return;

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

						const remap = DEPRECATED_PSEUDO_ELEMENTS_REMAP[normalized];

						if (remap) mappedValue = `::${remap}`;
					} else {
						namedValue = value.slice(1);
						const normalized = namedValue.toLowerCase();

						if (!deprecatedPseudoClasses.has(normalized)) return;

						const remap = DEPRECATED_PSEUDO_CLASSES_REMAP[normalized];

						if (remap) mappedValue = `:${remap}`;
					}

					if (optionsMatches(secondaryOptions, 'ignoreSelectors', namedValue)) return;

					let fix;
					let message;
					let messageArgs;

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

				if (hasDeprecatedTypeSelector && isTag(node)) {
					const { sourceIndex, value } = node;

					if (optionsMatches(secondaryOptions, 'ignoreSelectors', value)) return;

					const normalizedValue = value.toLowerCase();

					if (
						!deprecatedHtmlTypeSelectors.has(normalizedValue) &&
						!deprecatedSvgTypeSelectors.has(value)
					)
						return;

					let fix;
					let message;
					let messageArgs;

					const remapKey = deprecatedSvgTypeSelectors.has(value) ? value : normalizedValue;
					const remapValue = DEPRECATED_TYPE_SELECTORS_REMAP[remapKey];

					if (remapValue) {
						message = messages.expected;
						messageArgs = [value, remapValue];
						fix = () => {
							node.value = remapValue;
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
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
