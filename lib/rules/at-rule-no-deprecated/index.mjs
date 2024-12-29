import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import { deprecatedAtKeywords } from '../../reference/atKeywords.mjs';
import isStandardSyntaxAtRule from '../../utils/isStandardSyntaxAtRule.mjs';
import optionsMatches from '../../utils/optionsMatches.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'at-rule-no-deprecated';

const messages = ruleMessages(ruleName, {
	rejected: (atRule) => `Unexpected deprecated at-rule "${atRule}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/at-rule-no-deprecated',
};

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{ actual: primary },
			{
				actual: secondaryOptions,
				possible: {
					ignoreAtRules: [isString, isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) return;

		root.walkAtRules((atRule) => {
			if (!isStandardSyntaxAtRule(atRule)) return;

			const { name } = atRule;

			if (optionsMatches(secondaryOptions, 'ignoreAtRules', name)) return;

			if (!deprecatedAtKeywords.has(name.toLowerCase())) return;

			const atName = `@${name}`;

			report({
				message: messages.rejected,
				messageArgs: [atName],
				node: atRule,
				ruleName,
				result,
				word: atName,
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default rule;