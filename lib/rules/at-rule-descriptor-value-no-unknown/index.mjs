import { atRuleRegexes } from '../../utils/regexes.mjs';
import { declarationValueIndex } from '../../utils/nodeFieldIndices.mjs';
import isStandardSyntaxAtRule from '../../utils/isStandardSyntaxAtRule.mjs';
import isStandardSyntaxDeclaration from '../../utils/isStandardSyntaxDeclaration.mjs';
import { pageContextProperties } from '../../reference/properties.mjs';
import report from '../../utils/report.mjs';
import ruleMessages from '../../utils/ruleMessages.mjs';
import validateOptions from '../../utils/validateOptions.mjs';

const ruleName = 'at-rule-descriptor-value-no-unknown';

const messages = ruleMessages(ruleName, {
	rejected: (descriptor, value) => `Unknown value "${value}" for descriptor "${descriptor}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/at-rule-descriptor-value-no-unknown',
};

/**
 * At-rules whose declarations csstree lists as descriptors, though they substitute `var()`
 * @type {ReadonlySet<string>}
 */
const varFunctionAcceptingAtKeywords = new Set(['function', 'position-try']);

/** @type {import('stylelint').CoreRules[typeof ruleName]} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) {
			return;
		}

		const lexer = /** @type {import('css-tree').Lexer} */ (result.stylelint.lexer);

		root.walkAtRules(atRuleRegexes.unsupportedNestingNames, (atRule) => {
			if (!isStandardSyntaxAtRule(atRule)) return;

			atRule.walkDecls((decl) => {
				if (!isStandardSyntaxDeclaration(decl)) return;

				const { prop, value } = decl;
				const { error } = lexer.matchAtruleDescriptor(atRule.name, prop, value);

				if (!error) return;

				if (!isUnknownValueError(error, atRule, prop)) return;

				const index = declarationValueIndex(decl);
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

/**
 * @param {Error} error
 * @param {import('postcss').AtRule} atRule
 * @param {string} prop
 * @returns {boolean}
 */
function isUnknownValueError(error, atRule, prop) {
	if (error.name === 'SyntaxMatchError') return true;

	return error.name === 'Error' && !isVarFunctionAcceptingDescriptor(atRule, prop);
}

/**
 * @param {import('postcss').AtRule} atRule
 * @param {string} prop
 * @returns {boolean}
 */
function isVarFunctionAcceptingDescriptor(atRule, prop) {
	return (
		varFunctionAcceptingAtKeywords.has(atRule.name.toLowerCase()) ||
		isPageContextPropertyInPageAtRule(atRule, prop)
	);
}

/**
 * @param {import('postcss').AtRule} atRule
 * @param {string} prop
 */
function isPageContextPropertyInPageAtRule(atRule, prop) {
	return atRule.name.toLowerCase() === 'page' && pageContextProperties.has(prop);
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
export default rule;
