'use strict';

const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { TokenType } = require('@csstools/css-tokenizer');
const { isTokenNode } = require('@csstools/css-parser-algorithms');
const { isMediaFeaturePlain, isMediaFeatureRange } = require('@csstools/media-query-list-parser');
const validateObjectWithArrayProps = require('../../utils/validateObjectWithArrayProps');
const { isString } = require('../../utils/validateTypes');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp');
const atRuleParamIndex = require('../../utils/atRuleParamIndex');
const parseMediaQuery = require('../../utils/parseMediaQuery');

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
			possible: [validateObjectWithArrayProps(isString)],
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
			const mediaQueryList = parseMediaQuery(atRule, result);

			mediaQueryList.forEach((mediaQuery) => {
				mediaQuery.walk((entry) => {
					if (!isMediaFeaturePlain(entry.node) && !isMediaFeatureRange(entry.node)) {
						return;
					}

					const featureName = entry.node.getName();
					const unitList = primaryUnitList(featureName);

					if (!unitList) {
						return;
					}

					entry.node.walk(({ node: childNode }) => {
						if (!isTokenNode(childNode)) {
							return;
						}

						const [tokenType, , startIndex, endIndex, parsedValue] = childNode.value;

						if (tokenType !== TokenType.Dimension) {
							return;
						}

						if (unitList.includes(parsedValue.unit.toLowerCase())) {
							return;
						}

						const atRuleIndex = atRuleParamIndex(atRule);

						report({
							message: messages.rejected(parsedValue.unit, featureName),
							node: atRule,
							index: atRuleIndex + startIndex,
							endIndex: atRuleIndex + endIndex + 1,
							result,
							ruleName,
						});
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
