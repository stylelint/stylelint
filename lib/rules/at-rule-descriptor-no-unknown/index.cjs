// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const cssTree = require('css-tree');
const atKeywords = require('../../reference/atKeywords.cjs');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');

const UNSUPPORTED_NESTING_REGEX = new RegExp(
	`^((?!${[...atKeywords.nestingSupportedAtKeywords.values()].join('|')}).)*$`,
	'i',
);

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

		root.walkAtRules(UNSUPPORTED_NESTING_REGEX, (atRule) => {
			atRule.walkDecls((decl) => {
				const { prop, value } = decl;

				const { error } = cssTree.lexer.matchAtruleDescriptor(atRule.name, prop, value);

				if (!error) return;

				if (error.name !== 'SyntaxReferenceError') return;

				if (!error.message.startsWith('Unknown at-rule descriptor')) return;

				const atName = `@${atRule.name}`;

				report({
					message: messages.rejected,
					messageArgs: [atName, prop],
					node: decl,
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
