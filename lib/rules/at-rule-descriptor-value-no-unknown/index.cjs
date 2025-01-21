// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const regexes = require('../../utils/regexes.cjs');
const nodeFieldIndices = require('../../utils/nodeFieldIndices.cjs');
const isStandardSyntaxAtRule = require('../../utils/isStandardSyntaxAtRule.cjs');
const isStandardSyntaxDeclaration = require('../../utils/isStandardSyntaxDeclaration.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');

const ruleName = 'at-rule-descriptor-value-no-unknown';

const messages = ruleMessages(ruleName, {
	rejected: (descriptor, value) =>
		`Unexpected unknown value "${value}" for descriptor "${descriptor}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/at-rule-descriptor-value-no-unknown',
	usesLexer: true,
};

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) {
			return;
		}

		root.walkAtRules(regexes.atRuleRegexes.unsupportedNesting, (atRule) => {
			if (!isStandardSyntaxAtRule(atRule)) return;

			atRule.walkDecls((decl) => {
				if (!isStandardSyntaxDeclaration(decl)) return;

				const { prop, value } = decl;

				const lexer = result.stylelint.lexer;

				if (!lexer) throw new Error('Expected a "lexer" object');

				const { error } = lexer.matchAtruleDescriptor(atRule.name, prop, value);

				if (!error) return;

				if (error.name !== 'SyntaxMatchError') return;

				const index = nodeFieldIndices.declarationValueIndex(decl);
				const endIndex = index + value.length;

				report({
					message: messages.rejected,
					messageArgs: [prop, value],
					node: decl,
					index,
					endIndex,
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

module.exports = rule;
