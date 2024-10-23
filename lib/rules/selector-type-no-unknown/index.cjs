// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const selectorParser = require('postcss-selector-parser');
const svgTags = require('svg-tags');
const validateTypes = require('../../utils/validateTypes.cjs');
const getRuleSelector = require('../../utils/getRuleSelector.cjs');
const selectors = require('../../reference/selectors.cjs');
const isCustomElement = require('../../utils/isCustomElement.cjs');
const isKeyframeSelector = require('../../utils/isKeyframeSelector.cjs');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule.cjs');
const isStandardSyntaxTypeSelector = require('../../utils/isStandardSyntaxTypeSelector.cjs');
const mathMLTags = require('../../utils/mathMLTags.cjs');
const optionsMatches = require('../../utils/optionsMatches.cjs');
const parseSelector = require('../../utils/parseSelector.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');

const ruleName = 'selector-type-no-unknown';

const messages = ruleMessages(ruleName, {
	rejected: (selector) => `Unexpected unknown type selector "${selector}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-type-no-unknown',
};

const STARTS_A_TAG_NAME_REGEX = /(?:[^.#[:a-z-]|^)[a-z]/i;
const IGNORED_PSEUDO_ELEMENTS = new Set([
	'::highlight',
	'::view-transition-group',
	'::view-transition-image-pair',
	'::view-transition-new',
	'::view-transition-old',
]);

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
					ignore: ['custom-elements', 'default-namespace'],
					ignoreNamespaces: [validateTypes.isString, validateTypes.isRegExp],
					ignoreTypes: [validateTypes.isString, validateTypes.isRegExp],
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

			const { selectors: selectors$1 } = ruleNode;

			if (selectors$1.some((s) => isKeyframeSelector(s))) {
				return;
			}

			parseSelector(getRuleSelector(ruleNode), result, ruleNode)?.walkTags((tagNode) => {
				if (!isStandardSyntaxTypeSelector(tagNode)) return;

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

				if (optionsMatches(secondaryOptions, 'ignoreNamespaces', tagNode.namespace)) return;

				if (optionsMatches(secondaryOptions, 'ignoreTypes', tagNode.value)) return;

				if (isArgumentOfIgnoredPseudoElement(tagNode)) return;

				const tagName = tagNode.value;
				const tagNameLowerCase = tagName.toLowerCase();

				if (
					selectors.htmlTypeSelectors.has(tagNameLowerCase) ||
					// SVG tags are case-sensitive
					svgTags.includes(tagName) ||
					mathMLTags.includes(tagNameLowerCase)
				) {
					return;
				}

				const index = tagNode.sourceIndex;
				const endIndex = index + tagName.length;

				report({
					message: messages.rejected,
					messageArgs: [tagName],
					node: ruleNode,
					index,
					endIndex,
					ruleName,
					result,
				});
			});
		});
	};
};

/** @param {import('postcss-selector-parser').Tag} tag */
function isArgumentOfIgnoredPseudoElement(tag) {
	const node = tag.parent?.parent;

	return selectorParser.isPseudoElement(node) && IGNORED_PSEUDO_ELEMENTS.has(node.value);
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
