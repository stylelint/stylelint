'use strict';

const mediaQueryListParser = require('@csstools/media-query-list-parser');
const cssParserAlgorithms = require('@csstools/css-parser-algorithms');
const atRuleParamIndex = require('../../utils/atRuleParamIndex.cjs');
const isCustomMediaQuery = require('../../utils/isCustomMediaQuery.cjs');
const parseMediaQuery = require('../../utils/parseMediaQuery.cjs');
const mediaFeatures = require('../../reference/mediaFeatures.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');

const ruleName = 'media-query-no-invalid';

const messages = ruleMessages(ruleName, {
	rejected: (query) => `Unexpected invalid media query "${query}"`,
});

const HAS_MIN_MAX_PREFIX = /^(?:min|max)-/i;

const meta = {
	url: 'https://stylelint.io/user-guide/rules/media-query-no-invalid',
};

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) {
			return;
		}

		root.walkAtRules(/^media$/i, (atRule) => {
			/** @type {Array<{tokens(): Array<import('@csstools/css-tokenizer').CSSToken>}>} */
			let invalidNodes = [];

			parseMediaQuery(atRule).forEach((mediaQuery) => {
				if (mediaQueryListParser.isMediaQueryInvalid(mediaQuery)) {
					// Queries that fail to parse are invalid.
					invalidNodes.push(mediaQuery);

					return;
				}

				mediaQuery.walk(({ node, parent }) => {
					// All general enclosed nodes are invalid.
					if (mediaQueryListParser.isGeneralEnclosed(node)) {
						invalidNodes.push(node);

						return;
					}

					// Invalid plain media features.
					if (mediaQueryListParser.isMediaFeaturePlain(node)) {
						const name = node.getName();

						if (isCustomMediaQuery(name)) {
							// In a plain context, custom media queries are invalid.
							invalidNodes.push(parent);

							return;
						}

						return;
					}

					// Invalid range media features.
					if (mediaQueryListParser.isMediaFeatureRange(node)) {
						const name = node.getName().toLowerCase();

						if (isCustomMediaQuery(name)) {
							// In a range context, custom media queries are invalid.
							invalidNodes.push(parent);

							return;
						}

						if (HAS_MIN_MAX_PREFIX.test(name)) {
							// In a range context, min- and max- prefixed feature names are invalid.
							invalidNodes.push(parent);

							return;
						}

						if (!mediaFeatures.rangeTypeMediaFeatureNames.has(name)) {
							// In a range context, non-range typed features are invalid.
							invalidNodes.push(parent);

							return;
						}

						return;
					}

					// Invalid boolean media features.
					if (mediaQueryListParser.isMediaFeatureBoolean(node)) {
						const name = node.getName().toLowerCase();

						if (HAS_MIN_MAX_PREFIX.test(name)) {
							// In a range context, min- and max- prefixed feature names are invalid
							invalidNodes.push(parent);
						}
					}
				});
			});

			if (invalidNodes.length === 0) return;

			const atRuleParamIndexValue = atRuleParamIndex(atRule);

			invalidNodes.forEach((invalidNode) => {
				const [start, end] = cssParserAlgorithms.sourceIndices(invalidNode);

				report({
					message: messages.rejected,
					messageArgs: [invalidNode.toString()],
					index: atRuleParamIndexValue + start,
					endIndex: atRuleParamIndexValue + end + 1,
					node: atRule,
					ruleName,
					result,
				});
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;