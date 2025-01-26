import {
	MediaFeatureName,
	MediaFeatureRangeNameValue,
	isMediaFeature,
	isMediaFeaturePlain,
	isMediaFeatureRange,
	isMediaQueryInvalid,
} from '@csstools/media-query-list-parser';
import { TokenNode, sourceIndices } from '@csstools/css-parser-algorithms';
import { TokenType } from '@csstools/css-tokenizer';

import { atRuleParamIndex } from '../../utils/nodeFieldIndices.mjs';
import { atRuleRegexes } from '../../utils/regexes.mjs';
import parseMediaQuery from '../../utils/parseMediaQuery.mjs';
import { rangeTypeMediaFeatureNames } from '../../reference/mediaFeatures.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'media-feature-range-notation';

const messages = ruleMessages(ruleName, {
	expected: (primary) => `Expected "${primary}" media feature range notation`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/media-feature-range-notation',
	fixable: true,
};

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: ['prefix', 'context'],
		});

		if (!validOptions) {
			return;
		}

		root.walkAtRules(atRuleRegexes.mediaName, (atRule) => {
			const mediaQueryList = parseMediaQuery(atRule);

			mediaQueryList.forEach((mediaQuery) => {
				if (isMediaQueryInvalid(mediaQuery)) return;

				mediaQuery.walk(({ node, parent }) => {
					// Only look at plain and range notation media features
					if (!isMediaFeatureRange(node) && !isMediaFeaturePlain(node)) return;

					// Expected plain notation and received plain notation
					if (primary === 'prefix' && isMediaFeaturePlain(node)) return;

					// Expected range notation and received range notation
					if (primary === 'context' && isMediaFeatureRange(node)) return;

					const featureName = node.getName();
					const unprefixedMediaFeature = featureName.replace(/^(?:min|max)-/i, '');

					if (!rangeTypeMediaFeatureNames.has(unprefixedMediaFeature)) return;

					/**
					 * @param {object} entry
					 * @param {import('@csstools/media-query-list-parser').MediaFeaturePlain} entry.node
					 * @param {import('@csstools/media-query-list-parser').MediaFeature} entry.parent
					 */
					const contextFixer = (entry) => () => {
						/** @type {import('@csstools/css-tokenizer').TokenDelim} */
						const operator = /^min-/i.test(featureName)
							? [TokenType.Delim, '>', -1, -1, { value: '>' }]
							: [TokenType.Delim, '<', -1, -1, { value: '<' }];

						entry.parent.feature = new MediaFeatureRangeNameValue(
							new MediaFeatureName(
								new TokenNode([
									TokenType.Ident,
									unprefixedMediaFeature,
									-1,
									-1,
									{ value: unprefixedMediaFeature },
								]),
								entry.node.name.before,
								entry.node.name.after.length > 0
									? entry.node.name.after
									: [[TokenType.Whitespace, ' ', -1, -1, undefined]],
							),
							[operator, [TokenType.Delim, '=', -1, -1, { value: '=' }]],
							entry.node.value,
						);

						const expectedMediaQueryList = mediaQueryList.map((mq) => mq.toString()).join(',');

						if (expectedMediaQueryList === atRule.params) return;

						atRule.params = expectedMediaQueryList;
					};

					const hasFix =
						primary === 'context' && isMediaFeaturePlain(node) && isMediaFeature(parent);
					const fix = hasFix ? contextFixer({ node, parent }) : undefined;
					const [startIndex, endIndex] = sourceIndices(node);
					const atRuleIndex = atRuleParamIndex(atRule);

					report({
						message: messages.expected,
						messageArgs: [primary],
						node: atRule,
						index: atRuleIndex + startIndex - 1,
						endIndex: atRuleIndex + endIndex + 1 + 1,
						result,
						ruleName,
						fix,
					});
				});
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
