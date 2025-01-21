// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const validateTypes = require('../../utils/validateTypes.cjs');
const isStandardSyntaxAtRule = require('../../utils/isStandardSyntaxAtRule.cjs');
const nodeFieldIndices = require('../../utils/nodeFieldIndices.cjs');
const optionsMatches = require('../../utils/optionsMatches.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');

const ruleName = 'at-rule-prelude-no-invalid';

const messages = ruleMessages(ruleName, {
	rejected: (atRule, prelude) => `Unexpected invalid prelude "${prelude}" for at-rule "${atRule}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/at-rule-prelude-no-invalid',
	usesLexer: true,
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
					ignoreAtRules: [validateTypes.isString, validateTypes.isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		root.walkAtRules((atRule) => {
			if (!isStandardSyntaxAtRule(atRule)) return;

			const { name, params } = atRule;

			if (optionsMatches(secondaryOptions, 'ignoreAtRules', name)) return;

			const lexer = result.stylelint.lexer;

			if (!lexer) throw new Error('Expected a "lexer" object');

			const { error } = lexer.matchAtrulePrelude(name, params);

			if (!error) return;

			if (error.name !== 'SyntaxMatchError') return;

			const atName = `@${name}`;

			const index = nodeFieldIndices.atRuleParamIndex(atRule);
			const endIndex = index + params.length;

			report({
				message: messages.rejected,
				messageArgs: [atName, params],
				node: atRule,
				index,
				endIndex,
				ruleName,
				result,
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
