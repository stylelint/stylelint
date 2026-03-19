import {
	declarationContainingAtKeywords,
	nestingSupportedAtKeywords,
} from '../../reference/atKeywords.mjs';
import { isAtRule, isRule } from '../../utils/typeGuards.mjs';
import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import findNodeUpToRoot from '../../utils/findNodeUpToRoot.mjs';
import isInDocument from '../../utils/isInDocument.mjs';
import isStandardSyntaxDeclaration from '../../utils/isStandardSyntaxDeclaration.mjs';
import optionsMatches from '../../utils/optionsMatches.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'no-invalid-position-declaration';

const messages = ruleMessages(ruleName, {
	rejected: 'Unexpected invalid position declaration',
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/no-invalid-position-declaration',
};

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary, secondaryOptions) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{ actual: primary, possible: [true] },
			{
				actual: secondaryOptions,
				possible: {
					ignoreAtRules: [isString, isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) return;

		/** @type {(node: import('postcss').Node) => boolean} */
		const isIgnoredAtRule = (node) =>
			isAtRule(node) && optionsMatches(secondaryOptions, 'ignoreAtRules', node.name);

		/** @type {(node: import('postcss').Node) => boolean} */
		const isDeclarationContainingAtRule = (node) =>
			isAtRule(node) && declarationContainingAtKeywords.has(node.name.toLowerCase());

		root.walkDecls((decl) => {
			if (isInDocument(decl, { inline: true })) return;

			if (!isStandardSyntaxDeclaration(decl)) return;

			const { parent } = decl;

			if (!parent) return;

			if (isRule(parent) || isDeclarationContainingAtRule(parent)) return;

			if (isAtRule(parent)) {
				const atRuleName = parent.name.toLowerCase();

				// Nesting-supported at-rules only allow declarations when nested inside a rule
				if (nestingSupportedAtKeywords.has(atRuleName)) {
					const parentRule = findNodeUpToRoot(
						decl,
						(node) => isRule(node) || isDeclarationContainingAtRule(node) || isIgnoredAtRule(node),
					);

					if (parentRule) return;
				} else {
					return;
				}
			}

			report({
				message: messages.rejected,
				messageArgs: [],
				node: decl,
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
