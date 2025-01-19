import { atRuleRegexes } from '../../utils/regexes.mjs';
import { declarationValueIndex } from '../../utils/nodeFieldIndices.mjs';
import { definitionSyntax } from 'css-tree';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import { syntaxNameKeywords } from '../../reference/keywords.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'syntax-string-no-invalid';

const messages = ruleMessages(ruleName, {
	rejected: (syntaxString) => `Unexpected invalid syntax string "${syntaxString}"`,
	rejectedParseError: (descriptorName, descriptorValue) =>
		`Cannot parse "${descriptorName}" descriptor with value "${descriptorValue}".`,
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

		root.walkAtRules(atRuleRegexes.property, (atRule) => {
			atRule.walkDecls(atRuleRegexes.syntax, (decl) => {
				/** @type {import('css-tree').DSNodeGroup} */
				let ast;

				try {
					ast = definitionSyntax.parse(decl.value);
				} catch {
					const index = declarationValueIndex(decl);
					const endIndex = index + decl.value.length;

					report({
						message: messages.rejectedParseError,
						messageArgs: [decl.prop, decl.value],
						node: decl,
						index,
						endIndex,
						result,
						ruleName,
					});

					return;
				}

				definitionSyntax.walk(ast, (node) => {
					if (node.type !== 'Type') return;

					const { name } = node;

					// Ignore universal syntax definition
					if (name === '*') return;

					if (syntaxNameKeywords.includes(name)) return;

					const index = declarationValueIndex(decl);
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
export default rule;
