'use strict';

const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { TokenType } = require('@csstools/css-tokenizer');
const { isTokenNode } = require('@csstools/css-parser-algorithms');
const {
	isMediaFeaturePlain,
	isMediaFeatureRange,
	parse,
} = require('@csstools/media-query-list-parser');
const validateObjectWithArrayProps = require('../../utils/validateObjectWithArrayProps');
const { isString } = require('../../utils/validateTypes');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp');
const flattenArray = require('../../utils/flattenArray');
const atRuleParamIndex = require('../../utils/atRuleParamIndex');

const ruleName = 'media-feature-name-unit-allowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (unit, name) => `Unexpected unit "${unit}" for name "${name}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/media-feature-name-unit-allowed-list',
};

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [validateObjectWithArrayProps(isString)],
		});

		if (!validOptions) {
			return;
		}

		root.walkAtRules(/^media$/i, (atRule) => {
			const mediaQueryList = parse(atRule.params);

			mediaQueryList.forEach((mediaQuery) => {
				mediaQuery.walk((entry) => {
					if (!isMediaFeaturePlain(entry.node) && !isMediaFeatureRange(entry.node)) {
						return;
					}

					const name = isMediaFeatureRange(entry.node)
						? entry.node.name.name.value[1].toString()
						: entry.node.name.toString();

					const nameKey = Object.keys(primary).find((nameIdentifier) =>
						matchesStringOrRegExp(name, nameIdentifier),
					);

					if (!nameKey) {
						return;
					}

					const nameList = flattenArray(primary[nameKey]);

					if (!nameList) {
						return;
					}

					entry.node.walk((childEntry) => {
						if (!isTokenNode(childEntry.node) || childEntry.node.value[0] !== TokenType.Dimension) {
							return;
						}

						const unit = childEntry.node.value[4].unit;

						if (nameList.includes(unit.toLowerCase())) {
							return;
						}

						const atRuleIndex = atRuleParamIndex(atRule);

						report({
							message: messages.rejected(unit, name),
							node: atRule,
							index: atRuleIndex + childEntry.node.value[2],
							endIndex: atRuleIndex + childEntry.node.value[3] + 1,
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
