'use strict';

const {
	MediaFeatureName,
	MediaFeatureRangeNameValue,
	isMediaFeature,
	isMediaFeaturePlain,
	isMediaFeatureRange,
} = require('@csstools/media-query-list-parser');
const { TokenNode } = require('@csstools/css-parser-algorithms');
const { TokenType } = require('@csstools/css-tokenizer');

const atRuleParamIndex = require('../../utils/atRuleParamIndex');
const parseMediaQuery = require('../../utils/parseMediaQuery');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { rangeTypeMediaFeatureNames } = require('../../reference/mediaFeatures');

const ruleName = 'media-feature-range-notation';

const messages = ruleMessages(ruleName, {
	expected: (primary) => `Expected "${primary}" media feature range notation`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/media-feature-range-notation',
	fixable: true,
};

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['prefix', 'context'],
		});

		if (!validOptions) {
			return;
		}

		root.walkAtRules(/^media$/i, (atRule) => {
			const mediaQueryList = parseMediaQuery(atRule, result);
			let hasFixes = false;

			mediaQueryList.forEach((mediaQuery) => {
				mediaQuery.walk((entry) => {
					const node = entry.node;

					// Only look at plain and range notation media features
					if (!isMediaFeatureRange(node) && !isMediaFeaturePlain(node)) return;

					// Expected plain notation and received plain notation
					if (primary === 'prefix' && isMediaFeaturePlain(node)) return;

					// Expected range notation and received range notation
					if (primary === 'context' && isMediaFeatureRange(node)) return;

					const featureName = node.getName();
					const unprefixedMediaFeature = featureName.replace(/^(?:min|max)-/i, '');

					if (!rangeTypeMediaFeatureNames.has(unprefixedMediaFeature)) return;

					if (context.fix && primary === 'context' && isMediaFeaturePlain(node)) {
						const parent = entry.parent;

						if (!isMediaFeature(parent)) return;

						hasFixes = true;

						/** @type {import('@csstools/css-tokenizer').TokenDelim} */
						const operator = /^min-/i.test(featureName)
							? [TokenType.Delim, '>', -1, -1, { value: '>' }]
							: [TokenType.Delim, '<', -1, -1, { value: '<' }];

						parent.feature = new MediaFeatureRangeNameValue(
							new MediaFeatureName(
								new TokenNode([
									TokenType.Ident,
									unprefixedMediaFeature,
									-1,
									-1,
									{ value: unprefixedMediaFeature },
								]),
								node.name.before,
								node.name.after.length > 0
									? node.name.after
									: [[TokenType.Whitespace, ' ', -1, -1, undefined]],
							),
							[operator, [TokenType.Delim, '=', -1, -1, { value: '=' }]],
							node.value,
						);

						return;
					}

					const tokens = node.tokens();
					const firstToken = tokens[0];
					const lastToken = tokens[tokens.length - 1];

					let startIndex = 0;
					let endIndex = atRule.params.length;

					if (firstToken && lastToken) {
						startIndex = firstToken[2];
						endIndex = lastToken[3];
					}

					const atRuleIndex = atRuleParamIndex(atRule);

					report({
						message: messages.expected,
						messageArgs: [primary],
						node: atRule,
						index: atRuleIndex + startIndex - 1,
						endIndex: atRuleIndex + endIndex + 1 + 1,
						result,
						ruleName,
					});
				});
			});

			if (hasFixes) {
				const expectedMediaQueryList = mediaQueryList
					.map((mediaQuery) => mediaQuery.toString())
					.join(',');

				if (expectedMediaQueryList === atRule.params) return;

				atRule.params = expectedMediaQueryList;
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
