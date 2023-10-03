import isStandardSyntaxAtRule from '../../utils/isStandardSyntaxAtRule.mjs';
import { isString } from '../../utils/validateTypes.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';
import vendor from '../../utils/vendor.mjs';

const ruleName = 'at-rule-allowed-list';

const messages = ruleMessages(ruleName, {
	rejected: (name) => `Unexpected at-rule "${name}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/at-rule-allowed-list',
};

/** @type {import('stylelint').Rule<string | string[]>} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [isString],
		});

		if (!validOptions) {
			return;
		}

		const primaryValues = [primary].flat();

		root.walkAtRules((atRule) => {
			const name = atRule.name;

			if (!isStandardSyntaxAtRule(atRule)) {
				return;
			}

			if (primaryValues.includes(vendor.unprefixed(name).toLowerCase())) {
				return;
			}

			report({
				message: messages.rejected,
				messageArgs: [name],
				node: atRule,
				result,
				ruleName,
				word: `@${name}`,
			});
		});
	};
};

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
