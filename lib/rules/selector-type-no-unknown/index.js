'use strict';

const isCustomElement = require('../../utils/isCustomElement');
const isKeyframeSelector = require('../../utils/isKeyframeSelector');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule');
const isStandardSyntaxTypeSelector = require('../../utils/isStandardSyntaxTypeSelector');
const keywordSets = require('../../reference/keywordSets');
const mathMLTags = require('mathml-tag-names');
const optionsMatches = require('../../utils/optionsMatches');
const parseSelector = require('../../utils/parseSelector');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const svgTags = require('svg-tags');
const validateOptions = require('../../utils/validateOptions');
const { isRegExp, isString } = require('../../utils/validateTypes');

const ruleName = 'selector-type-no-unknown';

const messages = ruleMessages(ruleName, {
	rejected: (selector) => `Unexpected unknown type selector "${selector}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/list/selector-type-no-unknown',
};

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
			const selector = ruleNode.selector;
			const selectors = ruleNode.selectors;

			if (!isStandardSyntaxRule(ruleNode)) {
				return;
			}

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
						keywordSets.standardHtmlTags.has(tagNameLowerCase) ||
						// SVG tags are case-sensitive
						svgTags.includes(tagName) ||
						keywordSets.nonStandardHtmlTags.has(tagNameLowerCase) ||
						mathMLTags.includes(tagNameLowerCase)
					) {
						return;
					}

					report({
						message: messages.rejected(tagName),
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
module.exports = rule;
