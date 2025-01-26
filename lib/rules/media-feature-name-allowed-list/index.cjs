// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const validateTypes = require('../../utils/validateTypes.cjs');
const nodeFieldIndices = require('../../utils/nodeFieldIndices.cjs');
const regexes = require('../../utils/regexes.cjs');
const findMediaFeatureNames = require('../../utils/findMediaFeatureNames.cjs');
const getAtRuleParams = require('../../utils/getAtRuleParams.cjs');
const isCustomMediaQuery = require('../../utils/isCustomMediaQuery.cjs');
const matchesStringOrRegExp = require('../../utils/matchesStringOrRegExp.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');

const ruleName = 'media-feature-name-allowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (name) => `Unexpected media feature name "${name}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/media-feature-name-allowed-list',
};

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [validateTypes.isString, validateTypes.isRegExp],
		});

		if (!validOptions) {
			return;
		}

		root.walkAtRules(regexes.atRuleRegexes.mediaName, (atRule) => {
			findMediaFeatureNames(getAtRuleParams(atRule), (mediaFeatureNameToken) => {
				const [, , startIndex, endIndex, { value: featureName }] = mediaFeatureNameToken;

				if (isCustomMediaQuery(featureName)) {
					return;
				}

				if (matchesStringOrRegExp(featureName, primary)) {
					return;
				}

				const atRuleIndex = nodeFieldIndices.atRuleParamIndex(atRule);

				report({
					message: messages.rejected,
					messageArgs: [featureName],
					node: atRule,
					index: atRuleIndex + startIndex,
					endIndex: atRuleIndex + endIndex + 1,
					ruleName,
					result,
				});
			});
		});
	};
};

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
