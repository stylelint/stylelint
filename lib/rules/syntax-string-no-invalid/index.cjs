// NOTICE: This file is generated by Rollup. To modify it,
// please instead edit the ESM counterpart and rebuild with Rollup (npm run build).
'use strict';

const regexes = require('../../utils/regexes.cjs');
const nodeFieldIndices = require('../../utils/nodeFieldIndices.cjs');
const cssTree = require('css-tree');
const report = require('../../utils/report.cjs');
const ruleMessages = require('../../utils/ruleMessages.cjs');
const keywords = require('../../reference/keywords.cjs');
const validateOptions = require('../../utils/validateOptions.cjs');

const ruleName = 'syntax-string-no-invalid';

const messages = ruleMessages(ruleName, {
	rejected: (syntaxString) => `Unexpected invalid syntax string "${syntaxString}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/syntax-string-no-invalid',
};

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) {
			return;
		}

		root.walkAtRules(regexes.atRuleRegexes.property, (atRule) => {
			atRule.walkDecls(regexes.atRuleRegexes.syntax, (decl) => {
				const ast = cssTree.definitionSyntax.parse(decl.value);

				cssTree.definitionSyntax.walk(ast, (node) => {
					if (node.type !== 'Type') return;

					const { name } = node;

					// Ignore universal syntax definition
					if (name === '*') return;

					if (keywords.syntaxNameKeywords.includes(name)) return;

					const index = nodeFieldIndices.declarationValueIndex(decl);
					const endIndex = index + decl.value.length;

					report({
						message: messages.rejected,
						messageArgs: [name],
						node: decl,
						index,
						endIndex,
						ruleName,
						result,
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
