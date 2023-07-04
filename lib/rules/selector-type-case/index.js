'use strict';

const isKeyframeSelector = require('../../utils/isKeyframeSelector');
const isStandardSyntaxRule = require('../../utils/isStandardSyntaxRule');
const isStandardSyntaxTypeSelector = require('../../utils/isStandardSyntaxTypeSelector');
const optionsMatches = require('../../utils/optionsMatches');
const parseSelector = require('../../utils/parseSelector');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { isString, isRegExp } = require('../../utils/validateTypes');
const { mixedCaseSvgTypeSelectors } = require('../../reference/selectors');

const ruleName = 'selector-type-case';

const messages = ruleMessages(ruleName, {
	expected: (actual, expected) => `Expected "${actual}" to be "${expected}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/selector-type-case',
	fixable: true,
};

const STARTS_A_TAG_NAME_REGEX = /(?:[^.#[:a-zA-Z-]|^)[a-zA-Z]/;
const ANY_UPPER_CASE_REGEX = /[A-Z]/;
const ANY_LOWER_CASE_REGEX = /[a-z]/;

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions, context) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
				possible: ['lower', 'upper'],
			},
			{
				actual: secondaryOptions,
				possible: {
					ignoreTypes: [isString, isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		root.walkRules((ruleNode) => {
			let hasComments = ruleNode.raws.selector && ruleNode.raws.selector.raw;
			const selector = hasComments ? hasComments : ruleNode.selector;

			if (!STARTS_A_TAG_NAME_REGEX.test(selector)) return;

			if (primary === 'lower' && !ANY_UPPER_CASE_REGEX.test(selector)) return;

			if (primary === 'upper' && !ANY_LOWER_CASE_REGEX.test(selector)) return;

			if (!isStandardSyntaxRule(ruleNode)) return;

			const { selectors } = ruleNode;

			if (selectors.some((s) => isKeyframeSelector(s))) {
				return;
			}

			parseSelector(selector, result, ruleNode, (selectorAST) => {
				selectorAST.walkTags((tag) => {
					if (!isStandardSyntaxTypeSelector(tag)) {
						return;
					}

					if (mixedCaseSvgTypeSelectors.has(tag.value)) {
						return;
					}

					if (optionsMatches(secondaryOptions, 'ignoreTypes', tag.value)) {
						return;
					}

					const sourceIndex = tag.sourceIndex;
					const value = tag.value;

					const expectedValue = primary === 'lower' ? value.toLowerCase() : value.toUpperCase();

					if (value === expectedValue) {
						return;
					}

					if (context.fix) {
						if (hasComments) {
							hasComments =
								hasComments.slice(0, sourceIndex) +
								expectedValue +
								hasComments.slice(sourceIndex + value.length);

							if (ruleNode.raws.selector == null) {
								throw new Error('The `raw` property must be present');
							}

							ruleNode.raws.selector.raw = hasComments;
						} else {
							ruleNode.selector =
								ruleNode.selector.slice(0, sourceIndex) +
								expectedValue +
								ruleNode.selector.slice(sourceIndex + value.length);
						}

						return;
					}

					report({
						message: messages.expected,
						messageArgs: [value, expectedValue],
						node: ruleNode,
						index: sourceIndex,
						ruleName,
						result,
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
