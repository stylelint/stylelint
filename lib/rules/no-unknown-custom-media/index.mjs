import { isMediaFeature, isMediaQueryInvalid } from '@csstools/media-query-list-parser';
import atRuleParamIndex from '../../utils/atRuleParamIndex.mjs';
import isCustomMediaQuery from '../../utils/isCustomMediaQuery.mjs';
import parseCustomMediaQuery from '../../utils/parseCustomMediaQuery.mjs';
import parseMediaQuery from '../../utils/parseMediaQuery.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

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

		root.walkAtRules((atRule) => {
			const atRuleName = atRule.name.toLowerCase();

			if (atRuleName !== 'custom-media' && atRuleName !== 'media') {
				return;
			}

			if (atRuleName === 'custom-media') {
				const customMediaQuery = parseCustomMediaQuery(atRule);
				const customMediaQueryName = customMediaQuery && customMediaQuery.getName();

				if (!customMediaQueryName) return;

				declaredCustomMediaQueries.add(customMediaQueryName);

				return;
			}

			let usedCustomMediaQueryName = '';

			const mediaQueryList = parseMediaQuery(atRule);

			mediaQueryList.forEach((mediaQuery) => {
				if (isMediaQueryInvalid(mediaQuery)) return;

				mediaQuery.walk(({ node }) => {
					if (isMediaFeature(node) && isCustomMediaQuery(node.getName())) {
						usedCustomMediaQueryName = node.getName();
					}
				});
			});

			if (declaredCustomMediaQueries.has(usedCustomMediaQueryName)) {
				return;
			}

			const index = atRuleParamIndex(atRule);
			const endIndex = index + usedCustomMediaQueryName.length + 1;

			report({
				message: messages.expected,
				messageArgs: [usedCustomMediaQueryName, primary],
				node: atRule,
				index,
				endIndex,
				result,
				ruleName,
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
