'use strict';

const mediaQueryListParser = require('@csstools/media-query-list-parser');
const cssTokenizer = require('@csstools/css-tokenizer');
const cssParserAlgorithms = require('@csstools/css-parser-algorithms');
const atRuleParamIndex = require('../../utils/atRuleParamIndex.cjs');
const validateTypes = require('../../utils/validateTypes.cjs');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp.cjs');
const parseMediaQuery = require('../../utils/parseMediaQuery.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateObjectWithArrayProps = require('../../utils/validateObjectWithArrayProps.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');

const ruleName = 'media-feature-name-unit-allowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (unit, name) => `Unexpected unit "${unit}" for name "${name}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/media-feature-name-unit-allowed-list',
};

/** @type {import('stylelint').Rule<Record<string, string | string[]>>} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [validateObjectWithArrayProps(validateTypes.isString)],
		});

		if (!validOptions) {
			return;
		}

		const primaryPairs = Object.entries(primary);
		const primaryUnitList = (/** @type {string} */ featureName) => {
			for (const [name, unit] of primaryPairs) {
				if (matchesStringOrRegExp(featureName, name)) return [unit].flat();
			}

			return undefined;
		};

		root.walkAtRules(/^media$/i, (atRule) => {
			const mediaQueryList = parseMediaQuery(atRule);

			mediaQueryList.forEach((mediaQuery) => {
				if (mediaQueryListParser.isMediaQueryInvalid(mediaQuery)) return;

				const initialState = {
					mediaFeatureName: '',
					/** @type {string[] | undefined} */
					unitList: undefined,
				};

				mediaQuery.walk(({ node, state }) => {
					if (!state) return;

					if (mediaQueryListParser.isMediaFeaturePlain(node) || mediaQueryListParser.isMediaFeatureRange(node)) {
						state.mediaFeatureName = node.getName();
						state.unitList = primaryUnitList(state.mediaFeatureName);

						return;
					}

					if (!cssParserAlgorithms.isTokenNode(node)) return;

					const { mediaFeatureName, unitList } = state;

					if (!mediaFeatureName || !unitList) return;

					const [tokenType, , startIndex, endIndex, parsedValue] = node.value;

					if (tokenType !== cssTokenizer.TokenType.Dimension) {
						return;
					}

					if (unitList.includes(parsedValue.unit.toLowerCase())) {
						return;
					}

					const atRuleIndex = atRuleParamIndex(atRule);

					report({
						message: messages.rejected(parsedValue.unit, mediaFeatureName),
						node: atRule,
						index: atRuleIndex + startIndex,
						endIndex: atRuleIndex + endIndex + 1,
						result,
						ruleName,
					});
				}, initialState);
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
