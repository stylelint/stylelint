// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const mediaQueryListParser = require('@csstools/media-query-list-parser');
const cssParserAlgorithms = require('@csstools/css-parser-algorithms');
const cssTokenizer = require('@csstools/css-tokenizer');
const nodeFieldIndices = require('../../utils/nodeFieldIndices.cjs');
const regexes = require('../../utils/regexes.cjs');
const optionsMatches = require('../../utils/optionsMatches.cjs');
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

/** @import {TokenDelim} from '@csstools/css-tokenizer' */

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
				possible: ['prefix', 'context'],
			},
			{
				actual: secondaryOptions,
				possible: {
					except: ['exact-value'],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		const exceptExactValue = optionsMatches(secondaryOptions, 'except', 'exact-value');

		root.walkAtRules(regexes.atRuleRegexes.mediaName, (atRule) => {
			const mediaQueryList = parseMediaQuery(atRule);

			mediaQueryList.forEach((mediaQuery) => {
				if (mediaQueryListParser.isMediaQueryInvalid(mediaQuery)) return;

				mediaQuery.walk(({ node, parent }) => {
					// Only look at plain and range notation media features
					if (!mediaQueryListParser.isMediaFeatureRange(node) && !mediaQueryListParser.isMediaFeaturePlain(node)) return;

					const featureName = node.getName();
					const unprefixedMediaFeature = featureName.replace(/^(?:min|max)-/i, '');

					if (!mediaFeatures.rangeTypeMediaFeatureNames.has(unprefixedMediaFeature)) return;

					if (exceptExactValue) {
						const isMediaFeatureRangeWithExactOperator =
							(mediaQueryListParser.isMediaFeatureRangeNameValue(node) || mediaQueryListParser.isMediaFeatureRangeValueName(node)) &&
							node.operator.length === 1 &&
							node.operator[0][1] === '=';

						const isMediaFeaturePlainUnprefixed =
							mediaQueryListParser.isMediaFeaturePlain(node) && featureName.length === unprefixedMediaFeature.length;

						if (isMediaFeatureRangeWithExactOperator || isMediaFeaturePlainUnprefixed) {
							primary = primary === 'prefix' ? 'context' : 'prefix';
						}
					}

					// Expected plain notation and received plain notation
					if (primary === 'prefix' && mediaQueryListParser.isMediaFeaturePlain(node)) return;

					// Expected range notation and received range notation
					if (primary === 'context' && mediaQueryListParser.isMediaFeatureRange(node)) return;

					/**
					 * @param {object} entry
					 * @param {import('@csstools/media-query-list-parser').MediaFeaturePlain} entry.node
					 * @param {import('@csstools/media-query-list-parser').MediaFeature} entry.parent
					 */
					const contextFixer = (entry) => () => {
						/** @type {[TokenDelim]|[TokenDelim, TokenDelim]} */
						let operator;

						if (/^min-/i.test(featureName)) {
							operator = [
								[cssTokenizer.TokenType.Delim, '>', -1, -1, { value: '>' }],
								[cssTokenizer.TokenType.Delim, '=', -1, -1, { value: '=' }],
							];
						} else if (/^max-/i.test(featureName)) {
							operator = [
								[cssTokenizer.TokenType.Delim, '<', -1, -1, { value: '<' }],
								[cssTokenizer.TokenType.Delim, '=', -1, -1, { value: '=' }],
							];
						} else {
							operator = [[cssTokenizer.TokenType.Delim, '=', -1, -1, { value: '=' }]];
						}

						entry.parent.feature = new mediaQueryListParser.MediaFeatureRangeNameValue(
							new mediaQueryListParser.MediaFeatureName(
								new cssParserAlgorithms.TokenNode([
									cssTokenizer.TokenType.Ident,
									unprefixedMediaFeature,
									-1,
									-1,
									{ value: unprefixedMediaFeature },
								]),
								entry.node.name.before,
								entry.node.name.after.length > 0
									? entry.node.name.after
									: [[cssTokenizer.TokenType.Whitespace, ' ', -1, -1, undefined]],
							),
							operator,
							entry.node.value,
						);

						const expectedMediaQueryList = mediaQueryList.map((mq) => mq.toString()).join(',');

						if (expectedMediaQueryList === atRule.params) return;

						atRule.params = expectedMediaQueryList;
					};

					const hasFix =
						primary === 'context' && mediaQueryListParser.isMediaFeaturePlain(node) && mediaQueryListParser.isMediaFeature(parent);
					const fix = hasFix ? contextFixer({ node, parent }) : undefined;
					const [startIndex, endIndex] = cssParserAlgorithms.sourceIndices(node);
					const atRuleIndex = nodeFieldIndices.atRuleParamIndex(atRule);

					report({
						message: messages.expected,
						messageArgs: [primary],
						node: atRule,
						index: atRuleIndex + startIndex - 1,
						endIndex: atRuleIndex + endIndex + 1 + 1,
						result,
						ruleName,
						fix: {
							apply: fix,
							node: atRule,
						},
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
