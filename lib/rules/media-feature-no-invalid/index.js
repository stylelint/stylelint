'use strict';

const {
	isMediaQueryInvalid,
	isGeneralEnclosed,
	isMediaFeaturePlain,
	isMediaFeatureRange,
	isMediaFeatureBoolean,
} = require('@csstools/media-query-list-parser');

const atRuleParamIndex = require('../../utils/atRuleParamIndex');
const parseMediaQuery = require('../../utils/parseMediaQuery');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const isCustomMediaQuery = require('../../utils/isCustomMediaQuery');
const { rangeTypeMediaFeatureNames } = require('../../reference/mediaFeatures');

const ruleName = 'media-feature-no-invalid';

const messages = ruleMessages(ruleName, {
	rejected: (query) => `Unexpected invalid media query "${query}"`,
});

const HAS_MIN_MAX_PREFIX = /^(?:min|max)-/i;

const meta = {
	url: 'https://stylelint.io/user-guide/rules/media-feature-no-invalid',
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
				if (isMediaQueryInvalid(mediaQuery)) {
					// Queries that fail to parse are invalid.
					invalidNodes.push(mediaQuery);

					return;
				}

				mediaQuery.walk((entry) => {
					// All general enclosured nodes are invalid.
					if (isGeneralEnclosed(entry.node)) {
						invalidNodes.push(entry.node);

						return;
					}

					// Invalid plain media features.
					if (isMediaFeaturePlain(entry.node)) {
						const name = entry.node.getName();

						if (isCustomMediaQuery(name)) {
							// In a plain context, custom media queries are invalid.
							invalidNodes.push(entry.parent);

							return;
						}

						return;
					}

					// Invalid range media features.
					if (isMediaFeatureRange(entry.node)) {
						const name = entry.node.getName().toLowerCase();

						if (isCustomMediaQuery(name)) {
							// In a range context, custom media queries are invalid.
							invalidNodes.push(entry.parent);

							return;
						}

						if (HAS_MIN_MAX_PREFIX.test(name)) {
							// In a range context, min- and max- prefixed feature names are invalid.
							invalidNodes.push(entry.parent);

							return;
						}

						if (!rangeTypeMediaFeatureNames.has(name)) {
							// In a range context, non-range typed features are invalid.
							invalidNodes.push(entry.parent);

							return;
						}

						return;
					}

					// Invalid boolean media features.
					if (isMediaFeatureBoolean(entry.node)) {
						const name = entry.node.getName().toLowerCase();

						if (HAS_MIN_MAX_PREFIX.test(name)) {
							// In a range context, min- and max- prefixed feature names are invalid
							invalidNodes.push(entry.parent);
						}
					}
				});
			});

			if (invalidNodes.length === 0) return;

			const atRuleParamIndexValue = atRuleParamIndex(atRule);

			invalidNodes.forEach((invalidNode) => {
				const [start, end] = startAndEndIndex(invalidNode);

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

/**
 * A function that returns the start and end boundaries of a node.
 *
 * @param {{ tokens(): Array<import('@csstools/css-tokenizer').CSSToken> }} node
 * @returns {[number, number]}
 */
function startAndEndIndex(node) {
	const tokens = node.tokens();

	const firstToken = tokens[0];
	const lastToken = tokens[tokens.length - 1];

	if (!firstToken || !lastToken) return [0, 0];

	const start = firstToken[2];
	const end = lastToken[3];

	return [start, end];
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
