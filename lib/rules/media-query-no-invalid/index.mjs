import {
	isGeneralEnclosed,
	isMediaFeatureBoolean,
	isMediaFeaturePlain,
	isMediaFeatureRange,
	isMediaQueryInvalid,
} from '@csstools/media-query-list-parser';
import { sourceIndices } from '@csstools/css-parser-algorithms';

import atRuleParamIndex from '../../utils/atRuleParamIndex.mjs';
import isCustomMediaQuery from '../../utils/isCustomMediaQuery.mjs';
import parseMediaQuery from '../../utils/parseMediaQuery.mjs';
import { rangeTypeMediaFeatureNames } from '../../reference/mediaFeatures.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'media-query-no-invalid';

const messages = ruleMessages(ruleName, {
	rejected: (query, reason) => {
		if (!reason) return `Unexpected invalid media query "${query}"`;

		return `Unexpected invalid media query "${query}", ${reason}`;
	},
});

const reasons = {
	custom: 'custom media queries can only be used in boolean queries',
	min_max_in_range: '"min-" and "max-" prefixes are not needed when using range queries',
	min_max_in_boolean: '"min-" and "max-" prefixes are not needed in boolean queries',
	discrete: 'discrete features can only be used in plain and boolean queries',
};

const HAS_MIN_MAX_PREFIX = /^(?:min|max)-/i;

const meta = {
	url: 'https://stylelint.io/user-guide/rules/media-query-no-invalid',
};

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) {
			return;
		}

		root.walkAtRules(/^media$/i, (atRule) => {
			const atRuleParamIndexValue = atRuleParamIndex(atRule);

			parseMediaQuery(atRule).forEach((mediaQuery) => {
				if (isMediaQueryInvalid(mediaQuery)) {
					// Queries that fail to parse are invalid.
					complain(atRule, atRuleParamIndexValue, mediaQuery);

					return;
				}

				mediaQuery.walk(({ node, parent }) => {
					// All general enclosed nodes are invalid.
					if (isGeneralEnclosed(node)) {
						complain(atRule, atRuleParamIndexValue, node);

						return;
					}

					// Invalid plain media features.
					if (isMediaFeaturePlain(node)) {
						const name = node.getName();

						if (isCustomMediaQuery(name)) {
							// In a plain context, custom media queries are invalid.
							complain(atRule, atRuleParamIndexValue, parent, 'custom');

							return;
						}

						return;
					}

					// Invalid range media features.
					if (isMediaFeatureRange(node)) {
						const name = node.getName().toLowerCase();

						if (isCustomMediaQuery(name)) {
							// In a range context, custom media queries are invalid.
							complain(atRule, atRuleParamIndexValue, parent, 'custom');

							return;
						}

						if (HAS_MIN_MAX_PREFIX.test(name)) {
							// In a range context, min- and max- prefixed feature names are invalid.
							complain(atRule, atRuleParamIndexValue, parent, 'min_max_in_range');

							return;
						}

						if (!rangeTypeMediaFeatureNames.has(name)) {
							// In a range context, non-range typed features are invalid.
							complain(atRule, atRuleParamIndexValue, parent, 'discrete');

							return;
						}

						return;
					}

					// Invalid boolean media features.
					if (isMediaFeatureBoolean(node)) {
						const name = node.getName();

						if (HAS_MIN_MAX_PREFIX.test(name)) {
							// In a boolean feature, min- and max- prefixed feature names are invalid
							complain(atRule, atRuleParamIndexValue, parent, 'min_max_in_boolean');
						}
					}
				});
			});
		});

		/**
		 * @param {import('postcss').AtRule} atRule
		 * @param {number} index
		 * @param {{tokens(): Array<import('@csstools/css-tokenizer').CSSToken>}} node
		 * @param {keyof reasons} [reason]
		 */
		function complain(atRule, index, node, reason) {
			const [start, end] = sourceIndices(node);

			report({
				message: messages.rejected,
				messageArgs: [node.toString(), reason ? reasons[reason] : ''],
				index: index + start,
				endIndex: index + end + 1,
				node: atRule,
				ruleName,
				result,
			});
		}
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
