// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const mediaQueryListParser = require('@csstools/media-query-list-parser');
const atRuleParamIndex = require('../../utils/atRuleParamIndex.cjs');
const isCustomMediaQuery = require('../../utils/isCustomMediaQuery.cjs');
const parseCustomMediaQuery = require('../../utils/parseCustomMediaQuery.cjs');
const parseMediaQuery = require('../../utils/parseMediaQuery.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');

const ruleName = 'no-unknown-custom-media';

const messages = ruleMessages(ruleName, {
	expected: (mediaName) => `Unexpected unknown custom media "${mediaName}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/no-unknown-custom-media',
};

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) return;

		const declaredCustomMediaQueries = new Set();

		root.walkAtRules(/^custom-media$/i, (atRule) => {
			const customMediaQuery = parseCustomMediaQuery(atRule);

			if (!customMediaQuery) return;

			declaredCustomMediaQueries.add(customMediaQuery.getName());
		});

		root.walkAtRules(/^media$/i, (atRule) => {
			const mediaQueryList = parseMediaQuery(atRule);

			mediaQueryList.forEach((mediaQuery) => {
				if (mediaQueryListParser.isMediaQueryInvalid(mediaQuery)) return;

				mediaQuery.walk(({ node }) => {
					if (!mediaQueryListParser.isMediaFeature(node)) return;

					const [, name, start, end] = node.getNameToken();

					if (!isCustomMediaQuery(name)) return;

					if (declaredCustomMediaQueries.has(name)) return;

					const baseIndex = atRuleParamIndex(atRule);
					const index = baseIndex + start;
					const endIndex = baseIndex + end + 1;

					report({
						message: messages.expected,
						messageArgs: [name],
						node: atRule,
						index,
						endIndex,
						result,
						ruleName,
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
