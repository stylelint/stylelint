'use strict';

const {
	isMediaQueryInvalid,
	isMediaFeature,
	isMediaFeatureValue,
} = require('@csstools/media-query-list-parser');

const atRuleParamIndex = require('../../utils/atRuleParamIndex');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp');
const optionsMatches = require('../../utils/optionsMatches');
const parseMediaQuery = require('../../utils/parseMediaQuery');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateObjectWithArrayProps = require('../../utils/validateObjectWithArrayProps');
const validateOptions = require('../../utils/validateOptions');
const vendor = require('../../utils/vendor');
const { isString, isRegExp } = require('../../utils/validateTypes');

const ruleName = 'media-feature-name-value-allowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (name, value) => `Unexpected value "${value}" for name "${name}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/media-feature-name-value-allowed-list',
};

/** @type {import('stylelint').Rule<Record<string, string | RegExp | Array<string | RegExp>>>} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [validateObjectWithArrayProps(isString, isRegExp)],
		});

		if (!validOptions) {
			return;
		}

		root.walkAtRules(/^media$/i, (atRule) => {
			parseMediaQuery(atRule).forEach((mediaQuery) => {
				if (isMediaQueryInvalid(mediaQuery)) return;

				mediaQuery.walk(
					(entry) => {
						if (!entry.state) return;

						if (isMediaFeature(entry.node)) {
							entry.state.mediaFeatureName = entry.node.getName();
							entry.state.unprefixedMediaFeatureName = vendor.unprefixed(entry.node.getName());

							return;
						}

						if (!isMediaFeatureValue(entry.node)) return;

						const { mediaFeatureName, unprefixedMediaFeatureName } = entry.state;

						if (!mediaFeatureName || !unprefixedMediaFeatureName) return;

						const componentValues = [entry.node.value].flat();
						const value = componentValues.map((x) => x.toString()).join('');

						const allowedValuesKey = Object.keys(primary).find((featureName) =>
							matchesStringOrRegExp(unprefixedMediaFeatureName, featureName),
						);

						if (allowedValuesKey == null) {
							return;
						}

						if (optionsMatches(primary, allowedValuesKey, value)) {
							return;
						}

						const atRuleIndex = atRuleParamIndex(atRule);
						const [startIndex, endIndex] = startAndEndIndex(componentValues);

						report({
							index: atRuleIndex + startIndex,
							endIndex: atRuleIndex + endIndex + 1,
							message: messages.rejected,
							messageArgs: [mediaFeatureName, value],
							node: atRule,
							ruleName,
							result,
						});
					},
					{
						mediaFeatureName: '',
						unprefixedMediaFeatureName: '',
					},
				);
			});
		});
	};
};

/**
 * A recursive function that returns the start and end boundaries of a node.
 *
 * @template {import('@csstools/css-tokenizer').CSSToken} T
 * @param {Array<{ tokens(): Array<T> }> | { tokens(): Array<T> }} node
 * @returns {[number, number]}
 */
function startAndEndIndex(node) {
	if (Array.isArray(node)) {
		const nodeStart = node[0];

		if (!nodeStart) return [0, 0];

		const nodeEnd = node[node.length - 1] || nodeStart;

		const [startA] = startAndEndIndex(nodeStart);
		const [, endB] = startAndEndIndex(nodeEnd);

		return [startA, endB];
	}

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
