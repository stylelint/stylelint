import { lexer } from 'css-tree';

import { atRuleRegexes } from '../../utils/regexes.mjs';
import isStandardSyntaxAtRule from '../../utils/isStandardSyntaxAtRule.mjs';
import isStandardSyntaxDeclaration from '../../utils/isStandardSyntaxDeclaration.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'at-rule-descriptor-no-unknown';

const messages = ruleMessages(ruleName, {
	rejected: (atRule, descriptor) =>
		`Unexpected unknown descriptor "${descriptor}" for at-rule "${atRule}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/at-rule-descriptor-no-unknown',
};

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) {
			return;
		}

		root.walkAtRules(atRuleRegexes.unsupportedNesting, (atRule) => {
			if (!isStandardSyntaxAtRule(atRule)) return;

			atRule.walkDecls((decl) => {
				if (!isStandardSyntaxDeclaration(decl)) return;

				const { prop, value } = decl;

				const { error } = lexer.matchAtruleDescriptor(atRule.name, prop, value);

				if (!error) return;

				if (error.name !== 'SyntaxReferenceError') return;

				if (!error.message.startsWith('Unknown at-rule descriptor')) return;

				const atName = `@${atRule.name}`;

				report({
					message: messages.rejected,
					messageArgs: [atName, prop],
					node: decl,
					index: 0,
					endIndex: prop.length,
					ruleName,
					result,
				});
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
