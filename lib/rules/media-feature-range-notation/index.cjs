'use strict';

const mediaQueryListParser = require('@csstools/media-query-list-parser');
const cssParserAlgorithms = require('@csstools/css-parser-algorithms');
const cssTokenizer = require('@csstools/css-tokenizer');
const atRuleParamIndex = require('../../utils/atRuleParamIndex.cjs');
const parseMediaQuery = require('../../utils/parseMediaQuery.cjs');
const mediaFeatures = require('../../reference/mediaFeatures.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');

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
			const mediaQueryList = parseMediaQuery(atRule);
			let hasFixes = false;

			mediaQueryList.forEach((mediaQuery) => {
				if (mediaQueryListParser.isMediaQueryInvalid(mediaQuery)) return;

				mediaQuery.walk(({ node, parent }) => {
					// Only look at plain and range notation media features
					if (!mediaQueryListParser.isMediaFeatureRange(node) && !mediaQueryListParser.isMediaFeaturePlain(node)) return;

					// Expected plain notation and received plain notation
					if (primary === 'prefix' && mediaQueryListParser.isMediaFeaturePlain(node)) return;

					// Expected range notation and received range notation
					if (primary === 'context' && mediaQueryListParser.isMediaFeatureRange(node)) return;

					const featureName = node.getName();
					const unprefixedMediaFeature = featureName.replace(/^(?:min|max)-/i, '');

					if (!mediaFeatures.rangeTypeMediaFeatureNames.has(unprefixedMediaFeature)) return;

					if (context.fix && primary === 'context' && mediaQueryListParser.isMediaFeaturePlain(node)) {
						if (!mediaQueryListParser.isMediaFeature(parent)) return;

						hasFixes = true;

						/** @type {import('@csstools/css-tokenizer').TokenDelim} */
						const operator = /^min-/i.test(featureName)
							? [cssTokenizer.TokenType.Delim, '>', -1, -1, { value: '>' }]
							: [cssTokenizer.TokenType.Delim, '<', -1, -1, { value: '<' }];

						parent.feature = new mediaQueryListParser.MediaFeatureRangeNameValue(
							new mediaQueryListParser.MediaFeatureName(
								new cssParserAlgorithms.TokenNode([
									cssTokenizer.TokenType.Ident,
									unprefixedMediaFeature,
									-1,
									-1,
									{ value: unprefixedMediaFeature },
								]),
								node.name.before,
								node.name.after.length > 0
									? node.name.after
									: [[cssTokenizer.TokenType.Whitespace, ' ', -1, -1, undefined]],
							),
							[operator, [cssTokenizer.TokenType.Delim, '=', -1, -1, { value: '=' }]],
							node.value,
						);

						return;
					}

					const [startIndex, endIndex] = cssParserAlgorithms.sourceIndices(node);

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