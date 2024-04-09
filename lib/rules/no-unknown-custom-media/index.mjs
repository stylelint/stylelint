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

		root.walkAtRules(/^custom-media$/i, (atRule) => {
			const customMediaQuery = parseCustomMediaQuery(atRule);

			if (!customMediaQuery) return;

			declaredCustomMediaQueries.add(customMediaQuery.getName());
		});

		root.walkAtRules(/^media$/i, (atRule) => {
			const mediaQueryList = parseMediaQuery(atRule);

			mediaQueryList.forEach((mediaQuery) => {
				if (isMediaQueryInvalid(mediaQuery)) return;

				mediaQuery.walk(({ node }) => {
					if (!isMediaFeature(node)) return;

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
export default rule;
