import { isRegExp, isString } from '../../utils/validateTypes.mjs';
import eachDeclarationBlock from '../../utils/eachDeclarationBlock.mjs';
import isStandardSyntaxDeclaration from '../../utils/isStandardSyntaxDeclaration.mjs';
import matchesStringOrRegExp from '../../utils/matchesStringOrRegExp.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'declaration-block-nesting-at-rule-required-list';

const messages = ruleMessages(ruleName, {
	expected: (atRule) => `Expected nesting at-rule "${atRule}" for declaration`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/declaration-block-nesting-at-rule-required-list',
};

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [isString, isRegExp],
		});

		if (!validOptions) return;

		eachDeclarationBlock(root, (eachDecl) => {
			eachDecl((decl) => {
				if (!isStandardSyntaxDeclaration(decl)) return;

				// Skip if declaration already has a required at-rule ancestor
				if (hasRequiredAtRuleAncestor(decl, primary)) return;

				report({
					message: messages.expected,
					messageArgs: [Array.isArray(primary) ? primary.join(', ') : primary],
					node: decl,
					result,
					ruleName,
				});
			});
		});
	};
};

/**
 * @param {import('postcss').Declaration} decl
 * @param {string | RegExp | Array<string | RegExp>} requiredAtRules
 * @returns {boolean}
 */
function hasRequiredAtRuleAncestor(decl, requiredAtRules) {
	let current = decl.parent;

	while (current) {
		if (current.type === 'atrule') {
			const atRuleName = current.name;

			// Check if at-rule name matches any of the required patterns
			if (matchesStringOrRegExp(atRuleName, requiredAtRules)) {
				return true;
			}
		}

		if (current.type === 'root') {
			break;
		}

		current = current.parent;
	}

	return false;
}

rule.primaryOptionArray = true;
rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
